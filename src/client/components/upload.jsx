import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Nav } from "./nav";
import { updateProductIds, uploadProducts } from "../actions";
import "../styles/upload.css"; // eslint-disable-line no-unused-vars

class Upload extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.handleUploadProductIds(this.props.productIds);
  }

  uploadSuccessMsg() {
    const msg = this.props.status === "Success" ? "Upload Success!!" : "";
    return (<p className="upload-status">{msg}</p>)
  }

  render() {
    const { dispatch } = this.props;
    return (
      <div className="upload-container">
        <Nav {...this.props} />
        <form className="upload-form" onSubmit={this.handleSubmit}>
          {this.uploadSuccessMsg()}
          <textarea
            placeholder="Enter comma or space separated product ids"
            id="commentField"
            className={"product-input"}
            value={this.props.productIds}
            onChange={event => this.props.handleUpdateProductIds(event.target.value)}
          />
          <input className="btn" type="submit" value="Upload" />
        </form>
      </div>
    );
  }
}

Upload.propTypes = {
  productIds: PropTypes.string,
  textarea: PropTypes.string,
  selectedOption: PropTypes.string,
  handleUpdateProductIds: PropTypes.func.isRequired,
  handleUploadProductIds: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    ...state.uploadStore
  };
};

const mapDispatchToProps = dispatch => ({
  handleUpdateProductIds: (productIds) => dispatch(updateProductIds(productIds)),
  handleUploadProductIds: (productIds) => dispatch(uploadProducts(productIds))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Upload);
