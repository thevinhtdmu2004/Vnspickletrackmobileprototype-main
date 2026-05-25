# Attendance API Contract

## 1. Purpose

Defines API planning for attendance recording and correction.

Attendance is business-critical because it affects member session balance.

---

## 2. Endpoints

## GET /api/v1/sessions/{sessionId}/attendance

Admin/Coach.

Returns attendance list for a session.

---

## POST /api/v1/sessions/{sessionId}/attendance

Admin/Coach.

Saves attendance records for a session.

### Request

```json
{
  "records": [
    {
      "memberId": "mem_001",
      "status": "Present"
    },
    {
      "memberId": "mem_002",
      "status": "Makeup"
    }
  ]
}
```

### Response

```json
{
  "success": true,
  "data": {
    "sessionId": "ses_001",
    "savedCount": 2,
    "summary": {
      "present": 1,
      "late": 0,
      "makeup": 1,
      "absent": 0,
      "leave": 0
    }
  },
  "message": "Đã lưu điểm danh",
  "errors": []
}
```

---

## PUT /api/v1/attendance/{attendanceId}

Admin/Coach.

Corrects an attendance record.

---

## 3. Status Values

| API Value | Vietnamese | Deduct Session |
|---|---|---:|
| Present | Có mặt | Yes |
| Late | Trễ | Yes |
| Makeup | Học bù | Yes |
| Absent | Vắng | No |
| Leave | Nghỉ phép | No |

---

## 4. Critical Rules

```text
- Học bù must deduct one session.
- Member cannot mark attendance.
- Cancelled session cannot save attendance.
- Zero-balance warning should be returned before/with save validation depending on design.
```

---

## 5. Suggested Validation Errors

| Code | Meaning |
|---|---|
| SESSION_CANCELLED | Cannot save attendance for cancelled session |
| MEMBER_NOT_IN_SESSION | Member is not assigned to this session/class |
| ZERO_BALANCE_WARNING | Deducting status selected for zero-balance member |
| INVALID_ATTENDANCE_STATUS | Status value is invalid |
| ACCESS_DENIED | User cannot save attendance |

---

## 6. Balance Handling Note

Production should centralize balance updates in Attendance Service.

UI should not calculate final balance independently.
