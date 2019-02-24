import React from "react";
import { connect } from "react-redux";
import {
  playSongWithPlayer,
  setDefaultVolume,
  pausePlayer,
  getCurrentPlaybackState,
  songNotClickedWithMouse,
  songFinishedPlaying,
  seek
} from "../actions/PlayerActions";
import "../styles/Player.css";
import Slider from "rc-slider";
import { Line } from "rc-progress";
import "rc-slider/assets/index.css";
let _ = require("lodash");

class Player extends React.Component {
  state = {
    mouseClickOnVolume: false,
    volume: 50,
    songPercent: 0,
    receivedPropsCalled: false,
    pauseCalled: false,
    backwardCalled: false,
    forwardCalled: false,
    startCalled: false,
    interval: null,
    currentSongPosition: 0,
    songPositionMetadata: [],
    autoPlayed: false
  };

  constructor(props) {
    super(props);
    // this.handleSeekLineClick = this.handleSeekLineClick.bind(this);
  }

  componentDidMount() {
    // document.getElementById("seekLine").addEventListener("click", this.handleSeekLineClick);
  }

  componentWillUnmount() {
    this.state.songPositionMetadata.forEach((item) => {
      clearInterval(item.songInterval);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.songClickedWithMouse) {
      this.setState({
        pauseCalled: false,
        backwardCalled: false,
        forwardCalled: false,
        startCalled: false,
        autoPlayed: false
      });
    }

    if (
      (nextProps.currentSongName !== this.props.currentSongName ||
        (nextProps.currentSongName === this.props.currentSongName &&
          (this.state.startCalled || nextProps.songClickedWithMouse))) &&
      nextProps.playingSong &&
      !nextProps.currentSongFinished &&
      (this.state.pauseCalled ||
        this.state.backwardCalled ||
        this.state.forwardCalled ||
        this.state.startCalled ||
        this.state.autoPlayed ||
        nextProps.songClickedWithMouse)
    ) {
      let songFound = this.state.songPositionMetadata.find((item) => {
        return item.songName === nextProps.currentSongName;
      });
      if (songFound) {
        this.updateProgressBar(songFound, nextProps);
      } else {
        this.updateProgressBarNoSongFound(nextProps);
      }
    }
  }

  updateProgressBarNoSongFound(nextProps) {
    this.state.songPositionMetadata.forEach((item) => {
      clearInterval(item.songInterval);
    });

    let interval = setInterval(() => {
      if (this.state.currentSongPosition > nextProps.currentSongDuration) {
        // clearInterval(interval);
        this.state.songPositionMetadata.forEach((item) => {
          clearInterval(item.songInterval);
        });
        this.setState({
          currentSongPosition: 0,
          songPositionMetadata: this.state.songPositionMetadata.map((item) => {
            let retVal = { ...item };
            if (item.songName === nextProps.currentSongName) {
              retVal.songPosition = 0;
              retVal.songDuration = nextProps.currentSongDuration;
              retVal.songInterval = interval;
            }
            return retVal;
          })
        });
        nextProps.trickleUpState(this.state);
        this.updateSeek(
          this.state.currentSongPosition,
          nextProps.currentSongDuration
        );
        this.playNextSong(nextProps);
        return;
      }

      let songItem = this.state.songPositionMetadata.find((item) => {
        return item.songName === nextProps.currentSongName;
      });

      if (
        this.state.songPositionMetadata.length === 0 ||
        typeof songItem === "undefined"
      ) {
        this.setState({
          currentSongPosition: 0
        });

        this.setState({
          songPositionMetadata: [
            ...this.state.songPositionMetadata,
            {
              songName: nextProps.currentSongName,
              songPosition: this.state.currentSongPosition,
              songDuration: nextProps.currentSongDuration,
              songInterval: interval
            }
          ]
        });
      } else {
        this.setState({
          currentSongPosition: this.state.currentSongPosition + 1000,
          songPositionMetadata: this.state.songPositionMetadata.map((item) => {
            let retVal = { ...item };
            if (item.songName === nextProps.currentSongName) {
              retVal.songPosition = this.state.currentSongPosition;
              retVal.songDuration = nextProps.currentSongDuration;
              retVal.songInterval = interval;
            }
            return retVal;
          })
        });
      }

      nextProps.trickleUpState(this.state);
      this.updateSeek(
        this.state.currentSongPosition,
        nextProps.currentSongDuration
      );
    }, 1000);
    nextProps.songNotClickedWithMouse();
    this.setState({
      forwardCalled: false,
      startCalled: false,
      backwardCalled: false,
      pauseCalled: false,
      autoPlayed: false
    });
  }

  updateProgressBar(song, nextProps) {
    this.state.songPositionMetadata.forEach((item) => {
      clearInterval(item.songInterval);
    });

    this.setState({
      currentSongPosition: song.songPosition
    });

    let interval = setInterval(() => {
      if (this.state.currentSongPosition > nextProps.currentSongDuration) {
        this.state.songPositionMetadata.forEach((item) => {
          clearInterval(item.songInterval);
        });
        this.setState({
          currentSongPosition: 0,
          songPositionMetadata: this.state.songPositionMetadata.map((item) => {
            let retVal = { ...item };
            if (item.songName === nextProps.currentSongName) {
              retVal.songPosition = 0;
              retVal.songDuration = nextProps.currentSongDuration;
              retVal.songInterval = interval;
            }
            return retVal;
          })
        });
        nextProps.trickleUpState(this.state);
        this.updateSeek(
          this.state.currentSongPosition,
          nextProps.currentSongDuration
        );
        this.playNextSong(nextProps);
        return;
      }

      this.setState({
        currentSongPosition: this.state.currentSongPosition + 1000,
        songPositionMetadata: this.state.songPositionMetadata.map((item) => {
          let retVal = { ...item };
          if (item.songName === song.songName) {
            retVal.songPosition = this.state.currentSongPosition;
            retVal.songDuration = nextProps.currentSongDuration;
            retVal.songInterval = interval;
          }
          return retVal;
        })
      });

      nextProps.trickleUpState(this.state);
      this.updateSeek(
        this.state.currentSongPosition,
        nextProps.currentSongDuration
      );
    }, 1000);

    nextProps.songNotClickedWithMouse();
    this.setState({
      forwardCalled: false,
      startCalled: false,
      backwardCalled: false,
      pauseCalled: false,
      autoPlayed: false
    });
  }

  playNextSong(nextProps) {
    this.playNextSongInList(
      nextProps.songList,
      nextProps.indexOfSong,
      nextProps.lengthOfSongList,
      nextProps.indexOfSelectedGenre
    );
  }

  handlePauseClick = _.debounce((e, playingSong) => {
    if (playingSong) {
      if (this.state.songPositionMetadata.length > 0) {
        this.state.songPositionMetadata.forEach((item) => {
          clearInterval(item.songInterval);
        });
      }

      this.props.pausePlayer();

      this.props.songNotClickedWithMouse();
      this.setState({
        pauseCalled: true,
        forwardCalled: false,
        backwardCalled: false,
        startCalled: false,
        autoPlayed: false
      });
      this.props.trickleUpState(this.state);
    }
  }, 100);

  handlePlayClick = _.debounce(
    (
      e,
      playingSong,
      currentSong,
      indexOfSong,
      lengthOfSongList,
      songList,
      indexOfSelectedGenre,
      positions,
      currentSongName
    ) => {
      let positionsMetadata = this.state.songPositionMetadata.filter((item) => {
        return (
          songList[indexOfSelectedGenre].songs[indexOfSong].name ===
          item.songName
        );
      });
      let position =
        positionsMetadata.length > 0 ? positionsMetadata[0].songPosition : 0;

      this.props.playSongWithPlayer(
        songList[indexOfSelectedGenre].songs[indexOfSong],
        indexOfSong,
        lengthOfSongList,
        position
      );

      this.props.songNotClickedWithMouse();
      this.setState({
        pauseCalled: false,
        forwardCalled: false,
        backwardCalled: false,
        startCalled: true,
        autoPlayed: false
      });
      this.props.trickleUpState(this.state);
    },
    100
  );

  handleMouseClickOnVolume = () => {
    this.setState({
      mouseClickOnVolume: !this.state.mouseClickOnVolume
    });
  };

  handleSliderChange = _.debounce((e) => {
    console.log("Changing volume: " + e);
    this.setState({
      volume: e
    });
    this.props.setDefaultVolume(e);
  }, 100);

  handleSeekLinePercentage(currentSongDuration, position) {
    let startTime = new Date().getTime() * 1000;
    let endTime = (new Date().getTime() + currentSongDuration) * 1000;

    let interval = setInterval(
      () => this.updateSeek(startTime, endTime, position),
      1000
    );

    this.setState({
      interval: interval
    });
  }

  updateSeek(positionMs, currentSongDuration) {
    let startTime = new Date().getTime() * 1000;
    let endTime = (new Date().getTime() + currentSongDuration) * 1000;

    let currTime = new Date().getTime() * 1000;
    currTime = currTime + positionMs * 1000;
    let percentagePlayed = Math.round(
      ((currTime - startTime) / (endTime - startTime)) * 100
    );

    if (currTime < endTime) {
      if (this.state.songPercent !== percentagePlayed) {
        this.setState({
          songPercent: percentagePlayed,
          currentSongCurrTime: currTime,
          currentSongEndTime: endTime
        });
      }
    }
  }

  handleBackwardClick = _.debounce(
    (
      e,
      indexOfSong,
      lengthOfSongList,
      songList,
      indexOfSelectedGenre,
      positions
    ) => {
      if (indexOfSong - 1 >= 0) {
        let positionsMetadata = this.state.songPositionMetadata.filter(
          (item) => {
            return (
              songList[indexOfSelectedGenre].songs[indexOfSong - 1].name ===
              item.songName
            );
          }
        );
        let position =
          positionsMetadata.length > 0 ? positionsMetadata[0].songPosition : 0;

        this.props.playSongWithPlayer(
          songList[indexOfSelectedGenre].songs[indexOfSong - 1],
          indexOfSong - 1,
          lengthOfSongList,
          position
        );

        this.props.songNotClickedWithMouse();
        this.setState({
          pauseCalled: false,
          forwardCalled: false,
          backwardCalled: true,
          startCalled: false,
          autoPlayed: false
        });
        this.props.trickleUpState(this.state);
      }
    },
    100
  );

  handleForwardClick = _.debounce(
    (
      e,
      indexOfSong,
      lengthOfSongList,
      songList,
      indexOfSelectedGenre,
      positions,
      currentSongName
    ) => {
      if (indexOfSong + 1 < songList[indexOfSelectedGenre].songs.length) {
        let positionsMetadata = this.state.songPositionMetadata.filter(
          (item) => {
            return (
              songList[indexOfSelectedGenre].songs[indexOfSong + 1].name ===
              item.songName
            );
          }
        );

        let position =
          positionsMetadata.length > 0 ? positionsMetadata[0].songPosition : 0;

        this.props.playSongWithPlayer(
          songList[indexOfSelectedGenre].songs[indexOfSong + 1],
          indexOfSong + 1,
          lengthOfSongList,
          position
        );

        this.props.songNotClickedWithMouse();
        this.setState({
          forwardCalled: true,
          startCalled: false,
          backwardCalled: false,
          pauseCalled: false,
          autoPlayed: false
        });
        this.props.trickleUpState(this.state);
      }
    },
    100
  );

  playNextSongInList(
    songList,
    indexOfSong,
    lengthOfSongList,
    indexOfSelectedGenre
  ) {
    console.log("Playing next song...");
    if (indexOfSong + 1 < songList[indexOfSelectedGenre].songs.length) {
      let positionsMetadata = this.state.songPositionMetadata.filter((item) => {
        return (
          songList[indexOfSelectedGenre].songs[indexOfSong + 1].name ===
          item.songName
        );
      });

      let position =
        positionsMetadata.length > 0 ? positionsMetadata[0].songPosition : 0;

      this.props.playSongWithPlayer(
        songList[indexOfSelectedGenre].songs[indexOfSong + 1],
        indexOfSong + 1,
        lengthOfSongList,
        position
      );
    }
    this.setState({
      autoPlayed: true,
      forwardCalled: false,
      backwardCalled: false,
      pauseCalled: false,
      startCalled: false
    });
  }

  // handleSeekLineClick(e) {
  //   let seekLine = document.getElementsByClassName('rc-progress-line')
  //   // console.log(e)
  //   // let x = e.pageX - seekLine.offsetLeft,
  //   //     y = e.pageY - seekLine.offsetTop,
  //   //     clickedValue = x * seekLine.max / seekLine.offsetWidth;

  //   // console.log(x, y, clickedValue);
  //   var left = (e.pageX - e.offsetX);
  //   var totalWidth = seekLine.width();
  //   var percentage = ( left / totalWidth );
  // }

  render() {
    const {
      playingSong,
      currentSong,
      currentSongName,
      currentSongArtist,
      currentSongDuration,
      indexOfSong,
      lengthOfSongList,
      songList,
      indexOfSelectedGenre,
      positions,
      product
    } = this.props;

    return (
      <div id="player">
        {currentSongName !== null && currentSongArtist !== null ? (
          <div id="now-playing">
            Playing: <b>{currentSongName}</b> by <b>{currentSongArtist}</b>
          </div>
        ) : null}
        {currentSongDuration !== 0 ? (
          <Line
            id="seekLine"
            percent={this.state.songPercent}
            strokeWidth="1"
            strokeColor={"#2185d0"}
            // onClick={(e) => this.handleSeekLineClick}
          />
        ) : null}
        <div id="player-actions" className="ui grid">
          <div id="player-actions-left" className="item left">
            <button
              className="ui icon button"
              onClick={(e) =>
                this.handleBackwardClick(
                  e,
                  indexOfSong,
                  lengthOfSongList,
                  songList,
                  indexOfSelectedGenre,
                  positions
                )
              }
              disabled={product === "premium" ? false : true}
            >
              <i className="step backward icon" />
            </button>
            {playingSong ? (
              <button
                className="ui icon button"
                onClick={(e) => this.handlePauseClick(e, playingSong)}
                disabled={product === "premium" ? false : true}
              >
                <i className="pause icon" />
              </button>
            ) : (
              <button
                className="ui icon button"
                onClick={(e) =>
                  this.handlePlayClick(
                    e,
                    playingSong,
                    currentSong,
                    indexOfSong,
                    lengthOfSongList,
                    songList,
                    indexOfSelectedGenre,
                    positions,
                    currentSongName
                  )
                }
                disabled={product === "premium" ? false : true}
              >
                <i className="play icon" />
              </button>
            )}
            <button
              className="ui icon button"
              onClick={(e) =>
                this.handleForwardClick(
                  e,
                  indexOfSong,
                  lengthOfSongList,
                  songList,
                  indexOfSelectedGenre,
                  positions,
                  currentSongName
                )
              }
              disabled={product === "premium" ? false : true}
            >
              <i className="step forward icon" />
            </button>
          </div>
          <div id="player-action-right" className="item right">
            <button
              className="ui icon button"
              onClick={this.handleMouseClickOnVolume}
              disabled={product === "premium" ? false : true}
            >
              <i className="volume up icon" />
            </button>
          </div>
        </div>
        <div className="item">
          {this.state.mouseClickOnVolume ? (
            <Slider
              id="volumeSlider"
              min={0}
              max={100}
              value={this.state.volume}
              marks={{
                0: 0,
                10: 10,
                20: 20,
                30: 30,
                40: 40,
                50: 50,
                60: 60,
                70: 70,
                80: 80,
                90: 90,
                100: 100
              }}
              step={null}
              onChange={(e) => this.handleSliderChange(e, this.props.deviceId)}
              disabled={product === "premium" ? false : true}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToPlayerProps = (state) => {
  return {
    playingSong: state.playerReducer.playingSong,
    deviceId: state.playerReducer.deviceId,
    currentSong: state.playerReducer.currentSong,
    positions: state.playerReducer.positions,
    currentSongName: state.playerReducer.currentSongName,
    currentSongArtist: state.playerReducer.currentSongArtist,
    currentSongDuration: state.playerReducer.currentSongDuration,
    indexOfSong: state.playerReducer.indexOfSong,
    lengthOfSongList: state.playerReducer.lengthOfSongList,
    songList: state.songListReducer.songList,
    indexOfSelectedGenre: state.songListReducer.indexOfSelectedGenre,
    songClickedWithMouse: state.playerReducer.songClickedWithMouse,
    isLoadingSongs: state.songListReducer.isLoadingSongs,
    songsLoaded: state.songListReducer.songsLoaded,
    currentSongFinished: state.playerReducer.currentSongFinished,
    product: state.topBarReducer.product
  };
};

const mapDispatchToPlayerProps = (dispatch) => {
  return {
    getCurrentPlaybackState: () => {
      dispatch(getCurrentPlaybackState());
    },
    playSongWithPlayer: (song, indexOfSong, lengthOfSongList, positionMs) => {
      dispatch(
        playSongWithPlayer(song, indexOfSong, lengthOfSongList, positionMs)
      );
    },
    pausePlayer: () => {
      dispatch(pausePlayer());
    },
    setDefaultVolume: (deviceId) => {
      dispatch(setDefaultVolume(deviceId));
    },
    songNotClickedWithMouse: () => {
      dispatch(songNotClickedWithMouse());
    },
    songFinishedPlaying: () => {
      dispatch(songFinishedPlaying());
    },
    seek: () => {
      dispatch(seek());
    }
  };
};

export default connect(
  mapStateToPlayerProps,
  mapDispatchToPlayerProps
)(Player);
