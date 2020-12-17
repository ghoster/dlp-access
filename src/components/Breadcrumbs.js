import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { arkLinkFormatted } from "../lib/MetadataRenderer";
import { fetchHeirarchyPathMembers } from "../lib/fetchTools";

import "../css/breadcrumbs.scss";

class Breadcrumbs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      links: []
    };
  }

  async buildList() {
    const records = await fetchHeirarchyPathMembers(this.props.record);
    let parent_list = [];
    for (const pathIdx in this.props.record.heirarchy_path) {
      const id = this.props.record.heirarchy_path[pathIdx];
      for (const recordIdx in records) {
        if (
          records[recordIdx].id === id &&
          records[recordIdx].id !== this.props.record.id
        ) {
          parent_list.push({
            title: records[recordIdx].title,
            url:
              "/collection/" + arkLinkFormatted(records[recordIdx].custom_key),
            custom_key: arkLinkFormatted(records[recordIdx].custom_key)
          });
        }
      }
    }

    parent_list.push({
      title: this.props.record.title,
      url:
        "/" +
        this.props.category.replace(/s+$/, "").toLowerCase() +
        "/" +
        arkLinkFormatted(this.props.record.custom_key),
      custom_key: arkLinkFormatted(this.props.record.custom_key)
    });

    this.setState({ links: parent_list }, function() {
      if (typeof this.props.setTitleList == "function") {
        this.props.setTitleList(parent_list);
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.record.id !== prevProps.record.id) {
      this.buildList();
    }
  }

  componentDidMount() {
    this.buildList();
  }

  render() {
    return (
      <ol id="vt_navtrail" className="long_title vt-breadcrumbs">
        <li key="home" className="vt-breadcrumbs-item">
          <NavLink className="vt-breadcrumbs-link" to={"/"}>
            Home
          </NavLink>
          <span className="breadcrumb-slash" aria-hidden="true">
            {" "}
            /{" "}
          </span>
        </li>
        {this.state.links.map((link, index, arr) => {
          if (index !== arr.length - 1) {
            return (
              <li
                className="vt-breadcrumbs-item"
                key={arkLinkFormatted(link.custom_key)}
              >
                <NavLink className="vt-breadcrumbs-link" to={link.url}>
                  {link.title}
                </NavLink>
                <span className="breadcrumb-slash" aria-hidden="true">
                  {" "}
                  /{" "}
                </span>
              </li>
            );
          } else {
            return (
              <li
                className="vt-breadcrumbs-item"
                key={arkLinkFormatted(link.custom_key)}
              >
                <NavLink
                  className="vt-breadcrumbs-link"
                  to={link.url}
                  aria-current="page"
                >
                  {link.title}
                </NavLink>
                <span className="breadcrumb-slash" aria-hidden="true">
                  {" "}
                  /{" "}
                </span>
              </li>
            );
          }
        })}
      </ol>
    );
  }
}

export default Breadcrumbs;
