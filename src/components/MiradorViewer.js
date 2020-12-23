import React, { Component } from "react";
import "../css/Viewer.scss";

class MiradorViewer extends Component {
  miradorConfig() {
    if (
      this.props.site.miradorOptions &&
      Object.keys(this.props.site.miradorOptions).length !== 0
    ) {
      var adminConfig = JSON.parse(this.props.site.miradorOptions);
      adminConfig.windows[0].manifestId = this.props.item.manifest_url;
    } else {
      var config = {
        selectedTheme: "light",
        language: "en",
        id: "mirador_viewer",
        window: {
          allowClose: false,
          allowFullscreen: true,
          allowMaximize: false,
          allowTopMenuButton: true,
          allowWindowSideBar: true,
          sideBarPanel: "info",
          defaultView: "single",
          sideBarOpen: false,
          panels: {
            info: true,
            attribution: true,
            canvas: false,
            annotations: true,
            search: false,
            layers: false
          }
        },
        windows: [
          {
            manifestId: this.props.item.manifest_url
          }
        ],
        thumbnailNavigation: {
          defaultPosition: "far-bottom",
          displaySettings: true,
          height: 130,
          width: 100
        },
        workspace: {
          draggingEnabled: false,
          allowNewWindows: false,
          isWorkspaceAddVisible: false,
          showZoomControls: true,
          type: "mosaic"
        },
        workspaceControlPanel: {
          enabled: false
        }
      };
    }
    return adminConfig || config;
  }

  componentDidMount() {
    this.miradorConfig();
    window.Mirador.viewer(this.miradorConfig());
  }

  render() {
    return <div id={this.miradorConfig().id}></div>;
  }
}

export default MiradorViewer;
