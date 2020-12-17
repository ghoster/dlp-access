import React, { Component } from "react";
import "../css/Viewer.scss";

class KalturaPlayer extends Component {
  getURL() {
    return `${this.props.manifest_url}?iframeembed=true&playerId=kaltura_player&entry_id=1_qvxfd4bn&flashvars[streamerType]=auto&amp;flashvars[localizationCode]=en&amp;flashvars[leadWithHTML5]=true&amp;flashvars[sideBarContainer.plugin]=true&amp;flashvars[sideBarContainer.position]=left&amp;flashvars[sideBarContainer.clickToClose]=true&amp;flashvars[chapters.plugin]=true&amp;flashvars[chapters.layout]=vertical&amp;flashvars[chapters.thumbnailRotator]=false&amp;flashvars[streamSelector.plugin]=true&amp;flashvars[EmbedPlayer.SpinnerTarget]=videoHolder&amp;flashvars[dualScreen.plugin]=true&amp;flashvars[Kaltura.addCrossoriginToIframe]=true&amp;&wid=1_x2fmman0`;
  }
  render() {
    return (
      <div
        style={{
          position: "relative",
          paddingBottom: "71.25%"
        }}
      >
        <iframe
          id="kaltura_player"
          className="kaltura-player"
          src={this.getURL()}
          allowFullScreen
          webkitallowfullscreen="true"
          mozallowfullscreen="true"
          allow="autoplay *; fullscreen *; encrypted-media *"
          sandbox="allow-forms allow-same-origin allow-scripts allow-top-navigation allow-pointer-lock allow-popups allow-modals allow-orientation-lock allow-popups-to-escape-sandbox allow-presentation allow-top-navigation-by-user-activation"
          frameBorder="0"
          title="Kaltura Player"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%"
          }}
        ></iframe>
      </div>
    );
  }
}

export default KalturaPlayer;
