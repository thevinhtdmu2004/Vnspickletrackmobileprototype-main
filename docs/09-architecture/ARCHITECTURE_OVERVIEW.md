# Architecture Overview

## 1. Purpose

This document defines the high-level architecture direction for the future production version of VNS PickleTrack.

The current repository is a prototype. Production architecture must be decided and implemented separately with clear layers and business rule protection.

---

## 2. Architecture Goals

| Goal | Description |
|---|---|
| Preserve business rules | Attendance/package logic must remain correct |
| Support 3 roles | Admin, Coach and Member experiences must remain separate |
| Enable mobile-first usage | App should work well on phones during class operations |
| Support offline or low-connectivity use | Pickleball court usage may not always have stable internet |
| Prepare future scalability | Support future cloud sync, member portal and reports |
| Protect financial/member data | Revenue and personal data must be role-protected |

---

## 3. Recommended Layered Architecture

```text
Presentation Layer
  ├── Screens
  ├── Components
  ├── Navigation
  └── View Models / State

Application Layer
  ├── Auth Service
  ├── Member Service
  ├── Class Service
  ├── Session Service
  ├── Attendance Service
  ├── Package Service
  ├── Renewal Service
  ├── Report Service
  └── Backup/Export Service

Domain Layer
  ├── User
  ├── Member
  ├── Coach
  ├── Class
  ├── Session
  ├── AttendanceRecord
  ├── Package
  ├── RenewalRequest
  ├── Payment/Renewal
  └── Permission

Infrastructure Layer
  ├── Local Database
  ├── File Storage
  ├── Backup Exporter
  ├── Sync Adapter
  ├── API Client
  └── Logging
```

---

## 4. Core Services

| Service | Responsibility |
|---|---|
| Auth Service | Login, logout, PIN/account handling, current role |
| Authorization Service | Check screen/action access by role |
| Member Service | Member CRUD, personal profile, balance summary |
| Class Service | Class CRUD and member assignment |
| Session Service | Today sessions, create session, session status |
| Attendance Service | Attendance statuses, save/correction, deduction logic |
| Package Service | Package catalog and package summary |
| Renewal Service | Admin renewal confirmation and Member renewal request |
| Report Service | Role-safe reporting |
| Backup Service | Backup/export/restore workflow |

---

## 5. Critical Architecture Rule

Attendance and package balance must not be calculated independently inside random UI screens.

Recommended:

```text
AttendanceService
  → applies attendance status
  → determines deduction
  → updates/returns balance impact
```

This prevents inconsistent calculation.

---

## 6. Role Access Enforcement

Role access should be enforced in at least two places:

```text
1. Navigation/UI visibility
2. Application service authorization
```

UI hiding alone is not enough for production.

---

## 7. Offline-first Consideration

For a small club/class MVP, a local-first app may be acceptable.

Possible options:

| Option | Description | Suitable When |
|---|---|---|
| Local SQLite only | Data stored on one device | Small single-site operation |
| Local SQLite + backup/export | Local app with manual backup | MVP/pilot |
| Cloud backend | Multi-device sync and centralized data | Growth stage |
| Hybrid | Offline local plus cloud sync | Mature product |

---

## 8. Production Architecture Decision Required

Before Sprint 00 implementation, decide:

```text
- App platform
- Database strategy
- Backend/API requirement
- Authentication model
- Backup/sync model
- Deployment model
```

These should be recorded using `ADR_TEMPLATE.md`.

---

## 9. Architecture Risks

| Risk | Mitigation |
|---|---|
| Wrong attendance deduction | Centralize logic in Attendance Service |
| Coach sees revenue | Enforce authorization in services and UI |
| Member sees other data | Enforce data ownership filters |
| Local data loss | Backup/export strategy |
| Scope creep | Change control |

---

## 10. Recommended Next Step

Create an ADR for the production stack decision.

Suggested title:

```text
ADR-001 — Production Platform and Data Strategy
```
