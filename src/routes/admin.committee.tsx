import { createFileRoute } from "@tanstack/react-router";
import { AdminCommitteePage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/admin/committee")({
  head: () => ({ meta: [{ title: "Chairman & Committee - Admin" }] }),
  component: AdminCommitteePage,
});

