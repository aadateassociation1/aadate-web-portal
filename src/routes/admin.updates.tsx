import { createFileRoute } from "@/lib/simple-router";
import { AdminUpdatesPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/da_admin/ssk/updates")({
  head: () => ({ meta: [{ title: "Market Updates - Admin" }] }),
  component: AdminUpdatesPage,
});

