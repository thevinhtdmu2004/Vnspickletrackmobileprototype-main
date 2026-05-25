# Auth Security

## 1. Purpose

Defines authentication and PIN/account security expectations.

---

## 2. MVP Login Model

Prototype accounts:

| Role | Username | PIN |
|---|---|---|
| Admin | admin | 123456 |
| Coach | coach | 111111 |
| Member | member | 222222 |

Production must not use these fixed demo credentials.

---

## 3. PIN Storage Rule

```text
Never store PIN in plain text.
```

Recommended:

```text
PinHash = hash(PIN + salt)
```

---

## 4. Login Protection

Recommended production controls:

```text
- Failed login counter
- Temporary lockout after repeated failures
- Session timeout
- Change PIN after first login if default PIN is used
- Audit failed login attempts if possible
```

---

## 5. Change PIN Rules

```text
- User must provide current PIN
- New PIN and confirm PIN must match
- New PIN should not be too simple
- PIN update must invalidate old credential
```

---

## 6. Open Decisions

```text
[ ] PIN-only or username/password?
[ ] Phone number login required?
[ ] OTP required in future?
[ ] Device binding needed?
[ ] Session timeout duration?
```
