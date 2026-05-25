# Codex Don't Touch Rules

## 1. Purpose

This document defines areas Codex must not change without explicit approval.

---

## 2. Do Not Change Business Rules Without Approval

Do not change:

```text
Có mặt  → deduct session
Trễ     → deduct session
Học bù  → deduct session
Vắng    → no deduction
Nghỉ phép → no deduction
```

Do not change:

```text
Coach cannot see revenue.
Member only sees personal data.
Member cannot mark attendance.
Member renewal is request-only.
Admin confirms package renewal/payment.
```

---

## 3. Do Not Add Major Scope Without Approval

Do not add these unless requested:

```text
- New user role
- Booking/reservation module
- Payment gateway
- Cloud sync
- Notification system
- Zalo Mini App
- Multi-tenant system
- Production backend
```

---

## 4. Do Not Restructure Source Without Approval

Avoid moving or renaming:

```text
src/app/App.tsx
src/app/components/
src/styles/
```

Do not reorganize the source tree as part of documentation or PM tasks.

---

## 5. Do Not Replace the Prototype Architecture Casually

Do not convert the prototype to another framework or architecture unless explicitly requested.

Do not replace the current React/Vite prototype structure during small fixes.

---

## 6. Do Not Store Critical BA Knowledge Only in Generated Files

Critical BA knowledge belongs in:

```text
GitHub Issues BA-00 → BA-07
docs/
```

Do not make `src/app/components/ScreenFlowDocument.tsx` the only source of truth.

---

## 7. Do Not Hide Risk

If a requested change may affect:

- Permission.
- Attendance.
- Package balance.
- Member privacy.
- Revenue visibility.

Codex must call it out in the final response.

---

## 8. Red Flag Changes

If a task asks for any of the following, pause and treat as high-risk:

```text
- Let Coach see revenue
- Let Member edit attendance
- Make Học bù not deduct session
- Allow Member to directly add package sessions
- Remove AccessDeniedScreen
- Merge Admin and Member navigation
- Remove role checks
```

These require explicit product owner approval.
