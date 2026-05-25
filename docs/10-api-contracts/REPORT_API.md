# Report API Contract

## 1. Purpose

Defines API planning for reports.

Reports must be role-safe.

---

## 2. Endpoints

## GET /api/v1/reports/low-balance-members

Admin and optionally Coach-limited.

### Query

```text
?threshold=2
```

---

## GET /api/v1/reports/attendance-monthly

Admin/Coach.

Coach should only see assigned class/session scope.

---

## GET /api/v1/reports/classes/{classId}

Admin/Coach if assigned.

---

## GET /api/v1/reports/members/{memberId}

Admin/Coach limited.

Member should use `/api/v1/members/me` and personal history APIs instead.

---

## GET /api/v1/reports/revenue

Admin-only.

### Response Example

```json
{
  "success": true,
  "data": {
    "month": "2026-05",
    "totalRevenue": 24000000,
    "renewalCount": 12,
    "packageBreakdown": []
  },
  "message": "",
  "errors": []
}
```

---

## 3. Critical Rules

```text
- Revenue report is Admin-only.
- Coach cannot access revenue endpoint.
- Member cannot access global reports.
- Member can only access own attendance/payment history.
```

---

## 4. Errors

| Code | Meaning |
|---|---|
| ACCESS_DENIED | User cannot access report |
| INVALID_DATE_RANGE | Date range is invalid |
| REPORT_NOT_AVAILABLE | Report is not available |
