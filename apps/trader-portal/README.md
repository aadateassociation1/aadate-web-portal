# Trader Portal

Target app for approved traders.

Current first-step implementation:
- Trader-facing routes are available in the root app under `/trader/...`.
- Legacy `/owner/...` routes still work as compatibility aliases.
- Data integration will move from mock/localStorage to `/api/v1/trader`.

Required modules include customer search, customer KYC, invoices, payments,
ledger, reminders, warnings, notices, reports, notifications, and support.

