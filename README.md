# data_web

Web frontend for the **Data Console**. Vue 3 SPA for querying operational data via [`data_gateway`](../data_gateway) and authenticating via the auth service.

## Intro

Operators sign in, then browse paginated tables, trace logs, chat history, and raw ID lookups. Route access is gated by JWT role on both frontend (`DATA_CONSOLE_PERMISSIONS`) and backend (`roleCheck`).

**Stack**

- Vue 3 · TypeScript · Vite
- Vue Router · Pinia
- Element Plus · Axios
- SCSS

**Features**

- Login with token refresh (`auth` header on every request)
- Role-based sidebar and route guards
- Reusable data UI: `DataFilter` · `DataTable` · `DataPagination` · `DataModal`
- Data Center pages: filter, sort, paginate list endpoints
- Data Lookup: batch fetch raw rows by entity + ids
- Users page: chat history calendar and user memory modals

---

## Project layout

```
data_web/
├── Dockerfile · nginx.conf
├── index.html
├── package.json
├── vite.config.ts
└── src/
    ├── main.ts                App bootstrap & API client init
    ├── api/                   auth · data · apiClient (interceptors)
    ├── configs/
    │   ├── data.ts            Table filters, sort fields, lookup entities
    │   └── sidebar.ts         Nav items & role permissions
    ├── router/                Routes & guards
    ├── stores/                Pinia (user session)
    ├── composables/           useAuth · useAlert
    ├── types/                 api · auth · data · env
    ├── layouts/               AuthLayout · MainLayout
    ├── components/
    │   ├── auth/              LoginForm
    │   ├── layout/            AppHeader · AppSidebar
    │   └── data/              Shared list / modal / chat components
    ├── views/                 One view per console page
    └── styles/                variables · global · fluid
```

**Pages** ([`src/router/routes.ts`](src/router/routes.ts)):

| Route | View | Mode |
|-------|------|------|
| `/` | LoginView | Auth |
| `/users` | UsersView | List + chat / memory modals |
| `/bots` | BotsView | List |
| `/knowledge` | KnowledgeView | List |
| `/mcp-capabilities` | McpCapabilitiesView | List |
| `/monitor-logs` | MonitorLogsView | Trace lookup |
| `/user-behavior-logs` | UserBehaviorLogsView | Aggregated list |
| `/data-lookup` | DataLookupView | Entity + ids lookup |

List pages share the same pattern: read config from [`configs/data.ts`](src/configs/data.ts) → call [`api/data.ts`](src/api/data.ts) → render shared components.

---

## Auth & permissions

1. `LoginView` → `POST /auth/webLogin` (auth service, `VITE_API_BASE_URL`)
2. Access token stored in `localStorage`; attached as `auth` header
3. `router.beforeEach` checks `requiresAuth`, `guestOnly`, and `meta.permission`
4. Sidebar filtered by `DATA_CONSOLE_PERMISSIONS[role]` in [`configs/sidebar.ts`](src/configs/sidebar.ts)

Data APIs use a separate base URL: `VITE_DATA_API_BASE_URL` → `data_gateway` `/data/*`.

---

## Environment variables

Create `.env` in the project root:

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | Auth service (login, refresh, user info) |
| `VITE_DATA_API_BASE_URL` | Data gateway (`/data/*`) |

Type definitions: [`src/types/env.d.ts`](src/types/env.d.ts).

---

## Scripts

```bash
npm run dev            # Vite dev server (port 5173)
npm run build          # lint + typecheck + production build
npm run build:staging  # build with staging mode
npm run preview        # preview production build
```

---

## How to extend

### New Data Center page

1. Add table config in [`configs/data.ts`](src/configs/data.ts) (`DATA_CENTER_TABLES`).
2. Add API function in [`api/data.ts`](src/api/data.ts) and types in [`types/data.ts`](src/types/data.ts).
3. Create `views/<name>/<Name>View.vue` using `DataFilter` + `DataTable` + `DataPagination`.
4. Register route in [`router/routes.ts`](src/router/routes.ts) with `meta.permission`.
5. Add sidebar entry and role mapping in [`configs/sidebar.ts`](src/configs/sidebar.ts).
6. Implement matching endpoint in `data_gateway`.

### New lookup entity

Add key to `DATA_LOOKUP_TABLES` in [`configs/data.ts`](src/configs/data.ts) and `TABLE_MAP` in `data_gateway`.
