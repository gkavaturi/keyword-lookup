import Promise from "bluebird";
import fetch from "node-fetch";
import Catbox from "catbox";
import catboxMemory from "catbox-memory";
import _get from "lodash/get";
import _flatten from "lodash/flatten";
import _mergeWith from "lodash/mergeWith";
import WordPos from "wordpos";
import defaultProductIds from "../data/sample-ids.json";

//create artifical delay to go around product api rate limiting
const TIMER_INVERVAL = 500;
const DATA_MISSING_ERR_MSG = "No data found";
const PRODUCT_API_URL = "http://api.walmartlabs.com/v1/items/";
const API_KEY = "kjybrqfdgp3u4yv2qzcnjndj";

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
    this.cache = new Catbox.Client(catboxMemory,{ partition: 'keywords'});
    this.cache.start().then(() => {
      console.log("Cache started");
    });
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
          return !(comp.includes(elNormalized) 
            && !isNaN(elNormalized) //to remove numbers
            ) ? comp.concat(elNormalized) : comp;
        },[]);
        return {
          [itemId]: keywords
        };
    }).catch((err) => {
      console.log(err);
    });
  }

  /*
  Parse data into keywords, product id pairs
  */
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
    defaultProductIds.forEach((itemId, index) => {
        const productPromise = new Promise((resolve, reject) => {
          setTimeout(() => {
            return fetch(`${PRODUCT_API_URL}${itemId}?format=json&apiKey=${API_KEY}`)
              .then((res) => res.json())
              .then((resPayload) => {
                resolve(this.extractKeywords(resPayload, itemId));
                return null;
              }).catch((err) => {
                reject(err);
                return null;
              });
          }, TIMER_INVERVAL*index);  
        });
        productPromises.push(productPromise);
    });

    Promise.all(productPromises)
      .then(function(values){
        const productData = this.parseData(values);
        //set 1 day cache for product data
        this.cache
          .set({segment: "keywords", id: "keywordStore"}, productData, 86400000)
          .then(() => { 
            console.log("Cache set for keyword store");
            reply(productData);
          })
          .catch((err) => {
            reply(`Unable to set cache for keyword store ${err}`);
          });
        
      }.bind(this))
      .catch(function(error) { console.log(error); });
  }

  async getProductsByKeyword(request, reply) {
    const keywords = request.query.keywords || "";
    const productData = await this.cache.get({segment: "keywords", id: "keywordStore"});
    
    if (!productData) {
      reply(DATA_MISSING_ERR_MSG);
    }

    const productIds = keywords.split(",").map((keyword) => {
      return productData.item[keyword];
    });

    const mergedProductsIds = [].concat(productIds).reduce((productIdStore, productId) => {
      if (!productIdStore.includes(productId)) {
        return productIdStore.concat(productId)
      } else {
        return productIdStore;
      }
    },[]);
    reply(mergedProductsIds);
  }
}

export default new DataLoaderApi();