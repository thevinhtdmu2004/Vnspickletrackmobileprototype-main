# Codex Task Prompts

## 1. Purpose

Reusable prompts for ChatGPT Codex or AI coding agents working on this repository.

Use these prompts to keep tasks controlled, small and aligned with product rules.

---

## 2. Prompt — Safe Repository Review

```text
You are working in the VNS PickleTrack repository.

First read:
- AGENTS.md
- docs/README.md
- docs/01-product-ba/ROLE_PERMISSION_SUMMARY.md
- docs/02-ux-prototype/PROTOTYPE_FREEZE_V1.md

Do not change any file yet.

Review the repository and report:
1. Current app structure.
2. Key screens.
3. Role flows.
4. Any possible risks.
5. Suggested next actions.
```

---

## 3. Prompt — Safe UI Wording Fix

```text
You are working in VNS PickleTrack.

Task:
Fix a UI wording issue only.

Rules:
- Read AGENTS.md first.
- Do not restructure src/.
- Do not change business logic.
- Do not change routes.
- Keep UI Vietnamese.
- Make the smallest possible change.

After change, report:
- File changed.
- Exact wording changed.
- Role impact.
- Test suggestion.
```

---

## 4. Prompt — Permission Fix

```text
You are working in VNS PickleTrack.

Task:
Fix a role permission issue.

Rules:
- Read AGENTS.md.
- Read docs/01-product-ba/ROLE_PERMISSION_SUMMARY.md.
- Preserve Admin / Coach / Member model.
- Coach must not see revenue.
- Member must only see personal data.
- Use AccessDeniedScreen for blocked routes when appropriate.
- Make minimal changes.

After change, report:
- Files changed.
- Which role was affected.
- Which screen was protected.
- How to test Admin, Coach and Member flows.
```

---

## 5. Prompt — Attendance Rule Review

```text
You are working in VNS PickleTrack.

Task:
Review or modify attendance-related code.

Rules:
- Read AGENTS.md.
- Preserve these statuses:
  Có mặt, Trễ, Học bù, Vắng, Nghỉ phép.
- Deducting statuses:
  Có mặt, Trễ, Học bù.
- Non-deducting statuses:
  Vắng, Nghỉ phép.
- Học bù must deduct one session.

Do not change this rule unless explicitly instructed.

After work, report:
- Attendance statuses found.
- Deduction mapping.
- Any risks.
- Suggested tests.
```

---

## 6. Prompt — Add Documentation Only

```text
You are working in VNS PickleTrack.

Task:
Add or update documentation only.

Rules:
- Do not modify src/.
- Do not modify package.json.
- Place documentation under docs/ unless instructed otherwise.
- If the document is a durable BA decision, also mention the related BA GitHub Issue.
- Keep documentation concise and structured.

After change, report:
- Files added/updated.
- Purpose of each file.
- Whether source code was untouched.
```

---

## 7. Prompt — Create Implementation Plan

```text
You are acting as PM/Technical Lead for VNS PickleTrack.

Task:
Create or update implementation planning documents.

Rules:
- Read docs/05-implementation-planning/.
- Do not modify source code.
- Keep Prototype Freeze v1 intact.
- Organize tasks by Epic, Priority and Dependency.
- Highlight critical path around Attendance and Package Balance.

Output should include:
- Epic list.
- Sprint order.
- Critical path.
- Risk notes.
```

---

## 8. Prompt — Bug Fix With Regression Check

```text
You are working in VNS PickleTrack.

Task:
Fix a bug.

Rules:
- Read AGENTS.md.
- Identify affected role(s).
- Make minimal source change.
- Do not add new module.
- Preserve attendance and permission rules.

After change, provide:
- Root cause.
- Files changed.
- Role impact.
- Business rule impact.
- Regression checklist:
  Admin login
  Coach login
  Member login
  Coach revenue restriction
  Member navigation restriction
  Attendance 5 statuses
```

---

## 9. Prompt — Pre-PR Review

```text
Review this repository change before PR.

Check:
- Does it violate AGENTS.md?
- Does it change business rules?
- Does it expose revenue to Coach/Member?
- Does it expose other member data to Member?
- Does it break any demo flow?
- Are docs updated if needed?

Return:
- Pass/Fail
- Risks
- Required fixes
- Suggested test steps
```

---

## 10. Prompt — Production Architecture Planning

```text
You are acting as Technical Architect for VNS PickleTrack.

Task:
Plan production architecture from the prototype.

Rules:
- Do not modify source code.
- Treat prototype as UX/BA reference only.
- Preserve business concepts.
- Decide open questions explicitly.

Analyze:
- App platform options.
- Data storage options.
- Backend need.
- Auth approach.
- Offline/sync approach.
- Backup/export approach.
- Deployment approach.

Output:
- Recommended architecture.
- Tradeoffs.
- Risks.
- Next decisions.
```
