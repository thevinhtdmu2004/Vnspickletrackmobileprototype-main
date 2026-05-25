# Database Design Documentation

## 1. Purpose

This folder contains database planning documents for the future VNS PickleTrack production implementation.

The prototype currently uses mock data. These documents define the target data concepts without forcing a backend decision during prototype freeze.

---

## 2. Documents

| File | Purpose |
|---|---|
| `DATABASE_OVERVIEW.md` | Database strategy and design principles |
| `ERD_CONCEPT.md` | Conceptual entity relationship design |
| `TABLE_SPECIFICATIONS.md` | Draft table specifications and constraints |
| `MIGRATION_STRATEGY.md` | Migration/versioning strategy |
| `SEED_DATA_STRATEGY.md` | Demo and initial seed data strategy |

---

## 3. Critical Database Rules

```text
- Attendance and package balance must be auditable.
- Attendance has exactly 5 MVP statuses: Có mặt, Trễ, Học bù, Vắng, Nghỉ phép.
- Deducting statuses are: Có mặt, Trễ, Học bù.
- Học bù deducts one session.
- Member renewal is request-only; Admin confirms package renewal/payment.
- Coach cannot access revenue data.
- Member can only access own data.
- Backup/export contains sensitive data and must be Admin-only.
```

---

## 4. Documentation Status

These documents are conceptual BA/technical planning references. They are not a final schema contract until the production architecture and database engine are approved.
