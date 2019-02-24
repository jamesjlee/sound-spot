import React from "react";
import { connect } from "react-redux";
import * as consts from "../constants/Consts";
import { fetchSongList } from "../actions/SongListActions";
import {
  setDeviceId,
  songFinishedPlaying,
  getCurrentPlaybackState
} from "../actions/PlayerActions";
import Song from "../components/Song";
import PropTypes from "prop-types";
import Cookie from "js-cookie";
import Script from "react-load-script";
import "../styles/MainContent.css";
import "../styles/SongList.css";
let _ = require("lodash");

class SongList extends React.Component {
  state = {
    loader: true,
    songsLoaded: false,
    deviceLoaded: false,
    player: null
  };
  constructor(props) {
    super(props);
    this.handleOnScroll = this.handleOnScroll.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentWillMount() {
    this.updateDimensions();
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    window.addEventListener("scroll", this.handleOnScroll);

    this.props.fetchSongList(consts.DEFAULT_SONG_GENRE, 0).then(() => {
      // this.props.getCurrentPlaybackState();
      this.checkIfWindowMatchesResolution(consts.DEFAULT_SONG_GENRE, 0);
    });
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleOnScroll);
    window.removeEventListener("resize", this.updateDimensions);
  }

  checkIfWindowMatchesResolution(genre, index) {
    if (window.scrollY === 0) {
      this.props.fetchSongList(genre, index);
      // .then(() => {
      // this.props.getCurrentPlaybackState();
      // });
    }
  }

  updateDimensions = _.debounce(() => {
    if (!this.props.songsLoaded) {
      return;
    }

    if (!this.props.isLoadingSongs && window.scrollY === 0) {
      console.log("Fetching more songs...");
      this.props.fetchSongList(
        this.props.songList[this.props.indexOfSelectedGenre].genre,
        this.props.indexOfSelectedGenre
      );
      // .then(() => {
      // this.props.getCurrentPlaybackState();
      // });
    }
  }, 1000);

  handleOnScroll = _.debounce(() => {
    var scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    var scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) ||
      document.body.scrollHeight;
    var clientHeight =
      document.documentElement.clientHeight || window.innerHeight;
    var scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

    if (scrolledToBottom) {
      if (!this.props.songsLoaded) {
        return;
      }

      if (!this.props.isLoadingSongs) {
        this.props
          .fetchSongList(
            this.props.songList[this.props.indexOfSelectedGenre].genre,
            this.props.indexOfSelectedGenre
          )
          .then(() => {
            window.scrollTo(0, scrollHeight - scrollHeight / 5);
          });
      }
    }
  }, 1000);

  handleScriptError = (err) => {
    console.log(err);
  };

  handleScriptLoad = () => {
    return new Promise((resolve) => {
      if (window.Spotify) {
        resolve();
      } else {
        // window.onSpotifyWebPlaybackSDKReady = resolve;
        window.onSpotifyWebPlaybackSDKReady = () => {
          const player = new window.Spotify.Player({
            name: "Spotify SDK Web Player",
            getOAuthToken: (cb) => {
              cb(Cookie.get(consts.COOKIE_PATH));
            }
          });

          this.setState({
            player: player
          });

          if (this.state.player) {
            this.state.player.connect();
            this.state.player.addListener(
              "initialization_error",
              ({ message }) => {
                console.error(message);
              }
            );
            this.state.player.addListener(
              "authentication_error",
              ({ message }) => {
                console.error(message);
              }
            );
            this.state.player.addListener("account_error", ({ message }) => {
              console.error(message);
            });
            this.state.player.addListener("playback_error", ({ message }) => {
              console.error(message);
            });
            // Playback status updates
            this.state.player.addListener("player_state_changed", (state) => {
              console.log(state);
            });
            // Ready
            this.state.player.addListener("ready", ({ device_id }) => {
              console.log("Ready with Device ID", device_id);
              this.props.setDeviceId(device_id);
              this.setState({
                deviceLoaded: true
              });
            });
            // Not Ready
            this.state.player.addListener("not_ready", ({ device_id }) => {
              console.log("Device ID has gone offline", device_id);
            });
          }
        };
      }
    });
  };

  loadSongs = () => {
    this.props
      .fetchSongList(
        this.props.songList[this.props.indexOfSelectedGenre].genre,
        this.props.indexOfSelectedGenre
      )
      .then(() => {
        // this.props.getCurrentPlaybackState();
        window.scrollTo(0, document.body.scrollHeight + 100);
      });
  };

  render() {
    const {
      songList,
      indexOfSelectedGenre,
      songsLoaded,
      isLoadingSongs,
      product
    } = this.props;

    // if (product === "premium") {
    if (!this.state.deviceLoaded) {
      return (
        <Script
          url="https://sdk.scdn.co/spotify-player.js"
          onError={this.handleScriptError.bind(this)}
          onLoad={this.handleScriptLoad.bind(this)}
        />
      );
    } else {
      if (!isLoadingSongs && songsLoaded && product === "premium") {
        const songsFromGenre = songList[indexOfSelectedGenre].songs.map(
          (songItem, index) => (
            <Song
              song={songItem}
              key={songItem.name + "-" + songItem.id}
              indexOfSong={index}
              trickledUpPositionMetadataState={
                this.props.trickledUpPositionMetadataState
              }
            />
          )
        );

        return (
          <div id="song-list-content" className="ui container">
            <div id="five-cards" className="ui link five cards">
              {songsFromGenre}
            </div>
          </div>
        );
      }
    }

    if (product === "premium") {
      return (
        <div id="content-loader" className="ui">
          <div className="ui active slow green double loader" />
        </div>
      );
    } else {
      return (
        <div id="premium-message" className='ui'>
          <p>
            Sorry! You must be subscribed to Spotify Premium to use this
            application.
          </p>
        </div>
      );
    }
  }
}

SongList.propTypes = {
  songList: PropTypes.array.isRequired,
  indexOfSelectedGenre: PropTypes.number.isRequired,
  songsLoaded: PropTypes.bool.isRequired,
  fetchSongList: PropTypes.func.isRequired,
  isLoadingSongs: PropTypes.bool.isRequired
};

const mapStateToSongListProps = (state) => {
  return {
    songList: state.songListReducer.songList,
    indexOfSelectedGenre: state.songListReducer.indexOfSelectedGenre,
    songsLoaded: state.songListReducer.songsLoaded,
    isLoadingSongs: state.songListReducer.isLoadingSongs,
    songFinishedPlaying: state.playerReducer.songFinishedPlaying,
    positions: state.playerReducer.positionsm,
    currentSongName: state.playerReducer.currentSongName,
    currentSongDuration: state.playerReducer.currentSongDuration,
    product: state.topBarReducer.product
  };
};

const mapDispatchToSongListProps = (dispatch) => {
  return {
    fetchSongList: (genre, index) => dispatch(fetchSongList(genre, index)),
    setDeviceId: (device_id) => dispatch(setDeviceId(device_id)),
    songFinishedPlaying: () => dispatch(songFinishedPlaying()),
    getCurrentPlaybackState: () => {
      dispatch(getCurrentPlaybackState());
    }
  };
};

export default connect(
  mapStateToSongListProps,
  mapDispatchToSongListProps
)(SongList);
