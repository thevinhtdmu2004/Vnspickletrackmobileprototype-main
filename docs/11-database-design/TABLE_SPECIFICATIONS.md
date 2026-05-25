# Table Specifications

## 1. Purpose

Draft table specifications for the future production implementation of VNS PickleTrack.

These are conceptual and should be refined after the final architecture/database decision. Names use PascalCase to stay readable in BA documentation; the implementation can map them to the chosen database naming convention.

---

## 2. Shared Conventions

Recommended shared fields for operational tables:

| Column | Type | Notes |
|---|---|---|
| CreatedAt | DATETIME | Required |
| CreatedByUserId | TEXT/UUID | Optional FK to Users depending workflow |
| UpdatedAt | DATETIME | Required |
| UpdatedByUserId | TEXT/UUID | Optional FK to Users depending workflow |

Soft delete fields are optional for production MVP:

| Column | Type | Notes |
|---|---|---|
| DeletedAt | DATETIME | Null means active |
| DeletedByUserId | TEXT/UUID | Optional FK to Users |

---

## 3. Users

| Column | Type | Notes |
|---|---|---|
| UserId | TEXT/UUID | Primary key |
| Username | TEXT | Required, unique |
| PinHash | TEXT | Required; never store plain PIN |
| Role | TEXT | Admin / Coach / Member |
| DisplayName | TEXT | UI display name |
| IsActive | BOOLEAN | Account status |
| LastLoginAt | DATETIME | Optional |
| CreatedAt | DATETIME | Required |
| UpdatedAt | DATETIME | Required |

Recommended constraints:

```text
UNIQUE(Username)
CHECK(Role IN ('Admin', 'Coach', 'Member'))
```

---

## 4. Members

| Column | Type | Notes |
|---|---|---|
| MemberId | TEXT/UUID | Primary key |
| UserId | TEXT/UUID | Optional FK to Users for member portal login |
| FullName | TEXT | Required |
| Phone | TEXT | Optional; unique if business policy requires |
| Level | TEXT | Beginner / Intermediate / Advanced |
| Status | TEXT | Active / Paused / Stopped |
| DefaultClassId | TEXT/UUID | Optional FK to Classes |
| Notes | TEXT | Optional internal note |
| CreatedAt | DATETIME | Required |
| UpdatedAt | DATETIME | Required |

Recommended constraints:

```text
CHECK(Level IN ('Beginner', 'Intermediate', 'Advanced'))
CHECK(Status IN ('Active', 'Paused', 'Stopped'))
```

Access rule:

```text
Member role can read only the row linked to their own UserId.
```

---

## 5. Coaches

| Column | Type | Notes |
|---|---|---|
| CoachId | TEXT/UUID | Primary key |
| UserId | TEXT/UUID | Required FK to Users |
| FullName | TEXT | Required |
| Phone | TEXT | Optional |
| Status | TEXT | Active / Inactive |
| CreatedAt | DATETIME | Required |
| UpdatedAt | DATETIME | Required |

Recommended constraints:

```text
UNIQUE(UserId)
CHECK(Status IN ('Active', 'Inactive'))
```

---

## 6. Classes

| Column | Type | Notes |
|---|---|---|
| ClassId | TEXT/UUID | Primary key |
| ClassName | TEXT | Required |
| Level | TEXT | Beginner / Intermediate / Advanced |
| CoachId | TEXT/UUID | Required FK to Coaches |
| Court | TEXT | Court name/number |
| StartTime | TEXT/TIME | Default start time |
| EndTime | TEXT/TIME | Default end time |
| WeeklySchedule | TEXT/JSON | Days of week |
| Status | TEXT | Open / Paused / Closed |
| CreatedAt | DATETIME | Required |
| UpdatedAt | DATETIME | Required |

Recommended constraints:

```text
CHECK(Level IN ('Beginner', 'Intermediate', 'Advanced'))
CHECK(Status IN ('Open', 'Paused', 'Closed'))
```

---

## 7. ClassMembers

| Column | Type | Notes |
|---|---|---|
| ClassMemberId | TEXT/UUID | Primary key |
| ClassId | TEXT/UUID | Required FK to Classes |
| MemberId | TEXT/UUID | Required FK to Members |
| JoinedAt | DATETIME | Required |
| LeftAt | DATETIME | Optional |
| Status | TEXT | Active / Removed |
| CreatedAt | DATETIME | Required |
| UpdatedAt | DATETIME | Required |

