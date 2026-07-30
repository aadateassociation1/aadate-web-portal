import { createFileRoute } from "@/lib/simple-router";
import { OwnerHelpPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/owner/help")({
  head: () => ({ meta: [{ title: "Help & Support - Trader" }] }),
  component: OwnerHelpPage,
});

