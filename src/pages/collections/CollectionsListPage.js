import React, { Component } from "react";
import ItemListView from "../search/ItemListView";
import GalleryView from "../search/GalleryView";
import ResultsNumberDropdown from "../../components/ResultsNumberDropdown";
import FilterDropdown from "../../components/FilterDropdown";
import SortbyDropdown from "../../components/SortbyDropdown";
import Pagination from "../../components/Pagination";
import ViewBar from "../../components/ViewBar";

import "../../css/ListPages.scss";
import "../../css/CollectionsListPage.scss";

class CollectionsListPage extends Component {
  render() {
    const Header = () => {
      if (this.props.isSearch) {
        return <CollectionsPaginationDisplay atBottom={false} />;
      } else {
        return <h1 className="list-type">About Our Collections</h1>;
      }
    };

    const CollectionsPaginationDisplay = ({ atBottom }) => {
      return (
        <Pagination
          numResults={this.props.collections.length}
          total={this.props.total}
          page={this.props.page}
          limit={this.props.limit}
          previousPage={this.props.previousPage}
          nextPage={this.props.nextPage}
          totalPages={this.props.totalPages}
          isSearch={this.props.isSearch}
          atBottom={atBottom}
        />
      );
    };

    return (
      <div className="collection-browse-wrapper">
        <div className="collection-browse-header">
          <Header />
        </div>
        <div className="container">
          <div className="row justify-content-center">
            <div
              className="navbar navbar-light justify-content-between"
              role="region"
              aria-label="Browsing Tools"
              aria-controls="browse-results"
            >
              <div
                className="collection-filters"
                role="group"
                aria-roledescription="Filter and sort options"
              >
                <FilterDropdown
                  siteFilter={this.props.browseCollections.filter}
                  updateFormState={this.props.updateFormState}
                />
                <SortbyDropdown
                  siteSort={this.props.browseCollections.sort}
                  updateFormState={this.props.updateFormState}
                />
              </div>
              <div className="form-inline collection-view-options">
                <ViewBar
                  view={this.props.view}
                  updateFormState={this.props.updateFormState}
                  pageViews={["Gallery", "List"]}
                />
                <ResultsNumberDropdown setLimit={this.props.setLimit} />
              </div>
            </div>
          </div>
          <div
            className="row justify-content-center"
            id="browse-results"
            role="region"
            aria-label="Browse results"
          >
            {this.props.collections.map(collection => {
              if (this.props.view === "Gallery") {
                return (
                  <GalleryView
                    site={this.props.site}
                    key={collection.id}
                    item={collection}
                    category="collection"
                    label={false}
                  />
                );
              } else {
                return (
                  <ItemListView
                    site={this.props.site}
                    key={collection.id}
                    item={collection}
                    category="collection"
                    label={false}
                  />
                );
              }
            })}
          </div>
        </div>
        <div aria-live="polite">
          <CollectionsPaginationDisplay atBottom={true} />
        </div>
      </div>
    );
  }
}

export default CollectionsListPage;
