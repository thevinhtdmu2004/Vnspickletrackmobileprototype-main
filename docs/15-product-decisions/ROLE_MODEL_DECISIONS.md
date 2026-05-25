# Role Model Decisions

## 1. Purpose

Defines decisions related to the product role model.

---

## 2. Approved Roles

```text
Admin
Coach
Member / Hội viên
```

---

## 3. Role Intent

| Role | Intent |
|---|---|
| Admin | Full operation and management |
| Coach | Class delivery and attendance operation |
| Member | Personal self-service |

---

## 4. Key Decisions

```text
- Admin sees revenue and system configuration.
- Coach does not see revenue.
- Member only sees own data.
- Member does not mark attendance.
- Member sends renewal request only.
```

---

## 5. Future Role Candidates

Potential future roles:

```text
- Branch Manager
- Receptionist
- Parent/Guardian
- Super Admin
```

These are not part of MVP.

---

## 6. Role Change Rule

Adding a new role requires:

```text
[ ] Product decision
[ ] Permission matrix update
[ ] Navigation update
[ ] UAT update
[ ] Security review
```
