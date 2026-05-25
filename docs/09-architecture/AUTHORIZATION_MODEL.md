# Authorization Model

## 1. Purpose

This document defines the role-based authorization model for VNS PickleTrack production implementation.

The prototype uses UI-level role separation. Production must enforce authorization in navigation, screen access and service/action level.

---

## 2. Roles

| Role | Description |
|---|---|
| Admin | Full management and business access |
| Coach | Class operation and attendance access |
| Member | Personal self-service access only |

---

## 3. Authorization Layers

Authorization should be enforced at multiple layers:

```text
Navigation Layer
  -> hide unavailable menu items

Route/Screen Guard
  -> block direct access to restricted screens

Application Service Layer
  -> validate action permission

Data Access Layer
  -> filter data by role and ownership
```

---

## 4. Permission Groups

| Group | Examples |
|---|---|
| Auth | Login, logout, change PIN |
| Member Management | View/add/edit members |
| Class Management | View/add/edit classes, assign members |
| Session Operation | View sessions, create sessions, complete/cancel |
| Attendance | Mark/correct attendance |
| Package | Manage package catalog, confirm renewals |
| Renewal Request | Submit/review renewal requests |
| Reports | Attendance, class, member, revenue |
| Backup/Export | Backup, export, restore |
| System Config | User management, settings |

---

## 5. Permission Matrix

| Permission | Admin | Coach | Member |
|---|---:|---:|---:|
| Login | Yes | Yes | Yes |
| Change own PIN | Yes | Yes | Yes |
| View Admin Dashboard | Yes | No | No |
| View Coach Dashboard | No | Yes | No |
| View Member Dashboard | No | No | Yes |
| View Today Sessions | Yes | Yes | No |
| Create Session | Yes | Optional/Limited | No |
| View Session Detail | Yes | Yes | Own schedule only |
| Mark Attendance | Yes | Yes | No |
| Correct Attendance | Yes | Yes | No |
| View All Members | Yes | Limited | No |
| Add/Edit Member | Yes | No | No |
| View Own Profile | N/A | N/A | Yes |
| View Class Management | Yes | Limited | No |
| Add/Edit Class | Yes | No | No |
| Assign Members | Yes | No | No |
| Confirm Package Renewal | Yes | No | No |
| Submit Renewal Request | No | No | Yes |
| View Revenue | Yes | No | No |
| View Operational Reports | Yes | Yes | Own history only |
| Backup/Export | Yes | No | No |
| User Management | Yes | No | No |

---

## 6. Route Guard Rules

### Admin-only routes

```text
- Revenue report
- Package management
- User management
- Backup/export/restore
- Full member management
- Full class management
```

### Coach-allowed routes

```text
- Coach dashboard
- Today sessions
- Session detail
- Attendance
- Limited reports
- Basic settings
```

### Member-only routes

```text
- Member dashboard
- Member schedule
- Member package
- Member attendance history
- Member payment history
- Member renewal request
- Member profile
```

---

## 7. Access Denied Behavior

If a user accesses a blocked route:

```text
Show AccessDeniedScreen
```

The screen should include:

- Clear message.
- Current role.
- Restricted feature name if possible.
- Back button.

---

## 8. Data Ownership Rules

### Member

Member data access must always be scoped to:

```text
CurrentUser.MemberId
```

Member must not query or view:

- Other member profiles.
- Full member list.
- Full class roster unless explicitly approved.
- Revenue.

### Coach

Coach data should be scoped to:

```text
Assigned classes / sessions
```

Coach should not see:

- Revenue.
- Full financial details.
- System user management.

### Admin

Admin can access all business data.

---

## 9. Action Authorization Examples

| Action | Authorization Rule |
|---|---|
| Save attendance | Role is Admin or Coach |
| View revenue report | Role is Admin |
| Submit renewal request | Role is Member and target MemberId equals current user's MemberId |
| Confirm renewal | Role is Admin |
| Export data | Role is Admin |
| View own package | Role is Member and owns profile |

---

## 10. Regression Checklist

```text
[ ] Admin can view revenue
[ ] Coach cannot view revenue
[ ] Member cannot view revenue
[ ] Coach can mark attendance
[ ] Member cannot mark attendance
[ ] Member can view own package
[ ] Member cannot view other members
[ ] Backup/export is Admin-only
[ ] AccessDeniedScreen appears for blocked routes
```
