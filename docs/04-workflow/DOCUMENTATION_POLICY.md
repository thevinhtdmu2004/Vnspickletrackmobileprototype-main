# Documentation Policy

## 1. Purpose

Define how documentation should be maintained after disconnecting Figma from GitHub.

## 2. Source of Truth

| Type | Location |
|---|---|
| Durable BA decisions | GitHub Issues BA-00 → BA-07 |
| Workflow safety | DEV-01 issue |
| Working project docs | `/docs` folder |
| Visual prototype docs | `ScreenFlowDocument.tsx` |

## 3. Rules

- Do not store critical BA knowledge only in generated source files.
- Important business rules must be reflected in GitHub Issues.
- `/docs` files can summarize and operationalize issue content.
- Visual documentation is for demo, not the only source of truth.

## 4. Protected Knowledge

Always preserve:

```text
- Admin / Coach / Member roles
- Permission matrix
- Attendance rules
- Học bù deducts one session
- Coach cannot see revenue
- Member only sees own data
- Member renewal is request-only
```
