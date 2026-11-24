using itc.portal as db from '../db/portal';

@path    : '/portal'
@requires: 'authenticated-user'

service PortalService {

    type ErpOption {
        code    : String;
        label   : String;
        enabled : Boolean;
    }

    type MeResult {
        userId         : String;
        roles          : many String;
        modules        : many String; // drives the menu
        erpOptions     : many ErpOption; // dropdown content
        selectedErp    : String; // null when user must choose
        lastErp        : String; // pre-select hint
        needsSelection : Boolean; // true = show dropdown
    }

    function me()                returns MeResult;
    action   selectErp(erp : String) returns MeResult;


}
