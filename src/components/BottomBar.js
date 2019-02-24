import React from "react";
import Player from "./Player";
import "../styles/BottomBar.css";

class BottomNav extends React.Component {
  render() {
    return (
      <div id="bottomBar" className="ui bottom fixed menu">
        <div className="right item">
          <Player trickleUpState={this.props.trickleUpState}/>
        </div>
        <div className="right item">
          <span></span>
        </div>
      </div>
    );
  }
}

export default BottomNav;
