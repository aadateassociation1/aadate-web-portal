import { createFileRoute } from "@/lib/simple-router";
import { AdminAuditPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/admin/audit")({
  head: () => ({ meta: [{ title: "Audit Logs - Admin" }] }),
  component: AdminAuditPage,
});

