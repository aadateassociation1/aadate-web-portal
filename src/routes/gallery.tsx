import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/public/SiteLayout";
import { Camera, Play } from "lucide-react";
import heroImg from "@/assets/market-hero.jpg";
import { GALLERY_ITEMS } from "@/lib/mock";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Photo & Video Gallery — VPP Market Yard" },
      { name: "description", content: "Photographs and videos of market yard events, meetings and activities." },
      { property: "og:title", content: "Gallery — VPP Market Yard" },
      { property: "og:description", content: "Moments from the market yard." },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  return (
    <SiteLayout>
      <section className="hero-gradient text-white py-14">
        <div className="container-page">
          <h1 className="font-display text-3xl font-bold sm:text-5xl">Gallery</h1>
          <p className="mt-3 text-white/80">Moments from the market yard.</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container-page grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY_ITEMS.map((a, i) => (
            <div key={a.title} className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-md">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${heroImg})`, filter: `hue-rotate(${i * 30}deg) saturate(1.1)` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/30 to-transparent" />
              {a.type === "video" && (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-saffron text-primary-dark shadow-xl">
                    <Play className="h-7 w-7 fill-current" />
                  </div>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-saffron">
                  <Camera className="h-3.5 w-3.5" /> {a.count} {a.type === "video" ? "clips" : "photos"}
                </div>
                <div className="mt-1 font-display font-semibold">{a.title}</div>
                <div className="text-xs text-white/70">{new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
