# ADR-001 - Production Foundation Direction

## Status

Accepted

## Date

2026-05-05

## Context

The repository currently contains the VNS PickleTrack Mobile Prototype at Prototype Freeze v1. The prototype is a UX/BA reference and should not be optimized into a different product flow.

Sprint 00 needs enough foundation to allow implementation sprints to proceed without prematurely introducing a backend, payment gateway, cloud sync model or native platform.

Key constraints:

```text
- Admin has full access.
- Coach can operate classes and attendance but cannot see revenue.
- Member can only view personal data.
- Member cannot mark attendance.
- Member renewal is request-only.
- Học bù deducts one session.
- Production implementation must preserve the prototype flow.
```

## Decision

Use a mobile-first web/PWA foundation based on the current React/Vite prototype and keep the prototype source stable.

Accepted production direction for the first MVP/pilot:

```text
- Mobile-first app experience.
- React/Vite web/PWA as the default implementation path.
- Role-aware navigation shell.
- Centralized authorization model.
- Centralized Attendance Service for deduction logic.
- Centralized Package/Renewal Service for balance changes.
- Local-first pilot data strategy with manual backup/export.
- PIN/account authentication scoped to the local MVP app.
- Member self-service remains in-app and role-scoped; independent public member own-device login is not included in Sprint 00 foundation.
```

Explicitly deferred from the first MVP foundation:

```text
- Native/hybrid app rewrite.
- Cloud backend or hybrid sync.
- Payment gateway integration.
- Independent member login from personal devices.
```

## Consequences

Positive:

```text
- Sprint 01 can start with clear role, navigation and service boundaries.
- Prototype source remains stable.
- Business rules stay visible before implementation.
- Architecture risk is documented before code is introduced.
```

Tradeoffs:

```text
- Multi-device and public member login are deferred.
- Admin backup discipline is required for local-first MVP.
- A later cloud/hybrid migration may be required if rollout scope expands.
```

## Follow-up Required

```text
[x] Product owner direction recorded through Sprint 00 continuation request.
[x] Production platform baseline accepted for MVP/pilot.
[x] Data persistence and auth baseline accepted for MVP/pilot.
[x] Member own-device login deferred from MVP foundation.
```

Future trigger:

```text
Revisit cloud/hybrid sync through change request if rollout requires multi-device access.
```

## Related Documents

```text
docs/08-sprints/sprint-00-foundation/SPRINT_00_FOUNDATION_BASELINE.md
docs/09-architecture/ARCHITECTURE_OVERVIEW.md
docs/09-architecture/AUTHORIZATION_MODEL.md
docs/09-architecture/DATA_PERSISTENCE_STRATEGY.md
docs/09-architecture/DOMAIN_MODEL.md
docs/01-product-ba/ROLE_PERMISSION_SUMMARY.md
```
