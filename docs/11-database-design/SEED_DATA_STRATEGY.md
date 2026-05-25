# Seed Data Strategy

## 1. Purpose

Defines how initial/demo data should be created for development, testing and UAT.

---

## 2. Seed Data Types

| Type | Purpose |
|---|---|
| Demo accounts | Login testing for Admin / Coach / Member |
| Demo members | Member list, package balance and attendance testing |
| Demo coaches | Coach assignment and class operation testing |
| Demo classes | Class/session flow testing |
| Demo sessions | Today class and attendance testing |
| Demo packages | Renewal/package flow testing |
| Demo payments | Payment history/report testing for Admin only |
| Demo renewal requests | Member request and Admin approval flow testing |

---

## 3. Demo Accounts

| Role | Username | Demo PIN |
|---|---|---|
| Admin | admin | 123456 |
| Coach | coach | 111111 |
| Member | member | 222222 |

Production must not store PIN as plain text.

---

## 4. Demo Classes

```text
Beginner A
Intermediate B
Advanced C
```

Each demo class should have:

```text
- One assigned coach
- At least one scheduled session
- At least two assigned members
```

---

## 5. Demo Members

| Name | Level | Remaining Sessions | Status |
|---|---|---:|---|
| Nguyễn Văn A | Beginner | 7 | Active |
| Trần Thị B | Beginner | 2 | Low balance |
| Lê Văn C | Intermediate | 0 | Out of sessions |
| Phạm Thị D | Advanced | 10 | Active |

---

## 6. Demo Packages

| Package | Sessions | Price |
|---|---:|---:|
| Gói 8 buổi | 8 | 1600000 |
| Gói 12 buổi | 12 | 2400000 |
| Gói 16 buổi | 16 | 3000000 |

---

## 7. Attendance Seed Coverage

Seed attendance must include all 5 MVP statuses:

```text
[ ] Có mặt
[ ] Trễ
[ ] Học bù
[ ] Vắng
[ ] Nghỉ phép
```

Deduction examples must prove:

```text
- Có mặt deducts one session.
- Trễ deducts one session.
- Học bù deducts one session.
- Vắng does not deduct.
- Nghỉ phép does not deduct.
```

---

## 8. Seed Rules

```text
- Seed data must be clearly marked as demo data.
- Seed data should be resettable in development.
- Do not run demo seed automatically in production unless explicitly allowed.
- Seed data must include normal, low balance and zero balance cases.
- Demo payment and revenue data must be visible to Admin only.
```

---

## 9. UAT Seed Requirements

UAT seed should include:

```text
[ ] One Admin
[ ] One Coach
[ ] One Member login
[ ] At least 3 classes
[ ] Members with normal/low/zero balance
[ ] Sessions with all 5 attendance statuses
[ ] Payment/renewal history for Admin report testing
[ ] One pending renewal request
[ ] One approved renewal request with linked payment renewal
[ ] One rejected renewal request
```
