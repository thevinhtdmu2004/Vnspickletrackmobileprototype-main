# Implementation Backlog

## 1. Purpose

This backlog converts the validated prototype into a high-level production implementation plan.

This is not yet a detailed sprint plan. It is the first structured backlog for planning and estimation.

---

## 2. Epic Overview

| Epic | Name | Objective |
|---|---|---|
| EPIC-01 | Foundation | Setup app structure, theme, navigation, role model |
| EPIC-02 | Authentication | Login and role-based routing |
| EPIC-03 | Member Management | Manage students/members and balances |
| EPIC-04 | Class & Session | Manage classes and session creation |
| EPIC-05 | Attendance | Mark and correct attendance |
| EPIC-06 | Package & Renewal | Package purchase, renewal request and confirmation |
| EPIC-07 | Reports | Operational and revenue reports |
| EPIC-08 | Member Portal | Member self-service screens |
| EPIC-09 | Backup & Export | Data backup/export/restore strategy |
| EPIC-10 | Admin Configuration | Package/user/settings management |
| EPIC-11 | UAT & Release | Testing, pilot and release preparation |

---

## 3. Initial Backlog

### EPIC-01 - Foundation

| ID | Task | Priority |
|---|---|---|
| FND-001 | Create production project structure | P1 |
| FND-002 | Define app theme and design tokens | P1 |
| FND-003 | Implement navigation shell | P1 |
| FND-004 | Define role model: Admin / Coach / Member | P1 |
| FND-005 | Define shared components | P1 |
| FND-006 | Define error/empty/access denied patterns | P1 |

### EPIC-02 - Authentication

| ID | Task | Priority |
|---|---|---|
| AUTH-001 | Implement login screen | P1 |
| AUTH-002 | Implement demo/local account model or real auth decision | P1 |
| AUTH-003 | Route user by role | P1 |
| AUTH-004 | Implement logout | P1 |
| AUTH-005 | Implement change PIN | P2 |

### EPIC-03 - Member Management

| ID | Task | Priority |
|---|---|---|
| MEM-001 | Member list | P1 |
| MEM-002 | Member detail | P1 |
| MEM-003 | Add/edit member | P1 |
| MEM-004 | Member attendance history | P1 |
| MEM-005 | Member payment history | P1 |
| MEM-006 | Low balance status | P1 |
| MEM-007 | Balance adjustment | P2 |

### EPIC-04 - Class & Session

| ID | Task | Priority |
|---|---|---|
| CLS-001 | Class list | P1 |
| CLS-002 | Add/edit class | P1 |
| CLS-003 | Class detail | P1 |
| CLS-004 | Assign members to class | P1 |
| SES-001 | Today sessions | P1 |
| SES-002 | Create session from class | P1 |
| SES-003 | Session detail | P1 |
| SES-004 | Complete/cancel session | P2 |

### EPIC-05 - Attendance

| ID | Task | Priority |
|---|---|---|
| ATT-001 | Attendance screen | P1 |
| ATT-002 | 5 attendance statuses | P1 |
| ATT-003 | Deduct/non-deduct rules | P1 |
| ATT-004 | Zero balance warning | P1 |
| ATT-005 | Save attendance | P1 |
| ATT-006 | Correct attendance | P1 |
| ATT-007 | Attendance summary | P2 |

### EPIC-06 - Package & Renewal

| ID | Task | Priority |
|---|---|---|
| PKG-001 | Package list | P1 |
| PKG-002 | Admin renewal confirmation | P1 |
| PKG-003 | Member renewal request | P1 |
| PKG-004 | Renewal request status | P2 |
| PKG-005 | Payment history | P1 |

### EPIC-07 - Reports

| ID | Task | Priority |
|---|---|---|
| RPT-001 | Low balance report | P1 |
| RPT-002 | Attendance monthly report | P1 |
| RPT-003 | Class report | P2 |
| RPT-004 | Member report | P2 |
| RPT-005 | Admin revenue report | P1 |
| RPT-006 | Hide revenue from Coach/Member | P1 |

### EPIC-08 - Member Portal

| ID | Task | Priority |
|---|---|---|
| MBR-001 | Member dashboard | P1 |
| MBR-002 | Member schedule | P1 |
| MBR-003 | Member package | P1 |
| MBR-004 | Member attendance history | P1 |
| MBR-005 | Member payment history | P1 |
| MBR-006 | Member contact screen | P2 |
| MBR-007 | Member profile | P1 |

### EPIC-09 - Backup & Export

| ID | Task | Priority |
|---|---|---|
| BCK-001 | Backup strategy decision | P1 |
| BCK-002 | Backup screen | P2 |
| EXP-001 | Export CSV strategy | P2 |
| RST-001 | Restore strategy | P3 |

### EPIC-10 - Admin Configuration

| ID | Task | Priority |
|---|---|---|
| CFG-001 | Package management | P2 |
| CFG-002 | User management | P2 |
| CFG-003 | Attendance rule settings | P3 |

### EPIC-11 - UAT & Release

| ID | Task | Priority |
|---|---|---|
| QA-001 | Smoke test checklist | P1 |
| QA-002 | UAT scenarios | P1 |
| QA-003 | Pilot release notes | P1 |
| QA-004 | Known issues log | P1 |

---

## 4. Recommended Sprint Order

```text
Sprint 0 - Foundation
Sprint 1 - Auth + Role Navigation
Sprint 2 - Member/Class/Session Core
Sprint 3 - Attendance Core
Sprint 4 - Package/Renewal
Sprint 5 - Reports + Member Portal
Sprint 6 - Backup/Export + UAT
```

---

## 5. Critical Path

```text
Role model
-> Navigation
-> Member/Class/Session
-> Attendance
-> Package balance
-> Reports
-> UAT
```

Attendance and package balance must be treated as the highest business-risk areas.
