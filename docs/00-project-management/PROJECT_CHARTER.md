# Project Charter — VNS PickleTrack Mobile Prototype

## 1. Project Name

**VNS PickleTrack Mobile Prototype**

## 2. Project Purpose

Create a mobile-first prototype for managing Pickleball members, coaches, classes, attendance, package balance, renewal requests, reports and backup workflows.

## 3. Project Type

Prototype / UX validation / BA discovery artifact.

This is not yet a production application.

## 4. Current Status

```text
Prototype Freeze v1 — Completed for Admin / Coach / Member review
```

## 5. Key Roles

| Role | Responsibility |
|---|---|
| Project Owner | Defines business direction and approves MVP scope |
| PM / BA | Maintains scope, flow, requirements and documentation |
| UX Designer | Maintains Figma/prototype experience |
| Developer | Converts validated prototype into production app later |
| Tester / UAT User | Validates business flows and usability |

## 6. Product Roles

| Product Role | Description |
|---|---|
| Admin | Full management role |
| Coach | Attendance and class operation role |
| Member | Self-service role for learners/members |

## 7. Success Criteria

- 3-role prototype is demo-ready.
- Admin can access management/revenue features.
- Coach can perform attendance but not see revenue.
- Member can view only personal information.
- Attendance has 5 statuses.
- Học bù deducts one session.
- Role-based access is clear in the UI.

## 8. Governance Rules

- Source code changes should be issue-driven.
- `src/` should not be restructured casually.
- BA documents should be preserved in GitHub Issues.
- Figma is no longer connected for automatic GitHub push.
- Future changes should go through Git branches and pull requests.
