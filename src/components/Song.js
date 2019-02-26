import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  playSongWithPlayer,
  getCurrentPlaybackState,
  songClickedWithMouse
} from "../actions/PlayerActions";
import "../styles/Song.css";
let _ = require("lodash");

class Song extends React.Component {
  // constructor(props) {
  //   super(props);
  //   // this.setSongClickedToFalse = this.setSongClickedToFalse.bind(this);
  // }

  state = {
    songToPlay: null,
    player: null,
    deviceId: null,
    loadedOnce: false,
    activeIndex: null
  };

  handleSongClick = _.debounce(
    (
      e,
      song,
      indexOfSong,
      lengthOfSongList,
      positions,
      currentSongName,
      songFinishedPlaying,
      trickledUpPositionMetadataState
    ) => {
      if (song) {
        this.setState({
          activeIndex: indexOfSong
        });

        let position;
        if (typeof trickledUpPositionMetadataState === "undefined") {
          position = 0;
        } else {
          let positionsMetadata = trickledUpPositionMetadataState.songPositionMetadata.filter(
            (item) => {
              return item.songName === song.name;
            }
          );

          position =
            positionsMetadata.length > 0
              ? positionsMetadata[0].songPosition
              : 0;
        }

        this.props.songClickedWithMouse();
        this.props.playSongWithPlayer(
          song,
          indexOfSong,
          lengthOfSongList,
          position
        );
      }
    },
    250
  );

  render() {
    const {
      song,
      indexOfSong,
      songList,
      positions,
      currentSongName,
      songFinishedPlaying,
      indexOfSelectedGenre,
      trickledUpPositionMetadataState
    } = this.props;

    let style = "ui card";
    if (songList.length > 0) {
      style =
        currentSongName ===
        songList[indexOfSelectedGenre].songs[indexOfSong].name
          ? "ui blue card currentlyPlaying"
          : "ui card";
    }

    return (
      <div
        id={`${song.name}-${song.id}`}
        className={style}
        onClick={(e) =>
          this.handleSongClick(
            e,
            song,
            indexOfSong,
            songList.length,
            positions,
            currentSongName,
            songFinishedPlaying,
            trickledUpPositionMetadataState
          )
        }
      >
        <div className="image">
          <img
             id={`${song.name}-${song.id}-image`}
            src={
              song.album.images
                ? song.album.images[0].url
                : "https://noalbumart.as2d1fa3s"
            }
            alt="song_image"
          />
        </div>
        <div className="content">
          <a className="header">{song.name}</a>
          <div className="meta">
            <span className="description">{song.artists[0].name}</span>
          </div>
        </div>
      </div>
    );
  }
}

Song.propTypes = {
  song: PropTypes.object.isRequired,
  deviceId: PropTypes.string.isRequired
};

const mapStateToSongProps = (state, ownProps) => {
  return {
    deviceId: state.playerReducer.deviceId,
    playingSong: state.playerReducer.playingSong,
    songList: state.songListReducer.songList,
    positions: state.playerReducer.positions,
    currentSongName: state.playerReducer.currentSongName,
    songFinishedPlaying: state.playerReducer.songFinishedPlaying,
    indexOfSelectedGenre: state.songListReducer.indexOfSelectedGenre,
    trickledUpPositionMetadataState: ownProps.trickledUpPositionMetadataState
  };
};

const mapDispatchToSongProps = (dispatch) => {
  return {
    songClickedWithMouse: () => {
      dispatch(songClickedWithMouse());
    },
    playSongWithPlayer: (song, indexOfSong, lengthOfSongList, deviceId) =>
      dispatch(
        playSongWithPlayer(song, indexOfSong, lengthOfSongList, deviceId)
      ),
    getCurrentPlaybackState: () => {
      dispatch(getCurrentPlaybackState());
    }
  };
};

export default connect(
  mapStateToSongProps,
  mapDispatchToSongProps
)(Song);
