import { createFileRoute } from "@/lib/simple-router";
import { OwnerSharedPostsPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/owner/shared-posts")({
  head: () => ({ meta: [{ title: "Shared Posts - Member" }] }),
  component: OwnerSharedPostsPage,
});

