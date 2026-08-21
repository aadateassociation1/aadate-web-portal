# Market Yard Schema Reference

The shared MySQL database is `market_yard_portal`.

The single SQL source of truth is:

```text
database/market_yard_portal_mysql_schema.sql
```

Use the same file in MySQL Workbench for setup/updates.

Current major domains:
- Access control: `roles`, `permissions`, `role_permissions`, `users`, `user_sessions`, `otp_verifications`
- Members: `members`, `member_documents`, member verification history, `market_galas`, `business_categories`
- Customers and KYC: `customers`, `customer_identifiers`, `customer_documents`, `customer_consents`, `customer_kyc_history`, `customer_duplicate_candidates`
- Member/customer linking
- Finance: `invoices`, `invoice_items`, `payments`, `payment_allocations`, `ledger_entries`
- Warnings and disputes: `payment_reminders`, `warning_cases`, `warning_evidence`, `warning_history`, `customer_disputes`, `dispute_evidence`
- Content and media: `media_files`, `posts`, `notifications`, `support_tickets`
- Rating and reviews: `ratings`
- Admin/audit: `system_settings`, `audit_logs`

Every frontend app must use the shared backend API. Do not connect any frontend directly to MySQL.
