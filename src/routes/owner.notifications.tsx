import { createFileRoute } from "@tanstack/react-router";
import { OwnerNotificationsPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/owner/notifications")({
  head: () => ({ meta: [{ title: "Notifications - Gala Owner" }] }),
  component: OwnerNotificationsPage,
});

