import { createFileRoute } from "@/lib/simple-router";
import { AdminUsersPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Gala Owner Management - Admin" }] }),
  component: AdminUsersPage,
});

