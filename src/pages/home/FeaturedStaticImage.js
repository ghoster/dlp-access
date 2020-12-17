import React, { Component } from "react";
import { getFile } from "../../lib/fetchTools";
import "../../css/FeaturedStaticImage.scss";

class FeaturedStaticImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copy: null
    };
  }

  componentDidMount() {
    if (this.props.staticImage) {
      const imgUrl = this.props.staticImage.src.split("/").pop();
      getFile(imgUrl, "image", this);
    }
  }

  render() {
    if (this.props.staticImage && this.state.copy) {
      return (
        <div className="home-static-image-wrapper">
          <img src={this.state.copy} alt={this.props.staticImage.altText} />
        </div>
      );
    } else {
      return <></>;
    }
  }
}

export default FeaturedStaticImage;
