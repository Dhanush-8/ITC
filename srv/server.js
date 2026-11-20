const cds = require("@sap/cds");
const cov2ap = require("@cap-js-community/odata-v2-adapter");

cds.env.cov2ap = cds.env.cov2ap || {};
cds.env.cov2ap.path = "odata/v2";
cds.env.cov2ap.targetPath = "odata/v4";

cds.on("bootstrap", (app) => {
  app.use(cov2ap.singleton());
});

module.exports = cds.server;