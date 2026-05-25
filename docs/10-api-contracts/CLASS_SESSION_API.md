# Class & Session API Contract

## 1. Purpose

Defines API planning for recurring classes and date-specific sessions.

---

## 2. Class Endpoints

## GET /api/v1/classes

### Response Item

```json
{
  "classId": "cls_001",
  "className": "Beginner A",
  "level": "Beginner",
  "coachId": "coach_001",
  "coachName": "Coach Nam",
  "court": "Sân 1",
  "schedule": ["Mon", "Wed", "Fri"],
  "startTime": "18:00",
  "endTime": "19:30",
  "status": "Open",
  "memberCount": 8
}
```

---

## POST /api/v1/classes

Admin-only.

---

## PUT /api/v1/classes/{classId}

Admin-only.

---

## POST /api/v1/classes/{classId}/members

Assign members to class.

Admin-only.

### Request

```json
{
  "memberIds": ["mem_001", "mem_002"]
}
```

---

## 3. Session Endpoints

## GET /api/v1/sessions/today

Admin/Coach.

### Response Item

```json
{
  "sessionId": "ses_001",
  "classId": "cls_001",
  "className": "Beginner A",
  "sessionDate": "2026-05-02",
  "startTime": "18:00",
  "endTime": "19:30",
  "court": "Sân 1",
  "coachName": "Coach Nam",
  "status": "Planned",
  "memberCount": 8
}
```

---

## POST /api/v1/sessions

Create session from class.

Admin or approved Coach permission.

### Request

```json
{
  "classId": "cls_001",
  "sessionDate": "2026-05-02"
}
```

---

## GET /api/v1/sessions/{sessionId}

Admin/Coach. Member may only view own schedule through member endpoints.

---

## PUT /api/v1/sessions/{sessionId}/status

Admin/Coach.

### Request

```json
{
  "status": "Completed"
}
```

---

## 4. Errors

| Code | Meaning |
|---|---|
| CLASS_NOT_FOUND | Class does not exist |
| SESSION_NOT_FOUND | Session does not exist |
| SESSION_ALREADY_EXISTS | Duplicate session for class/date |
| ACCESS_DENIED | User cannot access class/session |
