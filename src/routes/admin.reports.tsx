import { createFileRoute } from "@/lib/simple-router";
import { AdminReportsPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/da_admin/ssk/reports")({
  head: () => ({ meta: [{ title: "Reports & Analytics - Admin" }] }),
  component: AdminReportsPage,
});

