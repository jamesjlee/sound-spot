const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const SpotifyWebApi = require("spotify-web-api-node");
const randomstring = require("randomstring");
const cookieParser = require("cookie-parser");
const request = require("request-promise");
const cors = require("cors");

const app = express();
app.set("port", process.env.PORT || 5000);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "build")));
} else {
  app.use("/", express.static(path.join(__dirname, "public")));
}

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});

const scopes = [
  "user-read-private",
  "user-read-email",
  "user-read-birthdate",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-playback-state",
  "playlist-read-private",
  "playlist-modify-private",
  "playlist-modify-public",
  "playlist-read-collaborative",
  "user-top-read",
  "user-read-recently-played",
  "app-remote-control",
  "streaming",
  "user-follow-read",
  "user-follow-modify",
  "user-library-modify",
  "user-library-read"
];
const STATE_KEY = "spotify_auth_state";
const production = "https://sound-spot.herokuapp.com";
const callback = "https://sound-spot.herokuapp.com/callback";
const development = "http://localhost:3000";
const developmentCallback = "http://localhost:5000/callback";
const url = process.env.NODE_ENV === "production" ? production : development;
const callbackUrl =
  process.env.NODE_ENV === "production" ? callback : developmentCallback;
const scopesFormatted = scopes.join("%20");
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

app.get("/api/login", (req, res) => {
  const state = randomstring.generate(16);
  res.cookie(STATE_KEY, state);

  let authOptions = {
    url: `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${callbackUrl}&scope=${scopesFormatted}&state=${state}`,
    json: true
  };

  res.send({ authUrl: authOptions.url });
});

app.get("/callback", (req, res) => {
  const { code, state } = req.query;
  const storedState = req.cookies ? req.cookies[STATE_KEY] : null;
  if (state === null || state !== storedState) {
    res.redirect("/#/error/state_mismatch");
  } else {
    res.clearCookie(STATE_KEY);
    let authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: callbackUrl,
        grant_type: "authorization_code"
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer.from(client_id + ":" + client_secret).toString("base64")
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        let access_token = body.access_token;
        let refresh_token = body.refresh_token;
        let expires_in = body.expires_in;
        const expiresAt = new Date().getTime() / 1000 + expires_in;
        console.log(
          "Retrieved token. It expires in " +
            Math.floor(expiresAt - new Date().getTime() / 1000) +
            " seconds!"
        );

        res.redirect(
          `${url}/user?access_token=${access_token}&refresh_token=${refresh_token}&expires_at=${expiresAt}`
        );
      } else {
        res.redirect("/#/error/invalid_token");
      }
    });
  }
});

app.get("/api/logout", function(req, res, next) {
  let loggedInSpotifyApi = new SpotifyWebApi();
  loggedInSpotifyApi.setAccessToken(req.cookies.oauthToken);

  try {
    loggedInSpotifyApi.resetRefreshToken();
    loggedInSpotifyApi.resetAccessToken();
    res.json({ logged_out: true });
  } catch (err) {
    console.log(err);
    res.redirect("/#/error/could_not_log_out");
  }
});

app.get("/api/refresh_token", function(req, res) {
  let loggedInSpotifyApi = new SpotifyWebApi();
  loggedInSpotifyApi.setAccessToken(req.cookies.oauthToken);

  const ref_token = req.query.refresh_token;
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;

  let authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer.from(client_id + ":" + client_secret).toString("base64")
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: ref_token
    },
    json: true
  };

  request
    .post(authOptions)
    .then((body) => {
      let access_token = body.access_token;
      let expires_in = body.expires_in;
      const expiresAt = new Date().getTime() / 1000 + expires_in;
      console.log(
        "Refreshed token. It expires in " +
          Math.floor(expiresAt - new Date().getTime() / 1000) +
          " seconds!"
      );
      res.send({
        access_token: access_token,
        expires_at: expiresAt
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/#/error/could_not_refresh_token");
    });
});

