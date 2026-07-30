import { createFileRoute } from "@/lib/simple-router";
import { OwnerProfilePage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/owner/profile")({
  head: () => ({ meta: [{ title: "My Profile - Trader" }] }),
  component: OwnerProfilePage,
});

