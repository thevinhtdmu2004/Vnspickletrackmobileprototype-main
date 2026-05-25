# Incident Response Runbook

## 1. Purpose

Defines how to respond to serious incidents in VNS PickleTrack.

---

## 2. Incident Types

| Incident | Severity |
|---|---|
| App cannot open | P0 |
| Login unavailable for all users | P0 |
| Attendance data corrupted | P1 |
| Package balance incorrect for many members | P1 |
| Coach can see revenue | P1 |
| Member can see other member data | P1 |
| Backup/export fails repeatedly | P2 |
| UI wording issue | P3 |

---

## 3. Response Steps

```text
1. Confirm incident.
2. Identify affected users/roles.
3. Stop risky operation if needed.
4. Preserve data/backup.
5. Record incident details.
6. Escalate to technical owner.
7. Apply workaround or rollback.
8. Verify fix.
9. Document root cause.
```

---

## 4. Critical Permission Incident

If Coach sees revenue or Member sees other member data:

```text
[ ] Stop demo/pilot usage if needed
[ ] Capture screenshot
[ ] Identify route/screen
[ ] Create P1 bug issue
[ ] Fix access guard
[ ] Run permission regression
```

---

## 5. Data Corruption Incident

If attendance/package balance is wrong:

```text
[ ] Stop further correction until reviewed
[ ] Backup current data
[ ] Identify affected members/sessions
[ ] Compare attendance/payment history
[ ] Correct through approved process
[ ] Record audit note
```

---

## 6. Post-incident Review

```text
[ ] Root cause documented
[ ] Preventive action defined
[ ] Risk register updated
[ ] UAT checklist updated if needed
[ ] Decision log updated if needed
```
