import React, { Component } from "react";

class HomeStatement extends Component {
  render() {
    if (this.props.homeStatement) {
      return (
        <div className="home-statement-wrapper">
          <h2
            style={{
              display: this.props.homeStatement.heading ? "block" : "none"
            }}
          >
            {this.props.homeStatement.heading}
          </h2>
          <div
            style={{
              display: this.props.homeStatement.statement ? "block" : "none"
            }}
            className="home-statement"
          >
            <p>{this.props.homeStatement.statement}</p>
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  }
}

export default HomeStatement;
