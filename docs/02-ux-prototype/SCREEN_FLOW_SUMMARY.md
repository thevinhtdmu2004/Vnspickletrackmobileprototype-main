# Screen Flow Summary

## Entry Flow

```text
Splash → Login
Login Admin → Dashboard Admin
Login Coach → Dashboard Coach
Login Member → Member Dashboard
```

## Admin Flow

```text
Dashboard Admin
├── Today Classes → Session Detail → Attendance Check
├── Students → Student Detail → Renew Package
├── Classes → Class Detail → Assign Students
├── Reports → Revenue / Attendance / Class / Student Reports
└── Settings → Backup / Export / Package / User Management
```

## Coach Flow

```text
Dashboard Coach
├── Today Classes → Session Detail → Attendance Check
├── Students — limited
├── Reports — non-revenue
└── Settings — basic account settings
```

## Member Flow

```text
Member Dashboard
├── Member Schedule
├── Member Package
├── Member Attendance History
├── Member Payment History
├── Member Renew Request
├── Member Contact
└── Member Profile
```

## Important Access Rules

- Coach cannot see revenue.
- Member cannot see Admin/Coach navigation.
- Member can only see personal data.
- AccessDeniedScreen handles blocked access.
