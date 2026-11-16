namespace itc.finance;

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
