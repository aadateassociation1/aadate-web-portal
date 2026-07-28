import { createFileRoute } from "@/lib/simple-router";
import { OwnerChangePasswordPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/owner/change-password")({
  head: () => ({ meta: [{ title: "Change Password - Gala Owner" }] }),
  component: OwnerChangePasswordPage,
});

