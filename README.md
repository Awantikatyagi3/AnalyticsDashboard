# DENA Analytics Dashboard Workspace

A full-stack analytics platform for India's policy data, organized as a clean **npm monorepo workspace**.

## Repository Structure

```
IIT/
├── .github/
│   └── workflows/
│       └── specmatic-tests.yml   # CI pipeline: contract + workflow tests
├── package.json                  # Root workspace config (orchestrates scripts & dependencies)
├── README.md                     # Monorepo documentation
├── frontend/                     # React + Vite Frontend application
│   ├── src/                      # Components, pages, styles, assets
│   ├── public/                   # Static public assets
│   ├── package.json              # Frontend configuration
│   ├── vite.config.js            # Vite build configuration
│   └── index.html                # Main HTML entrypoint
└── backend/                      # Node.js + Express + TypeScript Backend API
    ├── src/                      # Controllers, models, routes, middlewares, config
    ├── contracts/                # OpenAPI 3.0 API specification + external examples
    │   ├── api.yaml              # OpenAPI spec (single source of truth)
    │   ├── api_dictionary.json   # Specmatic data dictionary for test generation
    │   └── api_examples/         # External Specmatic example files (12 scenarios)
    ├── workflow/                 # Arazzo workflow test definitions (for Enterprise)
    ├── specmatic.yaml            # Specmatic Config V3 (replaces specmatic.json)
    ├── jest.config.js            # Jest configuration for contract tests
    ├── docker-compose.yml        # Docker Compose: backend + specmatic-test services
    ├── package.json              # Backend configuration (includes specmatic, jest)
    └── tsconfig.json             # TypeScript configuration
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+
- **Java JRE 17+** (required by the Specmatic CLI JAR)

### 1. Install Workspace Dependencies

From the repository root `IIT/`:

```bash
npm install
```

This installs all dependencies for both the `frontend` and `backend` workspaces (including `specmatic`, `jest`, `ts-jest`, and `axios`) in one run.

### 2. Start Both Frontend and Backend Servers

To launch the backend server and frontend development server concurrently:

```bash
npm run dev
```

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:3000](http://localhost:3000)
- **API Swagger Documentation**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## Individual Workspace Scripts

If you want to interact with a specific workspace directly from the root folder:

### Frontend
- **Run dev server**: `npm run dev:frontend`
- **Build production bundle**: `npm run build:frontend`

### Backend
- **Run dev server**: `npm run dev:backend`
- **Build backend code**: `npm run build:backend`

---

## API Contract Testing with Specmatic

[Specmatic](https://specmatic.io) (open-source, v2.49.1) is used to validate the backend against the OpenAPI contract, generate resiliency tests, and run a multi-step user journey workflow. The configuration uses **Specmatic Config V3** (`specmatic.yaml`).

### Step 1 — Validate All Examples

Before running tests, verify that all inline and external examples in the contract are valid:

```bash
cd backend
npx specmatic examples validate --spec-file=contracts/api.yaml
```

Expected output:
```
Using dictionary file contracts/api_dictionary.json
All 8 example(s) are valid.  [Inline]
All 12 example(s) are valid. [External]
```

### Step 2 — Run Language-Native Jest Contract Tests (Recommended)

This is the **language-native integration** for this Node.js project. It starts the Express server programmatically using Jest, runs Specmatic contract tests inside the same process, and then executes a sequential **user journey workflow** (Login → Dashboards → Analytics → Insights):

```bash
cd backend
npm run test:contract
```

This runs `jest --config jest.config.js` which executes `src/scripts/specmatic-native.test.ts` with two test suites:

1. **Specmatic contract tests** — auto-generates test cases from `contracts/api.yaml` and validates every endpoint, status code, and schema.
2. **Sequential workflow** — simulates the real user journey: `POST /api/auth/login` → `GET /api/dashboards` → `GET /api/dashboards/{id}` → `GET /api/analytics/{category}` → `POST /api/insights` (CREATE → VIEW → VIEW → VIEW → CREATE).

### Step 3 — Run CLI Contract Tests

With the backend server running (`npm run dev:backend`), execute from the `backend/` directory:

```bash
cd backend
npx specmatic test --host=localhost --port=3000
```

Expected output:
```
100% API Coverage reported from 12 operations eligible for coverage
Tests run: 18, Successes: 18, Failures: 0
```

### Step 4 — Run Arazzo Workflow Tests (Enterprise)

The Arazzo workflow file (`workflow/DenaAnalyticsJourney.arazzo.yaml`) defines a multi-step user journey. Testing Arazzo workflows requires **Specmatic Enterprise**. With the backend running:

```bash
cd backend
# Requires Specmatic Enterprise license
npx specmatic test workflow/DenaAnalyticsJourney.arazzo.yaml --host=localhost --port=3000
```

> **Note**: This project uses Specmatic **Open Source** for all CI and automated tests. The Arazzo workflow file is included for forward-compatibility and documentation purposes.

---

## Running with Docker Compose

The `backend/docker-compose.yml` includes both the backend service and a `specmatic-test` service that automatically runs contract tests against the backend using the official `specmatic/specmatic:latest` open-source Docker image:

```bash
cd backend
docker compose up --exit-code-from specmatic-test
```

This will:
1. Build and start `dena-backend` on port `3000`.
2. Wait for the backend health check to pass.
3. Run `specmatic-test` (using `specmatic/specmatic:latest`) with `test --host=dena-backend --port=3000`.
4. Exit with the Specmatic test result code.

---

## CI/CD — GitHub Actions

Every `push` and `pull_request` to `main` automatically:

1. Installs Node.js 20 + Java 17 (required by Specmatic).
2. Installs all dependencies and builds the TypeScript backend.
3. Validates all Specmatic examples (`npx specmatic examples validate`).
4. Runs the language-native **Jest contract & workflow tests** (`npm run test:contract`).
5. Starts the backend server and runs full **CLI Specmatic contract tests**.
6. Uploads the Specmatic HTML test report as a build artifact.

See [`.github/workflows/specmatic-tests.yml`](.github/workflows/specmatic-tests.yml) for the full pipeline definition.

---

## Specmatic Integration Details

### Configuration: Specmatic Config V3 (`specmatic.yaml`)

The project uses **Specmatic Config Version 3** in YAML format (upgraded from the old `specmatic.json` using `npx specmatic config upgrade`):

```yaml
version: 3
systemUnderTest:
  service:
    definitions:
      - definition:
          source:
            filesystem:
              directory: "."
          specs:
            - "contracts/api.yaml"
            - "workflow/DenaAnalyticsJourney.arazzo.yaml"
