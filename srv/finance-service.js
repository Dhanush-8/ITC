const cds = require("@sap/cds");
const payments = require("./mock/payments");
const invoiceStatus = require("./mock/invoice-status");
const claims = require("./mock/claims");

module.exports = class FinanceService extends cds.ApplicationService {
  async init() {
    this.on("getPayments", () => payments.list());

    this.on("getPayment", (req) => {
      const { ID } = req.data || {};
      if (!ID) return req.reject(400, "Payment ID is required");

      const payment = payments.find(ID);
      if (!payment) return req.reject(404, `Payment ${ID} not found`);

      return payment;
    });

    this.on("getInvoiceStatuses", () => invoiceStatus.list());

    this.on("getInvoiceStatus", (req) => {
      const { ID } = req.data || {};
      if (!ID) return req.reject(400, "Invoice ID is required");

      const invoice = invoiceStatus.find(ID);
      if (!invoice) return req.reject(404, `Invoice ${ID} not found`);

      return invoice;
    });

    this.on("getClaims", () => claims.list());

    this.on("getClaim", (req) => {
      const { ID } = req.data || {};
      if (!ID) return req.reject(400, "Claim ID is required");

      const claim = claims.find(ID);
      if (!claim) return req.reject(404, `Claim ${ID} not found`);

      return claim;
    });

    return super.init();
  }
};
