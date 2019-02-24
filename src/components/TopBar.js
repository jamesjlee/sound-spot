import React from "react";
import Logout from "../components/Logout";
import NavBar from "../components/NavBar";
import { me } from "../actions/TopBarActions.js";
import { connect } from "react-redux";
import Cookies from "js-cookie";
import * as consts from "../constants/Consts";

class TopBar extends React.Component {
  componentDidMount() {
    if (Cookies.get(consts.COOKIE_PATH) + "" !== "undefined") {
      this.props.me();
    }
  }

  render() {
    let displayBlock = {
      display: "block"
    };

    const { displayName } = this.props;

    return (
      <div className="ui fixed menu" style={displayBlock}>
        <div className="ui container">
          <div className="right item">
            <h1 className="ui header">SoundSpot</h1>
          </div>
          <div className="right item">
            <a class="ui blue label">Hello, {displayName}</a>
            <Logout />
          </div>
        </div>
        <div className="ui container">
          <div className="item">
            <NavBar />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToTopBarProps = (state, ownProps) => {
  return {
    displayName: state.topBarReducer.displayName
  };
};

const mapDispatchToTopBarProps = (dispatch) => {
  return {
    me: () => {
      dispatch(me());
    }
  };
};

export default connect(
  mapStateToTopBarProps,
  mapDispatchToTopBarProps
)(TopBar);
