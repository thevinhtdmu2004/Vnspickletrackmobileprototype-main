# Documentation Index

This folder contains project-level documentation for **VNS PickleTrack Mobile Prototype**.

The repository source code under `src/` is intentionally left untouched during PM/BA restructuring.

---

## Folder Structure

```text
docs/
├── 00-project-management/
├── 01-product-ba/
├── 02-ux-prototype/
├── 03-uat-release/
├── 04-workflow/
├── 05-implementation-planning/
├── 06-risk-governance/
├── 07-codex-rules/
├── 08-sprints/
├── 09-architecture/
├── 10-api-contracts/
├── 11-database-design/
├── 12-security/
├── 13-deployment/
├── 14-operational-runbook/
└── 15-product-decisions/
```

---

## 00 — Project Management

| File | Purpose |
|---|---|
| `PROJECT_CHARTER.md` | Project identity, objectives and governance |
| `REPO_STRUCTURE.md` | Standard repository structure and folder rules |
| `ROADMAP.md` | Prototype-to-production roadmap |

---

## 01 — Product & BA

| File | Purpose |
|---|---|
| `BA_DOCUMENTATION_MAP.md` | Map between GitHub Issues and BA documentation set |
| `MVP_SCOPE.md` | MVP scope summary |
| `ROLE_PERMISSION_SUMMARY.md` | Role permission summary |

---

## 02 — UX Prototype

| File | Purpose |
|---|---|
| `PROTOTYPE_FREEZE_V1.md` | Current prototype freeze status |
| `SCREEN_FLOW_SUMMARY.md` | High-level screen flow summary |
| `FIGMA_HANDOFF_NOTES.md` | Notes after disconnecting Figma from GitHub |

---

## 03 — UAT & Release

| File | Purpose |
|---|---|
| `DEMO_CHECKLIST.md` | Stakeholder demo checklist |
| `UAT_PLAN_SUMMARY.md` | UAT test summary |
| `RELEASE_NOTES_TEMPLATE.md` | Template for prototype release notes |

---

## 04 — Workflow

| File | Purpose |
|---|---|
| `GIT_WORKFLOW.md` | Branching and commit workflow |
| `DOCUMENTATION_POLICY.md` | Rules for documentation safety |
| `CHANGE_CONTROL.md` | How to request and manage changes |

---

## 05 — Implementation Planning

| File | Purpose |
|---|---|
| `IMPLEMENTATION_READINESS.md` | Readiness checklist before moving from prototype to production |
| `IMPLEMENTATION_BACKLOG.md` | Epic-level implementation backlog |
| `TECHNICAL_HANDOFF.md` | Technical handoff notes from prototype to production |

---

## 06 — Risk & Governance

| File | Purpose |
|---|---|
| `RISK_REGISTER.md` | Project risk register |
| `DECISION_LOG.md` | Important product/technical decision log |

---

## 07 — Codex Rules

| File | Purpose |
|---|---|
| `README.md` | Codex rules index |
| `CODEX_OPERATING_RULES.md` | General operating rules for Codex |
| `CODEX_SKILLS.md` | Skill modes Codex should apply |
| `CODEX_TASK_PROMPTS.md` | Reusable Codex task prompts |
| `CODEX_CHECKLISTS.md` | Validation checklists for Codex changes |
| `CODEX_DONT_TOUCH.md` | Areas and rules Codex must not change without approval |

---

## 08 — Sprints

| File / Folder | Purpose |
|---|---|
| `README.md` | Sprint documentation index and convention |
| `SPRINT_PLAN_TEMPLATE.md` | Template for sprint planning |
| `SPRINT_REVIEW_TEMPLATE.md` | Template for sprint review/closeout |
| `SPRINT_BACKLOG_TEMPLATE.md` | Template for sprint backlog |
| `sprint-00-foundation/` | Sprint 00 implementation planning documents |
| `sprint-01-auth-role-navigation/` | Sprint 01 implementation planning documents |
| `sprint-02-member-class-session-core/` | Sprint 02 implementation planning documents |
| `sprint-03-attendance-core/` | Sprint 03 implementation planning documents |
| `sprint-04-package-renewal/` | Sprint 04 implementation planning documents |
| `sprint-05-reports-member-portal/` | Sprint 05 implementation planning documents |
| `sprint-06-backup-export-uat/` | Sprint 06 implementation planning documents |

---

## 09 — Architecture

