import { combineReducers } from "redux";
import userSessionReducer from "./UserSessionReducer";
import songListReducer from './SongListReducer'
import playerReducer from './PlayerReducer'
import topBarReducer from './TopBarReducer'

const rootReducer = combineReducers({
  userSessionReducer,
  songListReducer,
  playerReducer,
  topBarReducer
});

export default rootReducer;
