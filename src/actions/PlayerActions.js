import { RSAA } from "redux-api-middleware";
import qs from "query-string";

function playSongWithPlayerAction(
  song,
  songUri,
  deviceId,
  currSong,
  positionMs,
  indexOfSong,
  lengthOfSongList
) {
  let body;
  if (songUri === null && currSong === null && Number(positionMs) === 0) {
    body = qs.stringify({
      song_uri: null,
      device_id: deviceId,
      position_ms: 0
    });
  } else if (songUri === null && currSong !== null && Number(positionMs) > 0) {
    body = qs.stringify({
      song_uri: currSong,
      device_id: deviceId,
      position_ms: positionMs
    });
  } else if (songUri !== null && currSong !== null && Number(positionMs) > 0) {
    body = qs.stringify({
      song_uri: songUri,
      device_id: deviceId,
      position_ms: positionMs
    });
  } else {
    body = qs.stringify({
      song_uri: songUri,
      device_id: deviceId,
      position_ms: 0
    });
  }

  return {
    [RSAA]: {
      endpoint: "/api/play?" + body,
      method: "GET",
      types: [
        "PLAYER_PLAY_REQUEST",
        {
          type: "PLAYER_PLAY_SUCCESS",
          meta: {
            currentSong: song,
            currentSongName: song.name,
            currentSongArtist: song.artists[0].name,
            currentSongDuration: song.duration_ms,
            indexOfSong: indexOfSong,
            lengthOfSongList: lengthOfSongList,
            playingSong: true
          }
        },
        "PLAYER_PLAY_FAILURE"
      ]
    }
  };
}

function beforeSongPlayAction(song, indexOfSong, lengthOfSongList) {
  return {
    type: "BEFORE_SONG_PLAY",
    currentSong: song,
    currentSongName: song.name,
    currentSongArtist: song.artists[0].name,
    currentSongDuration: song.duration_ms,
    indexOfSong: indexOfSong,
    lengthOfSongList: lengthOfSongList,
    playingSong: true
  };
}

function beforeSongPlay(song, indexOfSong, lengthOfSongList) {
  return async (dispatch, getState) => {
    await dispatch(beforeSongPlayAction(song, indexOfSong, lengthOfSongList));
  };
}

export function playSongWithPlayer(
  song,
  indexOfSong,
  lengthOfSongList,
  positionMs
) {
  if (song) {
    return async (dispatch, getState) => {
      // await dispatch(beforeSongPlay(song, indexOfSong, lengthOfSongList));
      await dispatch(
        playSongWithPlayerAction(
          song,
          song.uri,
          getState().playerReducer.deviceId,
          getState().playerReducer.currentSong,
          positionMs > 0 ? positionMs : getState().playerReducer.currentSong,
          indexOfSong,
          lengthOfSongList
        )
      );
      // await dispatch(getUserCurrentPlaybackStateAction());

      // return dispatch(beforeSongPlay(song, indexOfSong, lengthOfSongList)).then(() => {
      //   console.log(getState())
      //   return dispatch(getCurrentPlaybackState()).then(() => {
      //     console.log(getState())
      //     return dispatch(
      //       playSongWithPlayerAction(
      //         song.uri,
      //         getState().playerReducer.deviceId,
      //         getState().playerReducer.currentSong,
      //         positionMs > 0 ? positionMs : getState().playerReducer.positionMs
      //       )
      //     );
      //   });
      // });
    };
  }
}

function setVolume(volume, deviceId) {
  const body = qs.stringify({
    volume: volume,
    device_id: deviceId
  });
  return {
    [RSAA]: {
      endpoint: "/api/set_player_volume?" + body,
      method: "GET",
      types: [
        "SET_PLAYER_VOLUME_REQUEST",
        "SET_PLAYER_VOLUME_SUCCESS",
        "SET_PLAYER_VOLUME_FAILURE"
      ]
    }
  };
}

export function setDefaultVolume(volume) {
  return async (dispatch, getState) => {
    await dispatch(setVolume(volume, getState().playerReducer.deviceId));
  };
}

function pausePlayerAction(deviceId, songName, positions) {
  const body = qs.stringify({
    device_id: deviceId
  });
  return {
    [RSAA]: {
      endpoint: "/api/pause_player?" + body,
      method: "GET",
      types: [
        "PAUSE_PLAYER_REQUEST",
        {
          type: "PAUSE_PLAYER_SUCCESS",
          meta: {
            playingSong: false,
            currentSongName: songName,
            positions: positions
          }
        },
        "PAUSE_PLAYER_FAILURE"
      ]
    }
  };
}

