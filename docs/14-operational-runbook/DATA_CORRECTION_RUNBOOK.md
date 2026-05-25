# Data Correction Runbook

## 1. Purpose

Defines a safe process for correcting attendance, package balance or member data.

---

## 2. Correction Types

| Type | Example | Risk |
|---|---|---|
| Attendance correction | Change Vắng to Có mặt | High |
| Package balance correction | Add/remove sessions manually | High |
| Member profile correction | Fix phone/name/class | Medium |
| Payment correction | Fix amount/package/date | High |

---

## 3. General Rules

```text
- Do not correct data without reason.
- Backup before bulk/high-risk correction.
- Record who requested correction.
- Record before/after value.
- Prefer correcting source transaction instead of directly changing balance.
```

---

## 4. Attendance Correction Steps

```text
1. Identify member.
2. Identify session date/class.
3. Check current status.
4. Confirm correct status.
5. Determine deduction impact.
6. Apply correction.
7. Verify remaining sessions.
8. Record correction note.
```

---

## 5. Package Balance Correction Steps

```text
1. Review payment/renewal history.
2. Review attendance history.
3. Identify discrepancy.
4. Prefer fixing missing/wrong transaction.
5. If manual adjustment is required, enter reason.
6. Verify member balance.
7. Record audit note.
```

---

## 6. Approval

High-risk corrections should be approved by Admin or Product Owner.

---

## 7. Correction Checklist

```text
[ ] Reason recorded
[ ] Affected member identified
[ ] Before value recorded
[ ] After value recorded
[ ] Balance verified
[ ] Audit/notes updated
```
