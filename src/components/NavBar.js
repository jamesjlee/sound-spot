import React from "react";
import * as consts from "../constants/Consts";
import { fetchSongList } from "../actions/SongListActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
var _ = require("lodash");

class NavBar extends React.Component {
  state = {
    activeIndex: 0
  }

  spotifyGenreHelper(str) {
    let ret = (str = str.replace(/\s+/g, "-").toLowerCase());
    return ret;
  }

  handleClick = _.debounce((e, index) => {
    let genre = consts.spotifyGenres[index];
    this.setState({
      activeIndex: index
    })
    this.props.fetchSongList(genre, index).then(() => {
      this.checkIfWindowMatchesResolution(genre, index);
    });
  }, 300);

  checkIfWindowMatchesResolution(genre, index) {
    if(window.scrollY === 0) {
      this.props.fetchSongList(genre, index);
    }
  }

  render() {
    return (
      <div className="ui fluid tabular menu">
        {consts.genres.map((genre, index) =>
          this.state.activeIndex === index ? (
            <a
              className="active item"
              key={index}
              onClick={(e) => this.handleClick(e, index)}
            >
              {genre}
            </a>
          ) : (
            <a
              className="item"
              key={index}
              onClick={(e) => this.handleClick(e, index)}
            >
              {genre}
            </a>
          )
        )}
      </div>
    );
  }
}

NavBar.propTypes = {
  songList: PropTypes.array.isRequired,
  indexOfSelectedGenre: PropTypes.number.isRequired
};

const mapStateToNavBarProps = (state) => {
  return {
    songList: state.songListReducer.songList,
    indexOfSelectedGenre: state.songListReducer.indexOfSelectedGenre
  };
};

const mapDispatchToNavBarProps = (dispatch) => {
  return {
    fetchSongList: (genre, index) => dispatch(fetchSongList(genre, index))
  };
};

export default connect(
  mapStateToNavBarProps,
  mapDispatchToNavBarProps
)(NavBar);
