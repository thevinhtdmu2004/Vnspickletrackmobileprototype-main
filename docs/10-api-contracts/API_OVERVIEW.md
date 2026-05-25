# API Overview

## 1. Purpose

This document defines the high-level API strategy for VNS PickleTrack if/when the product moves to a backend or cloud-sync model.

---

## 2. Current State

The current repository is a prototype and does not require real API integration.

API documents are planning artifacts for future implementation.

---

## 3. API Module Boundaries

| Module | Responsibility |
|---|---|
| Auth API | Login, logout, token/session, PIN change |
| Member API | Member profile, member list, member detail |
| Class API | Class management and assignment |
| Session API | Today sessions, create sessions, session lifecycle |
| Attendance API | Save/correct attendance and deduction logic |
| Package API | Package catalog and package summary |
| Renewal API | Member request and Admin confirmation |
| Report API | Role-safe reports |
| Backup/Export API | Optional backend backup/export workflow |

---

## 4. API Security Rules

```text
- All protected APIs require authenticated user context.
- Role must be verified by backend.
- MemberId must be scoped to current user for Member role.
- Coach must be scoped to assigned classes/sessions.
- Revenue endpoints are Admin-only.
```

---

## 5. Standard Response Shape

```json
{
  "success": true,
  "data": {},
  "message": "",
  "errors": []
}
```

---

## 6. Standard Error Shape

```json
{
  "success": false,
  "data": null,
  "message": "Không thể thực hiện yêu cầu",
  "errors": [
    {
      "code": "ACCESS_DENIED",
      "field": null,
      "message": "Bạn không có quyền truy cập chức năng này"
    }
  ]
}
```

---

## 7. Open Decisions

```text
[ ] Backend required for MVP or later phase?
[ ] Token/session model?
[ ] Offline sync API required?
[ ] API versioning strategy?
[ ] Audit log requirement?
```
