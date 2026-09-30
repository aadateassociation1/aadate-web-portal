import { createFileRoute } from "@/lib/simple-router";
import { AdminUsersPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/da_admin/ssk/users")({
  head: () => ({ meta: [{ title: "Member Management - Admin" }] }),
  component: AdminUsersPage,
});

