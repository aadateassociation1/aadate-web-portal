import { createFileRoute } from "@/lib/simple-router";
import { TraderMarketPricesPage } from "@/components/market-prices/MarketPricesPages";

export const Route = createFileRoute("/trader/market-prices")({
  head: () => ({ meta: [{ title: "Daily Market Prices - Member" }] }),
  component: TraderMarketPricesPage,
});
