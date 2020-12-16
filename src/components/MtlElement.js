import React, { Component } from "react";
import { MTLModel } from "react-3d-viewer";

export default class MtlElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mtl: "",
      src: "",
      rotation: { x: 0, y: 0, z: 0 },
      width: window.innerWidth * 1,
      texPath: ""
    };
  }
  render() {
    var { width } = this.state;
    if (width > 600) width = 600;
    // mtl={this.state.mtl}
    // src={this.state.src}
    // texPath={this.state.texPath}
    return (
      <section>
        <div className="model-container">
          <MTLModel
            enableZoom={true}
            position={{ x: 0, y: 0, z: 0 }}
            width={width}
            height={width}
            mtl="/3d_viewer/SmallAmethyst.mtl"
            src="/3d_viewer/SmallAmethyst.obj"
            texPath="/3d_viewer/"
            onProgress={xhr => {
              console.log("objmtl", xhr);
            }}
            onLoad={() => {
              console.log("on load");
            }}
          />
        </div>
      </section>
    );
  }
  componentDidMount() {
    const objURL = this.props.mtl.replace(".mtl", ".obj");
    const texPath = this.props.mtl.substr(
      0,
      this.props.mtl.lastIndexOf("/") + 1
    );
    this.setState({
      mtl: this.props.mtl,
      src: objURL,
      texPath: texPath
    });
  }
}
