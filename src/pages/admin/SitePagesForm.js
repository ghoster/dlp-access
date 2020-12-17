import React, { Component } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { NavLink } from "react-router-dom";
import { Form } from "semantic-ui-react";
import { updatedDiff } from "deep-object-diff";
import { API, Auth } from "aws-amplify";
import { getSite } from "../../lib/fetchTools";
import * as mutations from "../../graphql/mutations";

import "../../css/adminForms.scss";

const initialFormState = [];

class SitePagesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formState: initialFormState,
      prevFormState: initialFormState,
      viewState: "view",
      site: null,
      added: 0
    };
  }

  async loadSite() {
    const site = await getSite();
    if (site) {
      const sitePages = JSON.parse(site.sitePages);
      let pages = [];
      for (const key in sitePages) {
        const page = sitePages[key];
        pages.push({ pageName: key, ...page });
      }
      this.setState({
        formState: pages,
        prevFormState: pages,
        pages: pages,
        site: site
      });
    }
  }

  componentDidMount() {
    this.loadSite();
  }

  updateInputValue = event => {
    const { name, value } = event.target;
    const page = name.split("_")[0];
    let formField = name.split("_")[1].replace("[]", "");
    let tempState = JSON.parse(JSON.stringify(this.state.formState));

    for (const idx in tempState) {
      if (tempState[idx].pageName === page) {
        if (formField === "localURL") {
          formField = "local_url";
        } else if (formField === "dataURL") {
          formField = "data_url";
        }
        tempState[idx][formField] = value;
      }
    }

    this.setState({ formState: tempState });
  };

  handleSubmit = async () => {
    const pagesObj = {};
    for (const idx in this.state.formState) {
      let page = this.state.formState[idx];
      pagesObj[page.pageName] = page;
    }
    this.setState({ viewState: "view" });
    const siteID = this.state.site.id;
    const siteInfo = { id: siteID, sitePages: JSON.stringify(pagesObj) };
    await API.graphql({
      query: mutations.updateSite,
      variables: { input: siteInfo },
      authMode: "AMAZON_COGNITO_USER_POOLS"
    });
    const newData = updatedDiff(this.state.prevFormState, this.state.formState);
    const oldData = updatedDiff(this.state.formState, this.state.prevFormState);
    let newPages = [];
    let deletedPages = [];

    // check if pages were deleted (for history)
    for (const idx in this.state.prevFormState) {
      const pageName = this.state.prevFormState[idx].pageName;
      let found = false;
      for (const i in this.state.formState) {
        if (this.state.formState[i].pageName === pageName) {
          found = true;
        }
      }
      if (!found) {
        deletedPages.push(this.state.prevFormState[idx]);
      }
    }

    // check if pages were added (for history)
    const numNewPages =
      this.state.formState.length - this.state.prevFormState.length;
    if (numNewPages > 0) {
      newPages = this.state.formState.slice(
        Math.max(this.state.formState.length - numNewPages, 0)
      );
    }
    if (newPages.length) {
      for (const idx in newPages) {
        newData[Object.keys(newData).length] = newPages[idx];
      }
    }
    let eventInfo = {};
    if (!deletedPages.length) {
      eventInfo = Object.keys(newData).reduce((acc, key) => {
        return {
          ...acc,
          [key]: {
            old: oldData[key] || "New Page",
            new: newData[key]
          }
        };
      }, {});
    } else {
      for (const idx in deletedPages) {
        eventInfo[idx] = {
          old: deletedPages[idx],
          new: "Deleted"
        };
      }
    }

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

  addPage() {
    let pages = JSON.parse(JSON.stringify(this.state.formState));
    pages.push({ pageName: `new${this.state.added + 1}` });
    this.setState({ formState: pages, added: this.state.added + 1 });
  }

  deletePage(page) {
    let pages = JSON.parse(JSON.stringify(this.state.formState));
    for (const idx in pages) {
      if (pages[idx].pageName === page) {
        pages.splice(idx, 1);
      }
    }
    this.setState({ formState: pages });
  }

  editSitePagesForm = () => {
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          {this.state.formState.map((item, idx) => {
            return this.editSitePagesSection(item, idx);
          })}
          <div>
            <NavLink className="add" to="#" onClick={() => this.addPage()}>
              New Page
            </NavLink>
            <div className="clear"></div>
          </div>
          <Form.Button>Update Site</Form.Button>
        </Form>
      </div>
    );
  };

  formatAssets(input) {
    let assets = input;
    if (typeof input === "object") {
      assets = JSON.stringify(input);
    }
    return assets;
  }

  editSitePagesSection = (item, idx) => {
    return (
      <section key={idx}>
        <fieldset>
          <legend className="admin">{`Configuration for page: ${item.pageName}`}</legend>
          <Form.Input
            key={`${idx}_pageName`}
            label="Page ID"
            value={item.pageName}
            name={`${item.pageName}_pageName[]`}
            placeholder="Enter Page ID"
            onChange={this.updateInputValue}
          />
          <Form.Input
            key={`${idx}_component`}
            label="Component"
            value={item.component || ""}
            name={`${item.pageName}_component[]`}
            placeholder="Enter Handling Component"
            onChange={this.updateInputValue}
          />
          <Form.TextArea
            key={`${idx}_assets`}
            label="Assets"
            value={this.formatAssets(item.assets) || ""}
            name={`${item.pageName}_assets[]`}
            placeholder="Enter Page Assets"
            onChange={this.updateInputValue}
          />
          <Form.Input
            key={`${idx}_localURL`}
            label="Local URL"
            value={item.local_url || ""}
            name={`${item.pageName}_localURL[]`}
            placeholder="Enter Local URL"
            onChange={this.updateInputValue}
          />
          <Form.Input
            key={`${idx}_text`}
            label="Link Text"
            value={item.text || ""}
            name={`${item.pageName}_text[]`}
            placeholder="Enter Link Text"
            onChange={this.updateInputValue}
          />
          <Form.Input
            key={`${idx}_dataURL`}
            label="Data URL"
            value={item.data_url || ""}
            name={`${item.pageName}_dataURL[]`}
            placeholder="Enter Data URL"
            onChange={this.updateInputValue}
          />
        </fieldset>
        <div className="deleteWrapper">
          <NavLink
            className="delete"
            to="#"
            onClick={() => this.deletePage(item.pageName)}
          >
            Delete Page
          </NavLink>
          <div className="clear"></div>
        </div>
      </section>
    );
  };

  viewSitePages() {
    return (
      <ul>
        {this.state.formState.map(page => {
          return (
            <li key={page.pageName}>
              <div>
                <p>Page ID: {page.pageName} </p>
                <p>Component: {page.component}</p>
                <p>Assets: {JSON.stringify(page.assets) || ""}</p>
                <p>Local URL: {page.local_url}</p>
                <p>Text: {page.text}</p>
                <p>Data URL: {page.data_url}</p>
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
        <h1>{`Site Pages for: ${process.env.REACT_APP_REP_TYPE.toLowerCase()}`}</h1>
        <Form>
          <Form.Group inline>
            <label>Current mode:</label>
            <Form.Radio
              label="Edit"
              name="editStatePagesRadioGroup"
              value="edit"
              checked={this.state.viewState === "edit"}
              onChange={this.handleChange}
            />

            <Form.Radio
              label="View"
              name="viewStatePagesRadioGroup"
              value="view"
              checked={this.state.viewState === "view"}
              onChange={this.handleChange}
            />
          </Form.Group>
        </Form>
        {this.state.viewState === "view"
          ? this.viewSitePages()
          : this.editSitePagesForm()}
      </div>
    );
  }
}

export default withAuthenticator(SitePagesForm);
