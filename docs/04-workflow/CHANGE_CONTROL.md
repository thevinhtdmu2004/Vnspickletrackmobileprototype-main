# Change Control

## 1. Purpose

Control changes after Prototype Freeze v1.

## 2. Change Types

| Type | Example | Approval Needed |
|---|---|---|
| Wording | Đổi mật khẩu → Đổi mã PIN | Low |
| UI polish | Button spacing, colors | Low |
| Permission fix | Hide revenue from Coach | Medium |
| Business rule change | Học bù no longer deducts | High |
| New module | Booking, payment gateway | High |
| New role | Parent/Manager role | High |

## 3. Change Request Template

```text
Title:
Requested by:
Date:
Current behavior:
Requested change:
Reason:
Affected roles:
Affected screens:
Business impact:
Priority:
Approval:
```

## 4. Freeze Rule

After Prototype Freeze v1, do not add new major modules without explicit approval.

## 5. Recommended Process

```text
1. Create GitHub issue.
2. Classify change type.
3. Review impact.
4. Approve or reject.
5. Implement on branch.
6. Test role flows.
7. Merge through PR.
```
