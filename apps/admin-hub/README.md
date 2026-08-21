# Admin Hub

Target app for `MAIN_ADMIN` and `USER_ADMIN`.

Current first-step implementation:
- Admin routes remain in the root app under `/admin/...`.
- Backend dashboard summary is available at `/api/v1/admin/dashboard-summary`.
- Menus and actions should be tightened by permissions as backend auth grows.

Required modules include trader verification, customer KYC, duplicates,
warnings, disputes, content, reports, audit logs, and settings.