export function pausePlayer() {
  return async (dispatch, getState) => {
    // await dispatch(beforeSongPlayAction(getState().song));
    // console.log(getState())
    // await dispatch(getUserCurrentPlaybackStateAction());
    await dispatch(
      pausePlayerAction(
        getState().playerReducer.deviceId,
        getState().playerReducer.currentSongName,
        getState().playerReducer.positions
      )
    );
    // await dispatch(beforeSongPlayAction()).then(() => {
    //   dispatch(getUserCurrentPlaybackStateAction()).then(() => {
    //     dispatch(pausePlayerAction(getState().playerReducer.deviceId));
    //   });
    // });
  };
}

export function setDeviceId(deviceId) {
  return async (dispatch) => {
    await dispatch(setDeviceIdAction(deviceId));
  };
}

function setDeviceIdAction(deviceId) {
  return {
    type: "SET_DEVICE_ID",
    deviceId: deviceId
  };
}

function getUserCurrentPlaybackStateAction() {
  return {
    [RSAA]: {
      endpoint: "/api/current_user_playback",
      method: "GET",
      types: [
        "GET_CURRENT_USER_PLAYBACK_REQUEST",
        "GET_CURRENT_USER_PLAYBACK_SUCCESS",
        "GET_CURRENT_USER_PLAYBACK_FAILURE"
      ]
    }
  };
}

export function getCurrentPlaybackState() {
  return async (dispatch, getState) => {
    await dispatch(getUserCurrentPlaybackStateAction());
  };
}

function songFinishedPlayingAction(positions, currentSongName) {
  return {
    type: "SONG_FINISHED_PLAYING",
    positions: positions,
    currentSongName: currentSongName,
    currentSongFinished: true,
    playingSong: false
  };
}

export function songFinishedPlaying() {
  return async (dispatch, getState) => {
    await dispatch(
      songFinishedPlayingAction(
        getState().playerReducer.positions,
        getState().playerReducer.currentSongName
      )
    );
  };
}

function songClickedWithMouseAction() {
  return {
    type: "SONG_CLICKED_WITH_MOUSE",
    songClickedWithMouse: true
  };
}

export function songClickedWithMouse() {
  return async (dispatch, getState) => {
    await dispatch(songClickedWithMouseAction());
  };
}

function songNotClickedWithMouseAction() {
  return {
    type: "SONG_NOT_CLICKED_WITH_MOUSE",
    songClickedWithMouse: false
  };
}

export function songNotClickedWithMouse() {
  return async (dispatch, getState) => {
    await dispatch(songNotClickedWithMouseAction());
  };
}

function seekAction() {
  return {
    [RSAA]: {
      endpoint: "/api/seek",
      method: "GET",
      types: ["SEEK_REQUEST", "SEEK_SUCCESS", "SEEK_FAILURE"]
    }
  };
}

export function seek() {
  return async (dispatch, getState) => {
    await dispatch(seekAction());
  };
}

// function playedNextSongAction() {
//   return {
//     type: "PLAYED_NEXT_SUCCESS",
//     playedNextSong: true
//   };
// }
// export function playNextSong() {
//   return async (dispatch, getState) => {
//     await dispatch(playedNextSongAction());
//   };
// }

// function updateCurrentSongPositionAction(pos, intervalId) {
//   return {
//     type: "UPDATE_CURRENT_SONG_POSITION_SUCCESS",
//     currentSongPosition: pos,
//     intervalId: intervalId
//   };
// }
// export function updateCurrentSongPosition(pos, intervalId) {
//   return async (dispatch, getState) => {
//     await dispatch(updateCurrentSongPositionAction(pos, intervalId));
//   };
// }

// function updateProgressBarAction(position_ms) {
//   return {
//     type: "UPDATING_PROGRESS_BAR",
//     positionMs: position_ms
//   };
// }

// export function updateProgressBar() {
//   return async (dispatch, getState) => {
//     await dispatch(getCurrentPlaybackState());
//     await dispatch(
//       updateProgressBarAction(getState().playerReducer.position_ms)
//     );
//   };
// }
