# Data Persistence Strategy

## 1. Purpose

This document evaluates data persistence options for the production version of VNS PickleTrack.

The prototype uses mock data. Production must decide how data is stored, protected, backed up and potentially synchronized.

---

## 2. Data Categories

| Data Type | Examples | Sensitivity |
|---|---|---|
| User Account | Username, PIN hash, role | High |
| Member Profile | Name, phone, level, class | High |
| Class/Session | Schedule, coach, court | Medium |
| Attendance | Status, date, deduction | High |
| Package/Payment | Package, amount, renewal | High |
| Reports | Revenue, attendance summary | High |
| Backup Files | Full data snapshot | High |

---

## 3. Persistence Options

### Option A - Local SQLite Only

Data is stored locally on one device.

Pros:

```text
- Simple MVP implementation
- Works offline
- No backend cost
- Fast local access
```

Cons:

```text
- Hard to use on multiple devices
- Data loss risk if device is lost
- Manual backup required
- Member self-service is limited unless same device/app model is clarified
```

Suitable for:

```text
Small pilot / one-admin operation
```

---

### Option B - Local SQLite + Manual Backup/Export

Data is stored locally, with backup/export workflow.

Pros:

```text
- Still simple
- Offline-first
- Reduces data loss risk compared to no backup
- Good for MVP pilot
```

Cons:

```text
- Backup discipline required
- No true multi-device sync
- Member portal still challenging if members use own devices
```

Suitable for:

```text
MVP with one main operator device
```

---

### Option C - Cloud Backend

Data is stored centrally via backend/API.

Pros:

```text
- Multi-device support
- Better member portal support
- Centralized backup
- Easier reporting
```

Cons:

```text
- More development effort
- Requires hosting/security
- Needs API/auth design
- Offline usage needs extra work
```

Suitable for:

```text
Commercial product or multi-coach/member access
```

---

### Option D - Hybrid Offline + Cloud Sync

Local data with cloud synchronization.

Pros:

```text
- Best user experience long term
- Offline support
- Multi-device support
```

Cons:

```text
- Highest complexity
- Conflict handling required
- More testing needed
```

Suitable for:

```text
Mature product phase, not first MVP unless required
```

---

## 4. Recommended MVP Direction

For first production MVP, recommended decision path:

```text
Start with Option B: Local SQLite + Manual Backup/Export
```

Rationale:

```text
- Matches original lightweight mobile app direction
- Keeps MVP implementation manageable
- Supports offline court usage
- Allows Admin to operate without backend
- Can evolve later to cloud sync
```

However, if Member must login from their own phone in MVP, then a cloud backend or hybrid approach should be reconsidered.

---

## 5. Critical Design Questions

Before implementation, answer:

```text
1. Will Member use the same device as Admin/Coach, or their own phone?
2. Is multi-device sync required in MVP?
3. Is data loss acceptable if backup is not performed?
4. Is revenue/payment history considered sensitive enough for encryption?
5. Is offline-first mandatory?
```

---

## 6. Balance Calculation Strategy

Two options:

### Option 1 - Store Used/Remaining Sessions

Pros:

```text
- Simple display
- Fast query
```

Cons:

```text
- Risk of inconsistency if attendance correction is wrong
```

### Option 2 - Calculate from Payment/Renewal and Attendance Records

Pros:

```text
- Auditable
- More accurate long-term
```

Cons:

```text
- More complex queries
```

Recommended:

```text
Use auditable transaction model for production.
Keep cached balance only if necessary.
```

---

## 7. Data Protection Notes

- PIN should not be stored as plain text in production.
- Backup files contain personal and financial data.
- Export CSV should be Admin-only.
- Member data access must be scoped to the current member.
- Revenue data must be Admin-only.

---

## 8. ADR Status

ADR-001 records the accepted MVP/pilot baseline:

```text
Local-first pilot data strategy with manual backup/export.
Cloud backend and hybrid sync are deferred unless rollout scope changes.
```
