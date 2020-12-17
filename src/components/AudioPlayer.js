import React, { Component } from "react";
import "../css/Viewer.scss";

class AudioPlayer extends Component {
  render() {
    return (
      <div>
        <audio
          controls
          id="audio-player"
          className="audiojs"
          style={{ width: "100%" }}
          preload="auto"
        >
          <source src={this.props.manifest_url} />
          <p>
            Your browser does not support the audio tag.
            <br />
            You can download the audio file directly{" "}
            <a href={this.props.manifest_url}>here</a>
          </p>
        </audio>
      </div>
    );
  }
}

export default AudioPlayer;
