import { createFileRoute } from "@tanstack/react-router";
import { OwnerComplaintsPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/owner/complaints")({
  head: () => ({ meta: [{ title: "My Complaints - Gala Owner" }] }),
  component: OwnerComplaintsPage,
});

