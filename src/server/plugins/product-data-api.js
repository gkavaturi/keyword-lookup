import Promise from "bluebird";
import fetch from "node-fetch";

import Catbox from "catbox";
import catboxMemory from "catbox-memory";
import _get from "lodash/get";
import _flatten from "lodash/flatten";
import _mergeWith from "lodash/mergeWith";
import WordPos from "wordpos";
import logger from "electrode-ui-logger";

import defaultProductIds from "../data/sample-ids.json";
import {
  API_TIMER_INVERVAL,
  PRODUCT_API_URL,
  PRODUCT_API_KEY,
  SUCCESS_STATUS,
  ERROR_STATUS,
  ONE_DAY
} from "../utils/constants.js";

class DataLoaderApi {
  constructor() {
    fetch.Promise = Promise;

    this.register = this.register.bind(this);
    this.loadData = this.loadData.bind(this);
    this.extractKeywords = this.extractKeywords.bind(this);

    this.register.attributes = {
      name: "FileLoaderApi",
      version: "1.0.0"
    };
    this.wordpos = new WordPos();
    this.cache = new Catbox.Client(catboxMemory, {partition: "keywords"});
    this.cache.start().then(() => {
      logger.info("Cache started");
    });
  }

  register(server, options, next) {
    server.route([{
        method: "POST",
        path: "/api/loadData",
        handler: this.loadData,
        config: {
          bind: this,
          description: "load data from file",
          tags: ["api", "file", "data", "loader"]
        }
      }, {
        method: "GET",
        path: "/api/get-product",
        handler: this.getProductsByKeyword,
        config: {
          bind: this,
          description: "get products matching keywords",
          tags: ["api", "keyword", "product", "search"]
        }
      }]);
    next();
  }

  /*
  Extract keywords using wordpos library and normalize them
  */
  extractKeywords(resPayload, itemId) {
    const shortDesc = _get(resPayload, "shortDescription");
    const longDesc = _get(resPayload, "longDescription");
    const promiseS = shortDesc ? this.wordpos.getNouns(shortDesc) : [];
    const promiseL = longDesc ? this.wordpos.getNouns(longDesc) : [];

    return Promise.all([promiseS, promiseL]).then((values) => {
        const keywords = _flatten(values).reduce((comp, el) => {
          const elNormalized = el.toLowerCase();
          return !(comp.includes(elNormalized)
            && !isNaN(elNormalized)) //to remove numbers
            ? comp.concat(elNormalized) : comp;
        }, []);
        return {
          [itemId]: keywords
        };
    }).catch((err) => {
      throw err;
    });
  }

  /*
  Parse data into keywords, product id pairs
  */
  parseData(values) {
    const flatValues = [].concat(values);

    return flatValues.reduce((parentStore, keywords) => {
      const itemId = Object.keys(keywords)[0];
      const localValues = keywords[itemId].reduce((localStore, localWord) => {
        if (Array.isArray(localStore[localWord])) {
          if (!localStore[localWord].includes(itemId)) {
            localStore[localWord].push(itemId);
          }
        } else {
          localStore[localWord] = [itemId];
        }
        return localStore;
      }, {});

      return _mergeWith(parentStore, localValues,
                         (currValue, srcValue) => {
          return currValue.concat(srcValue);
      });
    }, {});
  }

  loadData(request, reply) {
    const productPromises = [];
    const productIds = Array.isArray(request.payload) ? request.payload : defaultProductIds;

    productIds.forEach((itemId, index) => {
        const productPromise = new Promise((resolve, reject) => {
          //create artifical delay to go around product api rate limiting
          setTimeout(() => {
            return fetch(`${PRODUCT_API_URL}${itemId}?format=json&apiKey=${PRODUCT_API_KEY}`)
              .then((res) => res.json())
              .then((resPayload) => {
                resolve(this.extractKeywords(resPayload, itemId));
                return null;
              }).catch((err) => {
                reject(err);
                return null;
              });
          }, API_TIMER_INVERVAL * index);
        });
        productPromises.push(productPromise);
    });

    Promise.all(productPromises)
      .then((values) => {
        const productData = this.parseData(values);
        const responsePayload = {
          status: SUCCESS_STATUS,
          payload: productData
        };

        //set 1 day cache for product data
        this.cache
          .set({segment: "keywords", id: "keywordStore"}, productData, ONE_DAY)
          .then(() => {
            logger.info("Cache set for keyword store");
            reply(responsePayload);
          })
          .catch((err) => {
            reply({
              status: ERROR_STATUS,
              error: `Unable to set cache for keyword store ${err}`
            });
          });
      })
      .catch((err) => {
        logger.error(err);
        reply({
          status: ERROR_STATUS,
          error: `Unable to populate keyword store ${err}`
        });
      });
  }

  async getProductsByKeyword(request, reply) {
    const keywords = request.query.keywords || "";
    const productData = await this.cache.get({segment: "keywords", id: "keywordStore"});

    if (!productData) {
      reply({
        status: ERROR_STATUS,
        error: "Cache for keyword store is empty",
        productIds: []
      });
    }

    const productIds = keywords.split(",").map((keyword) => {
      return productData.item[keyword];
    });

    const mergedProductIds = [].concat([], productIds)
      .reduce((productIdStore, productId) => {
        if (!productIdStore.includes(productId)) {
          return productIdStore.concat(productId);
        } else {
          return productIdStore;
        }
      }, []);

    reply({
      status: SUCCESS_STATUS,
      error: "",
      productIds: mergedProductIds
    });
  }
}

export default new DataLoaderApi();
