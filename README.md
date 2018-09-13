# keyword-lookup electrode app
> lookup products based on keyword search

## Installation

```sh
$ npm install
```

## Usage

```sh
$ clap dev
```

## API
GET /api/get-products?keywords=<comma_separated>(&type=long)

Params
  - keywords are comma separated i.e., men, bike
  - type is optional. passing long gives back full product data, default response is productids

POST /api/loadProductData

Payload
  - productIds as a JSON array are optional. default product ids are read from a local json file

## UI features using the above APIs

Home
  - User can search for products based on keywords

Upload
  - User can submit product ids which will replace the server cache and can be searched via Home search bar

Technologies & Frameworks used

- Electrode
- Hapi
- Catbox-memory (for local caching)
- React

## Run Tests

```sh
$ npm test
```


## License

Apache-2.0 © [Gokul Kavaturi]()
