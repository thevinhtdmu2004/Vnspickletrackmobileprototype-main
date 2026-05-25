# Backup Runbook

## 1. Purpose

Defines the operating procedure for backup and export.

---

## 2. Backup Owner

```text
Primary: Admin
Backup reviewer: PM/Operations owner if applicable
```

---

## 3. Backup Frequency

Recommended MVP frequency:

```text
- At least once per week
- Before app update
- Before data migration
- Before restore operation
- After heavy attendance/payment data entry period
```

---

## 4. Backup Steps

```text
1. Login as Admin.
2. Open Settings.
3. Open Backup.
4. Trigger backup.
5. Confirm backup success.
6. Store backup file securely.
7. Record backup date/time if needed.
```

---

## 5. Export CSV Steps

```text
1. Login as Admin.
2. Open Export CSV.
3. Select export type.
4. Select date range if needed.
5. Export file.
6. Store file securely.
```

---

## 6. Security Reminder

Backup/export may contain:

```text
- Member names
- Phone numbers
- Attendance history
- Payment history
- Revenue data
```

Do not share backup/export files casually.

---

## 7. Backup Failure Handling

```text
[ ] Retry backup
[ ] Check storage permission
[ ] Check available storage
[ ] Record issue
[ ] Escalate if repeated
```
