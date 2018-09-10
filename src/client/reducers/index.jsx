import { combineReducers } from "redux";
import { SEARCH_KEYWORD, UPLOAD_PRODUCT_IDS } from "../actions/index";

const productStore = (state = {}, action) => {
  switch (action.type) {
    case SEARCH_KEYWORD:
      return {
        ...state,
        keywords: action.keywords,
        productIds: action.productIds
      };
    case UPLOAD_PRODUCT_IDS:
      return {
        ...state,
        uploadProductIds: action.uploadProductIds,
        uploadStatus: "Success"
      };
    default:
      return state;
  }
};

export default combineReducers({
  productStore
});
