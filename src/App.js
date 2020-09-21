import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ScrollToTop from "./lib/ScrollToTop";
import { fetchSiteDetails } from "./lib/fetchTools";
import AnalyticsConfig from "./components/AnalyticsConfig";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { buildRoutes } from "./lib/CustomPageRoutes";
import HomePage from "./pages/HomePage";
import SiteAdmin from "./pages/SiteAdmin";

import CollectionsListLoader from "./pages/collections/CollectionsListLoader";
import CollectionsShowLoader from "./pages/collections/CollectionsShowLoader";

import SearchLoader from "./pages/search/SearchLoader";
import ArchivePage from "./pages/archives/ArchivePage";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      siteDetails: null,
      paginationClick: null
    };
  }

  setColor(color) {
    if (color) {
      document.documentElement.style.setProperty(
        "--themeHighlightColor",
        color
      );
    }
  }

  setPaginationClick(event) {
    this.setState({ paginationClick: event });
  }

  componentDidMount() {
    fetchSiteDetails(this, process.env.REACT_APP_REP_TYPE);
  }

  render() {
    if (this.state.siteDetails !== null) {
      this.setColor(this.state.siteDetails.siteColor);
      const customRoutes = buildRoutes(this.state.siteDetails);
      return (
        <Router>
          <AnalyticsConfig analyticsID={this.state.siteDetails.analyticsID} />
          <ScrollToTop paginationClick={this.state.paginationClick} />
          <Header
            siteDetails={this.state.siteDetails}
            location={window.location}
          />
          <main style={{ minHeight: "500px", padding: "1em 1em 0 1em" }}>
            <div id="content-wrapper" className="container p-0">
              <Switch>
                {customRoutes}
                <Route
                  path="/"
                  exact
                  render={props => (
                    <HomePage siteDetails={this.state.siteDetails} />
                  )}
                />
                <Route
                  path="/collections"
                  exact
                  render={props => (
                    <CollectionsListLoader
                      scrollUp={this.setPaginationClick.bind(this)}
                      siteDetails={this.state.siteDetails}
                    />
                  )}
                />
                <Route
                  path="/collection/:customKey"
                  render={props => (
                    <CollectionsShowLoader
                      siteDetails={this.state.siteDetails}
                      customKey={props.match.params.customKey}
                    />
                  )}
                />
                <Route
                  path="/search"
                  exact
                  render={props => (
                    <SearchLoader
                      scrollUp={this.setPaginationClick.bind(this)}
                      siteDetails={this.state.siteDetails}
                    />
                  )}
                />
                <Route
                  path="/archive/:customKey"
                  exact
                  render={props => (
                    <ArchivePage
                      siteDetails={this.state.siteDetails}
                      customKey={props.match.params.customKey}
                    />
                  )}
                />
                <Route exact path="/siteAdmin" component={SiteAdmin} />
              </Switch>
            </div>
          </main>
          <Footer />
        </Router>
      );
    } else {
      return <div>Error fetching site details from config</div>;
    }
  }
}

export default App;
