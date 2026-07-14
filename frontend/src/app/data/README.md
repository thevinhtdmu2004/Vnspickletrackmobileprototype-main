# Data Foundation

This folder is reserved for production data access and persistence adapters.

Sprint 00 accepted MVP baseline:

- Use local-first persistence for the first MVP/pilot.
- Keep manual backup/export as the required data protection workflow.
- Do not introduce cloud sync or payment gateway assumptions in the prototype.
- Keep repository interfaces separate from UI screens when production data access is introduced.
- Treat backup/export files as sensitive because they may include member and revenue data.

Cloud or hybrid sync requires a later change request.
