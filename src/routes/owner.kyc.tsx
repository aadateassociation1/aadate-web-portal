import { createFileRoute } from "@/lib/simple-router";
import { OwnerKycPage } from "@/components/dashboard/DashboardPages";

export const Route = createFileRoute("/owner/kyc")({
  head: () => ({ meta: [{ title: "Customer KYC - Trader" }] }),
  component: OwnerKycPage,
});