| File | Purpose |
|---|---|
| `README.md` | Architecture documentation index |
| `ARCHITECTURE_OVERVIEW.md` | High-level production architecture direction |
| `DOMAIN_MODEL.md` | Core domain entities and relationships |
| `AUTHORIZATION_MODEL.md` | Role-based authorization model |
| `DATA_PERSISTENCE_STRATEGY.md` | SQLite/cloud/hybrid persistence strategy |
| `BACKUP_EXPORT_STRATEGY.md` | Backup, export and restore strategy |
| `ADR-001-PRODUCTION_FOUNDATION.md` | Sprint 00 production foundation direction |
| `ADR_TEMPLATE.md` | Architecture Decision Record template |

---

## 10 — API Contracts

| File | Purpose |
|---|---|
| `README.md` | API contract documentation index |
| `API_OVERVIEW.md` | API strategy and module boundaries |
| `AUTH_API.md` | Login, logout and PIN/account API contract |
| `MEMBER_API.md` | Member/student API contract |
| `CLASS_SESSION_API.md` | Class and session API contract |
| `ATTENDANCE_API.md` | Attendance API and deduction behavior |
| `PACKAGE_RENEWAL_API.md` | Package, payment and renewal request API contract |
| `REPORT_API.md` | Report API and role restrictions |
| `BACKUP_EXPORT_API.md` | Backup/export API planning |
| `API_ERROR_MODEL.md` | Standard API error model |

---

## 11 — Database Design

| File | Purpose |
|---|---|
| `README.md` | Database design documentation index |
| `DATABASE_OVERVIEW.md` | Database strategy and design principles |
| `ERD_CONCEPT.md` | Conceptual entity relationship design |
| `TABLE_SPECIFICATIONS.md` | Draft table specifications |
| `MIGRATION_STRATEGY.md` | Migration/versioning strategy |
| `SEED_DATA_STRATEGY.md` | Demo and initial seed data strategy |

---

## 12 — Security

| File | Purpose |
|---|---|
| `README.md` | Security documentation index |
| `SECURITY_OVERVIEW.md` | Security principles and risk areas |
| `AUTH_SECURITY.md` | Login, PIN and account security |
| `DATA_PRIVACY.md` | Member data privacy and access boundaries |
| `ROLE_ACCESS_SECURITY.md` | Role access security rules |
| `BACKUP_SECURITY.md` | Backup/export security requirements |
| `AUDIT_LOG_STRATEGY.md` | Audit log planning |

---

## 13 — Deployment

| File | Purpose |
|---|---|
| `README.md` | Deployment documentation index |
| `DEPLOYMENT_OVERVIEW.md` | Deployment strategy overview |
| `ENVIRONMENT_STRATEGY.md` | Dev / Test / UAT / Production environments |
| `BUILD_RELEASE_PROCESS.md` | Build and release process |
| `PILOT_DEPLOYMENT_PLAN.md` | Pilot rollout plan |
| `ROLLBACK_PLAN.md` | Rollback and recovery strategy |

---

## 14 — Operational Runbook

| File | Purpose |
|---|---|
| `README.md` | Operational runbook index |
| `DAILY_OPERATIONS.md` | Daily Admin/Coach/Member operation routine |
| `BACKUP_RUNBOOK.md` | Backup/export operating procedure |
| `SUPPORT_RUNBOOK.md` | Support handling process |
| `INCIDENT_RESPONSE.md` | Incident handling and escalation |
| `DATA_CORRECTION_RUNBOOK.md` | Safe correction process for attendance/package/member data |

---

## 15 — Product Decisions

| File | Purpose |
|---|---|
| `README.md` | Product decision documentation index |
| `PRODUCT_DECISION_LOG.md` | Product and scope decision log |
| `MVP_SCOPE_DECISIONS.md` | MVP vs future scope decisions |
| `ROLE_MODEL_DECISIONS.md` | Admin / Coach / Member role decisions |
| `ATTENDANCE_RULE_DECISIONS.md` | Attendance status and deduction decisions |
| `FUTURE_ROADMAP_DECISIONS.md` | Post-MVP roadmap candidates and decisions |
| `DECISION_TEMPLATE.md` | Product decision template |

---

## Documentation Completeness Status

Current documentation is considered complete enough for **Prototype Freeze v1 → Architecture Decision → Sprint 00 Implementation Planning → MVP Development Preparation**.

Covered areas:

```text
- Project charter and roadmap
- BA/product scope
- Role and permission summary
- UX prototype freeze and screen flow
- UAT/demo checklist
- Git/change/documentation workflow
- Implementation planning and backlog
- Risk and decision governance
- Codex operating rules and skills
- Sprint documentation structure from Sprint 00 to Sprint 06
- Production architecture planning
- API contract planning
- Database design planning
- Security planning
- Deployment planning
- Operational runbooks
- Product decision governance
```

---

## Source of Truth

Durable BA documents are stored as GitHub Issues:

```text
BA-00 → BA-07
DEV-01
PM-01
```

The files in this folder are working summaries and operational guides.
