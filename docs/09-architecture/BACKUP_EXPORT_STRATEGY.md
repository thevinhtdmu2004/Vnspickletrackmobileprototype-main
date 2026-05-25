# Backup & Export Strategy

## 1. Purpose

This document defines the backup, export and restore strategy for VNS PickleTrack.

Backup/export is important because the app may start with local data storage for MVP.

---

## 2. Data to Protect

Backup/export may include:

```text
- User accounts and roles
- Member profiles
- Phone numbers
- Class/session data
- Attendance records
- Package/payment history
- Renewal requests
- Reports source data
```

This data should be treated as sensitive.

---

## 3. Backup Strategy Options

### Option A — Manual Local Backup

Admin triggers backup manually and saves a file.

Pros:

```text
- Simple
- Works offline
- Easy for MVP
```

Cons:

```text
- Depends on Admin discipline
- Risk if file is not stored safely
```

---

### Option B — Scheduled Reminder Backup

App reminds Admin to backup periodically.

Pros:

```text
- Reduces forgetting
- Still simple
```

Cons:

```text
- Still manual
- Requires notification/reminder support
```

---

### Option C — Cloud Backup

Backup automatically uploads to cloud storage/backend.

Pros:

```text
- Better protection
- Easier restore
```

Cons:

```text
- Requires cloud integration
- Requires security design
```

---

## 4. Recommended MVP Approach

Recommended for first MVP:

```text
Manual Local Backup + Export CSV
```

Add backup reminder if feasible.

---

## 5. Backup File Naming

Recommended format:

```text
pickletrack_backup_yyyyMMdd_HHmmss.db3
```

Example:

```text
pickletrack_backup_20260502_183000.db3
```

---

## 6. Export CSV Scope

Recommended export types:

| Export | Fields |
|---|---|
| Members | Name, phone, level, class, total/used/remaining sessions |
| Classes | Class name, coach, court, schedule, status |
| Sessions | Date, time, class, coach, status |
| Attendance | Session, member, status, deduction |
| Payments/Renewals | Member, package, amount, date, method |

---

## 7. Restore Strategy

For MVP, restore may be marked as:

```text
Coming Soon
```

If implemented, restore must:

```text
- Warn that current data may be overwritten
- Require confirmation
- Recommend backup before restore
- Validate file format
- Handle version mismatch
```

---

## 8. Access Control

Backup/export/restore must be:

```text
Admin-only
```

Coach and Member must not access these features.

---

## 9. Security Notes

- Backup contains sensitive personal and financial data.
- Backup should not be shared casually.
- Consider encryption before production use.
- If encryption is not implemented, UI must not claim encrypted backup.
- Export CSV should display privacy warning.

---

## 10. UAT Checklist

```text
[ ] Admin can open backup screen
[ ] Admin can trigger backup or see documented backup behavior
[ ] Admin can export CSV
[ ] Coach cannot access backup/export
[ ] Member cannot access backup/export
[ ] Restore is clearly marked as Coming Soon if not implemented
[ ] Backup privacy warning is visible
```
