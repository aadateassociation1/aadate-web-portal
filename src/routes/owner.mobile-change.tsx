import { createFileRoute } from "@tanstack/react-router";
import { OwnerMobileChangePage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/owner/mobile-change")({
  head: () => ({ meta: [{ title: "Mobile Number Change - Gala Owner" }] }),
  component: OwnerMobileChangePage,
});

