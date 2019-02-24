import * as consts from "../constants/Consts";
import Cookies from "js-cookie";
import { RSAA } from "redux-api-middleware";
import qs from "query-string";

export function authorizeUser() {
  return async (dispatch, getState) => {
    await dispatch(getAuthUrl());
  };
}

function getAuthUrl() {
  return {
    [RSAA]: {
      endpoint: "/api/login",
      method: "GET",
      types: [
        "GET_AUTH_URL_FETCH_REQUEST",
        "GET_AUTH_URL_FETCH_SUCCESS",
        "GET_AUTH_URL_FETCH_FAILURE"
      ]
    }
  };
}

export function authorizeUserWithAuthUrl(authUrl) {
  return async (dispatch, getState) => {
    loginWithAuthUrl(authUrl);
  };
}

function loginWithAuthUrl(authUrl) {
  if (authUrl) {
    window.location = authUrl;
  }
}

function setTokenInfoAction(authToken, refreshToken, expiresAt) {
  return {
    type: consts.SET_TOKEN_INFO,
    authToken: authToken,
    refreshToken: refreshToken,
    expiresAt: expiresAt,
    loggedIn: true
  };
}

export function setTokenInfo(authToken, refreshToken, expiresAt) {
  Cookies.set(consts.COOKIE_PATH, authToken);
  Cookies.set(consts.COOKIE_REFRESH_PATH, refreshToken);
  Cookies.set(consts.COOKIE_EXPIRES_PATH, expiresAt);
  return async (dispatch) => {
    await dispatch(setTokenInfoAction(authToken, refreshToken, expiresAt));
  };
}

function refreshTokenAction(refreshToken) {
  const body = qs.stringify({
    refresh_token: refreshToken
  });
  return {
    [RSAA]: {
      endpoint: "/api/refresh_token?" + body,
      method: "GET",
      types: [
        "REFRESH_TOKEN_FETCH_REQUEST",
        "REFRESH_TOKEN_FETCH_SUCCESS",
        "REFRESH_TOKEN_FETCH_FAILURE"
      ]
    }
  };
}

export function refreshAuthToken(refreshToken) {
  return async (dispatch, getState) => {
    await dispatch(refreshTokenAction(refreshToken)).then((data) =>
      dispatch(
        setTokenInfo(
          data.payload.access_token,
          refreshToken,
          data.payload.expires_at
        )
      )
    );
  };
}

function logoutAction() {
  return {
    [RSAA]: {
      endpoint: "/api/logout",
      method: "GET",
      types: ["LOGOUT_REQUEST", "LOGOUT_SUCCESS", "LOGOUT_FAILURE"]
    }
  };
}

function clearCookies() {
  Cookies.remove(consts.COOKIE_PATH);
  Cookies.remove(consts.COOKIE_REFRESH_PATH);
  Cookies.remove(consts.COOKIE_EXPIRES_PATH);
}

export function logout() {
  return async (dispatch) => {
    await dispatch(logoutAction()).then(clearCookies());
  };
}
