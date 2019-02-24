import React from "react";
import TopBar from "./TopBar";
import SongList from "../components/SongList";
import BottomBar from "./BottomBar";

class ParentContainer extends React.Component {
  state = {
    trickedUpPostionMetadataState: null
  };

  trickleUpState = (state) => {
    const trickledUpState = state;
    this.setState({
      trickledUpPositionMetadataState: trickledUpState
    });
  };

  render() {
    return (
      <div>
        <TopBar />
        <SongList
          trickledUpPositionMetadataState={
            this.state.trickledUpPositionMetadataState
          }
        />
        <BottomBar trickleUpState={this.trickleUpState} />
      </div>
    );
  }
}

export default ParentContainer;