Recommended constraints:

```text
CHECK(Status IN ('Active', 'Removed'))
UNIQUE(ClassId, MemberId, Status) filtered to Status = 'Active' when supported
```

---

## 8. Sessions

| Column | Type | Notes |
|---|---|---|
| SessionId | TEXT/UUID | Primary key |
| ClassId | TEXT/UUID | Required FK to Classes |
| SessionDate | DATE | Required |
| StartTime | TEXT/TIME | Actual start |
| EndTime | TEXT/TIME | Actual end |
| Court | TEXT | Actual court |
| CoachId | TEXT/UUID | Coach for this session |
| Status | TEXT | Planned / InProgress / Completed / Cancelled |
| CancelReason | TEXT | Optional |
| CreatedAt | DATETIME | Required |
| UpdatedAt | DATETIME | Required |

Recommended constraints:

```text
UNIQUE(ClassId, SessionDate, StartTime)
CHECK(Status IN ('Planned', 'InProgress', 'Completed', 'Cancelled'))
```

---

## 9. AttendanceRecords

| Column | Type | Notes |
|---|---|---|
| AttendanceId | TEXT/UUID | Primary key |
| SessionId | TEXT/UUID | Required FK to Sessions |
| MemberId | TEXT/UUID | Required FK to Members |
| Status | TEXT | Present / Late / Makeup / Absent / Leave |
| StatusLabel | TEXT | Optional Vietnamese label for display/export |
| DeductSession | BOOLEAN | Derived from Status |
| CreatedByUserId | TEXT/UUID | Required FK to Users; Admin/Coach only |
| CreatedAt | DATETIME | Required |
| UpdatedByUserId | TEXT/UUID | Optional FK to Users |
| UpdatedAt | DATETIME | Required |

Recommended constraints:

```text
UNIQUE(SessionId, MemberId)
CHECK(Status IN ('Present', 'Late', 'Makeup', 'Absent', 'Leave'))
CHECK(
  (Status IN ('Present', 'Late', 'Makeup') AND DeductSession = true)
  OR
  (Status IN ('Absent', 'Leave') AND DeductSession = false)
)
```

Vietnamese display mapping:

| Internal code | Vietnamese label | Deducts session |
|---|---|---|
| Present | Có mặt | Yes |
| Late | Trễ | Yes |
| Makeup | Học bù | Yes |
| Absent | Vắng | No |
| Leave | Nghỉ phép | No |

Business rules:

```text
- Attendance has exactly 5 MVP statuses.
- Học bù must deduct one session.
- Member cannot create or update attendance.
```

---

## 10. Packages

| Column | Type | Notes |
|---|---|---|
| PackageId | TEXT/UUID | Primary key |
| PackageName | TEXT | Example: Gói 12 buổi |
| SessionCount | INTEGER | Must be > 0 |
| Price | DECIMAL/INTEGER | VND amount; Admin-only revenue data |
| ValidityDays | INTEGER | Optional |
| IsActive | BOOLEAN | Required |
| CreatedAt | DATETIME | Required |
| UpdatedAt | DATETIME | Required |

Recommended constraints:

```text
CHECK(SessionCount > 0)
CHECK(Price >= 0)
```

Access rule:

```text
Coach and Member screens must not expose package price/revenue summaries.
```

---

## 11. RenewalRequests

| Column | Type | Notes |
|---|---|---|
| RequestId | TEXT/UUID | Primary key |
| MemberId | TEXT/UUID | Required FK to Members |
| PackageId | TEXT/UUID | Required FK to Packages |
| Note | TEXT | Optional |
| Status | TEXT | Pending / Approved / Rejected / Cancelled |
| CreatedAt | DATETIME | Required |
| ReviewedByUserId | TEXT/UUID | Admin user |
| ReviewedAt | DATETIME | Optional |
| ReviewNote | TEXT | Optional |

Recommended constraints:

```text
CHECK(Status IN ('Pending', 'Approved', 'Rejected', 'Cancelled'))
```

Business rules:

```text
- Member can create renewal request for self only.
- RenewalRequest does not add sessions by itself.
- Admin confirms payment renewal before sessions are added.
```

---

