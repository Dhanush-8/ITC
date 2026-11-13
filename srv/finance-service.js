const cds = require("@sap/cds");

module.exports = class FinanceService extends cds.ApplicationService {
  async init() {
    const { PaymentAdjustments } = cds.entities("itc.finance");

    // Bound action: streams the attached document of a payment / adjustment.
    this.on("downloadDocument", PaymentAdjustments, async (req) => {
      const { ID } = req.params[0] || {};
      if (!ID) return req.reject(400, "Payment / adjustment ID is required");

      const record = await SELECT.one
        .from(PaymentAdjustments)
        .columns("fileName", "fileType", "content")
        .where({ ID });

      if (!record || !record.content) {
        return req.reject(404, "No document attached to this payment / adjustment");
      }

      return record.content;
    });

    return super.init();
  }
};
