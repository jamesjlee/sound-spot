import React from "react";
import PropTypes from "prop-types";

const NoMatch = ({ location }) => (
  <div className="ui inverted red raised very padded text container segment">
    <strong>Error!</strong> No route found matching:
    <div className="ui inverted black segment">
      <code>{location.pathname}</code>
    </div>
  </div>
);

NoMatch.propTypes = {
  location: PropTypes.string.isRequired
};

export default NoMatch;
