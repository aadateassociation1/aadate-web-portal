import { createFileRoute } from "@/lib/simple-router";
import { AdminExPresidentPage } from "@/components/ex-presidents/ExPresidentPages";

export const Route = createFileRoute("/admin/ex-presidents")({
  head: () => ({ meta: [{ title: "Ex-President Management - Admin" }] }),
  component: AdminExPresidentPage,
});
