# UAT Plan Summary

## 1. Purpose

Validate that the prototype is understandable and complete for Admin, Coach and Member user journeys.

## 2. UAT Scope

| Area | Included |
|---|---:|
| Role login | Yes |
| Role dashboard | Yes |
| Attendance flow | Yes |
| Package renewal/request | Yes |
| Reports and revenue restriction | Yes |
| Member self-service | Yes |
| Backup/export demo | Yes |

## 3. UAT Acceptance

The prototype passes UAT review if:

```text
- Admin can complete management demo.
- Coach can complete attendance demo.
- Member can complete self-service demo.
- Coach cannot see revenue.
- Member cannot access management screens.
- Attendance rules are clear.
- Stakeholders agree MVP scope is understandable.
```

## 4. Critical Test Cases

| ID | Test | Expected |
|---|---|---|
| UAT-01 | Admin login | Dashboard Admin |
| UAT-02 | Coach login | Dashboard Coach |
| UAT-03 | Member login | Member Dashboard |
| UAT-04 | Coach revenue access | Hidden or AccessDenied |
| UAT-05 | Member admin access | Not visible / denied |
| UAT-06 | Attendance statuses | 5 statuses available |
| UAT-07 | Học bù | Deducts one session |
| UAT-08 | Member renewal | Request only |
| UAT-09 | Admin renewal | Admin confirmation flow |
| UAT-10 | Backup | Admin-only demo flow |
