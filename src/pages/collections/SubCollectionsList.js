import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import "../../css/CollectionsShowPage.scss";
import { arkLinkFormatted } from "../../lib/MetadataRenderer";

class SubCollectionsList extends Component {
  subCollectionsContent(items) {
    let content = "";
    if (items.length) {
      content = (
        <div>
          <ul className="subCollectionList">
            {items.map(item => (
              <li key={item.custom_key}>
                <NavLink
                  to={`/collection/${arkLinkFormatted(item.custom_key)}`}
                >
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return content;
  }

  render() {
    return <div>{this.subCollectionsContent(this.props.subCollections)}</div>;
  }
}

export default SubCollectionsList;
