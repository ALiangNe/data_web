# data_web

Vue 3 SPA for the **Data Console**. Authenticates via the auth service and queries operational data through [`data_gateway`](../data_gateway).

Stack: Vue 3 · TypeScript · Vite · Vue Router · Pinia · Element Plus · Axios · ECharts · SCSS.

---

## Project structure

```
data_web/
├── Dockerfile              # nginx serves dist/
├── nginx.conf
├── index.html
├── package.json
├── vite.config.ts
└── src/
    ├── main.ts             # Bootstrap: Pinia, router, Element Plus, API client
    ├── App.vue
    │
    ├── api/                # HTTP clients
    │   ├── apiClient.ts    # Axios instance, interceptors, auth header
    │   ├── auth.ts         # Login / refresh (VITE_API_BASE_URL)
    │   └── data.ts         # Data gateway POST /data/* (VITE_DATA_API_BASE_URL)
    │
    ├── configs/
    │   ├── data.ts         # Table filters/sort, lookup entities, dashboard MEDIA_PLATFORMS
    │   └── sidebar.ts      # Nav groups, role → permission mapping
    │
    ├── router/
    │   ├── index.ts        # Guards: auth, guestOnly, permission
    │   └── routes.ts       # Route definitions
    │
    ├── stores/
    │   ├── pinia.ts
    │   └── user.ts         # Session user (role, ids)
    │
    ├── composables/
    │   ├── auth/useAuth.ts
    │   └── common/useAlert.ts
    │
    ├── types/              # api · auth · data · env · axios augmentations
    │
    ├── layouts/
    │   ├── AuthLayout.vue  # Login shell
    │   └── MainLayout.vue  # Sidebar + header + outlet
    │
    ├── components/
    │   ├── auth/
    │   │   └── LoginForm.vue
    │   ├── layout/
    │   │   ├── AppHeader.vue
    │   │   └── AppSidebar.vue
    │   └── data/           # Shared display components
    │       ├── DataFilter.vue
    │       ├── DataTable.vue
    │       ├── DataPagination.vue
    │       ├── DataModal.vue
    │       ├── DataChartPanel.vue   # Dashboard charts (props only)
    │       ├── ChatHistoryList.vue
    │       ├── MonitorLogCard.vue
    │       └── UserMemoryPanel.vue
    │
    ├── views/              # Pages: fetch + assemble data, pass props down
    │   ├── login/LoginView.vue
    │   ├── dashboard/DashboardView.vue
    │   ├── users/UsersView.vue
    │   ├── bots/BotsView.vue
    │   ├── knowledge/KnowledgeView.vue
    │   ├── mcp-capabilities/McpCapabilitiesView.vue
    │   ├── monitor-logs/MonitorLogsView.vue
    │   ├── user-behavior-logs/UserBehaviorLogsView.vue
    │   └── data-lookup/DataLookupView.vue
    │
    └── styles/
        ├── variables.css
        ├── global.scss
        └── _fluid.scss
```

### Page conventions

| Pattern | Where | Responsibility |
|---------|-------|----------------|
| **List page** | `views/*View.vue` (except dashboard) | Read `DATA_CENTER_TABLES` config → call `api/data` → `DataFilter` + `DataTable` + `DataPagination` |
| **Dashboard** | `DashboardView.vue` | Multiple API calls, date grouping, chart props assembly → `DataChartPanel` |
| **Display** | `components/data/*` | Render props; no business API calls |

---

## Routes

| Path | View | Notes |
|------|------|-------|
| `/` | LoginView | Guest only |
| `/dashboard` | DashboardView | Default after login; sidebar brand link |
| `/users` | UsersView | List + chat / memory modals |
| `/bots` | BotsView | List |
| `/knowledge` | KnowledgeView | List |
| `/mcp-capabilities` | McpCapabilitiesView | List |
| `/monitor-logs` | MonitorLogsView | Trace lookup |
| `/user-behavior-logs` | UserBehaviorLogsView | Aggregated list |
| `/data-lookup` | DataLookupView | Entity + ids lookup |

Routes with `meta.permission` are checked against `DATA_CONSOLE_PERMISSIONS[role]`; denied users redirect to Dashboard.

---

## Auth & API bases

1. Login → `POST /auth/webLogin` on `VITE_API_BASE_URL`
2. Token in `localStorage`; sent as `auth` header on every request
3. Data APIs → `VITE_DATA_API_BASE_URL` + `/data/*`

---

## Environment

Create `.env` in project root:

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | Auth service |
| `VITE_DATA_API_BASE_URL` | Data gateway |

Types: [`src/types/env.d.ts`](src/types/env.d.ts).

Production may use relative paths (e.g. `/` with nginx routing `/auth` and `/data` to backends).

---

## Scripts

```bash
npm run dev            # Vite dev server (port 5173)
npm run build          # eslint + vue-tsc + production build
npm run build:staging  # build with --mode staging
npm run preview        # preview dist/
```

Build output is served by nginx in Docker (`dist/` → port 81).

---

## Extend

**New list page:** `configs/data.ts` → `api/data.ts` + `types/data.ts` → `views/<Name>View.vue` → `routes.ts` + `sidebar.ts` → matching `data_gateway` endpoint.

**New lookup entity:** add to `DATA_LOOKUP_TABLES` in `configs/data.ts` and `TABLE_MAP` in `data_gateway`.

**New dashboard metric:** extend gateway API → assemble in `DashboardView.vue` → add props to `DataChartPanel.vue`.
