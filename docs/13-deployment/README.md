# Deployment Documentation Index

## 1. Purpose

This folder contains deployment planning documents for VNS PickleTrack.

The current repository is still a prototype. These documents prepare future MVP deployment and pilot release.

---

## 2. Documents

| File | Purpose |
|---|---|
| `DEPLOYMENT_OVERVIEW.md` | Deployment strategy overview |
| `ENVIRONMENT_STRATEGY.md` | Dev / Test / UAT / Production environments |
| `BUILD_RELEASE_PROCESS.md` | Build and release process |
| `PILOT_DEPLOYMENT_PLAN.md` | Pilot rollout plan |
| `ROLLBACK_PLAN.md` | Rollback and recovery strategy |

---

## 3. Deployment Principles

```text
- Do not deploy prototype as production without implementation readiness review.
- Production release must pass Admin / Coach / Member UAT.
- Backup/export strategy must be confirmed before pilot.
- Known issues must be documented before release.
```
