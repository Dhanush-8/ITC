const cds = require("@sap/cds");
const payments = require("./mock/payments");

module.exports = class FinanceService extends cds.ApplicationService {
  async init() {
    // -----------------------------------------------------------------------
    // Payments overview list (dummy data, no persistence)
    // -----------------------------------------------------------------------
    this.on("getPayments", () => payments.list());

    // -----------------------------------------------------------------------
    // Single payment for the detail page
    // -----------------------------------------------------------------------
    this.on("getPayment", (req) => {
      const { ID } = req.data || {};
      if (!ID) return req.reject(400, "Payment ID is required");

      const payment = payments.find(ID);
      if (!payment) return req.reject(404, `Payment ${ID} not found`);

      return payment;
    });

    return super.init();
  }
};
