import { createFileRoute } from "@/lib/simple-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/public/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, Download, Eye, Calendar, FileText, UserRound, BarChart3 } from "lucide-react";
import type { MarketUpdate } from "@/lib/mock";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/updates")({
  head: () => ({
    meta: [
      { title: "Market Updates - Daily Rates & News | Shri Chhatrapati Shivaji Market Yard Adte Association" },
      { name: "description", content: "Daily vegetable, fruit, grain prices and market yard news." },
      { property: "og:title", content: "Market Updates - Shri Chhatrapati Shivaji Market Yard Adte Association" },
      { property: "og:description", content: "Live market rates and yard news." },
    ],
  }),
  component: Updates,
});

const CATS = ["All", "Market arrivals", "Vegetable prices", "Grain prices", "Weather alert", "Market holiday", "Water or electricity update", "Traffic or parking update", "General market news"];

function Updates() {
  type UpdateAttachment = { id: number; attachment_type: "image" | "video" | "document"; original_filename: string };
  type DbMarketUpdate = MarketUpdate & { attachments?: UpdateAttachment[] };
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState<DbMarketUpdate | null>(null);
  const [apiUpdates, setApiUpdates] = useState<DbMarketUpdate[]>([]);
  const { lang } = useI18n();

  useEffect(() => {
    fetch("/api/v1/public/posts")
      .then((response) => response.json())
      .then((result) => {
        if (!result.ok || !Array.isArray(result.posts)) return;
        setApiUpdates(result.posts.map((post: {
          id: number;
          title_en: string;
          title_mr: string | null;
          content_en: string | null;
          published_at: string | null;
          attachments?: UpdateAttachment[];
        }) => ({
          id: `DB-${post.id}`,
          title: post.title_en,
          titleMr: post.title_mr || post.title_en,
          category: (() => { try { return JSON.parse(post.content_en || "{}").category || "General market news"; } catch { return "General market news"; } })(),
          summary: (() => { try { return JSON.parse(post.content_en || "{}").details || post.content_en || "Published by market yard administration."; } catch { return post.content_en || "Published by market yard administration."; } })(),
          date: post.published_at || new Date().toISOString(),
          publishedBy: "Admin Hub",
          views: 0,
          featured: false,
          emergency: false,
          attachments: post.attachments || [],
        })));
      })
      .catch(() => undefined);
  }, []);

  const allUpdates = apiUpdates;
  const filtered = allUpdates.filter((u) =>
    (cat === "All" || u.category === cat) &&
    (u.title.toLowerCase().includes(q.toLowerCase()) || u.summary.toLowerCase().includes(q.toLowerCase()))
  );

  const downloadUpdate = (update: DbMarketUpdate) => {
    const firstAttachment = update.attachments?.[0];
    if (firstAttachment) {
      window.open(`/api/v1/public/content-attachments/${firstAttachment.id}/download?download=1`, "_blank");
      return;
    }
    const title = lang === "mr" ? update.titleMr : update.title;
    const fileName = `${update.id}-${update.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}.txt`;
    const report = [
      "Shri Chhatrapati Shivaji Market Yard Adte Association",
      "Market Update Report",
      "",
      `Update ID: ${update.id}`,
      `Title: ${title}`,
      `Category: ${update.category}`,
      `Date: ${new Date(update.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`,
      `Published by: ${update.publishedBy}`,
      `Views: ${update.views}`,
      `Featured: ${update.featured ? "Yes" : "No"}`,
      `Emergency: ${update.emergency ? "Yes" : "No"}`,
      "",
      "Summary:",
      update.summary,
    ].join("\n");
    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success("Market update downloaded");
  };

  return (
    <SiteLayout>
      <section className="py-10">
        <div className="container-page">
          <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center">
            <div className="relative min-w-0 flex-1 sm:min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search updates..." className="pl-9" />
            </div>
            <Select value={cat} onValueChange={setCat}>
              <SelectTrigger className="w-full sm:w-64"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((u) => (
              <Card
                key={u.id}
                className="overflow-hidden border-border/60 bg-background shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                {(() => {
                  const preview = u.attachments?.find((file) => file.attachment_type === "image") || u.attachments?.find((file) => file.attachment_type === "video");
                  if (!preview) return null;
                  const previewUrl = `/api/v1/public/content-attachments/${preview.id}/download`;
                  return (
                    <button
                      type="button"
                      className="group relative block h-48 w-full overflow-hidden bg-secondary/30 text-left sm:h-52"
                      onClick={() => setSelected(u)}
                    >
                      {preview.attachment_type === "image" ? (
                        <img
                          src={previewUrl}
                          alt={u.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <video
                          src={previewUrl}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          muted
                          preload="metadata"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/65 via-primary-dark/10 to-transparent" />
                      {u.attachments && u.attachments.length > 1 && (
                        <span className="absolute right-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-primary-dark shadow-sm backdrop-blur">
                          {u.attachments.length} files
                        </span>
                      )}
                      {preview.attachment_type === "video" && (
                        <span className="absolute left-3 top-3 rounded-full bg-saffron px-3 py-1 text-xs font-semibold text-saffron-foreground shadow-sm">
                          Video
                        </span>
                      )}
                    </button>
                  );
                })()}
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="bg-secondary text-primary-dark">
                      {u.category}
                    </Badge>
                    {u.emergency && <Badge className="bg-destructive text-white">Emergency</Badge>}
                    {u.featured && <Badge className="bg-saffron text-saffron-foreground">Featured</Badge>}
                  </div>
                  <h3 className="mt-3 line-clamp-2 text-lg font-display font-semibold text-primary-dark sm:text-xl">
                    {lang === "mr" ? u.titleMr : u.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {u.summary}
                  </p>
                  {u.attachments && u.attachments.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {u.attachments.map((file) => (
                        <Badge
                          key={file.id}
                          variant="outline"
                          className="border-primary/20 bg-secondary/40 text-primary-dark"
                        >
                          {file.attachment_type === "image" ? "Image" : file.attachment_type === "video" ? "Video" : "PDF"}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-secondary/35 px-3 py-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(u.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <span>{u.views} views</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full rounded-xl"
                      onClick={() => setSelected(u)}
                    >
                      <Eye className="mr-1 h-4 w-4" /> View
                    </Button>
                    <Button
                      size="sm"
                      className="w-full rounded-xl bg-saffron text-saffron-foreground hover:bg-saffron/90"
                      onClick={() => downloadUpdate(u)}
                    >
                      <Download className="mr-1 h-4 w-4" /> Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-muted-foreground">No updates match your search.</div>
          )}
        </div>
      </section>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="top-1/2 max-h-[calc(100vh-5rem)] max-w-2xl translate-y-[-50%] overflow-hidden p-0">
          {selected && (
            <div className="flex max-h-[calc(100vh-5rem)] flex-col">
              <DialogHeader className="border-b px-6 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="bg-secondary text-primary-dark">{selected.category}</Badge>
                  {selected.emergency && <Badge className="bg-destructive text-white">Emergency</Badge>}
                  {selected.featured && <Badge className="bg-saffron text-saffron-foreground">Featured</Badge>}
                </div>
                <DialogTitle className="pt-2 font-display text-2xl text-primary-dark">
                  {lang === "mr" ? selected.titleMr : selected.title}
                </DialogTitle>
                <DialogDescription>{selected.summary}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 overflow-y-auto px-6 py-4">
                {selected.attachments && selected.attachments.length > 0 && (
                  <div className="space-y-3">
                    {selected.attachments.filter((file) => file.attachment_type === "image").map((file) => (
                      <div key={file.id} className="grid max-h-[60vh] min-h-0 place-items-center overflow-hidden rounded-lg border bg-secondary/30">
                        <img src={`/api/v1/public/content-attachments/${file.id}/download`} alt={file.original_filename} className="h-auto max-h-[60vh] w-auto max-w-full object-contain" />
                      </div>
                    ))}
                    {selected.attachments.filter((file) => file.attachment_type === "video").map((file) => (
                      <video key={file.id} src={`/api/v1/public/content-attachments/${file.id}/download`} controls className="max-h-[60vh] w-full rounded-lg border bg-black object-contain" />
                    ))}
                    <div className="flex flex-wrap gap-2">
                      {selected.attachments.map((file) => (
                        <Button key={file.id} size="sm" variant="outline" onClick={() => window.open(`/api/v1/public/content-attachments/${file.id}/download?download=1`, "_blank")}>
                          <Download className="mr-1 h-4 w-4" /> {file.original_filename}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border bg-secondary/40 p-3">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div className="mt-2 text-xs text-muted-foreground">Published date</div>
                    <div className="text-sm font-semibold text-primary-dark">{new Date(selected.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                  </div>
                  <div className="rounded-lg border bg-secondary/40 p-3">
                    <UserRound className="h-4 w-4 text-primary" />
                    <div className="mt-2 text-xs text-muted-foreground">Published by</div>
                    <div className="text-sm font-semibold text-primary-dark">{selected.publishedBy}</div>
                  </div>
                  <div className="rounded-lg border bg-secondary/40 p-3">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <div className="mt-2 text-xs text-muted-foreground">Views</div>
                    <div className="text-sm font-semibold text-primary-dark">{selected.views}</div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 font-display font-semibold text-primary-dark">
                    <FileText className="h-4 w-4 text-primary" /> Update details
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{selected.summary}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    This update is published by the market yard administration for Members and visitors. Download the report for offline reference.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap justify-end gap-2 border-t px-6 py-4">
                <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
                <Button className="bg-saffron text-saffron-foreground hover:bg-saffron/90" onClick={() => downloadUpdate(selected)}><Download className="mr-1 h-4 w-4" /> Download Report</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SiteLayout>
  );
}

