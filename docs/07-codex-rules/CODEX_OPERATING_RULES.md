# Codex Operating Rules

## 1. Mission

Codex should help maintain, polish and eventually transform the VNS PickleTrack prototype into an implementation-ready product without breaking validated BA/UX decisions.

---

## 2. Context First

Before changing code, Codex should understand:

- Current role model.
- Current route/screen flow.
- Business rules.
- Relevant documentation.
- User request scope.

Use these references:

```text
AGENTS.md
docs/README.md
docs/00-project-management/
docs/01-product-ba/
docs/02-ux-prototype/
docs/05-implementation-planning/
docs/06-risk-governance/
```

---

## 3. Minimal Change Rule

Codex should prefer the smallest safe change that satisfies the request.

Avoid:

- Wholesale rewrites.
- Unrequested refactors.
- Source folder restructuring.
- Replacing prototype architecture unexpectedly.
- Introducing production patterns before approval.

---

## 4. Role Safety Rule

Every source change must consider all roles:

```text
Admin
Coach
Member
```

Ask internally:

- Does this expose Admin data to Coach?
- Does this expose other member data to Member?
- Does this create a dead-end in role navigation?
- Does this bypass AccessDeniedScreen?

---

## 5. Business Rule Safety Rule

Never change these without explicit instruction:

```text
Có mặt  → deduct session
Trễ     → deduct session
Học bù  → deduct session
Vắng    → no deduction
Nghỉ phép → no deduction
```

---

## 6. Prototype Freeze Rule

The project is frozen as:

```text
Prototype Freeze v1
```

Allowed after freeze:

- Bug fixes.
- Permission fixes.
- Wording corrections.
- Documentation improvements.
- UAT/test additions.

Not allowed without approval:

- New module.
- New role.
- Major navigation redesign.
- Business rule change.
- Production backend integration.

---

## 7. Documentation Update Rule

When a change affects behavior, update or reference documentation.

Examples:

| Change | Documentation Impact |
|---|---|
| Role permission change | BA-02 / ROLE_PERMISSION_SUMMARY |
| Screen flow change | BA-03 / SCREEN_FLOW_SUMMARY |
| Attendance rule change | BA-05 / MVP_SCOPE / UAT |
| Release change | RELEASE_NOTES_TEMPLATE |
| Risk change | RISK_REGISTER |

---

## 8. Error Handling Rule

For blocked access, use or preserve:

```text
AccessDeniedScreen
```

Do not silently redirect blocked users unless UX explicitly requires it.

---

## 9. Vietnamese UI Rule

All user-facing UI labels should remain Vietnamese unless the project owner explicitly requests otherwise.

Technical docs may use English where appropriate.

---

## 10. Output Rule for Codex Work

When Codex completes a change, report:

```text
- Files changed
- Why changed
- Role impact
- Business rule impact
- Suggested tests
```
