import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "../styles/raleway.css";
import customStyle from "../styles/custom.css"; // eslint-disable-line no-unused-vars
import homeStyle from "../styles/home.css"; // eslint-disable-line no-unused-vars
import { Nav } from "./nav";
import { searchKeyword } from "../actions";

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div styleName={"customStyle.container"}>
        <Nav {...this.props} />
        <form>
            <fieldset styleName={"homeStyle.search-container"}>
              <input
                type="text"
                placeholder="Search using keywords"
                id="keywordField"
                styleName={"homeStyle.search-field"}
                value={this.props.keywords}
                onChange={event => {
                  this.props.searchKeyword(event.target.value);
                }}
              />
            </fieldset>
          </form>
      </div>
    );
  }
}

Home.propTypes = {
  keywords: PropTypes.string,
  getProducts: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    keywords: state.keywords
  };
};

const mapDispatchToProps = dispatch => ({
  searchKeyword: (keywords) => dispatch(searchKeyword(keywords))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
