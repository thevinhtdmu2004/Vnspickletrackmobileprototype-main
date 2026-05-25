# Auth API Contract

## 1. Purpose

Defines authentication API planning for VNS PickleTrack.

---

## 2. Endpoints

## POST /api/v1/auth/login

### Request

```json
{
  "username": "admin",
  "pin": "123456"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "userId": "usr_001",
    "displayName": "Admin",
    "role": "Admin",
    "accessToken": "token",
    "expiresAt": "2026-05-02T18:00:00Z"
  },
  "message": "Đăng nhập thành công",
  "errors": []
}
```

---

## POST /api/v1/auth/logout

### Response

```json
{
  "success": true,
  "data": null,
  "message": "Đã đăng xuất",
  "errors": []
}
```

---

## POST /api/v1/auth/change-pin

### Request

```json
{
  "currentPin": "123456",
  "newPin": "654321",
  "confirmPin": "654321"
}
```

### Rules

```text
- User must be authenticated.
- New PIN must match confirmation.
- PIN must not be stored as plain text.
```

---

## 3. Roles

```text
Admin
Coach
Member
```

---

## 4. Errors

| Code | Meaning |
|---|---|
| INVALID_CREDENTIALS | Username or PIN is invalid |
| ACCOUNT_LOCKED | User account is locked |
| PIN_MISMATCH | New PIN and confirm PIN do not match |
| ACCESS_DENIED | User cannot access this function |
