import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import createRefreshMiddleware from "../middleware/requestMiddleware";
import rootReducer from "../reducers/RootReducer";

// const createStoreWithMiddleware = composeWithDevTools(applyMiddleware(
//   createRefreshMiddleware(),
//   thunkMiddleware
// ))(createStore);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(rootReducer, window.__state__, composeEnhancers(applyMiddleware(createRefreshMiddleware(), thunkMiddleware)));
