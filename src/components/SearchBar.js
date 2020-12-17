import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import { labelAttr } from "../lib/MetadataRenderer";

import "../css/searchBar.scss";

class SearchBar extends Component {
  state = {
    field: this.props.field,
    q: this.props.q
  };

  fields = ["title", "description", "all"];

  fieldOptions = () => {
    return this.fields.map(field => (
      <option value={field} key={field}>
        {labelAttr(field)}
      </option>
    ));
  };

  updateQuery = e => {
    this.setState({ q: e.target.value });
  };

  updateSearchField = e => {
    this.setState({ field: e.target.value });
  };

  onKeyPress = e => {
    if (e.which === 13) {
      this.submit();
    }
  };

  submit = () => {
    const parsedObject = {
      field: this.state.field,
      q: this.state.q,
      view: this.props.view,
      ...this.props.filters
    };
    try {
      if (window.location.pathname === "/") {
        window.location.href = `/search?${qs.stringify(parsedObject)}`;
      } else {
        this.props.history.push({
          pathname: "/search",
          search: `?${qs.stringify(parsedObject)}`,
          state: parsedObject
        });
        if (typeof this.props.setPage === "function") {
          this.props.setPage(0);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({
        q: this.props.q,
        field: this.props.field
      });
    }
  }

  searchBox = () => {
    return (
      <div>
        <label htmlFor="search" className="sr-only">
          Search:
        </label>
        <input
          className="form-control"
          value={this.state.q || ""}
          type="text"
          name="search"
          id="search"
          placeholder="Search by keyword, title, description"
          onChange={this.updateQuery}
          onKeyPress={this.onKeyPress}
        />
      </div>
    );
  };

  render() {
    return (
      <div role="search">
        <div className="searchbar-wrapper">
          {this.searchBox()}
          <label htmlFor="field-options" className="sr-only">
            Select search filter:
          </label>
          <select
            value={this.state.field}
            name="fieldOptions"
            id="field-options"
            onChange={this.updateSearchField}
            className="custom-select"
          >
            {this.fieldOptions()}
          </select>
          <button className="btn" type="submit" onClick={this.submit}>
            <div>
              <i className="fas fa-search"></i>
            </div>
            <span className="sr-only">Search</span>
          </button>
        </div>
      </div>
    );
  }
}
export default withRouter(SearchBar);
