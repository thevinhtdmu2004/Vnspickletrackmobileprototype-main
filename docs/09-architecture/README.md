# Architecture Documentation Index

## 1. Purpose

This folder contains architecture planning documents for converting **VNS PickleTrack Mobile Prototype** into a production-ready application.

These documents are created after Prototype Freeze v1 and before Sprint 00/Sprint 01 implementation.

---

## 2. Documents

| File | Purpose |
|---|---|
| `ARCHITECTURE_OVERVIEW.md` | High-level production architecture direction |
| `DOMAIN_MODEL.md` | Core domain entities and relationships |
| `AUTHORIZATION_MODEL.md` | Role-based authorization model |
| `DATA_PERSISTENCE_STRATEGY.md` | Data storage, SQLite/cloud/hybrid decision guide |
| `BACKUP_EXPORT_STRATEGY.md` | Backup, export and restore strategy |
| `ADR-001-PRODUCTION_FOUNDATION.md` | Sprint 00 production foundation direction |
| `ADR_TEMPLATE.md` | Architecture Decision Record template |

---

## 3. Key Architecture Principles

```text
- Prototype is UX/BA reference, not production architecture.
- Business rules must be centralized in services/domain layer.
- Role-based authorization must be enforced beyond UI.
- Attendance/package balance logic is business-critical.
- Member data privacy must be protected.
- Coach must not access revenue.
```

---

## 4. Relationship to Sprint Documents

Architecture documents support:

```text
Sprint 00 — Foundation
Sprint 01 — Auth & Role Navigation
Sprint 02 — Member/Class/Session Core
Sprint 03 — Attendance Core
Sprint 04 — Package & Renewal
Sprint 05 — Reports & Member Portal
Sprint 06 — Backup/Export & UAT
```
