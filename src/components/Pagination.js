import React, { Component } from "react";
import { Button } from "semantic-ui-react";

import "../css/ListPages.scss";

class Pagination extends Component {
  lowerBound() {
    return this.props.page * this.props.limit + 1;
  }

  upperBound() {
    const lower = this.lowerBound();
    const num = lower + this.props.numResults - 1;
    return num !== lower ? `- ${num}` : "";
  }

  render() {
    const Displaying = () => {
      let displayingCopy = "";
      if (this.props.numResults === 0) {
        displayingCopy = (
          <div role={this.props.atBottom ? "alert" : null}>
            No results found
          </div>
        );
      } else {
        const textBefore = this.props.isSearch
          ? "Search Results:"
          : "Displaying:";
        displayingCopy = (
          <div
            className="pagination-text"
            aria-live={this.props.atBottom ? "polite" : "off"}
          >
            <p>
              {`${textBefore} ${this.lowerBound()} ${this.upperBound()} of ${
                this.props.total
              }`}
            </p>
          </div>
        );
      }
      return displayingCopy;
    };
    const Previous = () => {
      if (this.props.page > 0) {
        return (
          <Button onClick={this.props.previousPage} aria-live="off">
            <i className="fas fa-angle-double-left"></i> Previous
          </Button>
        );
      } else {
        return <div></div>;
      }
    };
    const Next = () => {
      if (this.props.page < this.props.totalPages - 1) {
        return (
          <Button onClick={this.props.nextPage} aria-live="off">
            Next <i className="fas fa-angle-double-right"></i>
          </Button>
        );
      } else {
        return <div></div>;
      }
    };

    if (this.props.atBottom) {
      return (
        <div
          className="pagination-section"
          role="region"
          aria-label="Pagination"
        >
          <Displaying />
          <Previous />
          <Next />
        </div>
      );
    } else {
      return (
        <div className="pagination-section">
          <Displaying />
        </div>
      );
    }
  }
}

export default Pagination;
