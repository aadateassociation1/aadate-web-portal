import { createFileRoute } from "@/lib/simple-router";
import { OwnerNewComplaintPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/owner/new-complaint")({
  head: () => ({ meta: [{ title: "Raise Complaint - Trader" }] }),
  component: OwnerNewComplaintPage,
});

