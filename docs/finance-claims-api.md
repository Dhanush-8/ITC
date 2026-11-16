# Finance – Claims API (mock)

Mock response for the **Claims** sub-module of the Finance module.

There is **no entity / database table** behind this. The service exposes a CDS
`type` and returns hardcoded dummy data. When ECC / S4 integration is ready,
only `srv/mock/claims.js` (or the two handlers in `srv/finance-service.js`)
changes — the URL and JSON shape below stay the same.

| Item | Value |
| --- | --- |
| Service | `FinanceService` |
| Base URL (local) | `http://localhost:4004/finance` |
| Protocol | OData V4 |

> Functions must be called with `()`.

---

## 1. Claims overview list

```http
GET /finance/getClaims()
```

### Response `200`

```json
{
  "@odata.context": "$metadata#Collection(ClaimRow)",
  "value": [
    {
      "ID": "b0000000-0000-0000-0000-000000000001",
      "claimNumber": "CLM-2026-0001",
      "claimYear": 2026,
      "claimType": "Price Difference",
      "subClaimType": "Rate Difference",
      "invoiceNumber": "5100000001",
      "docDate": "2026-10-05",
      "businessArea": "Paperboards",
      "consignee": "Consignee A",
      "claimValue": "125000.00",
      "currency": "INR",
      "status": "Open",
      "selected": false
    },
    {
      "ID": "b0000000-0000-0000-0000-000000000002",
      "claimNumber": "CLM-2026-0002",
      "claimYear": 2026,
      "claimType": "Quality",
      "subClaimType": "Moisture",
      "invoiceNumber": "5100000002",
      "docDate": "2026-09-12",
      "businessArea": "Paper",
      "consignee": "Consignee B",
      "claimValue": "48500.50",
      "currency": "INR",
      "status": "In Progress",
      "selected": false
    }
  ]
}
```

The response contains **8 dummy rows** covering claim years 2025 and 2026 and
every status (`Open`, `In Progress`, `Approved`, `Rejected`, `Settled`,
`Closed`).

---

## 2. Single claim (detail page)

```http
GET /finance/getClaim(ID=b0000000-0000-0000-0000-000000000002)
```

The `ID` may also be the claim number (`CLM-2026-0002`).

### Response `200`

```json
{
  "@odata.context": "$metadata#ClaimRow",
  "ID": "b0000000-0000-0000-0000-000000000002",
  "claimNumber": "CLM-2026-0002",
  "claimYear": 2026,
  "claimType": "Quality",
  "subClaimType": "Moisture",
  "invoiceNumber": "5100000002",
  "docDate": "2026-09-12",
  "businessArea": "Paper",
  "consignee": "Consignee B",
  "claimValue": "48500.50",
  "currency": "INR",
  "status": "In Progress",
  "selected": false
}
```

Unknown ID returns `404`:

```json
{
  "error": {
    "message": "Claim b0000000-0000-0000-0000-000000000099 not found",
    "code": "404",
    "@Common.numericSeverity": 4
  }
}
```

Missing `ID` returns `400` (`"Claim ID is required"`).

---

## Column mapping

| # | UI column | JSON field | Type / notes |
| --- | --- | --- | --- |
| 1 | Claim Number | `claimNumber` | String, e.g. `CLM-2026-0001` |
| 2 | Claim Year | `claimYear` | Integer, e.g. `2026` |
| 3 | Claim Type | `claimType` | String, e.g. `Price Difference`, `Quality` |
| 4 | Sub Claim Type | `subClaimType` | String, e.g. `Rate Difference`, `Moisture` |
| 5 | Invoice Number | `invoiceNumber` | String, e.g. `5100000001` |
| 6 | Doc Date | `docDate` | Date, `YYYY-MM-DD` |
| 7 | Business Area | `businessArea` | String, e.g. `Paperboards`, `Paper` |
| 8 | Consignee | `consignee` | String (name as returned by ECC / S4) |
| 9 | Claim Value | `claimValue` | Decimal **serialized as string** (`"125000.00"`) |
| 10 | Status | `status` | String: Open, In Progress, Approved, Rejected, Settled, Closed |

Extra fields: `ID` (row key for detail navigation), `selected` (checkbox
state, always `false` — UI-only), `currency` (currency of `claimValue`).

---

## Files

| File | Purpose |
| --- | --- |
| `srv/finance-service.cds` | `ClaimRow` type + the two functions |
| `srv/finance-service.js` | Handlers returning the dummy data |
| `srv/mock/claims.js` | The dummy data (replace this with the ECC / S4 mapping later) |

Run locally with `npm start` (or `npx cds-serve`) and call
`http://localhost:4004/finance/getClaims()`.
