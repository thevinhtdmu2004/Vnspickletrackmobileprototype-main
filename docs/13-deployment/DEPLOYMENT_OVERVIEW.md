# Deployment Overview

## 1. Purpose

Defines high-level deployment approach for VNS PickleTrack.

---

## 2. Deployment Stages

```text
Prototype Review
→ MVP Development
→ Internal Test
→ UAT
→ Pilot Deployment
→ Production Release
```

---

## 3. Deployment Targets

Possible targets:

| Target | Description |
|---|---|
| Internal APK | Android APK for internal/pilot users |
| App Store / Play Store | Public distribution later |
| Web App | Browser-based deployment if web stack selected |
| Admin Device Only | Local-first single-device MVP |
| Cloud-backed App | Multi-device future deployment |

---

## 4. Release Gates

Before pilot deployment:

```text
[ ] Role login works
[ ] Admin/Coach/Member UAT passed
[ ] Attendance rules passed
[ ] Package renewal rules passed
[ ] Backup/export strategy confirmed
[ ] Known issues documented
[ ] Rollback plan prepared
```

---

## 5. MVP Deployment Recommendation

For early MVP:

```text
Internal APK or controlled internal distribution
```

Public store release should wait until security, backup and support processes are ready.
