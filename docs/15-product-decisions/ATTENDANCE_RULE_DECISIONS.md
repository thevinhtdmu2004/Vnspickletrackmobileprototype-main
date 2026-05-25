# Attendance Rule Decisions

## 1. Purpose

Defines product decisions for attendance status and deduction rules.

---

## 2. MVP Attendance Statuses

| Status | Vietnamese | Deduct Session |
|---|---|---:|
| Present | Có mặt | Yes |
| Late | Trễ | Yes |
| Makeup | Học bù | Yes |
| Absent | Vắng | No |
| Leave | Nghỉ phép | No |

---

## 3. Key Decision

```text
Học bù deducts one session.
```

Reason:

```text
The member still consumes training time even if the session is a makeup session.
```

---

## 4. Out of Scope Attendance Rules

Not included in MVP:

```text
- Partial-session deduction
- Penalty for absence
- Automatic late threshold
- Medical leave approval workflow
- Coach attendance approval workflow
```

---

## 5. Change Rule

Changing attendance deduction requires:

```text
[ ] Product Owner approval
[ ] BA-05 update
[ ] UAT checklist update
[ ] Sprint acceptance criteria update
[ ] Regression test update
```
