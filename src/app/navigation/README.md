# Navigation Foundation

This folder is reserved for production navigation definitions.

Sprint 00 baseline:

- Keep the current prototype routes in `src/app/App.tsx` until screens are split safely.
- Centralize route names, role home screens and route guards here when production navigation is extracted.
- Preserve Admin, Coach and Member shells from the approved prototype.
- Block restricted routes with `AccessDeniedScreen` or equivalent guard behavior.

Do not move prototype screens into this folder without a sprint task that covers regression testing.
