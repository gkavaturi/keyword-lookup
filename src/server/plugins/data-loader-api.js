import csv from "csvtojson";
import Promise from "bluebird";
import fetch from "node-fetch";
import _get from "lodash/get";
import _flatten from "lodash/flatten";
import _mergeWith from "lodash/mergeWith";
import WordPOS from "wordpos";

const PRODUCT_API_URL = "http://api.walmartlabs.com/v1/items/";
const API_KEY = "kjybrqfdgp3u4yv2qzcnjndj";

const itemIds = [
  14225185,
  14225186,
  14225188,
  14225187,
  39082884,
  30146244,
  12662817,
  34890820,
  19716431,
  42391766,
  35813552,
  40611708,
  40611825,
  36248492,
  44109840,
  23117408,
  35613901,
  42248076
]

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
    this.productData = [];
    this.wordpos = new WordPOS();
  }

  register(server, options, next) {
    server.route([{
        method: "GET",
        path: "/api/loadData",
        handler: this.loadData,
        config: {
          bind: this,
          description: "load data from file",
          tags: ["api", "file", "data", "loader"]
        }
      },{
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
          // console.log(elNormalized + " " + !isNaN(elNormalized));
          return !(comp.includes(elNormalized) 
            && !isNaN(elNormalized) //to remove numbers
            // && elNormalized.length > 2 //to remove most pronouns
            ) ? comp.concat(elNormalized) : comp;
        },[]);
        return {
          [itemId]: keywords
        };
    }).catch((err) => {
      console.log(err);
    });
  }

  parseData(values) {
    const flatValues = [].concat(values);
  
    return flatValues.reduce((parentStore, keywords) => {
      const itemId = Object.keys(keywords)[0];
      const values = keywords[itemId].reduce((localStore, localWord) => {
        if (Array.isArray(localStore[localWord])) {
          if (!localStore[localWord].includes(itemId)) {
            localStore[localWord].push(itemId);
          }
        } else {
          localStore[localWord] = [itemId];
        };
        return localStore;
      },{});

      return _mergeWith(parentStore, values,
                         (currValue, srcValue) => {
        if (Array.isArray(currValue)) {
          return currValue.concat(srcValue);
        }
      });
    }, {});
  }

  loadData(request, reply) {
    const productPromises = [];
    itemIds.forEach((itemId, index) => {
        const productPromise = new Promise((resolve, reject) => {
          setTimeout(() => {
            return fetch(`${PRODUCT_API_URL}${itemId}?format=json&apiKey=${API_KEY}`)
              .then((res) => res.json())
              .then((resPayload) => {
                resolve(this.extractKeywords(resPayload, itemId));
                return null;
              }).catch((err) => {
                reject(err);
              });
          }, 500*index);  
        });
        productPromises.push(productPromise);
    });

    Promise.all(productPromises)
      .then(function(values){
        this.productData = this.parseData(values);
        reply(this.productData);
      }.bind(this))
      .catch(function(error) { console.log(error); });
  }

  getProductsByKeyword(request, reply) {
    const keywords = request.query.keywords || "";
    const products = keywords.split(",").map((keyword) => {
      return this.productData[keyword];
    });
    reply(products);
  }
}

export default new DataLoaderApi();