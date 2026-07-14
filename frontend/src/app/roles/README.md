# Role Foundation

This folder is reserved for production role and permission helpers.

Sprint 00 baseline:

- Supported roles are `admin`, `coach` and `member`.
- Admin keeps full business and configuration access.
- Coach can operate classes and attendance but cannot view revenue.
- Member can only view personal data and cannot mark attendance.
- Member renewal remains request-only; Admin confirms payment and package renewal.

Role checks must protect navigation, routes, service actions and data ownership.
