# Repository Structure Guide

## 1. Purpose

This document defines the standard repository structure after Figma has been disconnected from GitHub.

The goal is to keep the prototype source stable while adding professional PM/BA/dev documentation around it.

---

## 2. Standard Structure

```text
.
├── src/                         # Prototype source code
│   └── app/
│       ├── App.tsx
│       └── components/
│
├── docs/                        # Project documentation
│   ├── README.md
│   ├── 00-project-management/
│   ├── 01-product-ba/
│   ├── 02-ux-prototype/
│   ├── 03-uat-release/
│   └── 04-workflow/
│
├── .github/                     # GitHub templates
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
│
├── package.json
├── vite.config.*
└── README.md
```

---

## 3. Folder Rules

### `src/`

Contains prototype implementation.

Rules:

- Do not restructure unless there is a specific development task.
- Do not mix BA documents into `src/`.
- Do not rename core screens casually.
- Any changes should reference an issue.

### `docs/`

Contains project-level working documentation.

Rules:

- Use this for project summaries, release notes and workflow guides.
- Durable BA source of truth still lives in GitHub Issues.
- Docs should not duplicate all issue content unless needed for handoff.

### `.github/`

Contains collaboration templates.

Rules:

- Use PR templates.
- Use issue templates for bugs, change requests and BA updates.

---

## 4. Source of Truth Hierarchy

| Priority | Location | Purpose |
|---:|---|---|
| 1 | GitHub Issues BA-00 → BA-07 | Durable BA/Product documentation |
| 2 | `docs/` | Working project documentation |
| 3 | `src/app/components/ScreenFlowDocument.tsx` | Visual prototype documentation |
| 4 | Source code | Prototype implementation |

---

## 5. No-touch Policy for Source Code

During PM/BA restructuring:

```text
Do not modify files under src/.
```

Only documentation and workflow files should be added or updated.
