import { createFileRoute } from "@/lib/simple-router";
import { OwnerMobileChangePage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/owner/mobile-change")({
  head: () => ({ meta: [{ title: "Mobile Number Change - Trader" }] }),
  component: OwnerMobileChangePage,
});

