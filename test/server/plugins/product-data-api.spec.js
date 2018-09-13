import Hapi from "hapi";
import sinon from "sinon";
import { expect } from "chai";
import fetch from "node-fetch";
import productDataPlugin from "../../../src/server/plugins/product-data-api";
import walmartProductApiMock from "../mock/load-mock.json";
import getProductsMock from "../mock/get-products.json";
import loadDataPayloadMock from "../mock/request-load-data-mock.json";
import productStoreData from "../mock/response-load-data-mock.json";

import {
  SERVER_OK
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
    }).timeout(10000); //eslint-disable-line

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
    }).timeout(5000); //eslint-disable-line
  });

  describe("Validate get data", () => {

    it("should return api ok", (done) => {
      const request = {
        method: "GET",
        url: "/api/get-product"
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
        url: "/api/get-product?keywords=bedding,sleep"
      };

      server.inject(request).then(res => {
        expect(JSON.parse(res.payload)).to.deep.equal(getProductsMock);
        done();
      }).catch(err => {
        throw err;
      });
    }).timeout(5000); //eslint-disable-line
  });

  afterEach(() => {
    sandbox.restore();
  });

});
