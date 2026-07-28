import { createFileRoute } from "@/lib/simple-router";
import { AdminNoticesPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/admin/notices")({
  head: () => ({ meta: [{ title: "Notices & Documents - Admin" }] }),
  component: AdminNoticesPage,
});

