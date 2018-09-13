import fetch from "node-fetch";

export const SEARCH_KEYWORD = "SEARCH_KEYWORD";

export const UPLOAD_PRODUCT_IDS = "UPLOAD_PRODUCT_IDS";

export const UPDATE_KEYWORD = "UPDATE_KEYWORD";

const SEARCH_URL = "/api/get-product";

export const inputProductIds = value => {
  return {
    type: UPLOAD_PRODUCT_IDS,
    value
  };
};

export const setKeyWords = (keywords) => {
 return (dispatch) => {
    dispatch({
      type: UPDATE_KEYWORD,
      keywords
    });
  };
};

export const fetchProducts = (keywords) => {
 return (dispatch) => {
    fetch(`${SEARCH_URL}?keywords=${keywords}&type=long`)
      .then(res => res.json())
      .then(body => {
        dispatch({
          type: SEARCH_KEYWORD,
          products: body.products
        });
      })
      .catch(error => {
        dispatch({
          type: SEARCH_KEYWORD,
          error
        });
      });
  };
};

export default {
  setKeyWords,
  fetchProducts
};
