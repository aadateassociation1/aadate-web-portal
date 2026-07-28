import { createFileRoute } from "@/lib/simple-router";
import { OwnerNoticesPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/owner/notices")({
  head: () => ({ meta: [{ title: "Notices & Documents - Gala Owner" }] }),
  component: OwnerNoticesPage,
});

