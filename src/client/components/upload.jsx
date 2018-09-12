import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Nav } from "./nav";
import { inputTextarea } from "../actions";
import custom from "../styles/custom.css"; // eslint-disable-line no-unused-vars
import uploadStyle from "../styles/upload.css"; // eslint-disable-line no-unused-vars

class Demo1 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: { value: "" },
      textarea: { value: "" },
      selectedOption: { value: "0-13" }
    };
  }

  render() {
    const { dispatch } = this.props;
    return (
      <div styleName={"custom.container"}>
        <Nav {...this.props} />
        <form>
          <div styleName={"uploadStyle.container"}>
            <textarea
              placeholder="Enter comma or space separated product ids"
              id="commentField"
              styleName={"uploadStyle.product-input"}
              value={this.props.textarea}
              onChange={event => dispatch(inputTextarea(event.target.value))}
            />
            <input type="submit" value="Upload" />
          </div>
        </form>
      </div>
    );
  }
}

Demo1.propTypes = {
  username: PropTypes.string,
  textarea: PropTypes.string,
  selectedOption: PropTypes.string,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    uploadProductIds: state.uploadProductIds
  };
};

export default connect(
  mapStateToProps,
  dispatch => ({ dispatch })
)(Demo1);
