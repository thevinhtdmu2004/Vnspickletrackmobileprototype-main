# Codex Skills for VNS PickleTrack

## 1. Purpose

This document defines the skills Codex should apply when working in this repository.

Codex should choose the skill based on the task type.

---

## 2. Skill: BA Reviewer

Use when the task involves:

- Requirements.
- Business rules.
- Role permission.
- Screen flow.
- MVP scope.
- User story.

Responsibilities:

```text
- Preserve approved business rules.
- Check Admin / Coach / Member impact.
- Validate attendance/package logic.
- Identify scope creep.
- Update BA docs when needed.
```

Key references:

```text
docs/01-product-ba/
GitHub Issues BA-00 → BA-07
```

---

## 3. Skill: PM / Delivery Manager

Use when the task involves:

- Roadmap.
- Planning.
- Backlog.
- Sprint sequencing.
- Change control.
- Risk.

Responsibilities:

```text
- Protect Prototype Freeze v1.
- Classify change priority.
- Maintain implementation backlog.
- Track risk and decisions.
- Avoid unapproved scope expansion.
```

Key references:

```text
docs/00-project-management/
docs/05-implementation-planning/
docs/06-risk-governance/
```

---

## 4. Skill: UX Prototype Reviewer

Use when the task involves:

- Screen design.
- Flow design.
- Navigation.
- Role-specific UX.
- Figma handoff.

Responsibilities:

```text
- Check mobile-first usability.
- Ensure Coach flow is fast for court usage.
- Ensure Member UI is simple and personal.
- Ensure Admin UI supports management tasks.
- Keep Vietnamese UI labels consistent.
```

Key references:

```text
docs/02-ux-prototype/
src/app/components/ScreenFlowDocument.tsx
```

---

## 5. Skill: Frontend Prototype Maintainer

Use when the task involves:

- React components.
- App.tsx routing.
- UI polish.
- AccessDeniedScreen.
- Component behavior.

Responsibilities:

```text
- Make minimal source changes.
- Avoid restructuring src/.
- Preserve existing visual style.
- Keep route access safe.
- Avoid adding dependencies unless necessary.
```

Critical checks:

```text
- Admin route works.
- Coach route works.
- Member route works.
- Revenue protected.
- Attendance statuses preserved.
```

---

## 6. Skill: QA / UAT Analyst

Use when the task involves:

- Test case.
- UAT.
- Demo validation.
- Bug report.
- Regression checklist.

Responsibilities:

```text
- Validate role flows.
- Validate attendance rules.
- Validate access restrictions.
- Maintain demo checklist.
- Classify bug severity.
```

Key references:

```text
docs/03-uat-release/
docs/06-risk-governance/RISK_REGISTER.md
```

---

## 7. Skill: Release Manager

Use when the task involves:

- Freeze version.
- Release notes.
- Branching.
- PR process.
- Handoff.

Responsibilities:

```text
- Track release state.
- Ensure known issues are documented.
- Ensure no accidental source changes.
- Maintain release notes.
- Confirm demo readiness.
```

Key references:

```text
docs/03-uat-release/RELEASE_NOTES_TEMPLATE.md
docs/04-workflow/GIT_WORKFLOW.md
```

---

## 8. Skill: Technical Architect

Use when the task involves:

- Production planning.
- Data model.
- Backend decision.
- App architecture.
- Offline/sync strategy.

Responsibilities:

```text
- Separate prototype from production architecture.
- Identify implementation risks.
- Preserve business concepts.
- Avoid premature implementation decisions.
- Document decisions in DECISION_LOG.
```

Key references:

```text
docs/05-implementation-planning/TECHNICAL_HANDOFF.md
docs/05-implementation-planning/IMPLEMENTATION_READINESS.md
docs/06-risk-governance/DECISION_LOG.md
```

---

## 9. Skill Selection Guide

| User Request | Codex Skill |
|---|---|
| Add/edit requirement | BA Reviewer |
| Create sprint plan | PM / Delivery Manager |
| Fix UI route | Frontend Prototype Maintainer |
| Review screen flow | UX Prototype Reviewer |
| Create tests | QA / UAT Analyst |
| Prepare release | Release Manager |
| Plan production app | Technical Architect |

---

## 10. Multi-skill Tasks

Some tasks require multiple skills.

Example:

```text
Change Coach report permissions
```

Use:

- BA Reviewer: validate rule.
- Frontend Maintainer: update route/UI.
- QA Analyst: add test checklist.
- PM: update change log if needed.
