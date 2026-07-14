# VNS PickleTrack Backend

ASP.NET Core Web API for the VNS PickleTrack mobile-first frontend.

## Technology

- Visual Studio Insiders 2026 compatible `.slnx` solution
- .NET 10 and C#
- ASP.NET Core Minimal API
- Entity Framework Core 10
- PostgreSQL through Npgsql
- Docker Compose
- xUnit and architecture tests

## Solution Path

```text
backend/Vns.PickleTrack.Backend.slnx
```

Open this file directly in Visual Studio Insiders 2026.

## Project Structure

```text
backend/
├── Vns.PickleTrack.Backend.slnx
├── src/
│   ├── Vns.PickleTrack.Api/
│   ├── Vns.PickleTrack.Application/
│   ├── Vns.PickleTrack.Domain/
│   └── Vns.PickleTrack.Infrastructure/
└── tests/
    ├── Vns.PickleTrack.Architecture.Tests/
    └── Vns.PickleTrack.Domain.UnitTests/
```

## Dependency Direction

```text
Api -> Application
Api -> Infrastructure
Infrastructure -> Application
Infrastructure -> Domain
Application -> Domain
Domain -> no project dependency
```

## Local URLs

```text
Frontend:       http://localhost:5170
Docker API:     http://localhost:5080
Local debug:    http://localhost:5081
Live health:    http://localhost:5080/health/live
System info:    http://localhost:5080/api/v1/system/info
Database ready: http://localhost:5080/api/v1/system/database
OpenAPI JSON:   http://localhost:5080/openapi/v1.json
```

Implemented business endpoints:

```text
POST /api/v1/auth/login
GET  /api/v1/admin/dashboard
GET  /api/v1/admin/members
```

The Admin endpoints require an Admin JWT. Coach and Member tokens receive
`403 Forbidden`.

Frontend environment:

```env
VITE_API_BASE_URL=http://localhost:5080/api/v1
```

## Run with Docker

```bash
cd backend
docker compose up --build
```

For local secrets, create `backend/.env` from `backend/.env.example`.
Never commit the `.env` file.

The PostgreSQL volume is versioned as `pickletrack_postgres18_v1_data`.
Previous Docker volumes are not deleted automatically.

In the Development environment, startup seeds an idempotent sample dataset
directly into PostgreSQL when the `users` table is empty:

```text
Admin:  admin  / 123456
Coach:  coach  / 111111
Member: member / 222222
```

The sample data includes users, members, classes, sessions, packages,
renewal payments, and all five MVP attendance statuses.

## Run from .NET CLI

Start PostgreSQL:

```bash
cd backend
docker compose up postgres -d
```

Run the API:

```bash
dotnet run --project src/Vns.PickleTrack.Api
```

Visual Studio and `dotnet run` use port `5081`. Docker Compose publishes the
container API on port `5080`, so both execution modes can run simultaneously.

## Verification

```bash
dotnet restore Vns.PickleTrack.Backend.slnx
dotnet tool restore
dotnet build Vns.PickleTrack.Backend.slnx --configuration Release
dotnet test Vns.PickleTrack.Backend.slnx --configuration Release
```

## Security Boundaries

- Revenue and payment operations are Admin-only.
- Coach operations are scoped to assigned classes and sessions.
- Member queries must be scoped to the authenticated member ID.
- Member renewal is request-only.
- Attendance supports exactly five MVP statuses.
- `Present`, `Late`, and `Makeup` deduct one session.
