import { createFileRoute } from "@/lib/simple-router";
import { AdminRegistrationsPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/admin/registrations")({
  head: () => ({ meta: [{ title: "Registration Approvals - Admin" }] }),
  component: AdminRegistrationsPage,
});

