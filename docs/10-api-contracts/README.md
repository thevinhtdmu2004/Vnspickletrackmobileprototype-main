# API Contracts Documentation

## 1. Purpose

This folder defines API contract planning for the future production version of **VNS PickleTrack**.

The current prototype does not require a backend API. These documents are prepared for the stage where the project moves from local prototype to production app with backend/cloud sync.

---

## 2. Documents

| File | Purpose |
|---|---|
| `API_OVERVIEW.md` | API strategy and module boundaries |
| `AUTH_API.md` | Login, logout, PIN/account API contract |
| `MEMBER_API.md` | Member/student API contract |
| `CLASS_SESSION_API.md` | Class and session API contract |
| `ATTENDANCE_API.md` | Attendance API and deduction behavior |
| `PACKAGE_RENEWAL_API.md` | Package, payment and renewal request API contract |
| `REPORT_API.md` | Report API contract and role restrictions |
| `BACKUP_EXPORT_API.md` | Backup/export API contract if backend is used |
| `API_ERROR_MODEL.md` | Standard error response model |

---

## 3. API Design Principles

```text
- Role permissions must be enforced by backend, not UI only.
- Coach must not access revenue endpoints.
- Member must only access own data.
- Attendance deduction must be centralized and auditable.
- Member renewal request must not directly add sessions.
- Admin confirms package renewal/payment.
```

---

## 4. Suggested API Versioning

```text
/api/v1/auth
/api/v1/members
/api/v1/classes
/api/v1/sessions
/api/v1/attendance
/api/v1/packages
/api/v1/renewal-requests
/api/v1/reports
/api/v1/backup
```

---

## 5. Status

```text
Draft - prepared for future backend/API implementation
```
