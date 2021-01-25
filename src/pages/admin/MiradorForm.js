import React, { Component } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Form } from "semantic-ui-react";
import { getSite } from "../../lib/fetchTools";
import { updatedDiff } from "deep-object-diff";
import { API, Auth } from "aws-amplify";
import * as mutations from "../../graphql/mutations";

const initialFormState = {};

class MiradorForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formState: initialFormState,
      prevFormState: initialFormState,
      viewState: "view",
      site: null
    };
  }

  async loadSite() {
    const site = await getSite();
    if (site) {
      if (site.miradorOptions) {
        const mirador = JSON.parse(site.miradorOptions);
        let siteInfo = {
          selectedTheme: mirador.selectedTheme || "light",
          language: "en",
          id: "mirador_viewer",
          window: {
            allowClose: false,
            allowFullscreen: true,
            allowMaximize: false,
            allowTopMenuButton: mirador.window.allowTopMenuButton || true,
            allowWindowSideBar: mirador.window.allowWindowSideBar || true,
            sideBarPanel: mirador.window.sideBarPanel || "info",
            defaultView: "single",
            sideBarOpen: mirador.window.sideBarOpen || false,
            panels: {
              info: true,
              attribution: true,
              canvas: false,
              annotations: true,
              search: false,
              layers: false
            }
          },
          windows: [
            {
              manifestId: ""
            }
          ],
          thumbnailNavigation: {
            defaultPosition:
              mirador.thumbnailNavigation.defaultPosition || "far-bottom",
            displaySettings:
              mirador.thumbnailNavigation.displaySettings || true,
            height: mirador.thumbnailNavigation.height || 130,
            width: mirador.thumbnailNavigation.width || 100
          },
          workspace: {
            draggingEnabled: false,
            allowNewWindows: false,
            isWorkspaceAddVisible: false,
            showZoomControls: true,
            type: "mosaic"
          },
          workspaceControlPanel: {
            enabled: false
          }
        };
        this.setState({
          formState: siteInfo,
          prevFormState: siteInfo,
          site: site
        });
      } else {
        let siteInfo = {
          selectedTheme: "light",
          language: "en",
          id: "mirador_viewer",
          window: {
            allowClose: false,
            allowFullscreen: true,
            allowMaximize: false,
            allowTopMenuButton: true,
            allowWindowSideBar: true,
            sideBarPanel: "info",
            defaultView: "single",
            sideBarOpen: false,
            panels: {
              info: true,
              attribution: true,
              canvas: false,
              annotations: true,
              search: false,
              layers: false
            }
          },
          windows: [
            {
              manifestId: ""
            }
          ],
          thumbnailNavigation: {
            defaultPosition: "far-bottom",
            displaySettings: true,
            height: 130,
            width: 100
          },
          workspace: {
            draggingEnabled: false,
            allowNewWindows: false,
            isWorkspaceAddVisible: false,
            showZoomControls: true,
            type: "mosaic"
          },
          workspaceControlPanel: {
            enabled: false
          }
        };
        this.setState({
          formState: siteInfo,
          prevFormState: siteInfo,
          site: site
        });
      }
    }
  }

  stringToBoolean = value => {
    switch (value) {
      case "true":
        return true;
      case "false":
        return false;
      default:
        return value;
    }
  };

  updateInputValue = event => {
    let { name, value } = event.target;
    value = this.stringToBoolean(value);
    this.setState(prevState => {
      return {
        formState: { ...prevState.formState, [name]: value }
      };
    });
  };

  updateNestedValue = (event, object) => {
    let { name, value } = event.target;
    value = this.stringToBoolean(value);
    if (parseInt(value)) {
      value = parseInt(value);
    }
    let tempState = { ...this.state.formState };
    let tempObject = Object.assign({}, tempState[object]);
    this.setState(prevState => {
      return {
        formState: {
          ...prevState.formState,
          [object]: { ...tempObject, [name]: value }
        }
      };
    });
  };

  handleSubmit = async () => {
    this.setState({ viewState: "view" });
    const siteID = this.state.site.id;
    let miradorOptions = JSON.stringify(this.state.formState);
    let siteInfo = { id: siteID, miradorOptions: miradorOptions };
    await API.graphql({
      query: mutations.updateSite,
      variables: { input: siteInfo },
      authMode: "AMAZON_COGNITO_USER_POOLS"
    });
    const newData = updatedDiff(this.state.prevFormState, this.state.formState);
    const oldData = updatedDiff(this.state.formState, this.state.prevFormState);
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

  editForm = () => {
    return (
      <div>
        <h2>{`Edit Mirador Viewer Options for ${process.env.REACT_APP_REP_TYPE.toLowerCase()}`}</h2>
        <form>
          <section>
            <h3>Theme</h3>
            <div className="form-group">
              <label htmlFor="selectedTheme">Select a theme</label>
              <select
                id="selectedTheme"
                className="form-control"
                value={this.state.formState.selectedTheme}
                name="selectedTheme"
                onChange={this.updateInputValue}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </section>
          <section>
            <h3>Window Options</h3>
            <div className="form-group">
              <label htmlFor="allowTopMenuButton">Allow top menu button</label>
              <select
                className="form-control"
                id="allowTopMenuButton"
                value={this.state.formState.window.allowTopMenuButton}
                name="allowTopMenuButton"
                onChange={e => {
                  this.updateNestedValue(e, "window");
                }}
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
              <small className="form-text text-muted">
                Add/remove the button which allows users to toggle view type in
                top bar.
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="allowWindowSideBar"> Allow window sidebar</label>
              <select
                className="form-control"
                id="allowWindowSideBar"
                value={this.state.formState.window.allowWindowSideBar}
                name="allowWindowSideBar"
                onChange={e => {
                  this.updateNestedValue(e, "window");
                }}
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
              <small className="form-text text-muted">
                Add/remove sidebar menu.
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="sideBarPanel">Sidebar panel</label>
              <select
                className="form-control"
                id="sideBarPanel"
                value={this.state.formState.window.sideBarPanel}
                name="sideBarPanel"
                onChange={e => {
                  this.updateNestedValue(e, "window");
                }}
              >
                <option value="info">Info</option>
                <option value="attribution">Attribution</option>
                <option value="canvas">Canvas</option>
                <option value="annotations">Annotations</option>
                <option value="search">Search</option>
              </select>
              <small className="form-text text-muted">
                Configure which content appears in sidebar upon opening.
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="sideBarOpen">Sidebar open</label>
              <select
                className="form-control"
                id="sideBarOpen"
                value={this.state.formState.window.sideBarOpen}
                name="sideBarOpen"
                onChange={e => {
                  this.updateNestedValue(e, "window");
                }}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              <small className="form-text text-muted">
                Configure whether sidebar is initially open or closed.
              </small>
            </div>

            <section>
              <h3>Thumbnail Navigation Options</h3>
              <div className="form-group">
                <label htmlFor="defaultPosition">Default position</label>
                <select
                  className="form-control"
                  id="defaultPosition"
                  value={
                    this.state.formState.thumbnailNavigation.defaultPosition
                  }
                  name="defaultPosition"
                  onChange={e => {
                    this.updateNestedValue(e, "thumbnailNavigation");
                  }}
                >
                  <option value="off">Off</option>
                  <option value="far-bottom">Far-bottom</option>
                  <option value="far-right">Far-right</option>
                </select>
                <small className="form-text text-muted">
                  Configure the default position of the thumbnail navigation
                  bar.
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="displaySettings">Display settings</label>
                <select
                  className="form-control"
                  id="displaySettings"
                  value={
                    this.state.formState.thumbnailNavigation.displaySettings
                  }
                  name="displaySettings"
                  onChange={e => {
                    this.updateNestedValue(e, "thumbnailNavigation");
                  }}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                <small className="form-text text-muted">
                  Add/remove options in the top bar which allow users to change
                  the position of thumbnails.
                </small>
              </div>
              <Form.Input
                id="thumbnailHeight"
                type="number"
                label='Height (of thumbnail ribbon in "far-bottom" position)'
                value={this.state.formState.thumbnailNavigation.height}
                name="height"
                placeholder="Enter number of pixels"
                onChange={e => {
                  this.updateNestedValue(e, "thumbnailNavigation");
                }}
              />
              <Form.Input
                id="thumbnailWidth"
                type="number"
                label='Width (of thumbnail ribbon in "far-right" position)'
                value={this.state.formState.thumbnailNavigation.width}
                name="width"
                placeholder="Enter number of pixels"
                onChange={e => {
                  this.updateNestedValue(e, "thumbnailNavigation");
                }}
              />
            </section>
          </section>
        </form>
        <button className="submit" onClick={this.handleSubmit}>
          Update Config
        </button>
      </div>
    );
  };

  view = () => {
    if (this.state.site && this.state.formState) {
      return (
        <div className="view-section">
          <div>
            <h3>Mirador Viewer Configuration</h3>
            <h4>Theme</h4>
            <p>
              <span className="key">Selected theme:</span>{" "}
              <span className="value">
                {this.state.formState.selectedTheme}
              </span>
            </p>
            <h4>Window Options</h4>
            <p>
              <span className="key">Allow top menu button:</span>{" "}
              <span className="value">
                {this.state.formState.window.allowTopMenuButton ? "Yes" : "No"}
              </span>
            </p>
            <p>
              <span className="key">Allow window sidebar:</span>{" "}
              <span className="value">
                {this.state.formState.window.allowWindowSideBar ? "Yes" : "No"}
              </span>
            </p>
            <p>
              <span className="key">Sidebar panel:</span>{" "}
              <span className="value">
                {this.state.formState.window.sideBarPanel}
              </span>
            </p>
            <p>
              <span className="key">Sidebar open:</span>{" "}
              <span className="value">
                {this.state.formState.window.sideBarOpen ? "Yes" : "No"}
              </span>
            </p>
            <h4>Thumbnail Navigation Options</h4>
            <p>
              <span className="key">Default position:</span>{" "}
              <span className="value">
                {this.state.formState.thumbnailNavigation.defaultPosition}
              </span>
            </p>
            <p>
              <span className="key">Display settings:</span>{" "}
              <span className="value">
                {this.state.formState.thumbnailNavigation.displaySettings
                  ? "Yes"
                  : "No"}
              </span>
            </p>
            <p>
              <span className="key">
                Height of thumbnail ribbon in "far-bottom" position:
              </span>{" "}
              <span className="value">
                {this.state.formState.thumbnailNavigation.height}
              </span>
            </p>
            <p>
              <span className="key">
                Width of thumbnail ribbon in "far-right" position:
              </span>{" "}
              <span className="value">
                {this.state.formState.thumbnailNavigation.width}
              </span>
            </p>
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

export default withAuthenticator(MiradorForm);
