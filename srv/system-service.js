const cds = require("@sap/cds");

const SYSTEMS = {
  ECC: { service: "ECC_API", path: "/posts/1" },
  S4: { service: "S4_API", path: "/posts/2" },
};

module.exports = class FinanceService extends cds.ApplicationService {
  async init() {
    this.on("connectSystem", async (req) => {
        
      console.log(req.user.id);
      console.log(req.user.roles);
      const { system } = req.data;
      const cfg = SYSTEMS[system?.toUpperCase()];
      if (!cfg) {
        return req.reject({
          status: 400,
          code: "UNKNOWN_SYSTEM",
          message: `Unknown system '${system}'`,
          target: "system",
        });
      }

      const role = system.toUpperCase() === "ECC" ? "Admin" : "Viewer";
      if (!req.user.is(role)) {
        return req.reject({
          status: 403,
          code: "NO_SYSTEM_ACCESS",
          message: `No access to ${system}`,
        });
      }

      try {
        const api = await cds.connect.to(cfg.service);
        return await api.send({ method: "GET", path: cfg.path });
      } catch (e) {
        console.error("connectSystem failed:", e.message);
        return req.reject({
          status: 502,
          code: "REMOTE_UNAVAILABLE",
          message: `Could not reach ${system}`,
        });
      }
    });
    return super.init();
  }
};
