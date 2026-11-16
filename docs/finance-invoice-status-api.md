# Finance – Invoice Status API (mock)

Mock response for the **Invoice Status** sub-module of the Finance module.

There is **no entity / database table** behind this. The service exposes a CDS
`type` and returns hardcoded dummy data. When ECC / S4 integration is ready,
only `srv/mock/invoice-status.js` (or the two handlers in
`srv/finance-service.js`) changes — the URL and JSON shape below stay the same.

| Item | Value |
| --- | --- |
| Service | `FinanceService` |
| Base URL (local) | `http://localhost:4004/finance` |
| Protocol | OData V4 |

> Functions must be called with `()`.

---

## 1. Invoice Status overview list

```http
GET /finance/getInvoiceStatuses()
```

### Response `200`

```json
{
  "@odata.context": "$metadata#Collection(InvoiceStatusRow)",
  "value": [
    {
      "ID": "a0000000-0000-0000-0000-000000000001",
      "invoiceNo": "5100000001",
      "customer": "Customer A",
      "docNo": "1800000001",
      "docTypeName": "Invoice",
      "partialSettlement": false,
      "docType": "RV",
      "docDate": "2026-11-01",
      "dueDate": "2026-12-01",
      "paymentTerm": "Net 30",
      "docAmount": "1250000.00",
      "balanceAmount": "1250000.00",
      "currency": "INR",
      "overdue": 0,
      "selected": false
    },
    {
      "ID": "a0000000-0000-0000-0000-000000000002",
      "invoiceNo": "5100000002",
      "customer": "Customer B",
      "docNo": "1800000002",
      "docTypeName": "Invoice",
      "partialSettlement": true,
      "docType": "RV",
      "docDate": "2026-09-15",
      "dueDate": "2026-10-15",
      "paymentTerm": "Net 30",
      "docAmount": "980000.00",
      "balanceAmount": "420000.00",
      "currency": "INR",
      "overdue": 32,
      "selected": false
    }
  ]
}
```

The response contains **8 dummy rows** covering: not-yet-due, partially
settled, fully paid (`balanceAmount: "0.00"`), heavily overdue, credit memo
(negative amounts), debit memo, and no-overdue-with-partial-settlement.

---

## 2. Single invoice status row (detail page)

```http
GET /finance/getInvoiceStatus(ID=a0000000-0000-0000-0000-000000000002)
```

The `ID` may also be the invoice number (`5100000002`).

### Response `200`

```json
{
  "@odata.context": "$metadata#InvoiceStatusRow",
  "ID": "a0000000-0000-0000-0000-000000000002",
  "invoiceNo": "5100000002",
  "customer": "Customer B",
  "docNo": "1800000002",
  "docTypeName": "Invoice",
  "partialSettlement": true,
  "docType": "RV",
  "docDate": "2026-09-15",
  "dueDate": "2026-10-15",
  "paymentTerm": "Net 30",
  "docAmount": "980000.00",
  "balanceAmount": "420000.00",
  "currency": "INR",
  "overdue": 32,
  "selected": false
}
```

Unknown ID returns `404`:

```json
{
  "error": {
    "message": "Invoice a0000000-0000-0000-0000-000000000099 not found",
    "code": "404",
    "@Common.numericSeverity": 4
  }
}
```

Missing `ID` returns `400` (`"Invoice ID is required"`).

---

## Column mapping

| # | UI column | JSON field | Type / notes |
| --- | --- | --- | --- |
| 1 | Invoice No | `invoiceNo` | String, e.g. `5100000001` |
| 2 | Customer | `customer` | String (name as returned by ECC / S4) |
| 3 | Doc No | `docNo` | String, e.g. `1800000001` |
| 4 | Doc Type Name | `docTypeName` | String, e.g. `Invoice`, `Credit Memo`, `Debit Memo` |
| 5 | Partial Settlement | `partialSettlement` | Boolean, `true` = partially settled |
| 6 | Doc Type | `docType` | String, SAP doc type code, e.g. `RV`, `DG`, `DR` |
| 7 | Doc Date | `docDate` | Date, `YYYY-MM-DD` |
| 8 | Due Date | `dueDate` | Date, `YYYY-MM-DD` |
| 9 | Pymt Term | `paymentTerm` | String, e.g. `Net 30`, `Net 45`, `Immediate` |
| 10 | Doc Amount | `docAmount` | Decimal **serialized as string** (`"1250000.00"`) |
| 11 | Balance Amount | `balanceAmount` | Decimal **serialized as string** (`"420000.00"`) |
| 12 | Overdue | `overdue` | Integer, days overdue (`0` = not overdue) |

Extra fields: `ID` (row key for detail navigation), `selected` (checkbox
state, always `false` — UI-only), `currency` (currency of the two amounts).

Notes for the UI:

- Keep `docAmount` / `balanceAmount` as **strings** end-to-end and format
  them only for display.
- Render the overdue cell (e.g. red) when `overdue > 0`; `0` means not overdue.
- Negative amounts are credit memos; do not take an absolute value.

---

## Files

| File | Purpose |
| --- | --- |
| `srv/finance-service.cds` | `InvoiceStatusRow` type + the two functions |
| `srv/finance-service.js` | Handlers returning the dummy data |
| `srv/mock/invoice-status.js` | The dummy data (replace this with the ECC / S4 mapping later) |

Run locally with `npm start` (or `npx cds-serve`) and call
`http://localhost:4004/finance/getInvoiceStatuses()`.
