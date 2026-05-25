# Sprint Workflow Skill

## 1. When To Use

Use this skill whenever the user asks to continue, implement, review, close or prepare a PR for a sprint.

This skill is scoped to VNS PickleTrack sprint execution.

---

## 2. Workflow

### Step 1 - Identify Sprint

Determine the target sprint from:

```text
- User request
- Current open files
- Current branch name
- Latest modified sprint folder
```

If unclear, infer conservatively from the current context and state the assumption.

### Step 2 - Read Sprint Inputs

Read the target sprint files:

```text
SPRINT_##_PLAN.md
SPRINT_##_BACKLOG.md
SPRINT_##_ACCEPTANCE_CRITERIA.md
SPRINT_##_REVIEW.md
```

Also read any sprint-specific checklist or implementation report if present.

### Step 3 - Map To Source And Business Rules

For code changes, identify:

```text
- Relevant screens/components
- Role access path
- Business rules touched
- Docs that need updates
```

Never change attendance/package/role/revenue behavior without documenting the impact.

### Step 4 - Implement Small

Make the smallest coherent change that satisfies the sprint item.

Preferred order:

```text
1. Fix shared rule/config if one exists.
2. Fix the screen or flow that exposes the sprint behavior.
3. Update supporting docs/checklists.
4. Run validation.
```

### Step 5 - Review Closure

Before marking a sprint complete, verify:

```text
- Acceptance criteria match source behavior.
- Review file reflects actual status.
- Regression checklist exists.
- Remaining manual UAT is clearly separated from implementation blockers.
```

### Step 6 - Prepare PR

Before PR:

```text
- Confirm git status.
- Confirm branch name.
- Confirm validation notes.
- Keep PR title and body tied to sprint scope.
```

---

## 3. Sprint Closure Decision Language

Use this wording when applicable:

```text
Sprint ## is eligible to close as an implementation sprint.
Carry manual UAT/demo regression into release validation.
```

Do not say a sprint is release-ready unless UAT/release checklist is actually complete.

---

## 4. Common Blockers

Do not close the sprint if any of these are true:

```text
- Member can access Admin/Coach-only screens.
- Coach can see revenue.
- Member can mark attendance.
- Học bù does not deduct one session.
- Attendance has more or fewer than the 5 MVP statuses.
- Package renewal adds sessions without Admin confirmation.
- Build fails for source changes.
```
