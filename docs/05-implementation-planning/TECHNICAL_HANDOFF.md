# Technical Handoff Notes

## 1. Purpose

This document provides high-level handoff notes for developers who will convert the prototype into a production application.

The current source is a prototype. Developers should not assume all prototype state, mock data or UI logic is production-ready.

---

## 2. Prototype Nature

Current implementation is a visual/demo prototype.

Expected limitations:

- Mock data.
- UI-level role separation.
- No real backend.
- No real persistence.
- No production authentication.
- Business rules are represented visually and partially in UI state.

---

## 3. Production Architecture Topics

Before implementation, decide:

| Topic | Decision Needed |
|---|---|
| App platform | React/Vite web/PWA MVP baseline; revisit native/hybrid by change request |
| Data storage | Local SQLite / Cloud DB / Hybrid |
| Backend | Required or not for MVP |
| Authentication | PIN, phone login, account login, OTP |
| Sync | Offline-only, manual backup, cloud sync |
| Deployment | APK, store, web app, internal distribution |
| Reporting | Local reports or backend analytics |

---

## 4. Business Logic to Preserve

```text
- 3 roles: Admin / Coach / Member
- Coach cannot see revenue
- Member only sees personal data
- Attendance has 5 statuses
- Học bù deducts one session
- Member renewal is request-only
- Admin confirms package renewal/payment
```

---

## 5. Suggested Production Layers

```text
UI Layer
  |-- Screens
  |-- Components
  |-- Navigation

Application Layer
  |-- Auth Service
  |-- Attendance Service
  |-- Member Service
  |-- Class Service
  |-- Package Service
  |-- Report Service

Domain Layer
  |-- User
  |-- Member
  |-- Coach
  |-- Class
  |-- Session
  |-- Attendance
  |-- Package
  |-- RenewalRequest
  |-- PaymentRenewal

Infrastructure Layer
  |-- Database
  |-- Backup/Export
  |-- Sync
  |-- External services
```

---

## 6. Prototype-to-Production Mapping

| Prototype Area | Production Concern |
|---|---|
| App.tsx routing | Real navigation architecture |
| Mock users | Auth/account database |
| Mock member data | Member table/entity |
| Mock attendance state | Attendance service and persistence |
| UI role checks | Real authorization guards |
| Renewal request UI | Renewal request workflow |
| Backup screen | Real backup/export implementation |

---

## 7. Developer Caution

Do not copy prototype UI logic directly into production without validating:

- Data model.
- Business rules.
- Security rules.
- Error handling.
- Persistence.
- Offline behavior.

The prototype is the UX/BA reference, not final production architecture.
