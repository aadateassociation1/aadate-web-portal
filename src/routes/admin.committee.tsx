import { createFileRoute } from "@/lib/simple-router";
import { AdminCommitteePage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/da_admin/ssk/committee")({
  head: () => ({ meta: [{ title: "Chairman & Committee - Admin" }] }),
  component: AdminCommitteePage,
});

