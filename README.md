# VNS PickleTrack Mobile Prototype

## 1. Overview

**VNS PickleTrack** is a mobile-first prototype for managing Pickleball students/members, coaches, classes, sessions, attendance, package balance, renewal requests, reports and backup workflows.

This repository is currently used as the **prototype source repository** after disconnecting Figma from GitHub.

The prototype supports three roles:

| Role | Purpose |
|---|---|
| Admin | Full business and system management |
| Coach | Class operation and attendance |
| Member / Hội viên | Self-service schedule, package and learning history |

---

## 2. Current Status

```text
Prototype Freeze v1 — Admin / Coach / Member completed
```

The prototype has been disconnected from Figma auto-push. From this point forward, changes should be managed through Git branches, commits and pull requests.

---

## 3. Quick Start

```bash
npm install
npm run dev
```

Then open the local development URL shown by Vite.

---

## 4. Demo Accounts

| Role | Username | PIN |
|---|---|---|
| Admin | admin | 123456 |
| Coach | coach | 111111 |
| Member | member | 222222 |

---

## 5. Repository Structure

```text
.
├── src/                         # Prototype source code — do not restructure casually
│   └── app/
│       ├── App.tsx
│       └── components/
│
├── docs/                        # Durable project documentation
│   ├── README.md
│   ├── 00-project-management/
│   ├── 01-product-ba/
│   ├── 02-ux-prototype/
│   ├── 03-uat-release/
│   └── 04-workflow/
│
├── .github/                     # GitHub workflow templates
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
│
├── package.json
├── vite.config.*
└── README.md
```

---

## 6. Documentation Strategy

There are two documentation layers:

### 6.1 GitHub Issues — Source of Truth

The BA documentation set is maintained in GitHub Issues:

```text
BA-00 — Master Documentation Hub
BA-01 — Product Vision & MVP Scope
BA-02 — Role & Permission Matrix
BA-03 — Sitemap & Screen Flow
BA-04 — Functional Requirements & User Stories
BA-05 — Business Rules & Data Concept
BA-06 — UAT & Demo Test Plan
BA-07 — Figma Documentation Prompt Pack
DEV-01 — Figma Push Workflow & Documentation Safety Rule
```

### 6.2 `/docs` Folder — Working Documentation

The `/docs` folder contains repo-level working documents, project structure, release notes, PM workflow and implementation guidance.

---

## 7. Important Business Rules

| Rule | Description |
|---|---|
| Attendance has 5 statuses | Có mặt, Trễ, Học bù, Vắng, Nghỉ phép |
| Deducting statuses | Có mặt, Trễ, Học bù |
| Non-deducting statuses | Vắng, Nghỉ phép |
| Coach revenue access | Not allowed |
| Member data access | Personal data only |
| Member renewal | Request only; Admin confirms payment/renewal |

---

## 8. Development Policy

- Do not push directly to `main` for major changes.
- Use feature branches.
- Do not modify prototype source casually without issue reference.
- Keep BA/Product decisions in GitHub Issues.
- Keep source code and documentation changes separated when possible.

---

## 9. Recommended Next Steps

1. Keep current prototype as `Prototype Freeze v1`.
2. Review with stakeholders.
3. Confirm MVP scope.
4. Create implementation backlog for production app.
5. Decide production stack and database strategy.
