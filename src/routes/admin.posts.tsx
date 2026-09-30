import { createFileRoute } from "@/lib/simple-router";
import { AdminOwnerPostsPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/da_admin/ssk/posts")({
  head: () => ({ meta: [{ title: "Owner Posts - Admin" }] }),
  component: AdminOwnerPostsPage,
});

