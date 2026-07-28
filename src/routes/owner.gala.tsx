import { createFileRoute } from "@/lib/simple-router";
import { OwnerGalaPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/owner/gala")({
  head: () => ({ meta: [{ title: "My Gala Details - Gala Owner" }] }),
  component: OwnerGalaPage,
});

