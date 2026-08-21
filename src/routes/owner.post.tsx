import { createFileRoute } from "@/lib/simple-router";
import { OwnerPostPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/owner/post")({
  head: () => ({ meta: [{ title: "Create Post - Member" }] }),
  component: OwnerPostPage,
});

