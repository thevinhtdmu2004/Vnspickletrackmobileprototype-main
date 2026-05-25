# Sprint Execution Rules

## 1. Purpose

These rules define how Codex must execute sprint work for VNS PickleTrack.

They must be read before starting any sprint implementation, sprint documentation update, sprint closure review or sprint PR preparation.

---

## 2. Required Context Check

Before making changes, Codex must inspect:

```text
- Root AGENTS.md
- Current git status
- Target sprint plan
- Target sprint backlog
- Target sprint acceptance criteria
- Relevant sprint review/report files
```

For behavior changes, Codex must also inspect the related BA or technical docs.

---

## 3. Business Rules That Must Not Regress

```text
- Admin has full business and configuration access.
- Coach can operate classes and attendance but must not see revenue.
- Member can only view personal data.
- Member cannot mark attendance.
- Member renewal is request-only.
- Admin confirms package renewal/payment.
- Attendance has exactly 5 MVP statuses: Có mặt, Trễ, Học bù, Vắng, Nghỉ phép.
- Deducting statuses are Có mặt, Trễ and Học bù.
- Non-deducting statuses are Vắng and Nghỉ phép.
- Học bù must deduct one session.
```

---

## 4. Source Change Rules

```text
- Do not restructure source casually.
- Do not rewrite prototype screens wholesale.
- Keep UI labels in Vietnamese.
- Preserve current visual style and flow.
- Prefer targeted fixes aligned to the sprint backlog.
- Do not introduce backend/cloud/payment assumptions unless explicitly approved.
```

---

## 5. Sprint Documentation Rules

When a sprint implementation changes behavior, update the relevant sprint docs:

```text
- SPRINT_##_PLAN.md
- SPRINT_##_BACKLOG.md
- SPRINT_##_ACCEPTANCE_CRITERIA.md
- SPRINT_##_REVIEW.md
- Sprint-specific regression checklist
- Implementation report when present or needed
```

Do not mark a sprint completed unless:

```text
- Backlog items are done or explicitly deferred.
- Acceptance criteria are met or explicitly documented as pending.
- Role and business-rule regression has been checked.
- Validation notes are recorded.
```

---

## 6. Validation Rules

After source changes, Codex should run:

```text
npm.cmd run build
git diff --check
```

If build cannot run due to sandbox restrictions, retry with approval. If still not run, document the blocker clearly.

For docs-only changes, `git diff --check` is sufficient unless the docs reference generated files or source behavior that needs build validation.

---

## 7. PR Rules

Sprint PR descriptions should include:

```text
- Sprint number and name
- Affected roles
- Affected screens/docs
- Business-rule impact
- Validation performed
- Known remaining UAT/manual checklist items
```
