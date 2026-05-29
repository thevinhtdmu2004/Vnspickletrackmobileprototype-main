# Attendance Rule Decisions

## 1. Purpose

Defines product decisions for attendance status and deduction rules.

---

## 2. MVP Attendance Statuses

*(Updated on 2026-05-29: Removed "Late / Trễ" status as per user request/change decision)*

| Status | Vietnamese | Deduct Session |
|---|---|---:|
| Present | Có mặt | Yes |
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

## 3.1 Makeup Class Registration Rules (Flexible)

*(Added on 2026-05-29: Flexible makeup class registration system)*

Members can register for makeup sessions with the following rules:

| Rule | Details |
|---|---|
| **Absence Limit** | Members can register for makeup if absences < 2 |
| **Session Selection** | Members can choose from available makeup sessions |
| **Flexible Scheduling** | Makeup sessions are arranged by coaches and can change based on needs |
| **Registration Window** | Members can register anytime during their course period |
| **Late Penalty** | If arriving > 45 minutes late, the session is cancelled |
| **Deduction** | Makeup session still deducts one session from package |

**Rationale:**

```text
- Flexible scheduling accommodates member availability
- Coach-arranged sessions ensure proper class balance
- Absence limit prevents abuse of makeup system
- Late penalty ensures session quality
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
