import Hapi from "hapi";
import sinon from "sinon";
import { expect } from "chai";
import fetch from "node-fetch";
import productDataPlugin from "../../../src/server/plugins/product-data-api";
import walmartProductApiMock from "../mock/load-mock.json";
// import productStoreData from "../mock/response-data-mock.json";

const SERVER_OK = 200;

describe("Validate product data api", () => {
  const server = new Hapi.Server();
  const sandbox = sinon.sandbox.create();

  before(() => {
    server.connection();
    return server.register(productDataPlugin);
  });

  describe("Validate load data", () => {

    beforeEach(() => {
      sinon.stub(fetch, "Promise")
        .resolves({
          json: () => {
            return Promise.resolve(walmartProductApiMock);
          }
        });
    });

    it("should return valid response", (done) => {
      const request = {
        method: "POST",
        url: "/api/loadProductData"
      };

      server.inject(request).then(res => {
        expect(res.statusCode).to.equal(SERVER_OK);
      }).catch((err) => {
        throw err;
      });
    });

    it("should return success for loadData", async () => {
      const request = {
        method: "POST",
        url: "/api/loadProductData"
      };

      server.inject(request).then((res) => {
        expect(JSON.parse(res.payload)).to.deep.equal(productStoreData);
      }).catch((err) => {
        throw err;
      });
    });
  });

  describe("Validate get data", () => {
    it("should return valid response", () => {
      const request = {
        method: "GET",
        url: "/api/get-product"
      };

      server.inject(request).then(res => {
        expect(res.statusCode).to.equal(SERVER_OK);
      }).catch((err) => {
        throw err;
      });
    });
  });

  afterEach(() => {
    sandbox.restore();
  });
});
