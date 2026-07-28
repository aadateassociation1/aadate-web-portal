import { createFileRoute } from "@tanstack/react-router";
import { AdminReportsPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Reports & Analytics - Admin" }] }),
  component: AdminReportsPage,
});

