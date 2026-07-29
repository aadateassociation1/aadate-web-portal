import { createFileRoute } from "@/lib/simple-router";
import { AdminUsersPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Member Management - Admin" }] }),
  component: AdminUsersPage,
});

