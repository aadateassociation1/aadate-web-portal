import { createFileRoute } from "@/lib/simple-router";
import { AdminHelpPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/admin/help")({
  head: () => ({ meta: [{ title: "Help & Support - Admin" }] }),
  component: AdminHelpPage,
});

