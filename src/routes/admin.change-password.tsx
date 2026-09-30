import { createFileRoute } from "@/lib/simple-router";
import { AdminChangePasswordPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/da_admin/ssk/change-password")({
  head: () => ({ meta: [{ title: "Change Password - Admin" }] }),
  component: AdminChangePasswordPage,
});

