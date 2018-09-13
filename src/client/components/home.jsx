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
    this.state = {
      searchActive: false
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.handleSearchKeywords(this.props.keywords);
    if (!this.state.searchActive) {
      this.setState({ searchActive: true });
    }
  }

  renderProducts() {
    if (Array.isArray(this.props.products) && this.props.products.length > 0) {
      return this.props.products.map((product, index) => 
        <div className="product-container" key={index}>
          <h3 className="product-title">{product.name}</h3>
          <div className="product-desc group">
            <div className="product-image-wrapper product-desc-section">
              <img className="product-image" src="" alt={`${product.name}-image`} src={product.thumbnailImage}/>
            </div>
            <div className="product-desc-short product-desc-section">
              <p>{product.shortDescription}</p>
            </div>
          </div>
        </div>
      );
    }
  }

  renderSubheading() {
    if (this.state.searchActive && this.props.products) {
      const endS = this.props.products.length === 1 ? "" : "s";
      return (<div className="sub-heading">
        <h4 className="sub-heading-text">Showing {this.props.products.length} result{endS} </h4>
      </div>);
    }
  }

  render() {
    let searchFieldClass = "search-field-small";
    
    if(!this.state.searchActive) {
      searchFieldClass = "search-field-large";
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
              placeholder="Search using keywords"
              className={`search-field ${searchFieldClass}`}
              value={this.props.keywords}
              onChange={event => this.props.handleUpdateKeywords(event.target.value)}
            />
          </div>
        </form>
        {this.renderSubheading()}
        <div className="product-store-container">
          {this.renderProducts()}
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  keywords: PropTypes.string,
  handleUpdateKeywords: PropTypes.func.isRequired,
  handleSearchKeywords: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    ...state.productStore
  }
};

const mapDispatchToProps = dispatch => ({
  handleUpdateKeywords: (keywords) => dispatch(setKeyWords(keywords)),
  handleSearchKeywords: (keywords) => dispatch(fetchProducts(keywords))
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Home));
