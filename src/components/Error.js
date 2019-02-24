import React from "react";
import PropTypes from "prop-types";
class Error extends React.Component {
  render() {
    const { errorMsg } = this.props.params;
    return (
      <div className="error">
        <h2>An Error Occured</h2>
        <p>{errorMsg}</p>
      </div>
    );
  }
}

Error.propTypes = {
  errorMsg: PropTypes.string.isRequired
};

export default Error;
