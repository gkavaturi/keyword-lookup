/* eslint-disable */
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import "../styles/raleway.css";
import "../styles/home.css"; // eslint-disable-line no-unused-vars
import { Nav } from "./nav";
import { fetchProducts, setKeyWords } from "../actions";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdateKeywords = this.handleUpdateKeywords.bind(this);
    this.state = {
      hasSearched: false
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.triggerSearchKeywords(this.props.keywords);
    if (!this.state.hasSearched) {
      this.setState({ hasSearched: true });
    }
  }

  handleUpdateKeywords(event) {
    this.props.triggerUpdateKeywords(event.target.value);
  }

  renderProducts() {
    if (Array.isArray(this.props.products) && this.props.products.length > 0) {
      return this.props.products.map((product, index) => 
        <div className="product-container group" key={index}>
          <h3 className="product-title">{product.name}</h3>
          <div className="product-desc">
            <div className="product-image product-desc-section">
              <img src="" alt={`${product.name}-image`} src={product.thumbnailImage}/>
            </div>
            <div className="product-desc-short product-desc-section">
              <p>{product.shortDescription}</p>
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    let searchFieldClass = "search-field-small";
    let productContainerClass = "product-store-container-border";

    if(!this.state.hasSearched) {
      searchFieldClass = "search-field-large";
      productContainerClass = "";
    }
    return (
      <div className="home-container">
        <form className="search-form" autoComplete="false" onSubmit={this.handleSubmit}>
          <Nav {...this.props} />
          <div className="search-container">
            <input
              type="text"
              placeholder=""
              id="keywordField"
              className={`search-field ${searchFieldClass}`}
              value={this.props.keywords}
              onChange={event => {
                  this.props.triggerUpdateKeywords(event.target.value);
              }}
            />
          </div>
        </form>
        <div className={`product-store-container ${productContainerClass}`}>
          {this.renderProducts()}
        </div>
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
