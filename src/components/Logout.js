import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { logout } from "../actions/UserSessionActions";
import { pausePlayer } from "../actions/PlayerActions";

class Logout extends React.Component {
  handleLogoutClick() {
    if (this.props.playingSong) {
      this.props.pausePlayer();
    }
    this.props.logout();
  }

  renderRedirect() {}
  render() {
    const { loggedOut } = this.props;
    if (loggedOut) {
      return <Redirect to="/login" />;
    }

    return (
      <button className="ui button" onClick={() => this.handleLogoutClick()}>
        Logout
      </button>
    );
  }
}

Logout.propTypes = {
  loggedOut: PropTypes.bool
};

const mapStateToLogoutProps = (state) => {
  return {
    loggedOut: state.userSessionReducer.loggedOut,
    playingSong: state.playerReducer.playingSong
  };
};

const mapDispatchToLogoutProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
    pausePlayer: () => {
      dispatch(pausePlayer());
    }
  };
};

export default connect(
  mapStateToLogoutProps,
  mapDispatchToLogoutProps
)(Logout);
