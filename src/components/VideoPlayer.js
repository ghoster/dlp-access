import React, { Component } from "react";
import "../css/Viewer.scss";

class VideoPlayer extends Component {
  render() {
    return (
      <div>
        <video
          controls
          id="video-player"
          className="videojs"
          style={{ width: "100%" }}
          preload="auto"
        >
          <source src={this.props.manifest_url} />
          <p>
            Your browser does not support the video tag.
            <br />
            You can download the video file directly{" "}
            <a href={this.props.manifest_url}>here</a>
          </p>
        </video>
      </div>
    );
  }
}

export default VideoPlayer;
