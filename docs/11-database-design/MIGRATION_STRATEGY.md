# Migration Strategy

## 1. Purpose

Defines how database schema changes should be managed in production implementation.

---

## 2. Recommended Principles

```text
- Every schema change must be versioned.
- Do not manually alter production data without a migration record.
- Seed/demo data must be separated from schema migration.
- Backup before destructive migration.
- Attendance and package ledger migrations require extra verification.
```

---

## 3. Migration Versioning

Recommended naming:

```text
YYYYMMDDHHmm_description
```

Example:

```text
202605021830_create_members_table
```

---

## 4. Migration Types

| Type | Example |
|---|---|
| Create table | Create Members table |
| Add column | Add IsActive to Packages |
| Add index | Add index on AttendanceRecords.SessionId |
| Add constraint | Add unique SessionId + MemberId |
| Data migration | Normalize role values |
| Destructive migration | Drop/rename column - requires backup |

---

## 5. Required Migration Log

Production should keep a migration log table:

```text
SchemaMigrations
|-- MigrationId
|-- AppliedAt
|-- AppVersion
|-- Checksum optional
```

---

## 6. Backup Requirement

Before destructive migrations:

```text
[ ] Create backup
[ ] Verify backup file exists
[ ] Confirm migration scope
[ ] Run migration
[ ] Verify app starts
[ ] Verify attendance deduction data
[ ] Verify package balance reconstruction
```

---

## 7. Rollback Policy

For MVP:

```text
- Prefer forward-only migrations.
- Rollback should be handled by restoring backup if needed.
- Any rollback from production data must preserve audit records.
```

---

## 8. Testing Checklist

```text
[ ] Fresh database migration works
[ ] Existing database migration works
[ ] Seed data still loads
[ ] Attendance/package data not corrupted
[ ] Học bù still deducts one session
[ ] Coach still cannot access revenue tables/screens
[ ] Member still sees own data only
[ ] Backup before destructive migration
```
