import React, { Component } from "react";
import { arkLinkFormatted } from "../../lib/MetadataRenderer";
import Thumbnail from "../../components/Thumbnail";
import "../../css/SearchResult.css";

class GalleryView extends Component {
  render() {
    return (
      <div className="col-md-6 col-lg-4 gallery-item">
        <div className="card">
          <a
            href={`/${this.props.category}/${arkLinkFormatted(
              this.props.item.custom_key
            )}`}
          >
            <Thumbnail
              item={this.props.item}
              category={this.props.category}
              className="card-img-top"
              label={this.props.label}
            />
            <div className="card-body">
              <h3 className="card-title crop-text-3">
                {this.props.item.title}
              </h3>

              <p className="card-text crop-text-3">
                {this.props.item.description}
              </p>
            </div>
          </a>
        </div>
      </div>
    );
  }
}

export default GalleryView;
