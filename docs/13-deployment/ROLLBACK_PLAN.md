# Rollback Plan

## 1. Purpose

Defines rollback and recovery strategy for VNS PickleTrack pilot or production release.

---

## 2. Rollback Triggers

Rollback should be considered when:

```text
- App cannot start
- Login fails for critical roles
- Attendance cannot be saved
- Package balance is corrupted
- Coach can see revenue
- Member can see other member data
- Backup/export corrupts data
```

---

## 3. Rollback Options

| Option | Description |
|---|---|
| Reinstall previous build | Use previous APK/build |
| Restore backup | Restore last known good data backup |
| Disable feature | Hide/disable problematic feature |
| Manual correction | Correct small data issue manually |

---

## 4. Pre-release Backup Rule

Before pilot or production update:

```text
[ ] Create backup
[ ] Verify backup file exists
[ ] Record current app version
[ ] Record new app version
[ ] Communicate rollback contact
```

---

## 5. Rollback Steps

```text
1. Stop using affected version.
2. Record issue and affected data.
3. Restore previous app/build if needed.
4. Restore backup if data corruption occurred.
5. Verify Admin/Coach/Member login.
6. Verify attendance/package balance.
7. Record rollback result.
```

---

## 6. Post-rollback Review

```text
[ ] Root cause identified
[ ] Bug issue created
[ ] Risk register updated
[ ] Release notes updated
[ ] Fix plan prepared
```