app.get("/api/tracks", function(req, res) {
  let loggedInSpotifyApi = new SpotifyWebApi();
  loggedInSpotifyApi.setAccessToken(req.cookies.oauthToken);
  const genre = req.query.genre;

  loggedInSpotifyApi
    .getRecommendations({ seed_genres: [`${genre}`], limit: 50 })
    .then(function(data) {
      res.json(data);
    })
    .catch(function(err) {
      console.log(err);
      res.redirect("/#/error/could_not_fetch_tracks");
    });
});

app.get("/api/play", function(req, res) {
  let loggedInSpotifyApi = new SpotifyWebApi();
  loggedInSpotifyApi.setAccessToken(req.cookies.oauthToken);
  const song_uri = req.query.song_uri;
  const device_id = req.query.device_id;
  const position_ms = Number(req.query.position_ms);

  console.log(
    "playing song: " +
      song_uri +
      " with device: " +
      device_id +
      " starting at position: " +
      position_ms
  );

  let authOptions;

  if (song_uri !== null) {
    authOptions = {
      url: `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + req.cookies.oauthToken
      },
      body: {
        uris: [song_uri],
        position_ms: position_ms
      },
      json: true
    };
  } else {
    authOptions = {
      url: `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + req.cookies.oauthToken
      },
      body: {
        position_ms: position_ms
      },
      json: true
    };
  }

  request
    .put(authOptions)
    .then((body) => {
      res.send({ body: body });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/#/error/could_not_play_song");
    });
});

app.get("/api/current_user_playback", function(req, res) {
  let loggedInSpotifyApi = new SpotifyWebApi();
  loggedInSpotifyApi.setAccessToken(req.cookies.oauthToken);

  loggedInSpotifyApi
    .getMyCurrentPlaybackState()
    .then(function(data) {
      res.json(data);
    })
    .catch(function(err) {
      console.log(err);
    });
});

app.get("/api/set_player_volume", function(req, res) {
  let loggedInSpotifyApi = new SpotifyWebApi();
  loggedInSpotifyApi.setAccessToken(req.cookies.oauthToken);
  const volume = req.query.volume;
  const device_id = req.query.device_id;

  let authOptions = {
    url: `https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}&device_id=${device_id}`,
    headers: {
      Authorization: "Bearer " + req.cookies.oauthToken
    },
    json: true
  };

  request
    .put(authOptions)
    .then((body) => {
      res.send({
        body: body
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/#/error/could_not_set_volume");
    });
});

app.get("/api/pause_player", function(req, res) {
  let loggedInSpotifyApi = new SpotifyWebApi();
  loggedInSpotifyApi.setAccessToken(req.cookies.oauthToken);
  const device_id = req.query.device_id;

  let authOptions = {
    url: `https://api.spotify.com/v1/me/player/pause?device_id=${device_id}`,
    headers: {
      Authorization: "Bearer " + req.cookies.oauthToken
    },
    json: true
  };

  request
    .put(authOptions)
    .then((body) => {
      res.send({
        body: body
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/#/error/could_not_pause_player");
    });
});

app.get("/api/seek", function(req, res) {
  let loggedInSpotifyApi = new SpotifyWebApi();
  loggedInSpotifyApi.setAccessToken(req.cookies.oauthToken);
  const device_id = req.query.device_id;
  const position_ms = req.query.position_ms;

  let authOptions = {
    url: `https://api.spotify.com/v1/me/player/seek?device_id=${device_id}&position_ms=${position_ms}`,
    headers: {
      Authorization: "Bearer " + req.cookies.oauthToken
    },
    json: true
  };

  request
    .put(authOptions)
    .then((body) => {
      res.send({
        body: body
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/#/error/could_not_seek");
    });
});

app.get("/api/me", function(req, res) {
  let loggedInSpotifyApi = new SpotifyWebApi();
  loggedInSpotifyApi.setAccessToken(req.cookies.oauthToken);

  let authOptions = {
    url: `https://api.spotify.com/v1/me`,
    headers: {
      Authorization: "Bearer " + req.cookies.oauthToken
    },
    json: true
  };

  request
    .get(authOptions)
    .then((body) => {
      res.send({
        body: body
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/#/error/could_not_find_user");
    });
});

app.listen(app.get("port"), "0.0.0.0", () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
