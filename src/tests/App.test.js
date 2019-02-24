import React from "react";
import App from "../App";
import { shallow, mount, enzyme } from "enzyme";
import {
  Route,
  Switch,
  BrowserRouter as Router
} from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import User from "../components/User";
import Login from "../components/Login";
import Logout from "../components/Logout";
import Error from "../components/Error";
import configureStore from "../store/store";
import { Provider } from "react-redux";
import NoMatch from "../components/NoMatch";

jest.mock("../store/store");

describe("App.js", () => {
  describe("App.js components exist", () => {
    let wrapper = null;
    beforeEach(() => {
      wrapper = shallow(<App />);
    });

    it("should mount and check for Provider", () => {
      const hasProvider = wrapper.find(Provider);
      expect(hasProvider).toBeDefined();
      expect(hasProvider.props().store).toEqual(configureStore());
    });

    it("should mount and check for Router", () => {
      const hasRouter = wrapper.find(Router);
      expect(hasRouter).toBeDefined();
    });

    it("should mount and check for Switch", () => {
      const hasSwitch = wrapper.find(Switch);
      expect(hasSwitch).toBeDefined();
    });

    describe("PrivateRoute is initialized correctly", () => {
      it("should mount and check for PrivateRoute", () => {
        const hasPrivateRoute = wrapper.find(PrivateRoute);
        expect(hasPrivateRoute).toBeDefined();
      });
      it("should check if PrivateRoute is initialized properly", () => {
        const hasPrivateRoute = wrapper.find(PrivateRoute);
        expect(hasPrivateRoute.props().path).toEqual("/user");
        expect(hasPrivateRoute.props().component).toEqual(User);
      });
    });

    describe("Routes are intialized correctly", () => {
      it("should mount and check for Route children", () => {
        let hasRoutes = wrapper.find(Route);
        expect(hasRoutes).toHaveLength(5);
      });
      it("should have a route /login", () => {
        const login = wrapper.findWhere((n) => n.props().path === "/login");
        expect(login.props().component).toEqual(Login);
      });
      it("should have a route /logout", () => {
        const logout = wrapper.findWhere((n) => n.props().path === "/logout");
        expect(logout.props().component).toEqual(Logout);
      });

      it("should have a route /error/:errorMsg", () => {
        const error = wrapper.findWhere(
          (n) => n.props().path === "/error/:errorMsg"
        );
        expect(error.props().component).toEqual(Error);
      });

      it("should have a route /", () => {
        const slash = wrapper.findWhere((n) => n.props().path === "/");
        expect(slash.props().render).toBeDefined();
      });

      it("should have a route with component NoMatch", () => {
        const noMatch = wrapper.findWhere(
          (n) => n.props().component === NoMatch
        );
        expect(noMatch).toBeDefined();
      });
    });
  });
});
