import { RSAA } from "redux-api-middleware";
import qs from "query-string";

// function storeSongListAction(tracks, index, genre) {
//   const body = {
//     tracks: tracks,
//     indexOfSelectedGenre: index,
//     genre: genre
//   };
//   return {
//     [RSAA]: {
//       types: [consts.STORE_SONG_LIST],
//       body
//     }
//   };
// }

function initiatingSongListFetch() {
  return {
    type: "INITIATING_SONG_LIST_FETCH_REQUEST",
    meta: {
      isLoadingSongs: true,
      songsLoaded: false
    }
  };
}

function fetchSongs(index, genre) {
  const body = qs.stringify({
    genre: genre
  });
  return {
    [RSAA]: {
      endpoint: "/api/tracks?" + body,
      method: "GET",
      types: [
        "SONG_LIST_FETCH_REQUEST",
        {
          type: "SONG_LIST_FETCH_SUCCESS",
          meta: {
            genre: genre,
            indexOfSelectedGenre: index
          }
        },
        "SONG_LIST_FETCH_FAILURE"
      ]
    }
  };
}

export function fetchSongList(genre, index) {
  return async (dispatch) => {
    await dispatch(initiatingSongListFetch());
    await dispatch(fetchSongs(index, genre));
  };
}

// export function fetchSongList(genre, index) {
//   return (dispatch) => {
//     dispatch(initiatingSongListFetch(genre, index));
//     return fetch(`/api/tracks?genre=${genre}`, {
//       accept: "application/json"
//     })
//       .then(utils.checkStatus)
//       .then(utils.parseJSON)
//       .then((tracks) =>
//         dispatch(storeSongListAction(tracks.body.tracks, index, genre))
//       )
//       .then((data) => data)
//       .catch((error) => console.log(error.message));
//   };
// }

// function fetchSuccessAction() {
//   return {
//     [RSAA]: {
//       type: consts.FETCH_SUCCESS,
//       songsLoaded: true
//     }
//   };
// }

// export function fetchSuccess() {
//   return (dispatch) => {
//     return new Promise((resolve) => {
//       resolve();
//     }).then(() => {
//       dispatch(fetchSuccessAction());
//     });
//   };
// }
