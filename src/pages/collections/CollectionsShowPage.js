import React, { Component } from "react";
import SubCollectionsLoader from "./SubCollectionsLoader";
import CollectionItemsLoader from "./CollectionItemsLoader";
import Breadcrumbs from "../../components/Breadcrumbs";
import CollectionTopContent from "../../components/CollectionTopContent";
import {
  RenderItemsDetailed,
  addNewlineInDesc
} from "../../lib/MetadataRenderer";
import {
  fetchLanguages,
  getTopLevelParentForCollection
} from "../../lib/fetchTools";

import "../../css/CollectionsShowPage.css";

const TRUNCATION_LENGTH = 600;

class CollectionsShowPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collection: null,
      languages: null,
      descriptionTruncated: true,
      subDescriptionTruncated: true,
      description: "",
      title: "",
      thumbnail_path: "",
      creator: "",
      modified_date: "",
      titleList: []
    };
    this.onMoreLessClick = this.onMoreLessClick.bind(this);
  }

  handleZeroItems(collection) {
    let numberStatement = "";
    if (collection > 0) {
      numberStatement = collection + " items";
    }
    return numberStatement;
  }

  updateSubCollections(component, collection, subCollections) {
    collection.subCollection_total =
      subCollections != null ? subCollections.length : 0;

    component.setCollectionState(collection);
  }

  updateCollectionArchives(component, collection, items) {
    collection.archives = items.total;
    component.setCollectionState(collection);
  }

  setCollectionState(collection) {
    this.setState({
      collection: collection
    });
  }

  async setTopLevelAttributes(attributes) {
    let attributeResults = {};
    attributeResults = await this.getTopLevelAttributes(
      this.props.collection,
      attributes
    );
    this.setState(attributeResults, function() {
      this.render();
    });
  }

  async getTopLevelAttributes(collection, attributes) {
    let attributeResults = {};
    let parentData = await getTopLevelParentForCollection(collection);
    for (const key of attributes) {
      attributeResults[key] = parentData[key];
    }
    return attributeResults;
  }

  subCollectionTitle() {
    let title = "";
    if (this.state.title && this.state.title !== this.state.collection.title) {
      title = this.state.collection.title;
    }
    return title;
  }

  subCollectionDescription() {
    let descriptionSection = <></>;
    let descriptionText = this.state.collection.description;

    if (descriptionText && this.state.subDescriptionTruncated) {
      descriptionText = descriptionText.substr(0, TRUNCATION_LENGTH);
    }
    if (this.state.collection.parent_collection && descriptionText) {
      descriptionSection = (
        <div className="collection-detail-description">
          <div className="collection-detail-key">Description</div>
          <div
            className={`collection-detail-value description ${
              this.state.subDescriptionTruncated ? "trunc" : "full"
            }`}
          >
            {addNewlineInDesc(descriptionText)}
            {this.moreLessButtons(descriptionText, "metadata")}
          </div>
        </div>
      );
    }
    return descriptionSection;
  }

  moreLessButtons(text, section) {
    let moreLess = <></>;
    if (text && text.length >= TRUNCATION_LENGTH) {
      moreLess = (
        <span>
          <button
            onClick={e => this.onMoreLessClick(section, e)}
            className="more"
            type="button"
            aria-controls="collection-description"
            aria-expanded="false"
          >
            . . .[more]
          </button>
          <button
            onClick={e => this.onMoreLessClick(section, e)}
            className="less"
            type="button"
            aria-controls="collection-description"
            aria-expanded="true"
          >
            . . .[less]
          </button>
        </span>
      );
    }
    return moreLess;
  }

  onMoreLessClick(section, e) {
    e.preventDefault();
    let key = "descriptionTruncated";
    if (section === "metadata") {
      key = "subDescriptionTruncated";
    }
    let truncated = true;
    if (this.state[key]) {
      truncated = false;
    }
    let stateObj = {};
    stateObj[key] = truncated;
    this.setState(stateObj, function() {
      this.render();
    });
  }

  setTitleList(titleList) {
    this.setState({ titleList: titleList });
  }

  metadataTitle() {
    let title = "";
    if (this.state.titleList.length) {
      title +=
        "Collection Details for " +
        this.state.titleList.map(elem => elem.title).join(", ");
    }
    return title;
  }

  componentDidMount() {
    this.setState(
      {
        collection: this.props.collection
      },
      function() {
        fetchLanguages(this, "abbr");
        const topLevelAttributes = [
          "title",
          "description",
          "thumbnail_path",
          "creator",
          "modified_date"
        ];
        this.setTopLevelAttributes(topLevelAttributes);
      }
    );
  }

  render() {
    if (this.state.languages && this.state.collection) {
      return (
        <div>
          <div className="breadcrumbs-wrapper">
            <nav aria-label="Collection breadcrumbs">
              <Breadcrumbs
                category="Collections"
                record={this.state.collection}
                setTitleList={this.setTitleList.bind(this)}
              />
            </nav>
          </div>

          <CollectionTopContent
            collectionImg={this.state.thumbnail_path}
            collectionTitle={this.state.title}
            modified_date={this.state.modified_date}
            description={this.state.description}
            TRUNCATION_LENGTH={TRUNCATION_LENGTH}
            creator={this.state.creator}
          />

          <div className="container">
            <div className="mid-content-row row">
              <div
                className="col-12 col-lg-8 details-section"
                role="region"
                aria-labelledby="collection-details-section-header"
              >
                <h2
                  className="details-section-header"
                  id="collection-details-section-header"
                >
                  {this.metadataTitle()}
                </h2>

                <div className="details-section-content-grid">
                  {this.subCollectionDescription()}
                  <table aria-label="Collection Metadata">
                    <tbody>
                      <RenderItemsDetailed
                        keyArray={
                          this.props.siteDetails.displayedAttributes.collection
                        }
                        item={this.state.collection}
                        languages={this.state.languages}
                        type="table"
                      />
                    </tbody>
                  </table>
                </div>
              </div>
              <div
                className="col-12 col-lg-4 subcollections-section"
                role="region"
                aria-labelledby="collection-subcollections-section"
              >
                <SubCollectionsLoader
                  parent={this}
                  collection={this.state.collection}
                  updateSubCollections={this.updateSubCollections}
                />
              </div>
            </div>
          </div>

          <CollectionItemsLoader
            parent={this}
            collection={this.state.collection}
            updateCollectionArchives={this.updateCollectionArchives.bind(this)}
          />
        </div>
      );
    } else {
      return null;
    }
  }
}

export default CollectionsShowPage;
