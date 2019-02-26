import * as consts from "../constants/Consts";
import { refreshAuthToken, logout } from "../actions/UserSessionActions";
import { me } from "../actions/TopBarActions";
import { isRSAA, apiMiddleware } from "redux-api-middleware";

const Cookie = require("js-cookie");

function createRefreshMiddleware() {
  const postponedRSAAs = [];
  return ({ dispatch, getState }) => {
    const rsaaMiddleware = apiMiddleware({ dispatch, getState });
    return (next) => (action) => {
      if (isRSAA(action)) {
        try {
          const authToken = Cookie.get(consts.COOKIE_PATH);
          const refreshToken = Cookie.get(consts.COOKIE_REFRESH_PATH);
          const expirationTime = Cookie.get(consts.COOKIE_EXPIRES_PATH) * 1000;
          const isAccessTokenExpiring =
            expirationTime - Date.now() < 300000 &&
            expirationTime - Date.now() > 0;
          // const isAccessTokenExpiring = Date.now() - 50000;
          let accessTokenTimeIsOver = expirationTime - Date.now() <= 0;
          if (typeof refreshToken !== "undefined" && isAccessTokenExpiring) {
            console.log("REFRESHING ACCESS TOKEN");
            postponedRSAAs.push(action);
            if (postponedRSAAs.length === 1) {
              return rsaaMiddleware(next)(
                dispatch(() => refreshAuthToken(refreshToken))
              ).then(() => {
                const postponedRSAA = postponedRSAAs.pop();
                return dispatch(postponedRSAA);
              });
            }
            return rsaaMiddleware(next)(action);
          } else if (
            typeof refreshToken !== "undefined" &&
            accessTokenTimeIsOver
          ) {
            console.log(
              "CANNOT REFRESH ACCESS TOKEN. TIME IS UP. LOGGING OUT AND REDIRECTING TO LOGIN PAGE."
            );
            postponedRSAAs.push(action);
            if (postponedRSAAs.length === 1) {
              return rsaaMiddleware(next)(dispatch(() => logout())).then(() => {
                window.location = window.location.origin + "/login";
                const postponedRSAA = postponedRSAAs.pop();
                return dispatch(postponedRSAA);
              });
            }
          }
          return rsaaMiddleware(next)(action);
        } catch (e) {
          console.log(e);
          return next(action);
        }
      }
      return next(action);
    };
  };
}

export default createRefreshMiddleware;
