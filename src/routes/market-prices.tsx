import { createFileRoute } from "@/lib/simple-router";
import { PublicMarketPricesPage } from "@/components/market-prices/MarketPricesPages";

export const Route = createFileRoute("/market-prices")({
  head: () => ({
    meta: [
      { title: "Daily Market Prices - Shri Chhatrapati Shivaji Market Yard Adte Association" },
      { name: "description", content: "Today's vegetable and fruit market prices." },
    ],
  }),
  component: PublicMarketPricesPage,
});
