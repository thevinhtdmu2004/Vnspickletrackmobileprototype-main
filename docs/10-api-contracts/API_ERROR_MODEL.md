# API Error Model

## 1. Purpose

Defines the standard API error model for VNS PickleTrack.

---

## 2. Standard Error Response

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

## 3. Common Error Codes

| Code | Meaning |
|---|---|
| VALIDATION_ERROR | Invalid request data |
| ACCESS_DENIED | User lacks permission |
| UNAUTHENTICATED | User is not logged in |
| NOT_FOUND | Resource does not exist |
| CONFLICT | Duplicate or conflicting data |
| BUSINESS_RULE_VIOLATION | Request violates business rule |
| ZERO_BALANCE_WARNING | Deducting attendance for zero-balance member |
| SERVER_ERROR | Unexpected server error |

---

## 4. Field-level Error Example

```json
{
  "success": false,
  "data": null,
  "message": "Dữ liệu không hợp lệ",
  "errors": [
    {
      "code": "VALIDATION_ERROR",
      "field": "fullName",
      "message": "Vui lòng nhập họ tên"
    }
  ]
}
```

---

## 5. Business Rule Error Example

```json
{
  "success": false,
  "data": {
    "memberId": "mem_003",
    "remainingSessions": 0
  },
  "message": "Học viên đã hết buổi",
  "errors": [
    {
      "code": "ZERO_BALANCE_WARNING",
      "field": "attendanceStatus",
      "message": "Học viên đã hết buổi. Vui lòng xác nhận trước khi lưu điểm danh."
    }
  ]
}
```

---

## 6. Access Denied Example

```json
{
  "success": false,
  "data": null,
  "message": "Không có quyền truy cập",
  "errors": [
    {
      "code": "ACCESS_DENIED",
      "field": null,
      "message": "Chỉ Admin mới được xem báo cáo doanh thu"
    }
  ]
}
```
