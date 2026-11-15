# Finance – Payments API (mock)

Mock response for the **Payments** sub-module of the Finance module.

There is **no entity / database table** behind this. The service exposes CDS
`type`s and returns hardcoded dummy data. When ECC integration is ready, only
`srv/mock/payments.js` (or the two handlers in `srv/finance-service.js`)
changes — the URL and JSON shape below stay the same.

| Item | Value |
| --- | --- |
| Service | `FinanceService` |
| Base URL (local) | `http://localhost:4004/finance` |
| Protocol | OData V4 |

> Functions must be called with `()`.

---

## 1. Payments overview list

```http
GET /finance/getPayments()
```

### Response `200`

```json
{
  "@odata.context": "$metadata#Collection(PaymentRow)",
  "value": [
    {
      "ID": "f0000000-0000-0000-0000-000000000001",
      "refNo": "PAY-2026-0001",
      "submittedOn": "2026-01-05",
      "paymentType": "Advance",
      "instrumentType": "RTGS",
      "instrumentUtrNo": "RTGS202601050001",
      "paymentDate": "2026-01-05",
      "amount": "250000.00",
      "currency": "INR",
      "status": "Approved",
      "lastUpdated": "2026-01-06T09:30:00.000Z",
      "remarks": "Advance against PO 4500012345",
      "documents": [
        {
          "fileName": "payment-advice-0001.pdf",
          "documentType": "Payment Advice",
          "size": 193,
          "uploadedOn": "2026-01-05T10:16:00.000Z"
        },
        {
          "fileName": "bank-rtgs-receipt-0001.pdf",
          "documentType": "Bank Receipt",
          "size": 193,
          "uploadedOn": "2026-01-05T12:40:00.000Z"
        }
      ],
      "selected": false,
      "documentCount": 2
    }
  ]
}
```

The response contains **8 dummy payments** covering every status
(`Draft`, `Submitted`, `Pending`, `Approved`, `Rejected`). One of them
(`PAY-2026-0006`) has `"documentCount": 0` and `"documents": []` for the
empty-state case.

---

## 2. Single payment (detail page)

```http
GET /finance/getPayment(ID=f0000000-0000-0000-0000-000000000002)
```

### Response `200`

```json
{
  "@odata.context": "$metadata#PaymentRow",
  "ID": "f0000000-0000-0000-0000-000000000002",
  "refNo": "ADJ-2026-0002",
  "submittedOn": "2026-01-08",
  "paymentType": "Adjustment",
  "instrumentType": "Bank Transfer",
  "instrumentUtrNo": "BT202601080012",
  "paymentDate": "2026-01-08",
  "amount": "18500.50",
  "currency": "INR",
  "status": "Pending",
  "lastUpdated": "2026-01-08T11:45:00.000Z",
  "remarks": "Rate difference adjustment for Dec 2025",
  "documents": [
    {
      "fileName": "adjustment-note-0002.pdf",
      "documentType": "Adjustment Note",
      "size": 193,
      "uploadedOn": "2026-01-08T11:50:00.000Z"
    }
  ],
  "selected": false,
  "documentCount": 1
}
```

Unknown ID returns `404`:

```json
{
  "error": {
    "message": "Payment f0000000-0000-0000-0000-000000000099 not found",
    "code": "404",
    "@Common.numericSeverity": 4
  }
}
```

---

## Column mapping

| # | UI column | JSON field | Type / notes |
| --- | --- | --- | --- |
| 1 | Checkbox (Row Selection) | `selected` | Boolean, always `false` (UI-only, use `selectionMode="Multi"`) |
| 2 | Payment / Adjustment Ref. No. | `refNo` | String, e.g. `PAY-2026-0001` |
| 3 | Submitted On | `submittedOn` | Date, `YYYY-MM-DD` |
| 4 | Payment Type | `paymentType` | Enum: Advance, Invoice, Adjustment, Credit Note, Debit Note |
| 5 | Instrument Type | `instrumentType` | Enum: RTGS, NEFT, UPI, Cheque, Demand Draft, Bank Transfer, Adjustment |
| 6 | Instrument / UTR No. | `instrumentUtrNo` | String |
| 7 | Payment Date | `paymentDate` | Date, `YYYY-MM-DD` |
| 8 | Amount | `amount` | Decimal **serialized as string** (`"250000.00"`), currency in `currency` |
| 9 | Documents | `documentCount` | Integer (list column). Full list in `documents[]` |
| 10 | Status | `status` | Enum: Draft, Submitted, Pending, Approved, Rejected |
| 11 | Last Updated | `lastUpdated` | Timestamp, ISO-8601 UTC |
| 12 | Action | – | UI action (e.g. download/approve); no backend field for now |

Extra fields: `ID`, `currency`, `remarks`.

Note: `amount` comes back as a **string** because it is a decimal — keep it as a
string end-to-end and format it only for display.

---

## Files

| File | Purpose |
| --- | --- |
| `db/finance-schema.cds` | Enums only (`PaymentType`, `InstrumentType`, `PaymentStatus`) |
| `srv/finance-service.cds` | `PaymentRow` / `PaymentDocumentRow` types + functions |
| `srv/finance-service.js` | Handlers returning the dummy data |
| `srv/mock/payments.js` | The dummy data (replace this with the ECC call later) |

Run locally with `npm start` (or `npx cds-serve`) and call
`http://localhost:4004/finance/getPayments()`.
