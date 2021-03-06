import React, { Component } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Form } from "semantic-ui-react";
import { updatedDiff } from "deep-object-diff";
import { API, Auth } from "aws-amplify";
import { getSite } from "../../lib/fetchTools";
import * as mutations from "../../graphql/mutations";
import FileUploadField from "./FileUploadField";
import { FeaturedItemsForm, FeaturedItems } from "./FeaturedItemsFields";
import { SponsorForm, Sponsors } from "./SponsorFields";
import {
  CollectionHighlightsForm,
  CollectionHighlights
} from "./CollectionHighlightsFields";

const initialFormState = {
  staticImageSrc: "",
  staticImageAltText: "",
  staticImageShowTitle: false,
  homeStatementHeading: "",
  homeStatement: "",
  sponsors: [],
  featuredItems: [],
  collectionHighlights: []
};

class HomepageForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formState: initialFormState,
      prevFormState: initialFormState,
      viewState: "view",
      site: null
    };
  }

  updateSponsorValue = event => {
    const { name, value, dataset } = event.target;
    const index = dataset.index;
    this.setState(prevState => {
      let sponsorArray = [...prevState.formState.sponsors];
      let sponsor = { ...sponsorArray[index], [name]: value };
      sponsorArray[index] = sponsor;
      return { formState: { ...prevState.formState, sponsors: sponsorArray } };
    });
  };

  addSponsor = () => {
    this.setState(prevState => {
      let sponsorArray = [...prevState.formState.sponsors];
      let index = sponsorArray.length + 1;
      let newSponsor = {
        alt: "",
        img: `https://img.cloud.lib.vt.edu/sites/images/${process.env.REACT_APP_REP_TYPE.toLowerCase()}/sponsor${index}.png`,
        link: ""
      };
      sponsorArray.push(newSponsor);
      return {
        formState: { ...prevState.formState, sponsors: sponsorArray }
      };
    });
  };

  removeSponsor = event => {
    const index = event.target.dataset.index;
    this.setState(prevState => {
      let sponsorArray = [...prevState.formState.sponsors];
      sponsorArray.splice(index, 1);
      return {
        formState: { ...prevState.formState, sponsors: sponsorArray }
      };
    });
  };

  updateItemValue = event => {
    const { name, value, dataset } = event.target;
    const index = dataset.index;
    this.setState(prevState => {
      let itemArray = [...prevState.formState.featuredItems];
      let item = { ...itemArray[index], [name]: value };
      itemArray[index] = item;
      return {
        formState: { ...prevState.formState, featuredItems: itemArray }
      };
    });
  };

  addItem = () => {
    this.setState(prevState => {
      let itemArray = [...prevState.formState.featuredItems];
      let index = itemArray.length + 1;
      let newItem = {
        altText: "",
        src: `https://img.cloud.lib.vt.edu/sites/images/${process.env.REACT_APP_REP_TYPE.toLowerCase()}/featured_item${index}.png`,
        cardTitle: "",
        link: ""
      };
      itemArray.push(newItem);
      return {
        formState: { ...prevState.formState, featuredItems: itemArray }
      };
    });
  };

  removeItem = event => {
    const index = event.target.dataset.index;
    this.setState(prevState => {
      let itemArray = [...prevState.formState.featuredItems];
      itemArray.splice(index, 1);
      return {
        formState: { ...prevState.formState, featuredItems: itemArray }
      };
    });
  };

  updateHighlightValue = event => {
    const { name, value, dataset } = event.target;
    const index = dataset.index;
    this.setState(prevState => {
      let itemArray = [...prevState.formState.collectionHighlights];
      let item = { ...itemArray[index], [name]: value };
      itemArray[index] = item;
      return {
        formState: { ...prevState.formState, collectionHighlights: itemArray }
      };
    });
  };

  addHighlight = () => {
    this.setState(prevState => {
      let itemArray = [...prevState.formState.collectionHighlights];
      let index = itemArray.length + 1;
      let newItem = {
        title: "",
        img: `https://img.cloud.lib.vt.edu/sites/images/${process.env.REACT_APP_REP_TYPE.toLowerCase()}/highlight${index}.jpg`,
        link: "",
        itemCount: ""
      };
      itemArray.push(newItem);
      return {
        formState: { ...prevState.formState, collectionHighlights: itemArray }
      };
    });
  };

  removeHighlight = event => {
    const index = event.target.dataset.index;
    this.setState(prevState => {
      let itemArray = [...prevState.formState.collectionHighlights];
      itemArray.splice(index, 1);
      return {
        formState: { ...prevState.formState, collectionHighlights: itemArray }
      };
    });
  };

  async loadSite() {
    const site = await getSite();
    if (site && site.homePage) {
      const homepage = JSON.parse(site.homePage);
      let siteInfo = {};
      try {
        siteInfo = {
          staticImageSrc: homepage.staticImage.src || "",
          staticImageAltText: homepage.staticImage.altText || "",
          staticImageShowTitle: homepage.staticImage.showTitle || false,
          homeStatementHeading: homepage.homeStatement.heading || "",
          homeStatement: homepage.homeStatement.statement,
          sponsors: homepage.sponsors || [],
          featuredItems: homepage.featuredItems || [],
          collectionHighlights: homepage.collectionHighlights || []
        };
      } catch (error) {
        console.error(error);
      }

      this.setState({
        formState: siteInfo,
        prevFormState: siteInfo,
        site: site
      });
    }
  }

  setStaticImgSrc(context, srcName) {
    let evt = { target: { name: null, value: null, type: "upload" } };
    evt.target.name = "staticImageSrc";
    const filePrefix = `https://img.cloud.lib.vt.edu/sites/images/${process.env.REACT_APP_REP_TYPE.toLowerCase()}`;
    evt.target.value = `${filePrefix}/${srcName}`;
    context.updateInputValue(evt);
  }

  updateInputValue = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState(prevState => {
      return {
        formState: { ...prevState.formState, [name]: value }
      };
    });
  };

  handleSubmit = async () => {
    this.setState({ viewState: "view" });
    const siteID = this.state.site.id;
    let homePage = JSON.parse(this.state.site.homePage);
    homePage.homeStatement.heading = this.state.formState.homeStatementHeading;
    homePage.homeStatement.statement = this.state.formState.homeStatement;
    homePage.staticImage.src = this.state.formState.staticImageSrc;
    homePage.staticImage.altText = this.state.formState.staticImageAltText;
    homePage.staticImage.showTitle = this.state.formState.staticImageShowTitle;
    homePage.sponsors = this.state.formState.sponsors;
    homePage.featuredItems = this.state.formState.featuredItems;
    homePage.collectionHighlights = this.state.formState.collectionHighlights;
    let siteInfo = { id: siteID, homePage: JSON.stringify(homePage) };
    await API.graphql({
      query: mutations.updateSite,
      variables: { input: siteInfo },
      authMode: "AMAZON_COGNITO_USER_POOLS"
    });
    const initialHomePage = JSON.parse(this.state.site.homePage);
    const newData = updatedDiff(initialHomePage, homePage);
    const oldData = updatedDiff(homePage, initialHomePage);
    const eventInfo = Object.keys(newData).reduce((acc, key) => {
      return {
        ...acc,
        [key]: {
          old: oldData[key],
          new: newData[key]
        }
      };
    }, {});
    const userInfo = await Auth.currentUserPoolUser();
    let historyInfo = {
      groups: userInfo.signInUserSession.accessToken.payload["cognito:groups"],
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

  fileUploadLabel(staticImageSrc) {
    let hasValue = "";
    if (staticImageSrc) {
      hasValue = "to change ";
    }
    return `Upload file ${hasValue} (Image or HTML file only):`;
  }

  editForm = () => {
    return (
      <div>
        <h2>{`Edit Homepage Top with SiteId: ${process.env.REACT_APP_REP_TYPE.toLowerCase()}`}</h2>
        <Form>
          <section className="homepage-statement">
            <h3>Homepage Statement</h3>
            <Form.Input
              label="Heading"
              value={this.state.formState.homeStatementHeading}
              name="homeStatementHeading"
              placeholder="Enter Heading"
              onChange={this.updateInputValue}
            />
            <Form.TextArea
              label="Statement"
              value={this.state.formState.homeStatement}
              name="homeStatement"
              placeholder="Enter Statement"
              onChange={this.updateInputValue}
            />
          </section>
          <section className="static-image">
            <h3>Static Image</h3>
            <FileUploadField
              context={this}
              value={this.state.formState.staticImageSrc}
              label={this.fileUploadLabel(this.state.formState.staticImageSrc)}
              name="staticImageSrc"
              placeholder="Enter Src"
              site={this.state.site}
              setSrc={this.setStaticImgSrc.bind(this)}
            />
            <Form.Input
              label="Alt Text"
              value={this.state.formState.staticImageAltText}
              name="staticImageAltText"
              placeholder="Enter Alt Text"
              onChange={this.updateInputValue}
            />
            <label>
              Show title:
              <input
                className="showTitleCheckbox"
                name="staticImageShowTitle"
                type="checkbox"
                checked={this.state.formState.staticImageShowTitle}
                onChange={this.updateInputValue}
              />
            </label>
          </section>
        </Form>
        <FeaturedItemsForm
          itemList={this.state.formState.featuredItems}
          updateItemValue={this.updateItemValue}
          addItem={this.addItem}
          removeItem={this.removeItem}
          site={this.state.site}
          context={this}
        />
        <SponsorForm
          sponsorsList={this.state.formState.sponsors}
          updateSponsorValue={this.updateSponsorValue}
          addSponsor={this.addSponsor}
          removeSponsor={this.removeSponsor}
          site={this.state.site}
          context={this}
        />
        <CollectionHighlightsForm
          highlightsList={this.state.formState.collectionHighlights}
          updateHighlightValue={this.updateHighlightValue}
          addHighlight={this.addHighlight}
          removeHighlight={this.removeHighlight}
          site={this.state.site}
          context={this}
        />
        <button className="submit" onClick={this.handleSubmit}>
          Update Config
        </button>
      </div>
    );
  };

  showTitleFormatted() {
    let title = "false";
    try {
      title = this.state.formState.staticImageShowTitle.toString();
    } catch (error) {
      console.error(error);
    }
    return title;
  }

  view = () => {
    if (this.state.site && this.state.formState) {
      return (
        <div className="view-section">
          <div>
            <h3>Homepage Statement</h3>
            <p>
              <span className="key">Heading:</span>{" "}
              {this.state.formState.homeStatementHeading}
            </p>
            <p>
              <span className="key">Statement:</span>{" "}
              {this.state.formState.homeStatement}
            </p>
            <h3>Static Image</h3>
            <p>
              <span className="key">Src:</span>{" "}
              {this.state.formState.staticImageSrc}
            </p>
            <p>
              <span className="key">Alt text:</span>{" "}
              {this.state.formState.staticImageAltText}
            </p>
            <p>
              <span className="key">Show title:</span>{" "}
              {this.showTitleFormatted()}
            </p>
            <h3>Featured Items</h3>
            <FeaturedItems itemList={this.state.formState.featuredItems} />
            <h3>Sponsors</h3>
            <Sponsors sponsorsList={this.state.formState.sponsors} />
            <h3>Collection Highlights</h3>
            <CollectionHighlights
              highlightsList={this.state.formState.collectionHighlights}
            />
          </div>
        </div>
      );
    } else {
      return <div>Error fetching site configurations......</div>;
    }
  };

  componentDidMount() {
    this.loadSite();
  }

  render() {
    return (
      <div className="col-lg-9 col-sm-12 admin-content">
        <Form>
          <Form.Group inline>
            <label>Current mode:</label>
            <Form.Radio
              label="Edit"
              name="viewRadioGroup"
              value="edit"
              checked={this.state.viewState === "edit"}
              onChange={this.handleChange}
            />
            <Form.Radio
              label="View"
              name="viewRadioGroup"
              value="view"
              checked={this.state.viewState === "view"}
              onChange={this.handleChange}
            />
          </Form.Group>
        </Form>
        {this.state.viewState === "view" ? this.view() : this.editForm()}
      </div>
    );
  }
}

export default withAuthenticator(HomepageForm);
