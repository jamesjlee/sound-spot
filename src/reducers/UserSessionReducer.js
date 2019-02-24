const initialState = {
  authToken: null,
  refreshToken: null,
  expiresAt: null,
  authUrl: null,
  loggedIn: false,
  tokenIsValid: false
  // likes: {}
};

const userSession = (state = initialState, action) => {
  switch (action.type) {
    case "GET_AUTH_URL_FETCH_SUCCESS":
      if (action.payload) {
        return {
          ...state,
          authUrl: action.payload.authUrl
        };
      } else {
        return {
          ...state
        };
      }

    case "SET_TOKEN_INFO":
      return {
        ...state,
        authToken: action.authToken,
        refreshToken: action.refreshToken,
        expiresAt: action.expiresAt,
        loggedIn: action.loggedIn
      };

    case "REFRESH_TOKEN_FETCH_SUCCESS":
      if (action.payload) {
        return {
          ...state,
          authToken: action.payload.access_token,
          refreshToken: action.meta.refreshToken,
          expiresAt: action.payload.expiresAt
        };
      } else {
        return {
          ...state
        };
      }

    case "LOGOUT_SUCCESS":
      return {
        ...state,
        loggedOut: action.payload.logged_out
      };

    case "REFRESH_TOKEN_FETCH":
      return {
        ...state,
        refreshToken: action.refreshToken
      };

    case "REFRESH_TOKEN_FETCH":
      return {
        ...state,
        authToken: action.authToken,
        refreshToken: action.refreshToken,
        expiresAt: action.expiresAt
      };
      
    default:
      return state;
  }
};

export default userSession;
