import fetch from "node-fetch";

export const SEARCH_KEYWORD = "SEARCH_KEYWORD";

export const UPLOAD_PRODUCT_IDS = "UPLOAD_PRODUCT_IDS";

const SEARCH_URL = "/api/get-product";

export const inputProductIds = value => {
  return {
    type: "UPLOAD_PRODUCT_IDS",
    value
  };
};

export const searchKeyword = value => {
  return {
    type: SEARCH_KEYWORD,
    value
  };
};

export const fetchProducts = (keywords) => {
   return (dispatch) => {
    fetch(`${SEARCH_URL}?keywords=${keywords}`)
      .then((response) => {
        dispatch({
          type: SEARCH_KEYWORD,
          products: response.productIds
        });
      })
      .catch((error) => {
        dispatch({
          type: SEARCH_KEYWORD,
          error
        });
      });
  };
};
