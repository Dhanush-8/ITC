using itc.finance as db from '../db/finance-schema';

// ---------------------------------------------------------------------------
// API response types for the Payments sub-module.
// These are plain types: no entity, no table, no CSV seeding.
// ---------------------------------------------------------------------------

type PaymentDocumentRow : {
    fileName     : String(255);   // e.g. payment-advice-0001.pdf
    documentType : String(50);    // e.g. Payment Advice, Bank Receipt
    size         : Integer;       // bytes
    uploadedOn   : Timestamp;
};

type PaymentRow : {
    ID              : UUID;
    selected        : Boolean;      // checkbox (row selection) - UI only
    refNo           : String(30);   // Payment / Adjustment Ref. No.
    submittedOn     : Date;
    paymentType     : db.PaymentType;
    instrumentType  : db.InstrumentType;
    instrumentUtrNo : String(50);   // Instrument / UTR No.
    paymentDate     : Date;
    amount          : Decimal(15,2);
    currency        : String(5);
    documentCount   : Integer;      // Documents (list column)
    documents       : array of PaymentDocumentRow;
    status          : db.PaymentStatus;
    lastUpdated     : Timestamp;    // Last Updated
    remarks         : String(500);
};

service FinanceService @(path: '/finance') {

    // Payments overview list. Returns dummy data for now, ECC later.
    function getPayments() returns array of PaymentRow;

    // Single payment (detail page) by ID.
    function getPayment(ID: UUID) returns PaymentRow;

}
