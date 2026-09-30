import { createFileRoute } from "@/lib/simple-router";
import { AdminAuditPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/da_admin/ssk/audit")({
  head: () => ({ meta: [{ title: "Audit Logs - Admin" }] }),
  component: AdminAuditPage,
});

