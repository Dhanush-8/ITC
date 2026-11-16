using itc.finance as db from '../db/finance-schema';

type PaymentDocumentRow : {
    fileName     : String(255);
    documentType : String(50);
    size         : Integer;
    uploadedOn   : Timestamp;
};

type PaymentRow : {
    ID              : UUID;
    selected        : Boolean;
    refNo           : String(30);
    submittedOn     : Date;
    paymentType     : db.PaymentType;
    instrumentType  : db.InstrumentType;
    instrumentUtrNo : String(50);
    paymentDate     : Date;
    amount          : Decimal(15,2);
    currency        : String(5);
    documentCount   : Integer;
    documents       : array of PaymentDocumentRow;
    status          : db.PaymentStatus;
    lastUpdated     : Timestamp;
    remarks         : String(500);
};

type InvoiceStatusRow : {
    ID                : UUID;
    selected          : Boolean;
    invoiceNo         : String(30);
    customer          : String(255);
    docNo             : String(30);
    docTypeName       : String(100);
    partialSettlement : Boolean;
    docType           : String(20);
    docDate           : Date;
    dueDate           : Date;
    paymentTerm       : String(100);
    docAmount         : Decimal(15,2);
    balanceAmount     : Decimal(15,2);
    currency          : String(5);
    overdue           : Integer;
};

service FinanceService @(path: '/finance') {

    function getPayments() returns array of PaymentRow;

    function getPayment(ID: UUID) returns PaymentRow;

    function getInvoiceStatuses() returns array of InvoiceStatusRow;

    function getInvoiceStatus(ID: UUID) returns InvoiceStatusRow;

}
