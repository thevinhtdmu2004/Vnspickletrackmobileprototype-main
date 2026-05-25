# Implementation Readiness

## 1. Purpose

This document defines the readiness checklist before moving from prototype to production implementation.

The current repository contains a validated prototype. Before building the production app, the team should confirm product scope, business rules, technical direction and delivery plan.

---

## 2. Current Prototype Status

```text
Prototype Freeze v1 - Admin / Coach / Member completed
```

Covered roles:

- Admin.
- Coach.
- Member / Hội viên.

Covered journeys:

- Role login.
- Role dashboards.
- Attendance flow.
- Student/member management.
- Class/session management.
- Package renewal and request.
- Reports.
- Backup/export prototype.
- Screen flow documentation.

---

## 3. Readiness Checklist

### Product / BA

```text
[x] MVP scope confirmed through Prototype Freeze v1 documentation
[x] Role permissions confirmed
[x] Attendance rules confirmed
[x] Package rules confirmed
[x] Member renewal request flow confirmed
[x] Coach revenue restriction confirmed
[x] Member personal data boundary confirmed
```

### UX / Prototype

```text
[x] Admin journey reviewed
[x] Coach journey reviewed
[x] Member journey reviewed
[x] Screen Flow Document reviewed
[ ] Known wording issues documented
[x] No major missing MVP screen documented for Prototype Freeze v1
```

### Technical

```text
[x] Production technology stack selected for MVP/pilot baseline
[x] Database strategy selected for MVP/pilot baseline
[x] Authentication strategy selected for MVP/pilot baseline
[x] Offline/online strategy selected for MVP/pilot baseline
[x] Backup/sync strategy selected for MVP/pilot baseline
[ ] Deployment target selected
[ ] Logging/monitoring approach selected
```

### Delivery

```text
[x] Implementation backlog prepared
[x] Sprint 0 scope defined
[x] Development environment defined
[x] Code repository workflow defined
[x] UAT plan prepared
[x] Release plan prepared
```

---

## 4. Key Decisions Needed Before Implementation

| Decision | Current direction | Owner |
|---|---|---|
| Production platform | React/Vite mobile-first web/PWA for MVP/pilot | Product + Tech Lead |
| Data storage | Local-first SQLite direction with manual backup/export | Tech Lead |
| Sync model | Offline/local-first MVP, cloud sync deferred | Product + Tech Lead |
| Authentication | Local PIN/account baseline for MVP/pilot | Product + Tech Lead |
| Member access | In-app role-scoped member self-service; own-device login deferred | Product |
| Revenue module | Admin-only MVP reporting; Coach/Member excluded | Product |
| Backup/export | Local manual backup/export, Admin-only | Tech Lead |

---

## 5. Implementation Gate

The project may proceed sprint-by-sprint when:

```text
- MVP scope is frozen.
- Business rules are approved.
- Technical baseline is selected.
- Backlog is prepared.
- Source workflow is stable.
- Prototype is accepted by stakeholders.
```

Remaining non-blocking production hardening items:

```text
- Confirm deployment target.
- Confirm logging/monitoring approach.
- Complete manual UAT before demo/release.
```

---

## 6. Recommended Next Action

Continue production implementation by sprint order:

```text
Sprint 03 - Attendance Core
- Attendance screen
- 5 MVP statuses
- Deduction mapping
- Low/zero balance warning
- Save/correction baseline
- Attendance regression checklist
```
