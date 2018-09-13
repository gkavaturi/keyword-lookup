import React from "react";
import ReactDOM from "react-dom";
import Upload from "client/components/upload";
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "client/reducers";
import { BrowserRouter } from "react-router-dom";

describe("Upload", () => {
  let component;
  let container;

  beforeEach(() => {
    container = document.createElement("div");
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
  });

  it("has expected content with deep render", () => {
    const initialState = {
      uploadStore: {}
    };

    const store = createStore(rootReducer, initialState);

    component = ReactDOM.render(
      <Provider store={store}>
        <BrowserRouter>
          <Upload />
        </BrowserRouter>
      </Provider>,
      container
    );

    expect(component).to.not.be.false;
  });
});
