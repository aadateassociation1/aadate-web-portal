import { createFileRoute } from "@/lib/simple-router";
import { AdminChangePasswordPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/admin/change-password")({
  head: () => ({ meta: [{ title: "Change Password - Admin" }] }),
  component: AdminChangePasswordPage,
});

