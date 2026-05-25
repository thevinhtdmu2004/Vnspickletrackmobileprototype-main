# Member API Contract

## 1. Purpose

Defines API planning for student/member management.

---

## 2. Endpoints

## GET /api/v1/members

Admin-only or Coach-limited.

### Query

```text
?page=1&pageSize=20&keyword=&status=&classId=
```

### Response Data Item

```json
{
  "memberId": "mem_001",
  "fullName": "Nguyễn Văn A",
  "phone": "0900000000",
  "level": "Beginner",
  "status": "Active",
  "defaultClassName": "Beginner A",
  "totalSessions": 12,
  "usedSessions": 5,
  "remainingSessions": 7
}
```

---

## GET /api/v1/members/{memberId}

### Rule

```text
Admin can view all.
Coach can view members in assigned classes.
Member can only view own profile through /me endpoint.
```

---

## POST /api/v1/members

Admin-only.

### Request

```json
{
  "fullName": "Nguyễn Văn A",
  "phone": "0900000000",
  "level": "Beginner",
  "defaultClassId": "cls_001",
  "status": "Active",
  "notes": ""
}
```

---

## PUT /api/v1/members/{memberId}

Admin-only.

---

## GET /api/v1/members/me

Member-only.

Returns current member's own profile.

---

## 3. Errors

| Code | Meaning |
|---|---|
| MEMBER_NOT_FOUND | Member does not exist |
| ACCESS_DENIED | User cannot access member data |
| VALIDATION_ERROR | Invalid member data |
