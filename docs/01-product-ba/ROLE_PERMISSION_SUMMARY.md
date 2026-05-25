# Role Permission Summary

## Roles

| Role | Summary |
|---|---|
| Admin | Full management and financial access |
| Coach | Attendance and class operation, no revenue |
| Member | Personal self-service only |

## Permission Summary

| Feature | Admin | Coach | Member |
|---|---:|---:|---:|
| Dashboard | Admin dashboard | Coach dashboard | Member dashboard |
| Today classes | Yes | Yes | No |
| Attendance | Yes | Yes | No |
| Student list | Yes | Limited | No |
| Student detail | Yes | Limited | Own data only |
| Package renewal | Confirm | No | Request only |
| Revenue | Yes | No | No |
| Reports | Full | Non-revenue | Own history only |
| Backup/export | Yes | No | No |
| Package management | Yes | No | View only |
| User management | Yes | No | No |
| Change PIN | Yes | Yes | Yes |

## Critical Rules

```text
Coach must not see revenue.
Member must not access Admin/Coach navigation.
Member renewal is request-only.
Học bù must deduct one session.
```
