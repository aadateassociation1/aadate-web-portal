# Market Yard Production Notes

## Required Backend Environment

Set these on the VPS for the `market-yard-api` PM2 process:

```env
UPLOAD_ROOT=/home/deploy/data/market-yard/uploads
VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
VAPID_SUBJECT=mailto:admin@digitalaadate.org
```

`UPLOAD_ROOT` must be outside `/var/www/digitalaadate`, `dist`, and `dist-admin` so uploads survive frontend deployments.

Generate VAPID keys once:

```bash
npx web-push generate-vapid-keys
```

Keep `VAPID_PRIVATE_KEY` only on the backend.

## Nginx

Keep `/api/` proxied to the backend:

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:4008;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Allow mobile photo uploads:

```nginx
client_max_body_size 20M;
```

Reload Nginx after changes:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Database Migrations

For a fresh Hostinger import:

1. `database/01_hostinger_schema_queries.sql`
2. `database/02_hostinger_login_seed.sql`

For an existing production database, import:

1. `database/03_push_notifications_migration.sql`

The backend also creates the push tables safely on startup with `CREATE TABLE IF NOT EXISTS`.

