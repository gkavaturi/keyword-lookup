/* eslint-disable */
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import "../styles/raleway.css";
import customStyle from "../styles/custom.css"; // eslint-disable-line no-unused-vars
import homeStyle from "../styles/home.css"; // eslint-disable-line no-unused-vars
import { Nav } from "./nav";
import { fetchProducts, setKeyWords } from "../actions";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdateKeywords = this.handleUpdateKeywords.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.triggerSearchKeywords(this.props.keywords);
  }

  handleUpdateKeywords(event) {
    this.props.triggerUpdateKeywords(event.target.value);
  }

  render() {
    return (
      <div styleName={"customStyle.container"}>
        <Nav {...this.props} />
        <form onSubmit={this.handleSubmit}>
          <fieldset styleName={"homeStyle.search-container"}>
            <input
              type="text"
              placeholder=""
              id="keywordField"
              styleName={"homeStyle.search-field"}
              value={this.props.keywords}
              onChange={event => {
                  this.props.triggerUpdateKeywords(event.target.value);
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
  triggerUpdateKeywords: PropTypes.func.isRequired,
  triggerSearchKeywords: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    ...state.productStore
  }
};

const mapDispatchToProps = dispatch => ({
  triggerUpdateKeywords: (keywords) => dispatch(setKeyWords(keywords)),
  triggerSearchKeywords: (keywords) => dispatch(fetchProducts(keywords))
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Home));
