import { RSAA } from "redux-api-middleware";

function meAction() {
  return {
    [RSAA]: {
      endpoint: "/api/me",
      method: "GET",
      types: [
        "ME_REQUEST",
        "ME_SUCCESS",
        "ME_FAILURE"
      ]
    }
  };
}

export function me() {
  return async (dispatch) => {
    await dispatch(meAction());
  };
}