```

### External Examples

Twelve external example files in `contracts/api_examples/` control the exact test data for every endpoint and status code, covering:
- `POST /api/auth/login` — 200 (valid), 401 (invalid creds), 400 (bad body)
- `GET /api/dashboards` — 200
- `GET /api/dashboards/{id}` — 200, 400, 404
- `GET /api/analytics/{category}` — 200
- `POST /api/insights` — 200 (×2), 400, 401

### Data Dictionary (`contracts/api_dictionary.json`)

The dictionary file controls the generated test data for typed fields across all auto-generated test scenarios:
- `(id:number)` → `1` — ensures path parameter `id` resolves to a seeded dashboard.
- `(bearerAuth:string)` → a long-lived JWT token (50 year expiry) signed with the app's secret — ensures all authenticated endpoint tests use a valid token automatically.

### Schema Resiliency Tests

Specmatic automatically generates **resiliency / generative tests** in addition to example-based tests. These tests:
- Send values of the **wrong type** for each field (e.g., string where integer is expected).
- Send values **outside enum constraints** (e.g., an invalid `category` for `/api/insights`).
- Expect the server to respond with `4xx` errors.

This is enabled by default — no additional configuration needed. The one `1f` entry visible in `/api/insights 200` coverage is a **passing resiliency check**: Specmatic sent a random category value that the server correctly rejected with `400`.

### API Coverage

```
100% API Coverage — 12 operations across 5 API paths, all covered.
```

### Specmatic MCP Server

The open-source Specmatic CLI includes an MCP (Model Context Protocol) server capability:

```bash
npx specmatic mcp server  # Run Specmatic as an MCP server over stdio
npx specmatic mcp test    # Run auto-tests against an MCP server
```

This project's backend exposes a **REST API only** (not an MCP tool server), so `specmatic mcp test` is not applicable. The `specmatic mcp server` can be used by AI agents (e.g., Claude, Cursor) to interact with the API contracts through Specmatic's MCP interface.

---

## Issues Found by Specmatic

Specmatic contract testing uncovered the following issues during integration:

1. **Missing response example for `validInsight`** — The inline request example named `validInsight` under `POST /api/insights` had no matching response example with the same name, causing Specmatic to skip it. **Fixed** by adding a corresponding `validInsight` response example to the `200` response in `contracts/api.yaml`.

2. **Expired JWT token in dictionary** — The `bearerAuth` token in `specmatic-dictionary.json` (now `contracts/api_dictionary.json`) was short-lived and expired. **Fixed** by generating a 50-year token signed with the application secret, eliminating intermittent `401` failures in auto-generated tests.

3. **Dictionary naming mismatch** — The old `specmatic-dictionary.json` was placed at the backend root but needed to be named `api_dictionary.json` in the same directory as `api.yaml` (`contracts/`) to follow Specmatic's auto-detection naming convention. **Fixed** by moving and renaming the file.

These fixes improve contract reliability and ensure the Specmatic test suite runs cleanly in CI without manual token rotation.

---

## Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`
