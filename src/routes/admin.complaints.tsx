import { createFileRoute } from "@/lib/simple-router";
import { AdminComplaintsPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/admin/complaints")({
  head: () => ({ meta: [{ title: "Complaint Management - Admin" }] }),
  component: AdminComplaintsPage,
});

