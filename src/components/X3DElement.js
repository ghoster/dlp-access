import React, { Component } from "react";

//  VTU_GSC_000005
export default class X3DElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: ""
    };
    this.x3dLoaded = this.x3dLoaded.bind(this);
  }

  x3dLoaded(e) {
    console.log("loaded");
    console.log(e);
  }

  componentDidMount() {
    this.setState({ url: this.props.url });

    const script = document.createElement("script");
    script.src = "https://www.x3dom.org/download/x3dom.js";
    script.async = true;
    document.head.appendChild(script);

    const styles = document.createElement("link");
    styles.rel = "stylesheet";
    styles.type = "text/css";
    styles.href = "https://www.x3dom.org/download/x3dom.css";
    document.head.appendChild(script);
  }

  render() {
    return (
      <section>
        <div className="model-container x3d">
          <x3d
            id="x3dElement"
            is="x3d"
            width={`${this.props.frameSize}px`}
            height={`${this.props.frameSize}px`}
          >
            <scene is="x3d">
              <navigationInfo type="EXAMINE" is="x3d" />
              <viewpoint
                id="viewPoint"
                is="x3d"
                centerOfRotation="0, 0, 0"
                position="-2.25 1.0 -3.0"
                orientation="0.03886, 0.99185, 0.12133, 3.7568"
                isActive="true"
              />
              <inline
                id="x3dInline"
                DEF="x3dInline"
                nameSpaceName="tanatloc"
                is="x3d"
                mapDEFToID="true"
                url={this.props.url}
                onload={this.x3dLoaded}
              />
              <loadSensor
                is="x3d"
                DEF="InlineLoadSensor"
                isLoaded={this.x3dLoaded}
                timeOut="5"
              >
                <inline is="x3d" USE="x3dInline" containerField="watchList" />
              </loadSensor>
            </scene>
          </x3d>
        </div>
      </section>
    );
  }
}
