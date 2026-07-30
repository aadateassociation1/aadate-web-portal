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
import { Search, Download, Eye, FileText, Calendar, Hash, Paperclip } from "lucide-react";
import { NOTICES, type Notice } from "@/lib/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/notices")({
  head: () => ({
    meta: [
      { title: "Notices & Documents â€” VPP Market Yard" },
      { name: "description", content: "Official notices, circulars and downloadable documents for traders." },
      { property: "og:title", content: "Notices & Documents â€” VPP Market Yard" },
      { property: "og:description", content: "Access all official notices and market yard documents." },
    ],
  }),
  component: Notices,
});

const CATS = ["All", "General Notice", "Meeting Notice", "Payment Notice", "Government Circular", "Market Holiday Notice", "Health and Safety Notice", "Parking Notice", "Water Supply Notice", "Electricity Notice", "Rules and Regulations"];

function Notices() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState<Notice | null>(null);
  const filtered = NOTICES.filter((n) =>
    (cat === "All" || n.category === cat) &&
    (n.title.toLowerCase().includes(q.toLowerCase()) || n.description.toLowerCase().includes(q.toLowerCase()))
  );

  const downloadNotice = (notice: Notice) => {
    const fileName = notice.attachment.replace(/\.pdf$/i, ".txt");
    const report = [
      "Vishal Purandhar Patasanstha",
      "Official Notice",
      "",
      `Notice No: ${notice.number}`,
      `Title: ${notice.title}`,
      `Category: ${notice.category}`,
      `Date: ${new Date(notice.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`,
      `Attachment: ${notice.attachment}`,
      "",
      "Description:",
      notice.description,
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
    toast.success(`${notice.attachment} downloaded`);
  };

  return (
    <SiteLayout>
      <section className="hero-gradient text-white py-14">
        <div className="container-page">
          <h1 className="font-display text-3xl font-bold sm:text-5xl">Notices &amp; Documents</h1>
          <p className="mt-3 text-white/80">Official communication from the association.</p>
        </div>
      </section>

      <section className="py-10">
        <div className="container-page">
          <div className="grid gap-3 sm:flex sm:flex-wrap">
            <div className="relative min-w-0 flex-1 sm:min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search noticesâ€¦" className="pl-9" />
            </div>
            <Select value={cat} onValueChange={setCat}>
              <SelectTrigger className="w-full sm:w-72"><SelectValue /></SelectTrigger>
              <SelectContent>{CATS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div className="mt-8 grid gap-4">
            {filtered.map((n) => (
              <Card key={n.id} className="border-border/60">
                <CardContent className="p-5 sm:p-6">
                  <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-6">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-secondary text-primary sm:h-14 sm:w-14">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="border-primary/40 text-primary">{n.category}</Badge>
                        <span>#{n.number}</span>
                        <span>Â· {new Date(n.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                      <h3 className="mt-1.5 font-display font-semibold text-primary-dark">{n.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{n.description}</p>
                    </div>
                    <div className="col-span-2 grid grid-cols-2 gap-2 sm:col-span-1 sm:flex sm:flex-row">
                      <Button size="sm" variant="outline" onClick={() => setSelected(n)}><Eye className="h-4 w-4 sm:mr-1" /> <span>View</span></Button>
                      <Button size="sm" className="bg-primary" onClick={() => downloadNotice(n)}><Download className="h-4 w-4 sm:mr-1" /> <span>Download</span></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-primary/40 text-primary">{selected.category}</Badge>
                  <span className="text-xs font-medium text-muted-foreground">#{selected.number}</span>
                </div>
                <DialogTitle className="pt-2 font-display text-2xl text-primary-dark">{selected.title}</DialogTitle>
                <DialogDescription>{selected.description}</DialogDescription>
              </DialogHeader>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border bg-secondary/40 p-3">
                  <Hash className="h-4 w-4 text-primary" />
                  <div className="mt-2 text-xs text-muted-foreground">Notice number</div>
                  <div className="text-sm font-semibold text-primary-dark">{selected.number}</div>
                </div>
                <div className="rounded-lg border bg-secondary/40 p-3">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div className="mt-2 text-xs text-muted-foreground">Published date</div>
                  <div className="text-sm font-semibold text-primary-dark">{new Date(selected.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                </div>
                <div className="rounded-lg border bg-secondary/40 p-3">
                  <Paperclip className="h-4 w-4 text-primary" />
                  <div className="mt-2 text-xs text-muted-foreground">Attachment</div>
                  <div className="truncate text-sm font-semibold text-primary-dark">{selected.attachment}</div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 font-display font-semibold text-primary-dark">
                  <FileText className="h-4 w-4 text-primary" /> Notice details
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{selected.description}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  This notice is issued by the association for traders and market yard traders. Download the notice for offline reference.
                </p>
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
                <Button className="bg-primary" onClick={() => downloadNotice(selected)}><Download className="mr-1 h-4 w-4" /> Download Notice</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </SiteLayout>
  );
}
