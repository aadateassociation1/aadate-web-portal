import { createFileRoute } from "@/lib/simple-router";
import { AdminGalleryPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/da_admin/ssk/gallery")({
  head: () => ({ meta: [{ title: "Gallery Management - Admin" }] }),
  component: AdminGalleryPage,
});
