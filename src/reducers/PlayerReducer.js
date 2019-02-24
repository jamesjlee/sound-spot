const initialState = {
  playingSong: false,
  deviceId: null,
  currentSong: null,
  currentSongName: null,
  currentSongArtist: null,
  indexOfSong: 0,
  lengthOfSongList: 0,
  positions: [],
  songClickedWithMouse: false,
  currentSongFinished: false,
  currentSongPosition: 0,
};

const playerReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_DEVICE_ID":
      return {
        ...state,
        deviceId: action.deviceId
      };

    case "PAUSE_PLAYER_SUCCESS":
      return {
        ...state,
        playingSong: action.meta.playingSong,
        currentSongFinished: false,
        positions: state.positions.map((item) => {
          if (item.songName === action.currentSongName) {
            return {
              ...item,
              songName: item.songName,
              positionMs: item.positionMs,
              songDuration: item.songDuration,
              songFinishedPlaying:
                item.songDuration === item.positionMs ? true : false,
            };
          }
          return item;
        })
      };

    case "PLAYER_PLAY_SUCCESS":
      return {
        ...state,
        currentSong: action.meta.currentSong,
        currentSongName: action.meta.currentSongName,
        currentSongArtist: action.meta.currentSongArtist,
        currentSongDuration: action.meta.currentSongDuration,
        indexOfSong: action.meta.indexOfSong,
        lengthOfSongList: action.meta.lengthOfSongList,
        playingSong: action.meta.playingSong,
        currentSongFinished: false,
        currentSongPosition: 0
      };

    case "PLAYER_PLAY_FAILURE":
      return {
        ...state,
        playingSong: false
      };

    case "GET_CURRENT_USER_PLAYBACK_SUCCESS":
      if (action.payload.body.item) {
        return {
          ...state,
          positions: [
            ...state.positions,
            {
              positionMs: action.payload.body.progress_ms,
              songName: action.payload.body.item.name,
              songDuration: action.payload.body.item.duration_ms,
              songFinishedPlaying:
                action.payload.body.item.duration_ms ===
                action.payload.body.progress_ms
                  ? true
                  : false,

            }
          ].reduce((acc, d) => {
            let found = acc.find((a) => a.songName === d.songName);
            let val = {
              songName: d.songName,
              positionMs: d.positionMs,
              songFinishedPlaying: d.songFinishedPlaying,
              songDuration: d.songDuration,
            };
            if (found) {
              if (found.positionMs < d.positionMs) {
                val = {
                  songName: d.songName,
                  positionMs: d.positionMs,
                  songFinishedPlaying: d.songFinishedPlaying,
                  songDuration: d.songDuration,
                };
                acc.push(val);
                let index = acc.indexOf(found);
                if (index > -1) {
                  acc.splice(index, 1);
                }
              }
              if (found.positionMs > d.positionMs) {
                val = {
                  songName: found.songName,
                  positionMs: found.positionMs,
                  songFinishedPlaying: found.songFinishedPlaying,
                  songDuration: found.songDuration,
                };
                acc.push(val);
                let index = acc.indexOf(d);
                if (index > -1) {
                  acc.splice(index, 1);
                }
              }

              if (found.positionMs === d.positionMs) {
                let index = acc.indexOf(found);
                if (index > -1) {
                  acc.splice(index, 1);
                }
              }
            } else if (!found) {
              acc.push(val);
            }
            return acc.reduce((unique, o) => {
              if (
                !unique.some(
                  (obj) =>
                    obj.songName === o.songName &&
                    obj.positionMs === o.positionMs
                )
              ) {
                unique.push(o);
              }
              return unique;
            }, []);
          }, [])
        };
      } else {
        return {
          ...state
        };
      }

    case "BEFORE_SONG_PLAY":
      return {
        ...state,
        currentSong: action.currentSong,
        currentSongName: action.currentSongName,
        currentSongArtist: action.currentSongArtist,
        currentSongDuration: action.currentSongDuration,
        indexOfSong: action.indexOfSong,
        lengthOfSongList: action.lengthOfSongList,
        playingSong: action.playingSong,
        currentSongFinished: false,
        currentSongPosition: 0
      };

    case "SONG_FINISHED_PLAYING":
      return {
        ...state,
        playingSong: false,
        currentSongFinished: true,
        positions: action.positions.map((item) => {
          if (item.songName === action.currentSongName) {
            return { ...item, songFinishedPlaying: true };
          }
          return item;
        })
      };

    case "SONG_CLICKED_WITH_MOUSE":
      return {
        ...state,
        songClickedWithMouse: action.songClickedWithMouse
      };

    case "SONG_NOT_CLICKED_WITH_MOUSE":
      return {
        ...state,
        songClickedWithMouse: action.songClickedWithMouse
      };

    // case "PLAYED_NEXT_SUCCESS":
    //   return {
    //     ...state,
    //     playedNextSong: true
    //   };

    // case "UPDATE_CURRENT_SONG_POSITION_SUCCESS":
    //   return {
    //     ...state,
    //     currentSongPosition: action.currentSongPosition,
    //     songMappedToInterval: [
    //       ...state.songMappedToInterval,
    //       {
    //         songName: state.currentSongName,
    //         indexOfSong: state.indexOfSong,
    //         indexOfInterval: action.intervalId,
    //         currentSongPosition: action.currentSongPosition
    //       }
    //     ]
    //   };

    // case "UPDATING_PROGRESS_BAR": {
    //   return {
    //     ...state,

    //   }
    // }

    default:
      return state;
  }
};

export default playerReducer;
