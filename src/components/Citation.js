import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import { htmlParsedValue } from "../lib/MetadataRenderer";

import "../css/Citation.css";

class Citation extends Component {
  render() {
    const theme = createMuiTheme({
      overrides: {
        MuiTooltip: {
          tooltip: {
            fontSize: "0.875rem",
            fontFamily: "Acherus, sans-serif",
            backgroundColor: "black"
          },
          arrow: {
            color: "black"
          }
        }
      }
    });

    return (
      <div aria-label="Item Citation" className="citation-section">
        <h2 className="citation-heading">Cite this Item</h2>
        <div className="citation-text"></div>
        <div className="permanent-link">
          <div className="link-label">
            Permanent Link:
            <MuiThemeProvider theme={theme}>
              <Tooltip
                title="Use this link for citations in publications and presentations to ensure consistent access in the future."
                arrow
                placement="top"
                tabIndex="0"
              >
                <span className="help-icon">
                  <i className="fas fa-question-circle"></i>
                </span>
              </Tooltip>
            </MuiThemeProvider>
          </div>
          <div className="link-text">
            {htmlParsedValue(
              `<a href="http://idn.lib.vt.edu/${this.props.item.custom_key}">https://idn.lib.vt.edu/${this.props.item.custom_key}</a>`
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Citation;
