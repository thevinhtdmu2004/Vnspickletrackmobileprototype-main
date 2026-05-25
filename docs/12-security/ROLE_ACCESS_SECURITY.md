# Role Access Security

## 1. Purpose

Defines security rules for role-based access in VNS PickleTrack.

---

## 2. Roles

```text
Admin
Coach
Member
```

---

## 3. Admin Access

Admin can access:

```text
- Full member management
- Class/session management
- Attendance
- Package renewal/payment confirmation
- Revenue reports
- Backup/export
- User/package management
```

---

## 4. Coach Access

Coach can access:

```text
- Assigned/today classes
- Session detail
- Attendance
- Operational reports
- Basic account settings
```

Coach must not access:

```text
- Revenue
- Full financial reports
- Backup/export
- User management
- Package management
```

---

## 5. Member Access

Member can access:

```text
- Own dashboard
- Own schedule
- Own package
- Own attendance history
- Own payment history
- Own profile
- Renewal request
```

Member must not access:

```text
- Attendance marking
- Other member data
- Full class management
- Revenue
- Admin settings
- Backup/export
```

---

## 6. Enforcement Layers

```text
[ ] Hide unavailable navigation items
[ ] Guard restricted routes
[ ] Check permission before service action
[ ] Filter data by ownership
[ ] Return AccessDenied for blocked actions
```

---

## 7. Regression Checklist

```text
[ ] Coach revenue route blocked
[ ] Member attendance route blocked
[ ] Member full member list blocked
[ ] Backup/export Admin-only
[ ] User management Admin-only
```
