import Hapi from "hapi";
import sinon from "sinon";
import { expect } from "chai";
import fetch from "node-fetch";
import productDataPlugin from "../../../src/server/plugins/product-data-api";
import walmartProductApiMock from "../mock/load-mock.json";
import getProductsMock from "../mock/get-products.json";
import getProductsLongMock from "../mock/get-products-long.json";
import loadDataPayloadMock from "../mock/request-load-data-mock.json";
import productStoreData from "../mock/response-load-data-mock.json";
import parseDataInput from "../mock/parse-data-input.json";
import parseDataOutput from "../mock/parse-data-output.json";

import {
  SERVER_OK,
  TIMEOUT_INTERVAL
} from "../../../src/server/utils/constants.js";

describe("Validate product data api", () => {
  const server = new Hapi.Server();
  const sandbox = sinon.sandbox.create();

  before(() => {
    server.connection();
    return server.register(productDataPlugin);
  });

  describe("Validate load data", () => {

    it("should return api ok", (done) => {
      const request = {
        method: "POST",
        url: "/api/loadProductData"
      };
      server.inject(request).then(res => {
        expect(res.statusCode).to.equal(SERVER_OK);
        done();
      }).catch(err => { throw err; });
    }).timeout(TIMEOUT_INTERVAL);

    it("should return success for load data", (done) => {
      const request = {
        method: "POST",
        url: "/api/loadProductData",
        payload: JSON.stringify(loadDataPayloadMock)
      };

      sandbox.stub(fetch, "Promise").resolves({
        json: () => {
          return walmartProductApiMock;
        }
      });

      server.inject(request).then(res => {
        expect(JSON.parse(res.payload)).to.deep.equal(productStoreData);
        done();
      }).catch(err => { throw err; });
    }).timeout(TIMEOUT_INTERVAL);

    it("should parse data as expected", (done) => {
      expect(productDataPlugin.parseData(parseDataInput)).to.deep.equal(parseDataOutput);
      done();
    });

  });

  describe("Validate get data", () => {

    it("should return api ok", (done) => {
      const request = {
        method: "GET",
        url: "/api/get-products"
      };

      server.inject(request).then(res => {
        expect(res.statusCode).to.equal(SERVER_OK);
        done();
      }).catch(err => {
        throw err;
      });
    });

    it("should return product ids for get products", (done) => {
      const request = {
        method: "GET",
        url: "/api/get-products?keywords=bedding,sleep"
      };

      server.inject(request).then(res => {
        expect(JSON.parse(res.payload)).to.deep.equal(getProductsMock);
        done();
      }).catch(err => {
        throw err;
      });
    }).timeout(TIMEOUT_INTERVAL);

    it("should return product ids for long form get products", (done) => {
      const request = {
        method: "GET",
        url: "/api/get-products?keywords=bedding,sleep&type=long"
      };

      server.inject(request).then(res => {
        expect(JSON.parse(res.payload)).to.deep.equal(getProductsLongMock);
        done();
      }).catch(err => {
        throw err;
      });
    }).timeout(TIMEOUT_INTERVAL);
  });

  afterEach(() => {
    sandbox.restore();
  });

});
