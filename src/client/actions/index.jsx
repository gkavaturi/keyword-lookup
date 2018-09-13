import fetch from "node-fetch";

export const SEARCH_KEYWORD = "SEARCH_KEYWORD";

export const UPLOAD_PRODUCT = "UPLOAD_PRODUCT";

export const UPDATE_PRODUCT_IDS = "UPDATE_PRODUCT_IDS";

export const UPDATE_KEYWORD = "UPDATE_KEYWORD";

const SEARCH_URL = "/api/get-products";
const UPLOAD_URL = "/api/loadProductData";

export const updateProductIds = productIds => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_PRODUCT_IDS,
      productIds
    });
  };
};

export const uploadProducts = value => {
  const productIds = value.split(/,|\s+|\n/);
  return (dispatch) => {
    fetch(UPLOAD_URL, {
        method: "POST",
        body: JSON.stringify(productIds),
        headers: { "Content-Type": "application/json" }
    })
    .then(res => res.json())
    .then(body => {
      dispatch({
        type: UPLOAD_PRODUCT,
        keywords: body.payload,
        status: body.status
      });
    })
    .catch(error => {
      dispatch({
        type: UPLOAD_PRODUCT,
        status: error
      });
    });
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
  fetchProducts,
  uploadProducts,
  updateProductIds
};
