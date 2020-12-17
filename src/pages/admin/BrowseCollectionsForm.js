import React, { Component } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { NavLink } from "react-router-dom";
import { Form } from "semantic-ui-react";
import { addedDiff, updatedDiff } from "deep-object-diff";
import { API, Auth } from "aws-amplify";
import { getSite } from "../../lib/fetchTools";
import * as mutations from "../../graphql/mutations";

import "../../css/adminForms.scss";

class BrowseCollectionsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      browseCollections: {},
      prevBrowseCollections: {},
      viewState: "view",
      site: null,
      newSort: ""
    };
  }

  availableSorts = () => {
    let AllSorts = [
      "title (asc)",
      "title (desc)",
      "start_date (desc)",
      "start_date (asc)",
      "identifier (asc)",
      "identifier (desc)"
    ];
    const currentSorts = this.state.browseCollections.sort.map(sortField => {
      return `${sortField.field} (${sortField.direction})`;
    });
    return AllSorts.filter(el => !currentSorts.includes(el));
  };

  sortOptions = () => {
    return this.availableSorts().map(sortField => (
      <option value={sortField} key={sortField}>
        {sortField}
      </option>
    ));
  };

  loadSite = async () => {
    const site = await getSite();
    if (site) {
      const siteBrowseCollections = JSON.parse(site.browseCollections);
      this.setState({
        browseCollections: siteBrowseCollections,
        prevBrowseCollections: siteBrowseCollections,
        site: site
      });
    }
  };

  componentDidMount() {
    this.loadSite();
  }

  handleSubmit = async () => {
    this.setState({ viewState: "view" });
    const siteID = this.state.site.id;
    const siteInfo = {
      id: siteID,
      browseCollections: JSON.stringify(this.state.browseCollections)
    };

    await API.graphql({
      query: mutations.updateSite,
      variables: { input: siteInfo },
      authMode: "AMAZON_COGNITO_USER_POOLS"
    });

    const addedData = addedDiff(
      this.state.prevBrowseCollections,
      this.state.browseCollections
    );
    const newData = updatedDiff(
      this.state.prevBrowseCollections,
      this.state.browseCollections
    );
    const oldData = updatedDiff(
      this.state.browseCollections,
      this.state.prevBrowseCollections
    );
    const deletedData = addedDiff(
      this.state.browseCollections,
      this.state.prevBrowseCollections
    );
    const updatedData = Object.keys(newData).reduce((acc, key) => {
      return {
        ...acc,
        [key]: {
          new: newData[key],
          old: oldData[key]
        }
      };
    }, {});
    const eventInfo = {
      browseCollections: {
        added: addedData,
        deleted: deletedData,
        updated: updatedData
      }
    };

    const userInfo = await Auth.currentUserPoolUser();
    let historyInfo = {
      userEmail: userInfo.attributes.email,
      siteID: siteID,
      event: JSON.stringify(eventInfo)
    };

    await API.graphql({
      query: mutations.createHistory,
      variables: { input: historyInfo },
      authMode: "AMAZON_COGNITO_USER_POOLS"
    });
  };

  handleViewChange = (e, { value }) => {
    this.setState({ viewState: value });
  };

  handleValueChange = idx => event => {
    let tempBrowseCollections = { ...this.state.browseCollections };
    let tempFilter = tempBrowseCollections.filter;
    let tempValues = [...tempFilter.values];
    tempValues[idx] = event.target.value;
    this.setState({
      browseCollections: {
        ...tempBrowseCollections,
        filter: { ...tempFilter, values: tempValues }
      }
    });
  };

  handleAddValue = () => {
    let tempBrowseCollections = { ...this.state.browseCollections };
    let tempFilter = tempBrowseCollections.filter;
    const len = tempFilter.values.length;
    let tempValues = [...tempFilter.values, `new filter value ${len + 1}`];
    this.setState({
      browseCollections: {
        ...tempBrowseCollections,
        filter: { ...tempFilter, values: tempValues }
      }
    });
  };

  handleRemoveValue = idx => () => {
    let tempBrowseCollections = { ...this.state.browseCollections };
    let tempFilter = tempBrowseCollections.filter;
    let tempValues = tempFilter.values.filter((t, tidx) => idx !== tidx);
    this.setState({
      browseCollections: {
        ...tempBrowseCollections,
        filter: { ...tempFilter, values: tempValues }
      }
    });
  };

  editFilterValue = (value, idx) => {
    let fixedValue = value === "All";
    return (
      <li key={`filter_li_${idx}`}>
        <Form.Input
          key={`filter_value_${idx}`}
          value={value}
          name={`filter_value_${idx}`}
          placeholder={`filter value #${idx + 1}`}
          onChange={this.handleValueChange(idx)}
          readOnly={fixedValue}
        />
        {fixedValue ? (
          <></>
        ) : (
          <button
            type="button"
            onClick={this.handleRemoveValue(idx)}
            className="small deleteValue"
          >
            X
          </button>
        )}
        <div className="clear"></div>
      </li>
    );
  };

  convertSortToObject = sortField => {
    return {
      field: sortField.substring(0, sortField.lastIndexOf("(") - 1),
      direction: sortField.substring(
        sortField.lastIndexOf("(") + 1,
        sortField.lastIndexOf(")")
      )
    };
  };

  editSort = (sortField, idx) => {
    return (
      <section key={`sort_${idx}`}>
        <p>Sort Field: {sortField.field}</p>
        <p>Sort Direction: {sortField.direction}</p>
        <div className="deletePageWrapper">
          <NavLink
            className="deletePage"
            to="#"
            onClick={() => this.deleteSort(sortField)}
          >
            Delete Sort Field
          </NavLink>
          <div className="clear"></div>
        </div>
      </section>
    );
  };

  addSort = () => {
    let tempBrowseCollections = { ...this.state.browseCollections };
    let tempSort = tempBrowseCollections.sort;
    const sortToAdd = this.state.newSort || this.availableSorts()[0];
    if (sortToAdd) {
      this.setState({
        browseCollections: {
          ...tempBrowseCollections,
          sort: [...tempSort, this.convertSortToObject(sortToAdd)]
        },
        newSort: ""
      });
    }
  };

  deleteSort = sortField => {
    let tempBrowseCollections = { ...this.state.browseCollections };
    const tempSort = tempBrowseCollections.sort.filter(
      item =>
        !(
          item.field === sortField.field &&
          item.direction === sortField.direction
        )
    );
    this.setState({
      browseCollections: {
        ...tempBrowseCollections,
        sort: tempSort
      }
    });
  };

  dropdownChange = e => {
    this.setState({ newSort: e.target.value });
  };

  addSortField = () => {
    if (this.availableSorts().length) {
      return (
        <div>
          <select
            value={this.state.newSort}
            name="new_sort"
            id="new-sort-options"
            onChange={this.dropdownChange}
            className="custom-select"
          >
            {this.sortOptions()}
          </select>
          <NavLink className="addPage" to="#" onClick={() => this.addSort()}>
            Add New Sort Field
          </NavLink>
          <div className="clear"></div>
        </div>
      );
    } else return <></>;
  };

  editFilterSortForm = () => {
    const filterField = "subject";
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <section key="filter">
            <fieldset>
              <legend className="admin">{`Configuration for filter field: ${filterField}`}</legend>
              <h4>Values:</h4>
              <ul>
                {this.state.browseCollections.filter.values &&
                  this.state.browseCollections.filter.values.map(
                    (value, idx) => {
                      return this.editFilterValue(value, idx);
                    }
                  )}
              </ul>
              <button
                type="button"
                onClick={() => this.handleAddValue()}
                className="small"
              >
                Add Value
              </button>
            </fieldset>
          </section>
          <ul>
            {this.state.browseCollections.sort.map((value, idx) => {
              return this.editSort(value, idx);
            })}
          </ul>
          {this.addSortField()}
          <Form.Button>Update Filter and Sort Fields</Form.Button>
        </Form>
      </div>
    );
  };

  viewFilterSort() {
    const collectionFilter = this.state.browseCollections.filter;
    const collectionSort = this.state.browseCollections.sort;
    if (collectionFilter && collectionSort) {
      return (
        <div>
          <p>Filter Field: {collectionFilter.field}</p>
          <p>Values:</p>
          <ul>
            {collectionFilter.values.map((val, idx) => {
              return (
                <li key={`${collectionFilter.field}_value_${idx}`}>{val}</li>
              );
            })}
          </ul>
          <hr />
          <ul>
            {collectionSort.map((sortVal, idx) => {
              return (
                <li key={`sort_${idx}`}>
                  <p>Sort Field: {sortVal.field} </p>
                  <p>Sort Direction: {sortVal.direction}</p>
                  <hr />
                </li>
              );
            })}
          </ul>
        </div>
      );
    } else return <></>;
  }

  render() {
    return (
      <div className="col-lg-9 col-sm-12 admin-content">
        <h1>{`Browse Collections page's filter and sort for ${process.env.REACT_APP_REP_TYPE.toLowerCase()}`}</h1>
        <Form>
          <Form.Group inline>
            <label>Current mode:</label>
            <Form.Radio
              label="Edit"
              name="editFilterSortRadioGroup"
              value="edit"
              checked={this.state.viewState === "edit"}
              onChange={this.handleViewChange}
            />

            <Form.Radio
              label="View"
              name="viewFilterSortRadioGroup"
              value="view"
              checked={this.state.viewState === "view"}
              onChange={this.handleViewChange}
            />
          </Form.Group>
        </Form>
        {this.state.viewState === "view"
          ? this.viewFilterSort()
          : this.editFilterSortForm()}
      </div>
    );
  }
}

export default withAuthenticator(BrowseCollectionsForm);
