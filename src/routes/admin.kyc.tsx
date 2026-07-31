import { createFileRoute } from "@/lib/simple-router";
import { AdminTraderKycPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/admin/kyc")({
  head: () => ({ meta: [{ title: "Trader KYC - Admin" }] }),
  component: AdminTraderKycPage,
});
