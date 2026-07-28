import { createFileRoute } from "@tanstack/react-router";
import { AdminGalleryPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/admin/gallery")({
  head: () => ({ meta: [{ title: "Gallery Management - Admin" }] }),
  component: AdminGalleryPage,
});
