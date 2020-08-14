import React, { Component } from "react";
import SiteTitle from "../components/SiteTitle";
import ContactSection from "../components/ContactSection";
import { getHTML } from "../lib/fetchTools";

import "../css/TermsPage.css";
class PermissionsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copy: ""
    };
  }

  componentDidMount() {
    getHTML(
      this.props.siteDetails.assetBasePath,
      this.props.siteDetails.sitePages[this.props.parentKey].data_url,
      this
    );
  }

  render() {
    let download = "";
    try {
      download = this.props.siteDetails.sitePages.terms.assets.download;
    } catch (error) {
      console.log("no download link specified");
    }
    return (
      <>
        <div className="row terms-page-wrapper">
          <div className="col-12 terms-heading">
            <SiteTitle
              siteTitle={this.props.siteDetails.siteTitle}
              pageTitle="Permissions"
            />
            <h1>Permissions</h1>
          </div>
          <div className="col-md-8">
            <div
              className="terms-details"
              dangerouslySetInnerHTML={{ __html: this.state.copy }}
            ></div>
          </div>
          <div className="col-md-4 contact-section-wrapper">
            <ContactSection siteDetails={this.props.siteDetails} />
            {download ? (
              <div>
                <h2 className="terms-downloads-heading">Downloadable forms</h2>
                <a href={download}>Permission form for image reproductions</a>
              </div>
            ) : null}
          </div>
        </div>
      </>
    );
  }
}

export default PermissionsPage;
