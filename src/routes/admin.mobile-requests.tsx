import { createFileRoute } from "@tanstack/react-router";
import { AdminMobileRequestsPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/admin/mobile-requests")({
  head: () => ({ meta: [{ title: "Mobile Change Requests - Admin" }] }),
  component: AdminMobileRequestsPage,
});

