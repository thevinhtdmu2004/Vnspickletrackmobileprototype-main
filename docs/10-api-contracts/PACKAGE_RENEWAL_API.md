# Package & Renewal API Contract

## 1. Purpose

Defines API planning for package catalog, Admin renewal confirmation and Member renewal request.

---

## 2. Package Endpoints

## GET /api/v1/packages

Returns active package catalog.

### Response Item

```json
{
  "packageId": "pkg_012",
  "packageName": "Gói 12 buổi",
  "sessionCount": 12,
  "price": 2400000,
  "validityDays": 90,
  "isActive": true
}
```

---

## POST /api/v1/packages

Admin-only.

---

## PUT /api/v1/packages/{packageId}

Admin-only.

---

## 3. Admin Renewal Confirmation

## POST /api/v1/members/{memberId}/renewals

Admin-only.

### Request

```json
{
  "packageId": "pkg_012",
  "amount": 2400000,
  "paymentMethod": "BankTransfer",
  "paymentDate": "2026-05-02",
  "note": "Gia hạn gói 12 buổi"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "renewalId": "ren_001",
    "memberId": "mem_001",
    "sessionsAdded": 12,
    "amount": 2400000,
    "newTotalSessions": 24,
    "newRemainingSessions": 19
  },
  "message": "Đã gia hạn gói học",
  "errors": []
}
```

---

## 4. Member Renewal Request

## POST /api/v1/renewal-requests

Member-only.

### Request

```json
{
  "packageId": "pkg_012",
  "note": "Em muốn gia hạn gói 12 buổi"
}
```

### Rule

```text
This endpoint creates a request only.
It must not add sessions automatically.
```

---

## GET /api/v1/renewal-requests/my

Member-only.

Returns current member's own renewal requests.

---

## GET /api/v1/renewal-requests

Admin-only.

Returns all renewal requests.

---

## PUT /api/v1/renewal-requests/{requestId}/status

Admin-only.

### Request

```json
{
  "status": "Approved",
  "note": "Đã liên hệ và xác nhận"
}
```

---

## 5. Errors

| Code | Meaning |
|---|---|
| PACKAGE_NOT_FOUND | Package does not exist |
| MEMBER_NOT_FOUND | Member does not exist |
| REQUEST_NOT_FOUND | Renewal request does not exist |
| ACCESS_DENIED | User cannot perform action |
| INVALID_AMOUNT | Amount is invalid |

---

## 6. Critical Rules

```text
- Admin confirms renewal/payment.
- Member submits request only.
- Coach cannot confirm renewal.
- Member cannot add sessions directly.
```
