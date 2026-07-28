import { createFileRoute } from "@tanstack/react-router";
import { AdminUpdatesPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/admin/updates")({
  head: () => ({ meta: [{ title: "Market Updates - Admin" }] }),
  component: AdminUpdatesPage,
});

