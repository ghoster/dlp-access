import React, { Component } from "react";

class SiteNavigationLinks extends Component {
  onFoldAction(event) {
    window.foldAction(event.currentTarget);
  }

  render() {
    const aboutPage = <></>;
    return (
      <ul id="vt_main_nav" role="presentation" aria-label="Pages in Site">
        <li className="nav-item">
          <div className="link-wrapper">
            <a href="/" tabIndex="-1">
              Home
            </a>
          </div>
        </li>
        {aboutPage}
        <li className="nav-item">
          <div className="link-wrapper">
            <a href="/permissions" tabIndex="-1">
              PERMISSIONS
            </a>
          </div>
        </li>
        <li className="nav-item">
          <div className="link-wrapper">
            <a href="/collections" tabIndex="-1">
              BROWSE COLLECTIONS
            </a>
          </div>
        </li>
        <li className="nav-item">
          <div className="link-wrapper">
            <a href="/search" tabIndex="-1">
              SEARCH
            </a>
          </div>
        </li>
      </ul>
    );
  }
}

export default SiteNavigationLinks;
