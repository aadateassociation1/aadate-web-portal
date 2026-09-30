import { createFileRoute } from "@/lib/simple-router";
import { AdminTraderKycPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/da_admin/ssk/kyc")({
  head: () => ({ meta: [{ title: "Member KYC - Admin" }] }),
  component: AdminTraderKycPage,
});
