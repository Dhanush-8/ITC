namespace itc.finance;

using { cuid, managed } from '@sap/cds/common';


type PaymentType : String(30) enum {
    ADVANCE     = 'Advance';
    INVOICE     = 'Invoice';
    ADJUSTMENT  = 'Adjustment';
    CREDIT_NOTE = 'Credit Note';
    DEBIT_NOTE  = 'Debit Note';
}

type InstrumentType : String(30) enum {
    RTGS          = 'RTGS';
    NEFT          = 'NEFT';
    UPI           = 'UPI';
    CHEQUE        = 'Cheque';
    DD            = 'Demand Draft';
    BANK_TRANSFER = 'Bank Transfer';
    ADJUSTMENT    = 'Adjustment';
}

type PaymentStatus : String(20) enum {
    DRAFT     = 'Draft';
    SUBMITTED = 'Submitted';
    PENDING   = 'Pending';
    APPROVED  = 'Approved';
    REJECTED  = 'Rejected';
}

// ---------------------------------------------------------------------------
// Payment / Adjustment
// ---------------------------------------------------------------------------

entity PaymentAdjustments : cuid, managed {

    refNo            : String(30) not null;   // Payment / Adjustment Ref No
    submittedOn      : Timestamp;             // Submitted On

    paymentType      : PaymentType;           // Payment Type
    instrumentType   : InstrumentType;        // Instrument Type
    instrumentUtrNo  : String(50);            // Instrument UTR No

    paymentDate      : Date;                  // Payment Date
    amount           : Decimal(15,2);         // Amount
    currency         : String(5) default 'INR';

    // Documents (single attachment, same pattern as SalesOrders)
    fileName         : String(255);
    fileType         : String(100) @Core.IsMediaType;
    content          : LargeBinary @Core.MediaType: fileType
                                   @Core.ContentDisposition.FileName: fileName;

    status           : PaymentStatus;         // Status
    remarks          : String(500);

}
