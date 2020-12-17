import React, { Component } from "react";

import "../css/Thumbnail.scss";

class Thumbnail extends Component {
  labelDisplay() {
    if (this.props.label) {
      return (
        <div className={`${this.props.category}-label`}>
          {this.props.category === "collection" ? "Collection" : "Item"}
        </div>
      );
    } else {
      return <></>;
    }
  }

  render() {
    return (
      <div className="image-container">
        {this.labelDisplay()}
        <img
          className={this.props.className}
          src={this.props.item.thumbnail_path}
          alt={this.props.altText ? this.props.item.title : ""}
        />
      </div>
    );
  }
}

export default Thumbnail;
