import React from "react";
import { mount } from "enzyme";
import Login from "../components/Login";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import createRefreshMiddleware from "../middleware/requestMiddleware";
import { Provider } from "react-redux";

const middlewares = [thunk, createRefreshMiddleware()];
const mockStore = configureMockStore(middlewares);
let initialState = {
  userSessionReducer: {
    authUrl: {
      authUrl: "www.google.com"
    },
    loggingIn: true
  }
};
let store;
let wrapper;

describe("Login.js", () => {
  beforeEach(() => {
    store = mockStore(initialState);
    wrapper = mount(
      <Provider store={store}>
        <Login />
      </Provider>
    );
  });

  describe("login button functionality", () => {
    let loginButton;
    let loginInstance;
    let visibleContent;
    beforeEach(() => {
      loginButton = wrapper.find(".button");
      loginInstance = wrapper.find("Login").instance();
      visibleContent = wrapper.find(".visible.content");
    });

    it("should render a login button", () => {
      expect(loginButton.first().props().className).toEqual(
        "ui massive animated green button"
      );
      expect(loginButton.first().props().onClick).toBeDefined();
    });

    it("should render a login button with `Login to SoundSpot`", () => {
      expect(visibleContent.text()).toEqual("Login to SoundSpot");
    });

    it("when login button is clicked it should not call `renderRedirect`", () => {
      let spyLogin = spyOn(loginInstance, "handleLoginClick");
      let spyRenderRedirect = spyOn(loginInstance, "renderRedirect");
      loginInstance.forceUpdate();
      wrapper.update();
      loginButton.simulate("click");
      expect(spyLogin).toHaveBeenCalledTimes(1);
      expect(spyRenderRedirect).toHaveBeenCalledTimes(1);
    });
  });
});
