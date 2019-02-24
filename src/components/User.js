import React from "react";
import * as consts from "../constants/Consts";
import { connect } from "react-redux";
import { setTokenInfo } from "../actions/UserSessionActions";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import qs from "query-string";
import { Redirect } from "react-router-dom";
import ParentContainer from './ParentContainer'

class User extends React.Component {
  state = {
    cookiesSet: false
  };
  componentWillMount() {
    if (Cookies.get(consts.COOKIE_PATH) + "" === "undefined") {
      this.props.setTokenInfo(
        qs.parse(this.props.location.search).access_token,
        qs.parse(this.props.location.search).refresh_token,
        Number(qs.parse(this.props.location.search).expires_at)
      );
    }
  }

  render() {
    if (Cookies.get(consts.COOKIE_PATH) + "" !== "undefined") {
      return (
        <div id="whole-container" className="ui container">
          <ParentContainer>
          </ParentContainer>
        </div>
      );
    } else {
      return <Redirect to="/login" />;
    }
  }
}

User.propTypes = {
  authToken: PropTypes.string,
  refreshToken: PropTypes.string,
  expiresAt: PropTypes.number,
  tokenIsValid: PropTypes.bool.isRequired,
  loggedIn: PropTypes.bool.isRequired
};

const mapStateToUserProps = (state) => {
  return {
    authToken: state.userSessionReducer.authToken,
    refreshToken: state.userSessionReducer.refreshToken,
    expiresAt: state.userSessionReducer.expiresAt,
    tokenIsValid: state.userSessionReducer.tokenIsValid,
    loggedIn: state.userSessionReducer.loggedIn
  };
};

const mapDispatchToUserProps = (dispatch) => {
  return {
    setTokenInfo: (authToken, refreshToken, expiresAt) =>
      dispatch(setTokenInfo(authToken, refreshToken, expiresAt))
  };
};

export default connect(
  mapStateToUserProps,
  mapDispatchToUserProps
)(User);
