import React from "react";
import "../styles/Login.css";
import { Redirect } from "react-router-dom";
import {
  authorizeUser,
  authorizeUserWithAuthUrl
} from "../actions/UserSessionActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import * as consts from "../constants/Consts";

class Login extends React.Component {
  handleLoginClick = () => {
    this.props.authorizeUser();
  };

  renderRedirect = (authUrl) => {
    this.props.authorizeUserWithAuthUrl(authUrl);
  };

  render() {
    const { authUrl } = this.props;

    if (authUrl !== null) {
      this.renderRedirect(authUrl);
    }

    if (Cookies.get(consts.COOKIE_PATH) + "" !== "undefined") {
      return <Redirect to="/user" />;
    }

    return (
      <div className="ui loginButton">
        <button
          className="ui massive animated green button"
          onClick={this.handleLoginClick}
        >
          <div className="visible content">Login to SoundSpot</div>
          <div className="hidden content">
            <i aria-hidden="true" className="arrow right icon" />
          </div>
        </button>
      </div>
    );
  }
}

Login.propTypes = {
  authUrl: PropTypes.string
};

const mapStateToLoginProps = (state) => {
  return {
    authUrl: state.userSessionReducer.authUrl
  };
};

const mapDispatchToLoginProps = (dispatch) => {
  return {
    authorizeUser: () => dispatch(authorizeUser()),
    authorizeUserWithAuthUrl: (authUrl) =>
      dispatch(authorizeUserWithAuthUrl(authUrl))
  };
};

export default connect(
  mapStateToLoginProps,
  mapDispatchToLoginProps
)(Login);
