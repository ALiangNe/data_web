# data_web

Internal Data Console for company data queries. It uses `data_gateway` for user, chat, hardware, software package, resource, log, and common lookup data.

## Features

- User Operations: users and user behavior logs
- Robot Management: bots and software packages
- AI Resources: Knowledge and MCP Capabilities
- Developer Tools: monitor logs and data lookup

## Structure

- `src/api/`: HTTP clients
- `src/components/`: shared and feature components
- `src/configs/`: table, sidebar, and permission config
- `src/layouts/`: page layouts
- `src/router/`: routes and guards
- `src/stores/`: Pinia stores
- `src/types/`: shared TypeScript types
- `src/views/`: page views

## Pages

- `/`: login
- `/dashboard`: dashboard
- `/users`: users, chat histories, and user memory
- `/bots`: robots
- `/software`: software packages
- `/knowledge`: Knowledge
- `/mcp-capabilities`: MCP Capabilities
- `/monitor-logs`: monitor logs
- `/user-behavior-logs`: user behavior logs
- `/data-lookup`: data lookup

Sidebar permissions are defined in `src/configs/sidebar.ts`.

## Scripts

```bash
npm run dev
npm run build
npm run build:staging
npm run preview
```

`npm run build` runs ESLint, type checks, and builds the production files.
