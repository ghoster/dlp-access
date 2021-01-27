import React, { Component } from "react";
import { API, Auth, Storage } from "aws-amplify";
import * as mutations from "../../graphql/mutations";

class FileUploadField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: {},
      hasError: false,
      isUploaded: false
    };
  }

  setFile = e => {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    if (file.type.match(/\/(jpeg|jpg|gif|png|html)$/g)) {
      this.setState({ file: file, hasError: false, isUploaded: false });
    } else {
      this.setState({ file: {}, hasError: true });
    }
  };

  uploadFile = async () => {
    if (!this.state.hasError) {
      const folder = this.state.file.type === "text/html" ? "html" : "image";
      const pathPrefix = `public/sitecontent/${folder}/${process.env.REACT_APP_REP_TYPE.toLowerCase()}/`;
      const prefixFolder = this.props.filepath ? `${this.props.filepath}/` : "";
      Storage.configure({
        customPrefix: {
          public: `${pathPrefix}${prefixFolder}`
        }
      });
      await Storage.put(this.state.file.name, this.state.file, {
        contentType: this.state.file.type
      });
      const eventInfo = {
        upload_content: {
          name: this.state.file.name,
          type: this.state.file.type,
          size: this.state.file.size
        }
      };
      const evt = {
        target: {
          name: this.props.name,
          value: `${prefixFolder}${this.state.file.name}`,
          type: "upload"
        }
      };
      this.setState({ isUploaded: true }, () => {
        this.props.setSrc(evt);
      });
      const userInfo = await Auth.currentUserPoolUser();
      let historyInfo = {
        groups:
          userInfo.signInUserSession.accessToken.payload["cognito:groups"],
        userEmail: userInfo.attributes.email,
        siteID: this.props.site.id,
        event: JSON.stringify(eventInfo)
      };
      await API.graphql({
        query: mutations.createHistory,
        variables: { input: historyInfo },
        authMode: "AMAZON_COGNITO_USER_POOLS"
      });
    } else {
      this.setState({ isUploaded: false });
    }
  };

  afterMessage = () => {
    let color = "green";
    let message = null;
    if (this.state.hasError) {
      color = "red";
      message = "Please upload image or HTML file only!!";
    } else if (this.state.isUploaded) {
      message = `${this.state.file.name} is uploaded successfully!`;
    }
    return (
      <p style={{ color: color }} data-test="upload-message">
        {message}
      </p>
    );
  };

  render() {
    return (
      <div className="fileUploadField">
        {this.props.value && (
          <div>
            <span className="key">Src:</span> {this.props.value}
          </div>
        )}
        <label>{this.props.label}</label>
        <input type="file" onChange={this.setFile} />
        <button className="ui button uploadButton" onClick={this.uploadFile}>
          Upload File
        </button>
        {this.state.hasError || this.state.isUploaded
          ? this.afterMessage()
          : ""}
      </div>
    );
  }
}

export default FileUploadField;
