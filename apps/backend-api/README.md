# Backend API

Shared Node/Express API for all Market Yard applications.

Local commands from the repo root:

```sh
npm run dev:backend
npm run db:init
```

Local endpoints:
- `GET /api/health`
- `GET /api/v1/health`
- `GET /api/v1/public/posts`
- `GET /api/v1/public/notices`
- `GET /api/v1/admin/dashboard-summary`
- `GET /api/v1/trader/customer-risk-search?q=...`

The API uses the shared MySQL database `market_yard_portal`.

