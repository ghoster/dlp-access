import React, { Component } from "react";
import { graphqlOperation } from "aws-amplify";
import { Connect } from "aws-amplify-react";
import PDFViewer from "../../components/PDFViewer";
import KalturaPlayer from "../../components/KalturaPlayer";
import MiradorViewer from "../../components/MiradorViewer";
import { OBJModel } from "react-3d-viewer";
import MediaElement from "../../components/MediaElement";
import SearchBar from "../../components/SearchBar";
import Breadcrumbs from "../../components/Breadcrumbs.js";
import SiteTitle from "../../components/SiteTitle";
import {
  RenderItemsDetailed,
  addNewlineInDesc
} from "../../lib/MetadataRenderer";
import { fetchLanguages } from "../../lib/fetchTools";
import { searchArchives } from "../../graphql/queries";
import RelatedItems from "../../components/RelatedItems";
import Citation from "../../components/Citation";
import MtlElement from "../../components/MtlElement";
import X3DElement from "../../components/X3DElement";

import "../../css/ArchivePage.scss";

class ArchivePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      category: "archive",
      searchField: "title",
      view: "Gallery",
      languages: null
    };
  }

  updateFormState = (name, val) => {
    this.setState({
      [name]: val
    });
  };

  setPage = page => {
    this.setState({ page: page });
  };

  addNewlineInDesc(content) {
    if (content) {
      content = content.split("\n").map((value, index) => {
        return <p key={index}>{value}</p>;
      });
    }

    return content;
  }

  isImgURL(url) {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  }

  isAudioURL(url) {
    return url.match(/\.(mp3|ogg|wav)$/) != null;
  }

  isVideoURL(url) {
    return url.match(/\.(mp4|mov)$/) != null;
  }

  isKalturaURL(url) {
    return url.match(/\.(kaltura.com)/) != null;
  }

  isPdfURL(url) {
    return url.match(/\.(pdf)$/) != null;
  }

  isJsonURL(url) {
    return url.match(/\.(json)$/) != null;
  }

  isObjURL(url) {
    return url.match(/\.(obj|OBJ)$/) != null;
  }
  isMtlUrl(url) {
    return url.match(/\.(mtl)$/) != null;
  }
  isX3DUrl(url) {
    return url.match(/\.(x3d|X3D)$/) != null;
  }

  buildTrack(url, thumbnail_path) {
    const nameExt = this.fileNameFromUrl(url);
    const name = nameExt.split(".")[0];

    const track = {};
    track["kind"] = "subtitles";
    track["label"] = "English";
    track["src"] = url.replace(nameExt, name + ".srt");
    track["srclang"] = "en";
    track["poster"] = thumbnail_path;
    return track;
  }

  mediaDisplay(item) {
    let display = null;
    let config = {};
    let tracks = [];
    let width = Math.min(
      document.getElementById("content-wrapper").offsetWidth - 50,
      720
    );
    if (this.isJsonURL(item.manifest_url)) {
      display = <MiradorViewer item={item} site={this.props.site} />;
    } else if (this.isImgURL(item.manifest_url)) {
      display = (
        <img className="item-img" src={item.manifest_url} alt={item.title} />
      );
    } else if (this.isAudioURL(item.manifest_url)) {
      const track = this.buildTrack(item.manifest_url, item.thumbnail_path);
      tracks.push(track);
      display = this.mediaElement(
        item.manifest_url,
        "audio",
        config,
        tracks,
        item.title
      );
    } else if (this.isVideoURL(item.manifest_url)) {
      const track = this.buildTrack(item.manifest_url, item.thumbnail_path);
      tracks.push(track);
      display = this.mediaElement(item.manifest_url, "video", config, tracks);
    } else if (this.isKalturaURL(item.manifest_url)) {
      display = <KalturaPlayer manifest_url={item.manifest_url} />;
    } else if (this.isPdfURL(item.manifest_url)) {
      display = (
        <PDFViewer manifest_url={item.manifest_url} title={item.title} />
      );
    } else if (this.isObjURL(item.manifest_url)) {
      const texPath = item.manifest_url.substr(
        0,
        item.manifest_url.lastIndexOf("/") + 1
      );
      display = (
        <div className="obj-wrapper" style={{ width: `${width}px` }}>
          <OBJModel src={item.manifest_url} texPath={texPath} />
        </div>
      );
    } else if (this.isMtlUrl(item.manifest_url)) {
      display = (
        <div className="obj-wrapper" style={{ width: `${width}px` }}>
          <MtlElement mtl={item.manifest_url} />
        </div>
      );
    } else if (this.isX3DUrl(item.manifest_url)) {
      display = (
        <div className="obj-wrapper" style={{ width: `${width}px` }}>
          <X3DElement url={item.manifest_url} frameSize={width} />
        </div>
      );
    } else {
      display = <></>;
    }
    return display;
  }

  fileExtensionFromFileName(filename) {
    return filename.split(".")[1];
  }

  fileNameFromUrl(manifest_url) {
    let url = new URL(manifest_url);
    return url.pathname.split("/").reverse()[0];
  }

  mediaElement(src, type, config, tracks, title = "") {
    const filename = this.fileNameFromUrl(src);
    const typeString = `${type}/${this.fileExtensionFromFileName(filename)}`;
    const srcArray = [{ src: src, type: typeString }];
    return (
      <MediaElement
        id="player1"
        mediaType={type}
        preload="none"
        controls
        width="100%"
        height="640"
        poster={tracks[0].poster}
        sources={JSON.stringify(srcArray)}
        options={JSON.stringify(config)}
        tracks={JSON.stringify(tracks)}
        title={title}
      />
    );
  }

  componentDidMount() {
    fetchLanguages(this, this.props.site, "abbr");
  }

  render() {
    return (
      <Connect
        query={graphqlOperation(searchArchives, {
          order: "ASC",
          limit: 1,
          filter: {
            custom_key: {
              eq: `ark:/53696/${this.props.customKey}`
            }
          }
        })}
      >
        {({ data: { searchArchives }, loading, errors }) => {
          if (!(errors === undefined || errors.length === 0))
            return <h3>Error</h3>;
          if (loading || !searchArchives) return <h3>Loading...</h3>;
          const item = searchArchives.items[0];

          // log archive identifier in ga
          window.ga("send", "pageview", {
            dimension1: item.identifier
          });

          if (this.state.languages) {
            return (
              <div className="item-page-wrapper">
                <SiteTitle
                  siteTitle={this.props.site.siteTitle}
                  pageTitle={item.title}
                />
                <SearchBar
                  category={this.state.category}
                  view={this.state.view}
                  searchField={this.state.searchField}
                  setPage={this.setPage}
                  updateFormState={this.updateFormState}
                />

                <div className="item-image-section">
                  <div className="breadcrumbs-wrapper">
                    <nav aria-label="Collection breadcrumbs">
                      <Breadcrumbs category={"Archives"} record={item} />
                    </nav>
                  </div>
                  <div className="row">
                    <div
                      className="col-sm-12"
                      id="item-media-col"
                      role="region"
                      aria-label="Item media"
                    >
                      {this.mediaDisplay(item)}
                    </div>
                  </div>
                </div>
                <div
                  className="row item-details-section"
                  role="region"
                  aria-label="Item details"
                >
                  <div className="col-lg-6 details-section-description">
                    <h2>{item.title}</h2>
                    {addNewlineInDesc(item.description)}
                  </div>
                  <div className="col-lg-6 details-section-metadata">
                    <Citation item={item} />
                    <table aria-label="Item Metadata">
                      <tbody>
                        <RenderItemsDetailed
                          keyArray={
                            JSON.parse(this.props.site.displayedAttributes)[
                              "archive"
                            ]
                          }
                          item={item}
                          languages={this.state.languages}
                        />
                      </tbody>
                    </table>
                  </div>
                </div>
                <RelatedItems collection={item} />
              </div>
            );
          } else {
            return <></>;
          }
        }}
      </Connect>
    );
  }
}

export default ArchivePage;
