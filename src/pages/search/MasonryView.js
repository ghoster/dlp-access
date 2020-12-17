import React, { Component } from "react";
import { arkLinkFormatted } from "../../lib/MetadataRenderer";
import Thumbnail from "../../components/Thumbnail";
import "../../css/SearchResult.scss";

class MasonryView extends Component {
  render() {
    return (
      <div className="masonry">
        <div className="card border-0">
          <a
            href={`/${this.props.category}/${arkLinkFormatted(
              this.props.item.custom_key
            )}`}
          >
            <Thumbnail
              item={this.props.item}
              category={this.props.category}
              label={this.props.label}
              className="card-img"
              altText="true"
            />
          </a>
        </div>
      </div>
    );
  }
}

export default MasonryView;
