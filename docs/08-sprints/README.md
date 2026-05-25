# Sprint Documentation Index

## 1. Purpose

This folder manages implementation documentation by sprint.

It is used after **Prototype Freeze v1** to plan and track production implementation work.

---

## 2. Required Codex Rules And Skill

Before working on any sprint, Codex must read:

```text
docs/07-codex-rules/SPRINT_AGENTS.md
docs/07-codex-rules/rules/SPRINT_EXECUTION_RULES.md
docs/07-codex-rules/skills/SPRINT_WORKFLOW_SKILL.md
```

These files define sprint execution rules, closure gates and the workflow skill for sprint implementation.

---

## 3. Sprint Documentation Structure

```text
docs/08-sprints/
|-- README.md
|-- SPRINT_PLAN_TEMPLATE.md
|-- SPRINT_BACKLOG_TEMPLATE.md
|-- SPRINT_REVIEW_TEMPLATE.md
|-- sprint-00-foundation/
|   |-- SPRINT_00_PLAN.md
|   |-- SPRINT_00_BACKLOG.md
|   |-- SPRINT_00_ACCEPTANCE_CRITERIA.md
|   |-- SPRINT_00_REVIEW.md
```

---

## 4. Recommended Sprint Roadmap

| Sprint | Name | Objective |
|---|---|---|
| Sprint 00 | Foundation | Setup project foundation, architecture, navigation, role model |
| Sprint 00 | Blazor CSS Migration | Move reusable CSS from sample Blazor source into target Blazor project |
| Sprint 01 | Auth & Role Navigation | Login, role routing, access denied flow |
| Sprint 02 | Member/Class/Session Core | Core data and screens for members, classes, sessions |
| Sprint 03 | Attendance Core | Attendance statuses, deduct rules, save/correct flow |
| Sprint 04 | Package & Renewal | Admin renewal and Member renewal request |
| Sprint 05 | Reports & Member Portal | Reports and member self-service screens |
| Sprint 06 | Backup/Export & UAT | Backup/export, UAT, release readiness |

---

## 5. Sprint Document Set

Each sprint should have:

```text
SPRINT_xx_PLAN.md
SPRINT_xx_BACKLOG.md
SPRINT_xx_ACCEPTANCE_CRITERIA.md
SPRINT_xx_REVIEW.md
```

Optional:

```text
SPRINT_xx_RISK.md
SPRINT_xx_DECISIONS.md
SPRINT_xx_UAT.md
```

---

## 6. Sprint Planning Rules

- Sprint scope must map back to BA Issues or implementation backlog.
- Attendance and role permission changes must always include tests/checklists.
- Do not expand MVP scope during sprint without change control.
- Each sprint must have clear acceptance criteria.
- Each sprint review must document done/not done/risks/next actions.
- Manual UAT/demo validation must be separated from implementation closure.

---

## 7. Source References

Use these documents before planning a sprint:

```text
docs/05-implementation-planning/IMPLEMENTATION_BACKLOG.md
docs/05-implementation-planning/IMPLEMENTATION_READINESS.md
docs/01-product-ba/ROLE_PERMISSION_SUMMARY.md
docs/01-product-ba/MVP_SCOPE.md
docs/03-uat-release/UAT_PLAN_SUMMARY.md
AGENTS.md
docs/07-codex-rules/SPRINT_AGENTS.md
docs/07-codex-rules/rules/SPRINT_EXECUTION_RULES.md
docs/07-codex-rules/skills/SPRINT_WORKFLOW_SKILL.md
```

---

## 8. Blazor CSS Migration Priority

The Blazor CSS migration sprint is tracked separately from the original prototype foundation sprint:

```text
docs/08-sprints/sprint-00-blazor-css-migration/
```

Use this folder before broad Blazor feature migration from the sample source.
