import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThList, faTh, faImages } from "@fortawesome/free-solid-svg-icons";
import "../css/SearchResult.scss";

class ViewBar extends Component {
  state = {
    view: this.props.view
  };

  updateView = viewType => {
    this.props.updateFormState("view", viewType);
  };

  render() {
    const buttons = this.props.pageViews.map((buttonType, index) => {
      return (
        <button
          type="button"
          key={index}
          className="btn"
          data-toggle="tooltip"
          title={`${buttonType} view`}
          aria-label={`${buttonType} view`}
          onClick={() => this.updateView(buttonType)}
          active={(this.state.view === buttonType).toString()}
          aria-pressed={(this.state.view === buttonType).toString()}
        >
          <FontAwesomeIcon
            icon={
              buttonType === "Gallery"
                ? faTh
                : buttonType === "List"
                ? faThList
                : faImages
            }
            size="lg"
            style={{ color: "var(--themeHighlightColor" }}
            aria-hidden="true"
          />
        </button>
      );
    });
    return (
      <div
        className="btn-group"
        role="group"
        aria-roledescription="View Options"
      >
        {buttons}
      </div>
    );
  }
}
export default ViewBar;
