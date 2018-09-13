import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "../styles/nav.css";

export class Nav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const currentTab = this.props.location.pathname.replace("/", "");
    return (
      <ul>
        <li className={currentTab === "" ? "active" : ""}>
          <Link to="/">Home</Link>
        </li>
        <li className={currentTab === "upload" ? "active" : ""}>
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
