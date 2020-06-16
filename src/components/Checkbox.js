import React, { Component } from "react";

class Checkbox extends Component {
  render() {
    return (
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          name={this.props.name}
          checked={this.props.selected}
          onChange={this.props.onCheckboxChange}
          data-cy="input-filter-checkbox"
        />
        <label className="form-check-label">{this.props.label}</label>
      </div>
    );
  }
}

export default Checkbox;