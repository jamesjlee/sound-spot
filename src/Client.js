// const Cookie = require("js-cookie");
// const COOKIE_PATH = "oauthToken";
// const COOKIE_REFRESH_PATH = "oauthRefreshToken";
// const COOKIE_EXPIRES_PATH = "oatuhExpiresAt";
// const qs = require("query-string");

// class Client {
//   constructor() {
//     this.token = Cookie.get(COOKIE_PATH);
//     if (this.token) {
//       this.isTokenValid().then((bool) => {
//         if (!bool) {
//           this.token = null;
//         }
//       });
//     }
//   }

//   isLoggedIn(props) {
//     console.log(qs.parse(props.location.search));
//     const queryParams = qs.parse(props.location.search);
//     if (Object.entries(queryParams).length !== 0) {
//       this.setToken(queryParams.access_token);
//       this.setRefreshToken(queryParams.refresh_token);
//       this.setExpiresAt(queryParams.expires_in);
//       this.token = Cookie.get(COOKIE_PATH);
//       console.log("inhere");
//     }
//     return !!this.token;
//   }

//   isTokenValid() {
//     const url = "/api/check_token?token=" + this.token;
//     return fetch(url, {
//       method: "get",
//       headers: {
//         accept: "application/json"
//       }
//     })
//       .then(this.checkStatus)
//       .then(this.parseJson)
//       .then((json) => json.valid === true);
//   }

//   tracks(genre, cb) {
//     return fetch(`/api/tracks?genre=${genre}`, {
//       accept: "application/json"
//     })
//       .then(this.checkStatus)
//       .then(this.parseJSON)
//       .then(cb)
//       .catch((error) => console.log(error.message));
//   }

//   setToken(accessToken) {
//     Cookie.set(COOKIE_PATH, accessToken);
//   }

//   setRefreshToken(refreshToken) {
//     Cookie.set(COOKIE_REFRESH_PATH, refreshToken);
//   }

//   setExpiresAt(expiresIn) {
//     Cookie.set(COOKIE_EXPIRES_PATH, expiresIn);
//   }

//   removeExpiresAt() {
//     Cookie.remove(COOKIE_EXPIRES_PATH);
//   }

//   removeRefreshToken() {
//     Cookie.remove(COOKIE_REFRESH_PATH);
//   }

//   removeToken() {
//     Cookie.remove(COOKIE_PATH);
//   }

//   refreshToken() {
//     return fetch(`/refresh_token`, {
//       accept: "application/json"
//     })
//       .then(this.checkStatus)
//       .then(this.parseJSON)
//       .catch((error) => console.log(error.message));
//   }

//   login() {
//     return fetch(`/api/login`, {
//       accept: "application/json"
//     })
//       .then(this.checkStatus)
//       .then(this.parseJSON)
//       .catch((error) => console.log(error.message));
//   }

//   logout() {
//     this.removeToken();
//   }

//   checkStatus(response) {
//     if (response.status >= 200 && response.status < 300) {
//       return response;
//     } else {
//       const error = new Error(`HTTP Error ${response.statusText}`);
//       error.status = response.statusText;
//       error.response = response;
//       console.log(error); // eslint-disable-line no-console
//       throw error;
//     }
//   }

//   parseJSON(response) {
//     return response.json();
//   }
// }

// export const client = new Client();
