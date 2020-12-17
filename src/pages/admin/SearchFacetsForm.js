import React, { Component } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { NavLink } from "react-router-dom";
import { Form } from "semantic-ui-react";
import { addedDiff, updatedDiff } from "deep-object-diff";
import { API, Auth } from "aws-amplify";
import { getSite } from "../../lib/fetchTools";
import * as mutations from "../../graphql/mutations";

import "../../css/adminForms.scss";

class SearchFacetsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      facets: {},
      prevFacets: {},
      viewState: "view",
      site: null,
      newFacet: ""
    };
  }

  availableFacets = () => {
    let AllFacets = [
      "creator",
      "collection",
      "format",
      "language",
      "location",
      "medium",
      "resource_type",
      "subject",
      "tags"
    ];
    return AllFacets.filter(el => !Object.keys(this.state.facets).includes(el));
  };

  facetOptions = () => {
    return this.availableFacets().map(facet => (
      <option value={facet} key={facet}>
        {facet}
      </option>
    ));
  };

  loadSite = async () => {
    const site = await getSite();
    if (site) {
      const siteFacets = JSON.parse(site.searchPage).facets;
      const searchFacets = {};
      Object.keys(siteFacets)
        .sort()
        .forEach(function(key) {
          searchFacets[key] = siteFacets[key];
        });
      this.setState({
        facets: searchFacets,
        prevFacets: searchFacets,
        site: site
      });
    }
  };

  componentDidMount() {
    this.loadSite();
  }

  updateInputValue = facetKey => event => {
    let tempFacets = { ...this.state.facets };
    this.setState({
      facets: {
        ...tempFacets,
        [facetKey]: { ...tempFacets[facetKey], label: event.target.value }
      }
    });
  };

  handleSubmit = async () => {
    this.setState({ viewState: "view" });
    const siteID = this.state.site.id;
    const siteInfo = {
      id: siteID,
      searchPage: JSON.stringify({ facets: this.state.facets })
    };

    await API.graphql({
      query: mutations.updateSite,
      variables: { input: siteInfo },
      authMode: "AMAZON_COGNITO_USER_POOLS"
    });

    const addedData = addedDiff(this.state.prevFacets, this.state.facets);
    const newData = updatedDiff(this.state.prevFacets, this.state.facets);
    const oldData = updatedDiff(this.state.facets, this.state.prevFacets);
    const deletedData = addedDiff(this.state.facets, this.state.prevFacets);
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
      searchPage: {
        facets: {
          added: addedData,
          deleted: deletedData,
          updated: updatedData
        }
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

  handleChange = (e, { value }) => {
    this.setState({ viewState: value });
  };

  handleValueChange = (facetKey, idx) => event => {
    let tempFacets = { ...this.state.facets };
    let tempValues = [...tempFacets[facetKey].values];
    tempValues[idx] = event.target.value;
    tempFacets = {
      ...tempFacets,
      [facetKey]: { ...tempFacets[facetKey], values: tempValues }
    };
    this.setState({ facets: tempFacets });
  };

  handleAddValue = facetKey => {
    let tempFacets = { ...this.state.facets };
    const len = tempFacets[facetKey].values.length;
    let tempValues = [
      ...tempFacets[facetKey].values,
      `${facetKey} new value ${len + 1}`
    ];
    this.setState({
      facets: {
        ...tempFacets,
        [facetKey]: { ...tempFacets[facetKey], values: tempValues }
      }
    });
  };

  handleRemoveValue = (facetKey, idx) => () => {
    let tempFacets = { ...this.state.facets };
    let tempValues = tempFacets[facetKey].values.filter(
      (t, tidx) => idx !== tidx
    );
    this.setState({
      facets: {
        ...tempFacets,
        [facetKey]: { ...tempFacets[facetKey], values: tempValues }
      }
    });
  };

  editFacetValue = (facetKey, value, idx) => {
    let fixedFacet = facetKey === "category" || facetKey === "date";
    return (
      <li key={`${facetKey}_li_${idx}`}>
        <Form.Input
          key={`${facetKey}_value_${idx}`}
          value={value}
          name={`${facetKey}_value_${idx}`}
          placeholder={`${facetKey} value #${idx + 1}`}
          onChange={this.handleValueChange(facetKey, idx)}
          readOnly={fixedFacet}
        />
        {fixedFacet ? (
          <></>
        ) : (
          <button
            type="button"
            onClick={this.handleRemoveValue(facetKey, idx)}
            className="small deleteValue"
          >
            X
          </button>
        )}
        <div className="clear"></div>
      </li>
    );
  };

  editFacet = facetKey => {
    let fixedFacet = facetKey === "category" || facetKey === "date";
    return (
      <section key={facetKey}>
        <fieldset>
          <legend className="admin">{`Configuration for facet field: ${facetKey}`}</legend>
          <Form.Input
            key={`${facetKey}_label`}
            label="Label"
            value={this.state.facets[facetKey].label}
            name={`${facetKey}_label`}
            placeholder="Enter Facet Label"
            onChange={this.updateInputValue(facetKey)}
          />
          <h4>Values:</h4>
          <ul>
            {this.state.facets[facetKey].values.map((value, idx) => {
              return this.editFacetValue(facetKey, value, idx);
            })}
          </ul>
          {fixedFacet ? (
            <></>
          ) : (
            <button
              type="button"
              onClick={() => this.handleAddValue(facetKey)}
              className="small"
            >
              Add Value
            </button>
          )}
        </fieldset>
        {facetKey === "category" || facetKey === "date" ? (
          <></>
        ) : (
          <div className="deletePageWrapper">
            <NavLink
              className="deletePage"
              to="#"
              onClick={() => this.deleteFacet(facetKey)}
            >
              Delete Facet Field
            </NavLink>
            <div className="clear"></div>
          </div>
        )}
      </section>
    );
  };

  addFacet = () => {
    let newFacetKey = this.state.newFacet || this.availableFacets()[0];
    if (newFacetKey) {
      this.setState({
        facets: {
          ...this.state.facets,
          [newFacetKey]: { label: newFacetKey, values: [] }
        },
        newFacet: ""
      });
    }
  };

  deleteFacet = facetKey => {
    let facets = { ...this.state.facets };
    delete facets[facetKey];
    this.setState({ facets: facets });
  };

  dropdownChange = e => {
    this.setState({ newFacet: e.target.value });
  };

  addFacetSection = () => {
    if (this.availableFacets().length) {
      return (
        <div>
          <select
            value={this.state.newFacet}
            name="new_facet"
            id="new-facet-options"
            onChange={this.dropdownChange}
            className="custom-select"
          >
            {this.facetOptions()}
          </select>
          <NavLink className="addPage" to="#" onClick={() => this.addFacet()}>
            Add New Search Facet
          </NavLink>
          <div className="clear"></div>
        </div>
      );
    } else return <></>;
  };

  editSearchFacetsForm = () => {
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          {Object.keys(this.state.facets).map(facetKey => {
            return this.editFacet(facetKey);
          })}
          {this.addFacetSection()}
          <Form.Button>Update Search Facets</Form.Button>
        </Form>
      </div>
    );
  };

  viewSearchFacets() {
    return (
      <ul>
        {Object.keys(this.state.facets).map((facetKey, idx) => {
          return (
            <li key={`facet_${facetKey}`}>
              <div>
                <p>Facet Field: {facetKey} </p>
                <p>Label: {this.state.facets[facetKey].label}</p>
                <p>Values: </p>
                <ul>
                  {this.state.facets[facetKey].values.map((val, idx) => {
                    return <li key={`${facetKey}_value_${idx}`}>{val}</li>;
                  })}
                </ul>
              </div>
              <hr />
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    return (
      <div className="col-lg-9 col-sm-12 admin-content">
        <h1>{`Search Facets for: ${process.env.REACT_APP_REP_TYPE.toLowerCase()}`}</h1>
        <Form>
          <Form.Group inline>
            <label>Current mode:</label>
            <Form.Radio
              label="Edit"
              name="editSearchFacetsRadioGroup"
              value="edit"
              checked={this.state.viewState === "edit"}
              onChange={this.handleChange}
            />

            <Form.Radio
              label="View"
              name="viewSearchFacetsRadioGroup"
              value="view"
              checked={this.state.viewState === "view"}
              onChange={this.handleChange}
            />
          </Form.Group>
        </Form>
        {this.state.viewState === "view"
          ? this.viewSearchFacets()
          : this.editSearchFacetsForm()}
      </div>
    );
  }
}

export default withAuthenticator(SearchFacetsForm);
