import React from "react";
import { Route } from "react-router-dom";
import PropTypes from "prop-types";

const PrivateRoute = ({ component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const propsSearch = props.location.search;
      return React.createElement(component, props);
    }}
  />
);

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired
};

export default PrivateRoute;