## 12. PaymentRenewals

| Column | Type | Notes |
|---|---|---|
| PaymentRenewalId | TEXT/UUID | Primary key |
| RequestId | TEXT/UUID | Optional FK to RenewalRequests |
| MemberId | TEXT/UUID | Required FK to Members |
| PackageId | TEXT/UUID | Required FK to Packages |
| Amount | DECIMAL/INTEGER | VND amount; Admin-only revenue data |
| SessionsAdded | INTEGER | From package or approved override |
| PaymentMethod | TEXT | Cash / BankTransfer / Other |
| PaymentDate | DATE | Required |
| ConfirmedByUserId | TEXT/UUID | Required Admin user |
| Notes | TEXT | Optional |
| CreatedAt | DATETIME | Required |
| UpdatedAt | DATETIME | Required |

Recommended constraints:

```text
CHECK(Amount >= 0)
CHECK(SessionsAdded > 0)
CHECK(PaymentMethod IN ('Cash', 'BankTransfer', 'Other'))
```

Access rule:

```text
PaymentRenewals are Admin-only for create/update/read, except derived non-revenue balance shown to the owning Member.
```

---

## 13. PackageLedgerEntries

| Column | Type | Notes |
|---|---|---|
| LedgerEntryId | TEXT/UUID | Primary key |
| MemberId | TEXT/UUID | Required FK to Members |
| SourceType | TEXT | PaymentRenewal / Attendance |
| SourceId | TEXT/UUID | ID of payment renewal or attendance record |
| SessionDelta | INTEGER | Positive for purchase, negative for deduction |
| BalanceAfter | INTEGER | Optional cached balance after entry |
| EntryDate | DATETIME | Required |
| CreatedByUserId | TEXT/UUID | FK to Users |
| Notes | TEXT | Optional |

Recommended constraints:

```text
CHECK(SourceType IN ('PaymentRenewal', 'Attendance'))
CHECK(SessionDelta <> 0)
UNIQUE(SourceType, SourceId)
```

Business rules:

```text
- PaymentRenewal creates positive SessionDelta.
- Deducting AttendanceRecord creates negative SessionDelta.
- Học bù creates SessionDelta = -1.
- Balance can be rebuilt from ledger entries.
```

---

## 14. BackupRecords

| Column | Type | Notes |
|---|---|---|
| BackupId | TEXT/UUID | Primary key |
| FileName | TEXT | Backup file name |
| FileSizeBytes | INTEGER | Optional |
| CreatedByUserId | TEXT/UUID | Required Admin user |
| CreatedAt | DATETIME | Required |
| Location | TEXT | Optional path/storage location |
| Checksum | TEXT | Optional integrity check |
| Notes | TEXT | Optional |

Access rule:

```text
Backup/export records are Admin-only.
```

---

## 15. AuditLogs

| Column | Type | Notes |
|---|---|---|
| AuditLogId | TEXT/UUID | Primary key |
| ActorUserId | TEXT/UUID | FK to Users |
| Action | TEXT | Create / Update / Delete / Login / Export / Backup |
| EntityType | TEXT | Table/entity name |
| EntityId | TEXT/UUID | Target record ID |
| OccurredAt | DATETIME | Required |
| MetadataJson | TEXT/JSON | Optional details |

Recommended uses:

```text
- Attendance changes
- Payment renewal confirmation
- Backup/export actions
- Role or account changes
```

---

## 16. SchemaMigrations

| Column | Type | Notes |
|---|---|---|
| MigrationId | TEXT | Primary key |
| AppliedAt | DATETIME | Required |
| AppVersion | TEXT | Optional |
| Checksum | TEXT | Optional |

---

## 17. Reporting Views

Recommended derived views or service queries:

```text
MemberPackageBalanceView
ClassAttendanceSummaryView
AdminRevenueSummaryView
CoachSessionOperationView
MemberSelfServiceSummaryView
```

Access rules:

```text
- AdminRevenueSummaryView is Admin-only.
- CoachSessionOperationView excludes revenue fields.
- MemberSelfServiceSummaryView filters to the current member only.
```

---

## 18. Future Tables

Potential future tables:

```text
Devices
SyncQueue
Notifications
Branches
Tenants
PaymentGatewayTransactions
```

These require separate change requests or architecture decisions before implementation.
