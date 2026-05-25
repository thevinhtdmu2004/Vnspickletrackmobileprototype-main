# Audit Log Strategy

## 1. Purpose

Defines what actions should be audited in production implementation.

Audit logs help resolve disputes around attendance, package balance and financial operations.

---

## 2. Recommended Audited Actions

| Action | Reason |
|---|---|
| Login failed | Account security |
| Change PIN | Account security |
| Save attendance | Affects package balance |
| Correct attendance | Affects package balance and disputes |
| Confirm package renewal | Financial/package impact |
| Adjust member sessions | High-risk manual change |
| Export CSV | Data privacy |
| Create backup | Data privacy |
| Restore data | High-risk data operation |
| Change user role | Permission security |

---

## 3. Audit Log Fields

| Field | Description |
|---|---|
| AuditId | Unique ID |
| Action | Action name |
| EntityType | Member / Session / Attendance / Package / User |
| EntityId | Target entity ID |
| PerformedByUserId | Acting user |
| PerformedAt | Timestamp |
| OldValue | Optional serialized old value |
| NewValue | Optional serialized new value |
| Note | Optional explanation |

---

## 4. Audit Rules

```text
- Manual balance/session adjustment must include reason.
- Attendance correction should store old and new status.
- Package renewal should store confirmed amount and sessions added.
- Export/backup should store timestamp and user.
```

---

## 5. Future Report

Potential future Admin report:

```text
Audit Log Report
- Filter by user
- Filter by action
- Filter by date
- Filter by member/session
```
