import * as consts from "../constants/Consts";

const initialState = {
  songList: [
    {
      id: 0,
      genre: "edm",
      songs: []
    },
    {
      id: 1,
      genre: "trance",
      songs: []
    },
    {
      id: 2,
      genre: "dance",
      songs: []
    },
    {
      id: 3,
      genre: "electronic",
      songs: []
    },
    {
      id: 4,
      genre: "house",
      songs: []
    },
    {
      id: 5,
      genre: "deep-house",
      songs: []
    }
  ],
  indexOfSelectedGenre: 0,
  songsLoaded: false,
  isLoadingSongs: false
};

const songListReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_SONGS_FROM_GENRE":
      return {
        ...state,
        indexOfSelectedGenre: action.indexOfSelectedGenre
      };

    case "INITIATING_SONG_LIST_FETCH_REQUEST":
      return {
        ...state,
        isLoadingSongs: action.meta.isLoadingSongs,
        songsLoaded: action.meta.songsLoaded
      };

    case "SONG_LIST_FETCH_REQUEST":
      return {
        ...state,
        isLoadingSongs: true
      };
    case "SONG_LIST_FETCH_SUCCESS":
      if (action.payload) {
        return {
          ...state,
          songList: [
            ...state.songList.slice(0, action.meta.indexOfSelectedGenre),
            {
              id: action.meta.indexOfSelectedGenre,
              genre: action.meta.genre,
              songs: [
                ...state.songList[action.meta.indexOfSelectedGenre].songs,
                ...action.payload.body.tracks
              ]
                .reduce(
                  (acc, song) =>
                    acc.some((x) => x.id === song.id) ? acc : acc.concat(song),
                  []
                )
                .filter((song) => {
                  if (song.available_markets.length > 0) {
                    return song;
                  }
                })
            },
            ...state.songList.slice(
              action.meta.indexOfSelectedGenre + 1,
              state.songList.length
            )
          ],
          indexOfSelectedGenre: action.meta.indexOfSelectedGenre,
          isLoadingSongs: false,
          songsLoaded: true
        };
      } else {
        return {
          ...state
        };
      }

    case consts.STORE_SONG_LIST:
      return {
        ...state,
        songList: [
          ...state.songList.slice(0, action.indexOfSelectedGenre),
          {
            id: action.indexOfSelectedGenre,
            genre: action.genre,
            songs: [
              ...state.songList[action.indexOfSelectedGenre].songs,
              ...action.tracks
            ].reduce(
              (acc, song) =>
                acc.some((x) => x.id === song.id) ? acc : acc.concat(song),
              []
            )
          },
          ...state.songList.slice(
            action.indexOfSelectedGenre + 1,
            state.songList.length
          )
        ],
        indexOfSelectedGenre: action.indexOfSelectedGenre
      };
    default:
      return state;
  }
};

export default songListReducer;
