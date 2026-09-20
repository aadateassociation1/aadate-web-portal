import { createFileRoute } from "@/lib/simple-router";
import { PublicExPresidentPage } from "@/components/ex-presidents/ExPresidentPages";

export const Route = createFileRoute("/ex-president")({
  head: () => ({
    meta: [
      { title: "Ex-President - Shri Chhatrapati Shivaji Market Yard Adte Association" },
      { name: "description", content: "Former Presidents of Shree Chhatrapati Shivaji Market Yard Aadte Association." },
    ],
  }),
  component: PublicExPresidentPage,
});
