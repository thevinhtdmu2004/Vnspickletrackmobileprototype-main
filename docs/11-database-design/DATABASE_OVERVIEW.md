# Database Overview

## 1. Purpose

This document defines the database design direction for VNS PickleTrack.

The database must support:

```text
- Admin / Coach / Member roles
- Member profile and package balance
- Coach and class assignment
- Class and session scheduling
- Attendance records
- Package renewal request and Admin-confirmed payment renewal
- Reports
- Backup/export
```

---

## 2. Recommended MVP Database Direction

For the first production MVP, recommended option:

```text
SQLite local-first + manual backup/export
```

This can later evolve to cloud sync if needed. Cloud sync, multi-device conflict handling and payment gateway integration require separate architecture decisions.

---

## 3. Design Principles

```text
- Prefer auditable records over hidden counters.
- Attendance must be linked to session and member.
- Package renewal/payment must be stored as transaction records.
- Remaining balance should be derived from renewal and attendance ledger data.
- Cached balance is allowed only if it can be rebuilt from source records.
- Role access must be enforced by app/service layer.
- Revenue data must remain Admin-only.
```

---

## 4. Core Tables

```text
Users
Members
Coaches
Classes
ClassMembers
Sessions
AttendanceRecords
Packages
RenewalRequests
PaymentRenewals
PackageLedgerEntries
BackupRecords
AuditLogs
SchemaMigrations
```

---

## 5. Balance Calculation

Recommended conceptual model:

```text
Total Purchased Sessions = SUM(PaymentRenewals.SessionsAdded)
Used Sessions = COUNT(AttendanceRecords where DeductSession = true)
Remaining Sessions = Total Purchased Sessions - Used Sessions
```

Preferred implementation model:

```text
PackageLedgerEntries
  + SessionsAdded from Admin-confirmed PaymentRenewals
  - SessionsDeducted from deducting AttendanceRecords
```

The ledger makes balance reconstruction auditable and avoids relying only on a mutable remaining-session counter.

---

## 6. Attendance Status Rules

The database must preserve exactly 5 MVP attendance statuses:

| Vietnamese status | Internal code | Deducts session |
|---|---|---|
| Có mặt | Present | Yes |
| Trễ | Late | Yes |
| Học bù | Makeup | Yes |
| Vắng | Absent | No |
| Nghỉ phép | Leave | No |

`Học bù` must deduct one session.

---

## 7. Sensitive Data

Sensitive tables:

```text
Users
Members
AttendanceRecords
PaymentRenewals
PackageLedgerEntries
BackupRecords
AuditLogs
```

Security considerations:

```text
- Do not store PIN in plain text.
- Backup files should be protected.
- Export CSV should be Admin-only.
- Coach and Member queries must not include revenue fields.
```
