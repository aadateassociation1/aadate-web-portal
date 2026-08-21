import { createFileRoute } from "@/lib/simple-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/public/SiteLayout";
import { Camera, Play } from "lucide-react";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Photo & Video Gallery - Shri Chhatrapati Shivaji Market Yard Adte Association" },
      { name: "description", content: "Photographs and videos of market yard events, meetings and activities." },
      { property: "og:title", content: "Gallery - Shri Chhatrapati Shivaji Market Yard Adte Association" },
      { property: "og:description", content: "Moments from the market yard." },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  type GalleryItem = {
    id: number;
    title_en: string;
    published_at: string | null;
    created_at: string;
    parsed?: { category?: string; details?: string };
    attachments: Array<{ id: number; attachment_type: "image" | "video" | "document"; original_filename: string }>;
  };
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    fetch("/api/v1/public/gallery")
      .then((response) => response.json())
      .then((result) => {
        if (result.ok) setItems(result.items || []);
      })
      .catch(() => undefined);
  }, []);

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
          {items.map((item) => {
            const image = item.attachments.find((file) => file.attachment_type === "image");
            const video = item.attachments.find((file) => file.attachment_type === "video");
            return (
            <a key={item.id} href={image || video ? `/api/v1/public/content-attachments/${(image || video)?.id}/download` : "#"} target="_blank" rel="noreferrer" className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-md">
              {image ? (
                <img src={`/api/v1/public/content-attachments/${image.id}/download`} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="absolute inset-0 bg-secondary" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/55 via-primary-dark/10 to-transparent" />
              {video && (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-saffron text-primary-dark shadow-xl">
                    <Play className="h-7 w-7 fill-current" />
                  </div>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-saffron">
                  <Camera className="h-3.5 w-3.5" /> {item.attachments.length} file{item.attachments.length === 1 ? "" : "s"}
                </div>
                <div className="mt-1 font-display font-semibold">{item.title_en}</div>
                <div className="text-xs text-white/70">{new Date(item.published_at || item.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
              </div>
            </a>
          )})}
          {items.length === 0 && <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">No gallery items published yet.</div>}
        </div>
      </section>
    </SiteLayout>
  );
}
