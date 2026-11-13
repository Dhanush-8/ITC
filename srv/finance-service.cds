using itc.finance as db from '../db/finance-schema';

service FinanceService @(path: '/finance') {

    entity PaymentAdjustments as projection on db.PaymentAdjustments
    actions {
        action downloadDocument() returns LargeBinary;
    };

}
