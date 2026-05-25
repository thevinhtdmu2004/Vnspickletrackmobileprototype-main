# Domain Model

## 1. Purpose

This document defines the core domain entities for VNS PickleTrack.

The goal is to provide a stable conceptual model before implementation.

---

## 2. Entity Overview

| Entity | Description |
|---|---|
| User | Login account and role identity |
| Member | Pickleball learner/member profile |
| Coach | Instructor profile or user role assigned to classes |
| Class | Recurring training group |
| Session | Actual scheduled occurrence of a class |
| AttendanceRecord | Attendance status of one member in one session |
| Package | Training package catalog item |
| RenewalRequest | Request submitted by Member to renew package |
| PaymentRenewal | Admin-confirmed payment/package renewal |
| PackageLedgerEntry | Auditable session balance movement |
| BackupRecord | Backup/export record concept |

---

## 3. User

### Fields

| Field | Description |
|---|---|
| UserId | Unique account ID |
| Username | Login name or phone |
| PinHash | PIN/auth credential reference |
| Role | Admin / Coach / Member |
| DisplayName | Name shown in UI |
| IsActive | Account status |

### Rules

```text
- User role controls navigation and permission.
- Member user should map to exactly one Member profile.
- Coach user may map to Coach profile.
```

---

## 4. Member

### Fields

| Field | Description |
|---|---|
| MemberId | Unique member ID |
| FullName | Member name |
| Phone | Contact phone |
| Level | Beginner / Intermediate / Advanced |
| Status | Active / Paused / Stopped |
| DefaultClassId | Main class |
| TotalSessions | Total purchased sessions, derived or cached |
| UsedSessions | Sessions consumed, derived or cached |
| RemainingSessions | Derived or cached balance |
| Notes | Optional notes |

### Rules

```text
RemainingSessions = TotalSessions - UsedSessions
Member can only see own profile/data.
Admin can manage all members.
Coach can see limited member data for assigned classes.
```

---

## 5. Coach

### Fields

| Field | Description |
|---|---|
| CoachId | Unique coach ID |
| UserId | Related user account |
| FullName | Coach name |
| Phone | Contact phone |
| Status | Active / Inactive |

### Rules

```text
Coach can operate assigned classes/sessions.
Coach cannot view revenue.
```

---

## 6. Class

### Fields

| Field | Description |
|---|---|
| ClassId | Unique class ID |
| ClassName | Beginner A / Intermediate B / Advanced C |
| Level | Class level |
| CoachId | Assigned coach |
| Court | Court name/number |
| StartTime | Default start time |
| EndTime | Default end time |
| WeeklySchedule | Days of week |
| Status | Open / Paused / Closed |

### Relationships

```text
Class 1..N Sessions
Class N..N Members
Class N..1 Coach
```

---

## 7. Session

### Fields

| Field | Description |
|---|---|
| SessionId | Unique session ID |
| ClassId | Related class |
| SessionDate | Specific date |
| StartTime | Actual start time |
| EndTime | Actual end time |
| Court | Actual court |
| CoachId | Coach for this session |
| Status | Planned / InProgress / Completed / Cancelled |

### Rules

```text
Attendance is attached to a Session.
Cancelled Session should not allow attendance save.
```

---

## 8. AttendanceRecord

### Fields

| Field | Description |
|---|---|
| AttendanceId | Unique attendance record ID |
| SessionId | Related session |
| MemberId | Related member |
| Status | Present / Late / Makeup / Absent / Leave |
| DeductSession | True/False |
| CreatedByUserId | Admin/Coach who recorded |
| CreatedAt | Created timestamp |
| UpdatedAt | Updated timestamp |

### Deduction Rules

| Status | Vietnamese | Deduct |
|---|---|---:|
| Present | Có mặt | Yes |
| Late | Trễ | Yes |
| Makeup | Học bù | Yes |
| Absent | Vắng | No |
| Leave | Nghỉ phép | No |

---

## 9. Package

### Fields

| Field | Description |
|---|---|
| PackageId | Unique package ID |
| PackageName | Example: Gói 12 buổi |
| SessionCount | Number of sessions |
| Price | Package price |
| ValidityDays | Optional validity |
| IsActive | Package active status |

---

## 10. RenewalRequest

### Fields

| Field | Description |
|---|---|
| RequestId | Unique request ID |
| MemberId | Requesting member |
| PackageId | Requested package |
| Note | Member note |
| Status | Pending / Approved / Rejected / Cancelled |
| CreatedAt | Request date |

### Rules

```text
Member renewal request does not add sessions automatically.
Admin must confirm renewal/payment.
```

---

## 11. PaymentRenewal

### Fields

| Field | Description |
|---|---|
| PaymentRenewalId | Unique ID |
| MemberId | Related member |
| PackageId | Package purchased |
| Amount | Paid amount |
| SessionsAdded | Sessions added |
| PaymentMethod | Cash / Bank transfer / Other |
| PaymentDate | Payment date |
| ConfirmedByUserId | Admin user |
| Notes | Optional notes |

---

## 12. PackageLedgerEntry

### Fields

| Field | Description |
|---|---|
| LedgerEntryId | Unique ledger entry ID |
| MemberId | Related member |
| SourceType | PaymentRenewal / Attendance |
| SourceId | Related source record ID |
| SessionDelta | Positive for renewal, negative for attendance deduction |
| EntryDate | Ledger entry date |
| BalanceAfter | Optional cached balance after entry |

### Rules

```text
PaymentRenewal adds sessions.
Deducting AttendanceRecord subtracts sessions.
Học bù subtracts one session.
Balance should be auditable from ledger records.
```

---

## 13. BackupRecord

### Fields

| Field | Description |
|---|---|
| BackupId | Unique backup ID |
| FileName | Backup file name |
| CreatedAt | Backup time |
| CreatedByUserId | Admin user |
| Size | File size |
| Location | Local/shared location |

---

## 14. Relationship Summary

```text
User 1..1 MemberProfile optional
User 1..1 CoachProfile optional
Coach 1..N Class
Class N..N Member
Class 1..N Session
Session 1..N AttendanceRecord
Member 1..N AttendanceRecord
Member 1..N RenewalRequest
Member 1..N PaymentRenewal
Member 1..N PackageLedgerEntry
Package 1..N RenewalRequest
Package 1..N PaymentRenewal
PaymentRenewal 1..N PackageLedgerEntry
AttendanceRecord 0..1 PackageLedgerEntry
```

---

## 15. Implementation Notes

- RemainingSessions may be stored for performance or calculated from attendance/payment history.
- Production implementation should define one authoritative source for balance.
- Attendance correction must handle balance adjustment carefully.
- Member visibility must always filter by current user/member identity.
