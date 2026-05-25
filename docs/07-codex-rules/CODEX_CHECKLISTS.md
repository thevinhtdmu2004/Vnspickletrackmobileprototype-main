# Codex Checklists

## 1. Before Any Change

```text
[ ] Read AGENTS.md
[ ] Understand requested scope
[ ] Identify affected role(s)
[ ] Identify affected screen(s)
[ ] Check whether business rules are affected
[ ] Check whether docs need update
[ ] Plan minimal change
```

---

## 2. Source Change Checklist

```text
[ ] No unnecessary source restructure
[ ] No unrelated refactor
[ ] No new dependency unless approved
[ ] UI labels remain Vietnamese
[ ] Role-based access preserved
[ ] AccessDeniedScreen used when needed
[ ] App routes still make sense
```

---

## 3. Role Regression Checklist

### Admin

```text
[ ] Admin login works
[ ] Admin dashboard opens
[ ] Admin can see revenue
[ ] Admin can access Settings management items
[ ] Admin can access reports
```

### Coach

```text
[ ] Coach login works
[ ] Coach dashboard opens
[ ] Coach can access attendance
[ ] Coach cannot see revenue
[ ] Coach sees limited settings
```

### Member

```text
[ ] Member login works
[ ] Member dashboard opens
[ ] Member sees member bottom navigation
[ ] Member cannot access Admin/Coach screens
[ ] Member only sees personal information
```

---

## 4. Attendance Regression Checklist

```text
[ ] Có mặt exists
[ ] Trễ exists
[ ] Học bù exists
[ ] Vắng exists
[ ] Nghỉ phép exists
[ ] Có mặt deducts session
[ ] Trễ deducts session
[ ] Học bù deducts session
[ ] Vắng does not deduct
[ ] Nghỉ phép does not deduct
[ ] Zero balance warning still appears
```

---

## 5. Documentation Checklist

```text
[ ] README update needed?
[ ] docs update needed?
[ ] BA issue reference needed?
[ ] UAT checklist update needed?
[ ] Decision log update needed?
[ ] Risk register update needed?
```

---

## 6. Before PR

```text
[ ] Changes are scoped
[ ] Files changed are expected
[ ] Business rule impact documented
[ ] Role impact documented
[ ] Suggested tests listed
[ ] No accidental src restructure
[ ] No accidental package/dependency change
```
