// ---------------------------------------------------------------------------
// Dummy data for the Payments sub-module.
// This file is the only place that needs to change when ECC integration lands:
// replace the rows below (or the two helpers) with the ECC response.
// ---------------------------------------------------------------------------

const rows = [
  {
    ID: "f0000000-0000-0000-0000-000000000001",
    refNo: "PAY-2026-0001",
    submittedOn: "2026-01-05",
    paymentType: "Advance",
    instrumentType: "RTGS",
    instrumentUtrNo: "RTGS202601050001",
    paymentDate: "2026-01-05",
    amount: "250000.00",
    currency: "INR",
    status: "Approved",
    lastUpdated: "2026-01-06T09:30:00.000Z",
    remarks: "Advance against PO 4500012345",
    documents: [
      {
        fileName: "payment-advice-0001.pdf",
        documentType: "Payment Advice",
        size: 193,
        uploadedOn: "2026-01-05T10:16:00.000Z",
      },
      {
        fileName: "bank-rtgs-receipt-0001.pdf",
        documentType: "Bank Receipt",
        size: 193,
        uploadedOn: "2026-01-05T12:40:00.000Z",
      },
    ],
  },
  {
    ID: "f0000000-0000-0000-0000-000000000002",
    refNo: "ADJ-2026-0002",
    submittedOn: "2026-01-08",
    paymentType: "Adjustment",
    instrumentType: "Bank Transfer",
    instrumentUtrNo: "BT202601080012",
    paymentDate: "2026-01-08",
    amount: "18500.50",
    currency: "INR",
    status: "Pending",
    lastUpdated: "2026-01-08T11:45:00.000Z",
    remarks: "Rate difference adjustment for Dec 2025",
    documents: [
      {
        fileName: "adjustment-note-0002.pdf",
        documentType: "Adjustment Note",
        size: 193,
        uploadedOn: "2026-01-08T11:50:00.000Z",
      },
    ],
  },
  {
    ID: "f0000000-0000-0000-0000-000000000003",
    refNo: "INV-2026-0003",
    submittedOn: "2026-01-10",
    paymentType: "Invoice",
    instrumentType: "NEFT",
    instrumentUtrNo: "NEFT202601100003",
    paymentDate: "2026-01-10",
    amount: "1250000.00",
    currency: "INR",
    status: "Submitted",
    lastUpdated: "2026-01-10T16:05:00.000Z",
    remarks: "Invoice payment against dispatch DN-77881",
    documents: [
      {
        fileName: "invoice-copy-0003.pdf",
        documentType: "Invoice Copy",
        size: 193,
        uploadedOn: "2026-01-10T08:25:00.000Z",
      },
      {
        fileName: "dispatch-note-0003.pdf",
        documentType: "Dispatch Note",
        size: 193,
        uploadedOn: "2026-01-10T08:30:00.000Z",
      },
    ],
  },
  {
    ID: "f0000000-0000-0000-0000-000000000004",
    refNo: "CN-2026-0004",
    submittedOn: "2026-01-12",
    paymentType: "Credit Note",
    instrumentType: "UPI",
    instrumentUtrNo: "UPI202601120004",
    paymentDate: "2026-01-12",
    amount: "42000.00",
    currency: "INR",
    status: "Approved",
    lastUpdated: "2026-01-14T10:10:00.000Z",
    remarks: "Credit note for short supply",
    documents: [
      {
        fileName: "credit-note-0004.pdf",
        documentType: "Credit Note",
        size: 193,
        uploadedOn: "2026-01-12T14:40:00.000Z",
      },
    ],
  },
  {
    ID: "f0000000-0000-0000-0000-000000000005",
    refNo: "DN-2026-0005",
    submittedOn: "2026-01-15",
    paymentType: "Debit Note",
    instrumentType: "Cheque",
    instrumentUtrNo: "CHQ445566",
    paymentDate: "2026-01-15",
    amount: "76000.25",
    currency: "INR",
    status: "Rejected",
    lastUpdated: "2026-01-18T12:00:00.000Z",
    remarks: "Cheque returned by bank",
    documents: [
      {
        fileName: "debit-note-0005.pdf",
        documentType: "Debit Note",
        size: 193,
        uploadedOn: "2026-01-15T09:10:00.000Z",
      },
      {
        fileName: "cheque-return-memo-0005.pdf",
        documentType: "Bank Memo",
        size: 193,
        uploadedOn: "2026-01-17T11:00:00.000Z",
      },
    ],
  },
  {
    ID: "f0000000-0000-0000-0000-000000000006",
    refNo: "PAY-2026-0006",
    submittedOn: "2026-01-20",
    paymentType: "Invoice",
    instrumentType: "RTGS",
    instrumentUtrNo: "RTGS202601200006",
    paymentDate: "2026-01-20",
    amount: "985000.00",
    currency: "INR",
    status: "Draft",
    lastUpdated: "2026-01-20T16:50:00.000Z",
    remarks: "Awaiting documents from dealer",
    // no documents: tests the empty state in the UI
    documents: [],
  },
  {
    ID: "f0000000-0000-0000-0000-000000000007",
    refNo: "ADJ-2026-0007",
    submittedOn: "2026-01-22",
    paymentType: "Adjustment",
    instrumentType: "Demand Draft",
    instrumentUtrNo: "DD778899",
    paymentDate: "2026-01-22",
    amount: "32750.75",
    currency: "INR",
    status: "Approved",
    lastUpdated: "2026-01-23T09:15:00.000Z",
    remarks: "Freight adjustment",
    documents: [
      {
        fileName: "adjustment-note-0007.pdf",
        documentType: "Adjustment Note",
        size: 193,
        uploadedOn: "2026-01-22T13:15:00.000Z",
      },
    ],
  },
  {
    ID: "f0000000-0000-0000-0000-000000000008",
    refNo: "PAY-2026-0008",
    submittedOn: "2026-01-25",
    paymentType: "Advance",
    instrumentType: "NEFT",
    instrumentUtrNo: "NEFT202601250008",
    paymentDate: "2026-01-25",
    amount: "500000.00",
    currency: "INR",
    status: "Pending",
    lastUpdated: "2026-01-25T07:40:00.000Z",
    remarks: "Advance for February requirement",
    documents: [
      {
        fileName: "payment-advice-0008.pdf",
        documentType: "Payment Advice",
        size: 193,
        uploadedOn: "2026-01-25T07:45:00.000Z",
      },
    ],
  },
];

// Return copies so one request cannot mutate the fixture.
const toApi = (row) => ({
  ...row,
  selected: false, // checkbox is UI state only
  documentCount: row.documents.length,
  documents: row.documents.map((document) => ({ ...document })),
});

const list = () => rows.map(toApi);

const find = (id) => {
  const row = rows.find((item) => item.ID === id || item.refNo === id);
  return row ? toApi(row) : undefined;
};

module.exports = { list, find };
