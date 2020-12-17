import React, { Component } from "react";
import "../css/Footer.scss";

class Footer extends Component {
  render() {
    return (
      <footer className="lib-ft">
        <div className="swoop">
          <img alt="Footer decoration" src="/images/swoop.svg" />
        </div>
        <div className="info-row">
          <div className="lib-names">
            <h3 className="footer-h3">LIBRARIES</h3>
            <a href="https://lib.vt.edu/about-us/libraries/artarch-library.html">
              Art & Architecture Library
            </a>
            <a href="https://lib.vt.edu/about-us/libraries/newman.html">
              Carol M. Newman Library
            </a>
            <a href="https://lib.vt.edu/about-us/libraries/vetmed-library.html">
              Veterinary Medicine Library
            </a>
            <a href="https://lib.vt.edu/about-us/libraries/nvc-resource-center.html">
              NVC Resource Center
            </a>
            <a href="https://lib.vt.edu/about-us/libraries/library-service-center.html">
              Library Service Center
            </a>
            <a href="https://lib.vt.edu/about-us/libraries/vtcsom-library.html">
              Virginia Tech Carilion School of Medicine Library
            </a>
          </div>
          <div className="lib-give">
            <a href="https://lib.vt.edu/about-us/give-to-the-library.html">
              <button className="give-button" tabIndex="-1">
                GIVE TO THE LIBRARY
              </button>
            </a>
            <h3 className="footer-h3">FOLLOW US</h3>
            <div className="social-icons">
              <a
                className="footer-social-links"
                href="https://twitter.com/VTLibraries"
              >
                <i className="fab fa-twitter"></i>
                <span className="sr-only">Twitter</span>
              </a>
              <a
                className="footer-social-links"
                href="https://instagram.com/vtlibraries"
              >
                <i className="fab fa-instagram"></i>
                <span className="sr-only">Instagram</span>
              </a>
              <a
                className="footer-social-links"
                href="https://www.youtube.com/user/VaTechLibraries"
              >
                <i className="fab fa-youtube"></i>
                <span className="sr-only">YouTube</span>
              </a>
              <a
                className="footer-social-links"
                href="https://www.facebook.com/VTLibraries"
              >
                <i className="fab fa-facebook-f"></i>
                <span className="sr-only">Facebook</span>
              </a>
            </div>
          </div>
          <div className="lib-contact">
            <h3 className="footer-h3">CONTACT</h3>
            <p>University Libraries (0434)</p>
            <p>Carol M. Newman Library, Virginia Tech</p>
            <p>560 Drillfield Drive</p>
            <p>Blacksburg, VA 24061</p>
            <p>(540) 231-6170</p>
          </div>
        </div>
        <div className="lib-int-links">
          <a href="https://lib.vt.edu/about-us/employment.html">Employment</a>
          <a href="https://vt.libsurveys.com/site-feedback">
            Feedback & Comments
          </a>
          <a href="https://lib.vt.edu/about-us/hours.html">Hours</a>
          <a href="https://lib.vt.edu/about-us/visitor-information.html">
            Visitor Information
          </a>
          <a href="http://guides.lib.vt.edu/staff-directory">Staff Directory</a>
          <a href="https://lib.vt.edu/about-us/sitemap.html">Site Map</a>
          <a href="https://intranet.lib.vt.edu/">Staff Only</a>
        </div>
        <div className="lib-cc">
          <a
            href="http://guides.lib.vt.edu/c.php?g=726937&p=5189705"
            className="fed-link"
          >
            <img
              src="https://lib.vt.edu/content/dam/lib_vt_edu/images/icons/fdlp-icon.png"
              alt="Federal Depository Emblem"
              className="fed-img"
            />
          </a>
        </div>
        <div className="page__footer-copyright">
          &copy; 2020 Virginia Polytechnic Institute and State University. All
          rights reserved.
        </div>
      </footer>
    );
  }
}

export default Footer;
