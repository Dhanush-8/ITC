namespace itc.portal;


// The ERP systems that exist (PSPD, LALCO)
entity ErpSystems {
    key code        : String(10); // PSPD, LALCO
        label       : String(40);
        destination : String(60); // BTP destination name for this ERP
        active      : Boolean default true;
}

// One row per user
entity UserProfiles {
  key userId : String(255);      // must match req.user.id from the token
  email      : String(255);
  lastErp    : String(10);       // last choice, only to pre-select the dropdown
  erpAccess  : Composition of many UserErpAccess on erpAccess.profile = $self;
}


// Which ERPs a user may use. 1 row = auto-route, 2 rows = dropdown.
entity UserErpAccess {
  key profile : Association to UserProfiles;
  key erp     : Association to ErpSystems;
}


// One-row switch for the future S/4HANA consolidation
entity PortalSettings {
  key ID                  : Integer default 1;
  erpConsolidated         : Boolean default false;
  consolidatedDestination : String(60);        // e.g. ERP_S4
}
