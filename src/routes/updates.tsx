import { createFileRoute } from "@/lib/simple-router";
import { useState } from "react";
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
import { MARKET_UPDATES, type MarketUpdate } from "@/lib/mock";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/updates")({
  head: () => ({
    meta: [
      { title: "Market Updates - Daily Rates & News | VPP Market Yard" },
      { name: "description", content: "Daily vegetable, fruit, grain prices and market yard news." },
      { property: "og:title", content: "Market Updates - VPP Market Yard" },
      { property: "og:description", content: "Live market rates and yard news." },
    ],
  }),
  component: Updates,
});

const CATS = ["All", "Market arrivals", "Vegetable prices", "Grain prices", "Weather alert", "Market holiday", "Water or electricity update", "Traffic or parking update", "General market news"];

function Updates() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState<MarketUpdate | null>(null);
  const { lang } = useI18n();

  const filtered = MARKET_UPDATES.filter((u) =>
    (cat === "All" || u.category === cat) &&
    (u.title.toLowerCase().includes(q.toLowerCase()) || u.summary.toLowerCase().includes(q.toLowerCase()))
  );

  const downloadUpdate = (update: MarketUpdate) => {
    const title = lang === "mr" ? update.titleMr : update.title;
    const fileName = `${update.id}-${update.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}.txt`;
    const report = [
      "Vishal Purandhar Patasanstha Market Yard",
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
      <section className="hero-gradient text-white py-14">
        <div className="container-page">
          <h1 className="font-display text-3xl font-bold sm:text-5xl">Market Updates</h1>
          <p className="mt-3 text-white/80">Daily prices, arrivals, weather and market yard announcements.</p>
        </div>
      </section>

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
              <Card key={u.id} className="border-border/60 hover:shadow-lg transition">
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="bg-secondary text-primary-dark">{u.category}</Badge>
                    {u.emergency && <Badge className="bg-destructive text-white">Emergency</Badge>}
                    {u.featured && <Badge className="bg-saffron text-saffron-foreground">Featured</Badge>}
                  </div>
                  <h3 className="mt-3 font-display font-semibold text-primary-dark">
                    {lang === "mr" ? u.titleMr : u.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{u.summary}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(u.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    <span>{u.views} views</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelected(u)}><Eye className="h-4 w-4 mr-1" /> View</Button>
                    <Button size="sm" className="flex-1 bg-primary" onClick={() => downloadUpdate(u)}><Download className="h-4 w-4 mr-1" /> Download</Button>
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
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
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
                  This update is published by the market yard administration for traders and visitors. Download the report for offline reference.
                </p>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
                <Button className="bg-primary" onClick={() => downloadUpdate(selected)}><Download className="mr-1 h-4 w-4" /> Download Report</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </SiteLayout>
  );
}
