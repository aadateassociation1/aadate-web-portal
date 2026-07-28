import { createFileRoute } from "@tanstack/react-router";
import { OwnerHelpPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/owner/help")({
  head: () => ({ meta: [{ title: "Help & Support - Gala Owner" }] }),
  component: OwnerHelpPage,
});

