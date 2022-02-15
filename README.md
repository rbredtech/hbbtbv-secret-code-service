# Secret Key service for HbbTV apps

Simple REST service that when requested with the correct secret code responds
with a URL with access token.

## Get started

To configure the service create `config/local.json` file and add values from `config/default.json`.

Configure secret keys like:
```
"SECRET_KEYS": {
  "123456": "http://whatever.url.test/you-want"
}
```

Configure e.g. `PORT` and `ALLOW_ORIGIN` also.

Install dependencies with `npm install`.

To run during development use `npm run dev` or `npm run dev:watch`.

To run in production use `npm start`.

## Usage

### API Endpoints
* GET `/keys/:keys` - Responds with HTTP 200 and URL in body when correct key was given, with 404 not found otherwise.
