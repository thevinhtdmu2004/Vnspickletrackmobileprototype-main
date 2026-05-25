# Environment Strategy

## 1. Purpose

Defines recommended environments for VNS PickleTrack implementation and release.

---

## 2. Environment Types

| Environment | Purpose | Users |
|---|---|---|
| Development | Developer local build/test | Dev team |
| Test | Internal QA validation | QA/PM |
| UAT | Stakeholder validation | Admin/Coach/Member reviewers |
| Pilot | Real limited use | Pilot club/class |
| Production | Live operation | Real users |

---

## 3. Data Rules by Environment

| Environment | Data Type |
|---|---|
| Development | Demo/seed data only |
| Test | Test data only |
| UAT | Controlled UAT data |
| Pilot | Real or semi-real data with backup |
| Production | Real data |

---

## 4. Access Rules

```text
- Do not use real member/payment data in Development unless approved.
- UAT should clearly label test data.
- Pilot data must be backed up.
- Production data must follow security/privacy rules.
```

---

## 5. Environment Checklist

```text
[ ] Environment name visible or documented
[ ] Demo accounts separated from production accounts
[ ] Backup strategy confirmed for Pilot/Production
[ ] Test data can be reset
[ ] Logs/errors can be reviewed
```
