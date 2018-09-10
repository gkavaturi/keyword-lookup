import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import navStyle from "../styles/nav.css"; // eslint-disable-line no-unused-vars

export class Nav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const currentTab = this.props.location.pathname.replace("/", "");
    return (
      <ul>
        <li styleName={currentTab === "" ? "navStyle.active" : ""}>
          <Link to="/">Home</Link>
        </li>
        <li styleName={currentTab === "upload" ? "navStyle.active" : ""}>
          <Link to="/upload">Upload</Link>
        </li>
      </ul>
    );
  }
}

Nav.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string
  })
};

Nav.defaultProps = {
  location: {
    pathname: ""
  }
};
