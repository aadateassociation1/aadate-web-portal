import { createFileRoute } from "@/lib/simple-router";
import { AdminMarketPricesPage } from "@/components/market-prices/MarketPricesPages";

export const Route = createFileRoute("/admin/market-prices")({
  head: () => ({ meta: [{ title: "Daily Market Prices - Admin" }] }),
  component: AdminMarketPricesPage,
});
