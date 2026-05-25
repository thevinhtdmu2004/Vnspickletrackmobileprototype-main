# Risk Register

## 1. Purpose

This document tracks key risks for the VNS PickleTrack project as it moves from prototype to production planning.

---

## 2. Risk Table

| ID | Risk | Impact | Probability | Severity | Mitigation |
|---|---|---:|---:|---:|---|
| R-001 | Prototype mistaken as production-ready app | High | Medium | High | Clearly label prototype and define production readiness gate |
| R-002 | Attendance business rule implemented incorrectly | High | Medium | High | Keep BA-05 as source of truth; test Học bù deduct rule |
| R-003 | Coach sees revenue data | High | Low | High | Enforce role guards and UAT permission tests |
| R-004 | Member accesses other member data | High | Low | High | Implement real authorization in production |
| R-005 | Package balance incorrect | High | Medium | High | Centralize attendance/package calculation in service layer |
| R-006 | Figma overwrites repo files again | Medium | Low | Medium | Keep Figma disconnected or use separate branch only |
| R-007 | Scope creep after prototype freeze | Medium | High | Medium | Use change control and approval process |
| R-008 | No clear backend/data strategy | High | Medium | High | Decide architecture before Sprint 0 |
| R-009 | Local-only data loss | High | Medium | High | Define backup/sync strategy before production |
| R-010 | UI too complex for Coach during class | Medium | Medium | Medium | UAT with real Coach user |

---

## 3. Highest Priority Risks

```text
1. Incorrect attendance/package balance
2. Role permission leakage
3. Data loss strategy
4. Scope creep after freeze
```

---

## 4. Review Frequency

Review this register:

- Before implementation planning.
- Before Sprint 0.
- Before UAT.
- Before pilot deployment.
