/* eslint-disable */
import { combineReducers } from "redux";
import { SEARCH_KEYWORD, UPDATE_KEYWORD, UPLOAD_PRODUCT, UPDATE_PRODUCT_IDS } from "../actions/index";

const defaultProductState = {
  keywords: "",
  products: []
};

const defaultUploadState = {
  uploadStatus: null,
  productIds: "",
  keywords: [],
  status: ""
};

const productStore = (state = defaultProductState, action) => {
  switch (action.type) {
    case SEARCH_KEYWORD:
      return {
        ...state,
        products: action.products
      };
    case UPDATE_KEYWORD:
      return {
        ...state,
        keywords: action.keywords
      };
    default:
      return state;
  }
};

const uploadStore = (state = defaultUploadState, action) => {
  switch (action.type) {
    case UPLOAD_PRODUCT:
      return {
        ...state,
        keywords: action.keywords,
        productIds: "",
        status: action.status
      };
    case UPDATE_PRODUCT_IDS:
      return {
        ...state,
        productIds: action.productIds,
        status: ""
      }
    default:
      return state;
  }
};

export default combineReducers({
  productStore,
  uploadStore
});
