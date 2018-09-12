/* eslint-disable */
import { combineReducers } from "redux";
import { SEARCH_KEYWORD, UPDATE_KEYWORD, UPLOAD_PRODUCT_IDS } from "../actions/index";

const defaultState = {
  keywords: "",
  productIds: []
};

const productStore = (state = defaultState, action) => {
  switch (action.type) {
    case SEARCH_KEYWORD:
      return {
        ...state,
        productIds: action.productIds
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

// const uploadProductStore = (state = {}, action) => {
//   switch (action.type) {
//     case UPLOAD_PRODUCT_IDS:
//       return {
//         ...state,
//         uploadStatus: "Success"
//       };
//     default:
//       return state;
//   }
// };

export default combineReducers({
  productStore
});
