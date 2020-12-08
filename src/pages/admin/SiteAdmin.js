import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { AmplifySignOut, withAuthenticator } from "@aws-amplify/ui-react";
import { Link } from "react-router-dom";
import SiteForm from "./SiteForm";
import SitePagesForm from "./SitePagesForm";
import ContentUpload from "./ContentUpload";
import HomepageForm from "./HomepageForm";
import SearchPageForm from "./SearchPageForm";
import BrowseCollectionsForm from "./BrowseCollectionsForm";
import DisplayedAttributesForm from "./DisplayedAttributesForm";
import MediaSectionForm from "./MediaSectionForm";

import "../../css/SiteAdmin.scss";

class SiteAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorized: false,
      form: "site"
    };
  }

  async checkGroup() {
    try {
      const data = await Auth.currentUserPoolUser();
      const groups =
        data.signInUserSession.accessToken.payload["cognito:groups"];
      let adminGroup = "";
      const repo_type = process.env.REACT_APP_REP_TYPE.toLowerCase();
      if (repo_type === "default") {
        adminGroup = "demoSiteAdmin";
      } else if (repo_type === "podcasts") {
        adminGroup = "podcastSiteAdmin";
      } else {
        adminGroup = `${repo_type}SiteAdmin`;
      }
      if (groups && groups.indexOf(adminGroup) !== -1) {
        this.setAuthorized(true);
      } else {
        this.setAuthorized(false);
      }
    } catch (err) {
      console.log("error: ", err);
      this.setAuthorized(false);
    }
  }

  setAuthorized(authorized) {
    this.setState({ authorized: authorized });
  }

  setForm(form) {
    this.setState({ form: form });
  }

  getForm() {
    const forms = {
      site: <SiteForm />,
      contentUpload: <ContentUpload />,
      sitePages: <SitePagesForm />,
      homepage: <HomepageForm />,
      searchPage: <SearchPageForm />,
      browseCollections: <BrowseCollectionsForm />,
      displayedAttributes: <DisplayedAttributesForm />,
      mediaSection: <MediaSectionForm />
    };
    return forms[this.state.form];
  }

  componentDidMount() {
    this.checkGroup();
  }

  render() {
    return (
      <div className="row admin-wrapper">
        <div className="col-lg-3 col-sm-12 admin-sidebar">
          <ul>
            <li className={this.state.form === "site" ? "admin-active" : ""}>
              <Link onClick={() => this.setForm("site")} to={"/siteAdmin"}>
                General Site Config
              </Link>
            </li>
            <li
              className={this.state.form === "sitePages" ? "admin-active" : ""}
            >
              <Link onClick={() => this.setForm("sitePages")} to={"/siteAdmin"}>
                Site Pages Config
              </Link>
            </li>
            <li
              className={
                this.state.form === "contentUpload" ? "admin-active" : ""
              }
            >
              <Link
                onClick={() => this.setForm("contentUpload")}
                to={"/siteAdmin"}
              >
                Upload Site Content
              </Link>
            </li>
            <li
              className={this.state.form === "homepage" ? "admin-active" : ""}
            >
              <Link onClick={() => this.setForm("homepage")} to={"/siteAdmin"}>
                Homepage Config
              </Link>
            </li>
            <li
              className={this.state.form === "searchPage" ? "admin-active" : ""}
            >
              <Link
                onClick={() => this.setForm("searchPage")}
                to={"/siteAdmin"}
              >
                Search Page Config
              </Link>
            </li>
            <li
              className={
                this.state.form === "browseCollections" ? "admin-active" : ""
              }
            >
              <Link
                onClick={() => this.setForm("browseCollections")}
                to={"/siteAdmin"}
              >
                Browse Collections Page
              </Link>
            </li>
            <li>
              <Link
                onClick={() => this.setForm("displayedAttributes")}
                to={"/siteAdmin"}
              >
                Displayed Attributes
              </Link>
            </li>
            <li>
              <Link
                onClick={() => this.setForm("mediaSection")}
                to={"/siteAdmin"}
              >
                Homepage media section
              </Link>
            </li>
          </ul>
          <AmplifySignOut />
        </div>
        {this.state.authorized ? (
          this.getForm()
        ) : (
          <h1>"Not authorized to access this page!"</h1>
        )}
      </div>
    );
  }
}

export default withAuthenticator(SiteAdmin);
