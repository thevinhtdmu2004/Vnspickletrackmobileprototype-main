# Security Overview

## 1. Purpose

Defines high-level security expectations for VNS PickleTrack production implementation.

---

## 2. Security Goals

| Goal | Description |
|---|---|
| Protect member data | Names, phone numbers, package and attendance history are sensitive |
| Protect revenue data | Revenue and payment reports are Admin-only |
| Protect account access | PIN/account credentials must be handled securely |
| Protect backup files | Backup/export contains sensitive data |
| Preserve auditability | Attendance/payment changes should be traceable |

---

## 3. Main Security Risks

| Risk | Impact | Mitigation |
|---|---|---|
| PIN stored in plain text | Account compromise | Store hashed PIN |
| Coach sees revenue | Business data leakage | Role authorization |
| Member sees other member data | Privacy breach | Ownership filtering |
| Backup shared openly | Full data leak | Admin-only and warning/encryption |
| Attendance changed without audit | Balance dispute | Audit log |

---

## 4. Security Baseline

```text
- Authenticate all users.
- Enforce role-based access.
- Filter data by ownership.
- Hash PIN/password.
- Protect backup/export.
- Add audit log for critical changes.
```

---

## 5. Future Security Enhancements

```text
- Local DB encryption
- Backup encryption
- Failed login lockout
- Session timeout
- Device binding
- Cloud token rotation
- Admin activity audit report
```
