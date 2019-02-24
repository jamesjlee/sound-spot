import React from "react";
import { mount, shallow } from "enzyme";
import User from "../components/User";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import createRefreshMiddleware from "../middleware/requestMiddleware";
import { Provider } from "react-redux";
import Cookie from "js-cookie";
import * as consts from "../constants/Consts";
import { BrowserRouter as Router } from "react-router-dom";

const middlewares = [thunk, createRefreshMiddleware()];
const mockStore = configureMockStore(middlewares);
const expiresAt = Date.now();
let initialState = {
  userSessionReducer: {
    authToken: "1a2a3a4a",
    refreshToken: "4a3a2a1a",
    expiresAt: expiresAt.toString(),
    tokenIsValid: false
  },
  songListReducer: {
    songList: [],
    indexOfSelectedGenre: 0,
    songsLoaded: false
  }
};
let store;
let wrapper;
let search = `www.google.com?access_token=1a2a3a4a&refresh_token=4a3a2a1a&expiresAt=${expiresAt}`;

describe("User.js", () => {
  beforeEach(() => {
    store = mockStore(initialState);
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <User location={search} />
        </Router>
      </Provider>
    );
    Cookie.get = jest
      .fn(consts.COOKIE_PATH)
      .mockImplementationOnce(() => undefined);
  });

  it("should render loader", () => {
    expect(wrapper.find(".ui.container").first().length).toEqual(0);
  });
});
