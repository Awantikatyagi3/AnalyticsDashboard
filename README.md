# DENA Analytics Dashboard Workspace

A full-stack analytics platform for India's policy data, organized as a clean **npm monorepo workspace**.

## Repository Structure

```
IIT/
├── package.json            # Root workspace config (orchestrates scripts & dependencies)
├── README.md               # Monorepo documentation
├── frontend/               # React + Vite Frontend application
│   ├── src/                # Components, pages, styles, assets
│   ├── public/             # Static public assets
│   ├── package.json        # Frontend configuration
│   ├── vite.config.js      # Vite build configuration
│   └── index.html          # Main HTML entrypoint
└── backend/                # Node.js + Express + TypeScript Backend API
    ├── src/                # Controllers, models, routes, middlewares, config
    ├── contracts/          # OpenAPI 3.0 API specifications
    ├── workflow/           # Specmatic Arazzo workflow test definitions
    ├── package.json        # Backend configuration
    └── tsconfig.json       # TypeScript configuration
```

---

## Getting Started

### 1. Install Workspace Dependencies

From the repository root `IIT/`:

```bash
npm install
```

This installs all dependencies for both the `frontend` and the `backend` workspaces in one run.

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

[Specmatic](https://specmatic.io) is used to validate the backend against the OpenAPI contract and run multi-step user journey tests.

### Run OpenAPI Contract Validation

With the backend server running, execute from the `backend/` directory:

```bash
npx specmatic test --host=localhost --port=3000
```

### Run Arazzo Workflow Journey Tests

With the backend server running, execute from the `backend/` directory:

```bash
npx specmatic test workflow/DenaAnalyticsJourney.arazzo.yaml --host=localhost --port=3000
```

---

## Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`
