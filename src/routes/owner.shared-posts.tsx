import { createFileRoute } from "@tanstack/react-router";
import { OwnerSharedPostsPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/owner/shared-posts")({
  head: () => ({ meta: [{ title: "Shared Posts - Gala Owner" }] }),
  component: OwnerSharedPostsPage,
});

