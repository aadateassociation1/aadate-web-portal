import { createFileRoute } from "@/lib/simple-router";
import { AdminReportsPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Reports & Analytics - Admin" }] }),
  component: AdminReportsPage,
});

