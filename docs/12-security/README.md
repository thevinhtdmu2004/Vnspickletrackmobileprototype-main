# Security Documentation Index

## 1. Purpose

This folder contains security planning documents for VNS PickleTrack production implementation.

---

## 2. Documents

| File | Purpose |
|---|---|
| `SECURITY_OVERVIEW.md` | Security principles and risk areas |
| `AUTH_SECURITY.md` | Login, PIN and account security |
| `DATA_PRIVACY.md` | Member data privacy and access boundaries |
| `ROLE_ACCESS_SECURITY.md` | Admin / Coach / Member access control rules |
| `BACKUP_SECURITY.md` | Backup/export security requirements |
| `AUDIT_LOG_STRATEGY.md` | Audit log planning |

---

## 3. Critical Security Rules

```text
- Coach must not see revenue.
- Member must only see personal data.
- PIN must not be stored as plain text.
- Backup/export contains sensitive data and must be Admin-only.
- Attendance and payment changes should be auditable.
```
