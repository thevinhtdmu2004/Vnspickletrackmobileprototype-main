# ERD Concept

## 1. Purpose

This document describes conceptual relationships between the core data entities for VNS PickleTrack.

---

## 2. Relationship Diagram - Text Form

```text
Users
  |-- 0..1 Members
  |-- 0..1 Coaches
  |-- 1..N AttendanceRecords as CreatedByUser
  |-- 1..N PaymentRenewals as ConfirmedByUser
  |-- 1..N BackupRecords as CreatedByUser

Coaches
  |-- 1..N Classes
  |-- 0..N Sessions as SessionCoach

Classes
  |-- N..N Members through ClassMembers
  |-- 1..N Sessions

Sessions
  |-- 1..N AttendanceRecords

Members
  |-- N..N Classes through ClassMembers
  |-- 1..N AttendanceRecords
  |-- 1..N RenewalRequests
  |-- 1..N PaymentRenewals
  |-- 1..N PackageLedgerEntries

Packages
  |-- 1..N RenewalRequests
  |-- 1..N PaymentRenewals

RenewalRequests
  |-- 0..1 PaymentRenewals when approved and paid

PaymentRenewals
  |-- 1..N PackageLedgerEntries for purchased sessions

AttendanceRecords
  |-- 0..1 PackageLedgerEntries for deducted sessions
```

---

## 3. Important Relationship Rules

```text
- AttendanceRecord must belong to one Session and one Member.
- Session must belong to one Class.
- Member can belong to multiple Classes.
- Class can contain multiple Members.
- Member renewal request references Package but does not add sessions.
- PaymentRenewal references Package and adds sessions after Admin confirmation.
- Deducting attendance creates or implies one negative package ledger entry.
- Học bù is a deducting attendance status and must deduct one session.
```

---

## 4. Role Data Boundaries

```text
- Admin can access all operational and revenue entities.
- Coach can access assigned classes, sessions, rosters and attendance operation data.
- Coach must not access PaymentRenewals, revenue reports or package price summaries.
- Member can access only their own profile, sessions, attendance summary, package balance and renewal requests.
- Member cannot create or update attendance records.
```

---

## 5. Audit Considerations

Recommended audit fields for most operational tables:

```text
CreatedAt
CreatedByUserId
UpdatedAt
UpdatedByUserId
DeletedAt if soft delete is used
DeletedByUserId if soft delete is used
```

Attendance and package balance records should favor append-only audit history over silent overwrites.
