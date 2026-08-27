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
import { Search, Download, Eye, FileText, Calendar, Hash, Paperclip } from "lucide-react";
import type { Notice } from "@/lib/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/notices")({
  head: () => ({
    meta: [
      { title: "Notices & Documents - Shri Chhatrapati Shivaji Market Yard Adte Association" },
      { name: "description", content: "Official notices, circulars and downloadable documents for Members." },
      { property: "og:title", content: "Notices & Documents - Shri Chhatrapati Shivaji Market Yard Adte Association" },
      { property: "og:description", content: "Access all official notices and market yard documents." },
    ],
  }),
  component: Notices,
});

const CATS = ["All", "General Notice", "Meeting Notice", "Payment Notice", "Government Circular", "Market Holiday Notice", "Health and Safety Notice", "Parking Notice", "Water Supply Notice", "Electricity Notice", "Rules and Regulations"];

function Notices() {
  type NoticeAttachment = { id: number; attachment_type: "image" | "video" | "document"; original_filename: string };
  type DbNotice = Notice & { attachments?: NoticeAttachment[] };
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState<DbNotice | null>(null);
  const [apiNotices, setApiNotices] = useState<DbNotice[]>([]);

  useEffect(() => {
    fetch("/api/v1/public/notices")
      .then((response) => response.json())
      .then((result) => {
        if (!result.ok || !Array.isArray(result.notices)) return;
        setApiNotices(result.notices.map((notice: {
          id: number;
          title_en: string;
          content_en: string | null;
          published_at: string | null;
          attachments?: NoticeAttachment[];
        }) => ({
          id: `DB-${notice.id}`,
          number: `DB/${notice.id}`,
          title: notice.title_en,
          category: (() => { try { return JSON.parse(notice.content_en || "{}").category || "General Notice"; } catch { return "General Notice"; } })(),
          description: (() => { try { return JSON.parse(notice.content_en || "{}").details || notice.content_en || "Published by market yard administration."; } catch { return notice.content_en || "Published by market yard administration."; } })(),
          date: notice.published_at || new Date().toISOString(),
          attachment: notice.attachments?.[0]?.original_filename || `notice-${notice.id}.txt`,
          attachments: notice.attachments || [],
        })));
      })
      .catch(() => undefined);
  }, []);

  const allNotices = apiNotices;
  const filtered = allNotices.filter((n) =>
    (cat === "All" || n.category === cat) &&
    (n.title.toLowerCase().includes(q.toLowerCase()) || n.description.toLowerCase().includes(q.toLowerCase()))
  );

  const downloadNotice = (notice: DbNotice) => {
    const firstAttachment = notice.attachments?.[0];
    if (firstAttachment) {
      window.open(`/api/v1/public/content-attachments/${firstAttachment.id}/download?download=1`, "_blank");
      return;
    }
    const fileName = notice.attachment.replace(/\.pdf$/i, ".txt");
    const report = [
      "Shri Chhatrapati Shivaji Market Yard Adte Association",
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
      <section className="py-10">
        <div className="container-page">
          <div className="grid gap-3 sm:flex sm:flex-wrap">
            <div className="relative min-w-0 flex-1 sm:min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search notices..." className="pl-9" />
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
                        <span>- {new Date(n.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                      <h3 className="mt-1.5 font-display font-semibold text-primary-dark">{n.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{n.description}</p>
                      {n.attachments && n.attachments.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {n.attachments.map((file) => (
                            <Badge key={file.id} variant="outline" className="border-primary/30 text-primary">
                              {file.attachment_type === "image" ? "Image" : file.attachment_type === "video" ? "Video" : "PDF"}
                            </Badge>
                          ))}
                        </div>
                      )}
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
        <DialogContent className="top-1/2 max-h-[calc(100vh-5rem)] max-w-2xl translate-y-[-50%] overflow-hidden p-0">
          {selected && (
            <div className="flex max-h-[calc(100vh-5rem)] flex-col">
              <DialogHeader className="border-b px-6 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-primary/40 text-primary">{selected.category}</Badge>
                  <span className="text-xs font-medium text-muted-foreground">#{selected.number}</span>
                </div>
                <DialogTitle className="pt-2 font-display text-2xl text-primary-dark">{selected.title}</DialogTitle>
                <DialogDescription>{selected.description}</DialogDescription>
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
                    This notice is issued by the association for Members and market yard Members. Download the notice for offline reference.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-2 border-t px-6 py-4">
                <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
                <Button className="bg-primary" onClick={() => downloadNotice(selected)}><Download className="mr-1 h-4 w-4" /> Download Notice</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SiteLayout>
  );
}
