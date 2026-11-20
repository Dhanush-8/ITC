// This file only answers three questions: which ERPs can this user use,
//  which one is selected, and which modules does the role get.

const cds = require("@sap/cds");
const { SELECT } = require("@sap/cds/lib/ql/cds-ql");

const fail = (code, message) => Object.assign(new Error(message), { code });

const MODULE_MAP = {
  // role → menu modules
  SalesUser: ["sales"],
  Dealer: ["sales"],
  PlanningUser: ["planning"],
  FinanceUser: ["finance"],
  Admin: ["sales", "planning", "finance", "admin"],
};

// Question 1: which ERPs can this user use?

async function getAllowedErps(req) {
  // After consolidation there is only one system for everybody
  if (settings?.erpConsolidated) {
    return [
      {
        code: "S4",
        label: "S/4HANA",
        destination: settings.consolidatedDestination,
      },
    ];
  }

  // Otherwise read the user's rows from UserErpAccess
  const rows = await SELECT.from("itc.portal.UserErpAccess")
    .columns("erp_code")
    .where({ profile_userId: req.user.id });

  if (rows.length === 0)
    throw fail(403, "No ERP access configured for this user");

  const codes = rows.map((r) => r.erp_code);

  return SELECT.from("itc.portal.ErpSystems").where({
    code: { in: codes },
    active: true,
  });

  // Question 2: which ERP is selected?
  //   - only one allowed          → that one, automatically
  //   - more than one allowed     → the one the user chose (must be in the allowed list)
  //   - nothing valid chosen yet  → null (user must pick)

  function pickErp(allowedErps, chosenCode) {
    if (allowedErps.length === 1) return allowedErps[0];
    return allowedErps.find((e) => e.code === chosenCode) || null;
  }

  // Used by business services (sales, finance...) on every request
  async function resolveErp(req) {
    const allowed = await getAllowedErps(req);
    const chosen = req.headers["x-erp"]; // sent by the UI after selection
    if (allowed.length > 1 && !chosen)
      throw fail(428, "Please select an ERP first");
    const erp = pickErp(allowed, chosen);
    if (!erp) throw fail(403, `ERP ${chosen} is not allowed for this user`);
    return erp;
  }

  // Question 3: which modules does this user's role get?
  function modulesFor(user) {
    const modules = [];
    for (const [role, mods] of Object.entries(MODULE_MAP)) {
      if (user.is(role)) {
        modules.push(...mods);
      }
    }
  }

  module.exports = { getAllowedErps, pickErp, resolveErp, modulesFor };
}
