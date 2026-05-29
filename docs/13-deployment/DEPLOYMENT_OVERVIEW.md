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

---

## 6. Current Live Status & CI/CD Pipeline

The project is containerized using Docker and configured with a CI/CD workflow to push images directly to Docker Hub.

* **GitHub Repository:** [thevinhtdmu2004/Vnspickletrackmobileprototype-main](https://github.com/thevinhtdmu2004/Vnspickletrackmobileprototype-main)
* **Docker Hub Repository:** [thevinhtdmu2004/vnspickletrack-app](https://hub.docker.com/r/thevinhtdmu2004/vnspickletrack-app)
* **CI/CD Workflow:** `.github/workflows/docker-ci-cd.yml` automatically triggers on push to branch `master`. It builds the Docker image using `Dockerfile` and pushes the tagged images:
  * `thevinhtdmu2004/vnspickletrack-app:latest`
  * `thevinhtdmu2004/vnspickletrack-app:<commit-sha>` (e.g. `4be649dd3a035990cf0e233685dd2598d01d6ef9`)
