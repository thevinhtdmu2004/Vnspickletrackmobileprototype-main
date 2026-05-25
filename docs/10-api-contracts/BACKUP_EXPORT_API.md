# Backup & Export API Contract

## 1. Purpose

Defines API planning for backup/export if backend or admin service exists.

For local-only MVP, these may map to local app services instead of HTTP APIs.

---

## 2. Endpoints

## POST /api/v1/backup/create

Admin-only.

### Response

```json
{
  "success": true,
  "data": {
    "backupId": "bck_001",
    "fileName": "pickletrack_backup_20260502_183000.db3",
    "createdAt": "2026-05-02T18:30:00Z",
    "sizeBytes": 2400000
  },
  "message": "Đã tạo bản sao lưu",
  "errors": []
}
```

---

## GET /api/v1/backup/history

Admin-only.

---

## POST /api/v1/export/csv

Admin-only.

### Request

```json
{
  "exportTypes": ["Members", "Attendance", "Payments"],
  "fromDate": "2026-05-01",
  "toDate": "2026-05-31"
}
```

---

## POST /api/v1/restore

Admin-only.

May remain out of MVP.

---

## 3. Critical Rules

```text
- Backup/export/restore are Admin-only.
- Backup contains sensitive member and financial data.
- If encryption is not implemented, do not claim encryption.
- Restore must warn before overwriting data.
```

---

## 4. Errors

| Code | Meaning |
|---|---|
| ACCESS_DENIED | User cannot access backup/export |
| BACKUP_FAILED | Backup failed |
| EXPORT_FAILED | CSV export failed |
| INVALID_RESTORE_FILE | Restore file invalid |
| RESTORE_NOT_SUPPORTED | Restore is not available in current version |
