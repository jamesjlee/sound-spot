import React from "react";
import User from "./components/User";
import Login from "./components/Login";
import Logout from "./components/Logout";
import {
  Route,
  Redirect,
  Switch,
  BrowserRouter as Router
} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Error from "./components/Error";
import { store } from "./store/store";
import { Provider } from "react-redux";
import NoMatch from "./components/NoMatch";

class App extends React.Component {
  renderLoading = () => {
    return (
      <div id="content-loader" className="ui">
        <div className="ui active slow green double loader" />
      </div>
    );
  };
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <PrivateRoute path="/user" component={User} />
            <Route path="/login" component={Login} />
            <Route path="/logout" component={Logout} />
            <Route path="/error/:errorMsg" component={Error} />
            <Route exact path="/" render={() => <Redirect to="/user" />} />
            <Route component={NoMatch} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
