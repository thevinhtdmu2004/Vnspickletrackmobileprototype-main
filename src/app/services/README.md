# Services Foundation

This folder is reserved for production application services.

Sprint 00 baseline services:

- `AuthService`: login, logout, PIN/account handling and current role.
- `AuthorizationService`: screen/action permission checks.
- `MemberService`: member CRUD and member-owned summaries.
- `ClassService`: class CRUD and assignment.
- `SessionService`: today sessions, creation and status.
- `AttendanceService`: attendance status, correction and deduction logic.
- `PackageService`: package catalog and balance summary.
- `RenewalService`: member renewal request and Admin confirmation.
- `ReportService`: role-safe reporting.
- `BackupService`: Admin-only backup, export and restore workflow.

Business rules must not be duplicated in random UI screens.
