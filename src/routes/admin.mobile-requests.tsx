import { createFileRoute } from "@/lib/simple-router";
import { AdminMobileRequestsPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/da_admin/ssk/mobile-requests")({
  head: () => ({ meta: [{ title: "Mobile Change Requests - Admin" }] }),
  component: AdminMobileRequestsPage,
});

