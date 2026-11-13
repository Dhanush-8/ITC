# Sales Order Portal UI

This is a standalone SAPUI5 application. It has its own dependencies and UI5 development server and does not participate in the CAP backend build.

## Run locally

1. Start the CAP backend separately from the repository root with `npm start`.
2. In this directory, install the UI dependencies with `npm install`.
3. Start the UI with `npm start` and open the URL printed by UI5 tooling.

The UI5 development server proxies `/sales` to `http://localhost:4004`. Change the `backend` URL in `ui5.yaml` when the backend runs elsewhere. The backend still enforces its configured authentication.

## Build

Run `npm run build` in this directory to create the deployable UI5 application in `dist`.
