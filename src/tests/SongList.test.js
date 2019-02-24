import React from "react";
import { mount, shallow } from "enzyme";
import SongList from "../components/SongList";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import createRefreshMiddleware from "../middleware/requestMiddleware";
import { Provider } from "react-redux";

const middlewares = [thunk, createRefreshMiddleware()];
const mockStore = configureMockStore(middlewares);
let initialState = {
  songListReducer: {
    songList: [
      {
        id: "1f2390hf0239h",
        name: "Test song",
        album: {
          images: [
            {
              height: 640,
              url: "https://testimg.com"
            }
          ]
        },
        uri: "spotify:track:1209379ry09"
      }
    ],
    indexOfSelectedGenre: 0,
    songsLoaded: false
  }
};
let store;
let wrapper;

describe("SongList.js", () => {
  beforeEach(() => {
    store = mockStore(initialState);
    wrapper = mount(
      <Provider store={store}>
        <SongList />
      </Provider>
    );
  });

  it("should render loader", () => {
    expect(wrapper.find(".ui.container").first().length).toEqual(1);
    expect(wrapper.find(".ui.active.dimmer").length).toEqual(1);
  });
});
