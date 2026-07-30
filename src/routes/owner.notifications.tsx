import { createFileRoute } from "@/lib/simple-router";
import { OwnerNotificationsPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/owner/notifications")({
  head: () => ({ meta: [{ title: "Notifications - Trader" }] }),
  component: OwnerNotificationsPage,
});

