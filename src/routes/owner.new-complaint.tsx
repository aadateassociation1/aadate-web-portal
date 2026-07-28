import { createFileRoute } from "@tanstack/react-router";
import { OwnerNewComplaintPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/owner/new-complaint")({
  head: () => ({ meta: [{ title: "Raise Complaint - Gala Owner" }] }),
  component: OwnerNewComplaintPage,
});

