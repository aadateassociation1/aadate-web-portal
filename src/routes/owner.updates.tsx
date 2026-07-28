import { createFileRoute } from "@/lib/simple-router";
import { OwnerUpdatesPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/owner/updates")({
  head: () => ({ meta: [{ title: "Market Updates - Gala Owner" }] }),
  component: OwnerUpdatesPage,
});

