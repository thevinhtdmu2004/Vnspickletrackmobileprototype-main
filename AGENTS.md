# AGENTS.md — Codex Rules for VNS PickleTrack

## 1. Project Context

This repository contains the **VNS PickleTrack Mobile Prototype**.

The project is currently in:

```text
Prototype Freeze v1 — Admin / Coach / Member completed
```

The prototype is a UX/BA reference for a future production application.

The current source under `src/` is prototype code and must be handled carefully.

---

## 2. Product Summary

VNS PickleTrack is a mobile-first app prototype for Pickleball operations:

- Member/student management.
- Coach and class management.
- Class session management.
- Attendance tracking.
- Package balance tracking.
- Renewal request and package renewal.
- Reports.
- Backup/export workflow.
- Member self-service portal.

The app supports three roles:

| Role | Meaning |
|---|---|
| Admin | Full management role |
| Coach | Attendance and class operation role |
| Member | Self-service role for learners/members |

---

## 3. Golden Business Rules

Codex must preserve these rules unless there is an explicit approved change request:

```text
1. Admin has full business and configuration access.
2. Coach can operate classes and attendance but must not see revenue.
3. Member can only view personal data.
4. Member cannot mark attendance.
5. Member renewal is request-only; Admin confirms package renewal/payment.
6. Attendance has exactly 5 MVP statuses:
   - Có mặt
   - Trễ
   - Học bù
   - Vắng
   - Nghỉ phép
7. Deducting statuses:
   - Có mặt
   - Trễ
   - Học bù
8. Non-deducting statuses:
   - Vắng
   - Nghỉ phép
9. Học bù must deduct one session.
10. Coach and Member must not access revenue screens.
```

---

## 4. Source Code Safety Rules

### 4.1 Do not restructure source casually

Do not move, rename, or reorganize files under `src/` unless the task explicitly asks for it.

### 4.2 Do not rewrite the prototype wholesale

Avoid large rewrites. Prefer targeted, minimal changes.

### 4.3 Do not change business rules silently

If a task changes attendance, package, role or permission logic, update relevant docs or clearly mention the impact.

### 4.4 Preserve role-based access

When adding routes or screens, verify access for:

- Admin.
- Coach.
- Member.

### 4.5 Revenue is Admin-only

Any new revenue, payment summary, sales chart or financial dashboard must be hidden from Coach and Member.

### 4.6 Member is personal-data only

Member screens must not expose:

- All-student lists.
- Other member profiles.
- Class rosters unless explicitly scoped to their own class view.
- Revenue.
- Admin settings.

---

## 5. Documentation Rules

Durable BA source of truth is stored in GitHub Issues:

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

Working docs are stored under:

```text
docs/
```

When Codex changes behavior, docs should be updated if the change affects:

- Role permissions.
- Screen flow.
- Attendance logic.
- Package renewal logic.
- UAT checklist.
- Release notes.

---

## 6. Change Control Rules

After Prototype Freeze v1:

Allowed without major approval:

- Typo and wording fixes.
- Minor UI polish.
- Small permission bug fixes.
- Documentation additions.
- Test/checklist additions.

Requires change request:

- New major module.
- New role.
- Business rule change.
- Major navigation redesign.
- Database/backend architecture decision.
- Payment gateway or cloud sync feature.

---

## 7. Coding Style Guidance

The current prototype is React/Vite based.

When editing code:

- Keep TypeScript types clear.
- Prefer small components.
- Keep UI labels in Vietnamese.
- Preserve existing visual style and color tokens.
- Avoid adding unnecessary dependencies.
- Avoid introducing backend assumptions into prototype code.
- Avoid replacing mock data with incomplete real-data stubs.

---

## 8. Testing Checklist for Codex Changes

After any source change, Codex should check:

```text
[ ] App compiles
[ ] Admin login routes to Admin dashboard
[ ] Coach login routes to Coach dashboard
[ ] Member login routes to Member dashboard
[ ] Coach cannot see revenue
[ ] Member cannot access Admin/Coach navigation
[ ] Attendance still has 5 statuses
[ ] Học bù still deducts one session
[ ] AccessDeniedScreen still works for blocked routes
[ ] Demo flows still do not dead-end
```

---

## 9. Commit and PR Guidance

Recommended commit prefixes:

```text
docs: documentation only
fix: bug fix
feat: new feature
chore: maintenance
refactor: internal cleanup without behavior change
```

For pull requests:

- Reference related issue.
- State affected roles.
- State affected screens.
- State business-rule impact.
- Include test notes.

---

## 10. Codex Operating Principle

```text
Do not optimize the prototype into something different.
Preserve the validated product flow.
Make small, safe, explainable changes.
```
