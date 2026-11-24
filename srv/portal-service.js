const cds = require("@sap/cds");
const erp = require("./lib/erp-context");

module.exports = cds.service.impl(function () {
  // Builds the answer the UI needs after login
  // async function buildMe(req, chosenCode) {
  //   const allowed  = await erp.getAllowedErps(req);
  //   const allErps  = await SELECT.from('itc.portal.ErpSystems').where({ active: true }).orderBy('code');
  //   const profile  = await SELECT.one.from('itc.portal.UserProfiles').where({ userId: req.user.id });

  //   // Use the fresh choice, or the header (covers a page refresh)
  //   const selected = erp.pickErp(allowed, chosenCode ?? req.headers['x-erp']);

  //   return {
  //     userId:  req.user.id,
  //     roles:   Object.keys(req.user.roles),
  //     modules: erp.modulesFor(req.user),

  //     // Dropdown content: both ERPs always listed, only allowed ones enabled
  //     erpOptions: allErps.map(e => ({
  //       code:    e.code,
  //       label:   e.label,
  //       enabled: allowed.some(a => a.code === e.code)
  //     })),

  //     selectedErp:    selected ? selected.code : null,
  //     lastErp:        profile?.lastErp || null,
  //     needsSelection: selected === null            // true only when user has 2 ERPs and hasn't chosen
  //   };
  // }

  function buildMe(req, choosenCode) {
    const allowed = erp.getAllowedErps(req.user);
    const selected = erp.pickErp(allowed, chosenCode ?? req.headers["x-erp"]);

    return {
      userId: req.user.id,
      roles: Object.keys(req.user.roles),
      modules: erp.modulesFor(req.user),

      // Every configured system is listed; only allowed ones are enabled
      erpOptions: erp.configuredErps().map((e) => ({
        code: e.code,
        label: e.label,
        enabled: allowed.some((a) => a.code === e.code),
      })),

      selectedErp: selected ? selected.code : null,
      needsSelection: selected === null,
    };
  }

  // Called by the UI right after login
  this.on("me", (req) => buildMe(req));

  // Called when the user picks from the dropdown
  // this.on("setErp", async (req) => {
  //   const { erp: code } = req.data;
  //   const allowed = await erp.getAllowedErps(req);

  //   if (!allowed.some((e) => e.code === code)) {
  //     return req.reject(403, `ERP ${code} is not allowed for this user`);
  //   }

  //   // Remember the choice as a hint for next login
  //   await UPSERT.into("itc.portal.UserProfiles").entries({
  //     userId: req.user.id,
  //     lastErp: code,
  //   });

  //   cds.log("erp").info("ERP selected", { user: req.user.id, erp: code });
  //   return buildMe(req, code);
  // });

  // Called when the user picks from the dropdown: validates and logs, stores nothing
  this.on("selectErp", (req) => {
    const allowed = erp.getAllowedErps(req.user);
    const code = String(req.data.erp || "")
      .trim()
      .toUpperCase();

    if (!allowed.some((e) => e.code === code))
      return req.reject(
        403,
        `ERP ${req.data.erp} is not allowed for this user`,
      );

    cds.log("erp").info("ERP selected", { user: req.user.id, erp: code });
    return buildMe(req, code);
  });
});
