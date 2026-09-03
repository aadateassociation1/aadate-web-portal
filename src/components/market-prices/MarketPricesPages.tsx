import { Fragment, useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, BarChart3, Calendar, ChevronDown, ChevronRight, Copy, Download, Eye, Filter, IndianRupee, Minus, Pencil, Plus, Save, Search, Store, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DashLayout } from "@/components/dashboard/DashLayout";
import { SiteLayout } from "@/components/public/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const CATEGORIES = [
  { value: "all", label: "All Items", mr: "\u0938\u0930\u094d\u0935" },
  { value: "vegetable", label: "Vegetables", mr: "\u092d\u093e\u091c\u0940\u092a\u093e\u0932\u093e" },
  { value: "fruit", label: "Fruits", mr: "\u092b\u0933\u0947" },
];
const UNITS = ["Kg", "Quintal", "Dozen", "Piece", "Bunch", "Bundle", "Crate", "Box", "Tray"];

type MarketPriceRow = {
  item_id: number;
  price_id: number | null;
  category: "vegetable" | "fruit";
  name_en: string;
  name_mr: string;
  variety: string | null;
  parent_id?: number | null;
  item_type?: "main" | "subtype";
  parent_name_en?: string | null;
  parent_name_mr?: string | null;
  parent_display_order?: number | null;
  subtype_count?: number;
  has_children?: number;
  default_unit: string;
  display_order: number;
  is_active: number;
  price_date: string | null;
  min_price: number | null;
  max_price: number | null;
  modal_price: number | null;
  unit: string | null;
  arrival_quantity: number | null;
  arrival_unit: string | null;
  quality_grade: string | null;
  notes: string | null;
  status: "draft" | "published" | null;
  published_at: string | null;
  price_updated_at: string | null;
  previous_price: number | null;
  change_amount: number | null;
  change_percent: number | null;
  change_direction: "up" | "down" | "same" | "none";
};

type MarketSummary = {
  total_items: number;
  updated_today: number;
  pending_update: number;
  last_published: string | null;
};

type DraftRow = {
  itemId: number;
  minPrice: string;
  maxPrice: string;
  modalPrice: string;
  unit: string;
  arrivalQuantity: string;
  arrivalUnit: string;
  qualityGrade: string;
  notes: string;
};

function todayInput() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

function formatDate(value: string | null | undefined, withTime = false) {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

function currency(value: number | null | undefined) {
  return value === null || value === undefined ? "-" : `\u20B9${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function categoryLabel(value: string) {
  return CATEGORIES.find((category) => category.value === value)?.label || value;
}

function marketItemKey(row: MarketPriceRow) {
  return [
    row.category,
    row.name_en.trim().toLowerCase(),
    row.name_mr.trim(),
    (row.variety || "").trim().toLowerCase(),
    row.default_unit,
  ].join("|");
}


function isPriceableRow(row: MarketPriceRow) {
  return Number(row.has_children || 0) === 0;
}

function parentTitle(row: MarketPriceRow) {
  return row.parent_name_en ? `${row.parent_name_en} / ${row.parent_name_mr || ""}` : `${row.name_en} / ${row.name_mr}`;
}

function itemTitle(row: MarketPriceRow) {
  if (row.parent_name_en) return `${row.name_en} / ${row.name_mr}`;
  if (row.variety) return `${row.variety} / ${row.name_mr}`;
  return `${row.name_en} / ${row.name_mr}`;
}
function buildMarketGroups(rows: MarketPriceRow[]) {
  const groups = new Map<string, { key: string; nameEn: string; nameMr: string; category: string; children: MarketPriceRow[] }>();
  rows.filter(isPriceableRow).forEach((row) => {
    const grouped = Boolean(row.parent_id || row.parent_name_en);
    const key = grouped ? `${row.category}:${row.parent_id || row.parent_name_en}` : `${row.category}:${row.item_id}`;
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        nameEn: row.parent_name_en || row.name_en,
        nameMr: row.parent_name_mr || row.name_mr,
        category: row.category,
        children: [],
      });
    }
    groups.get(key)!.children.push(row);
  });
  return Array.from(groups.values());
}
function dedupeMarketItems(rows: MarketPriceRow[]) {
  const byItem = new Map<string, MarketPriceRow>();
  rows.forEach((row) => {
    const key = marketItemKey(row);
    const existing = byItem.get(key);
    const hasSamePriceState = Boolean(existing?.price_id) === Boolean(row.price_id);
    if (!existing || (!existing.price_id && row.price_id) || (hasSamePriceState && row.item_id < existing.item_id)) {
      byItem.set(key, row);
    }
  });
  return Array.from(byItem.values()).sort((a, b) => (
    a.category.localeCompare(b.category)
    || a.display_order - b.display_order
    || a.name_en.localeCompare(b.name_en)
  ));
}

function changeView(row: MarketPriceRow) {
  if (row.change_amount === null) return <span className="inline-flex items-center gap-1 text-muted-foreground"><Minus className="h-4 w-4" /> New</span>;
  if (row.change_direction === "up") return <span className="inline-flex items-center gap-1 font-semibold text-success"><ArrowUp className="h-4 w-4" /> {currency(row.change_amount)} {row.change_percent !== null ? `(${row.change_percent}%)` : ""}</span>;
  if (row.change_direction === "down") return <span className="inline-flex items-center gap-1 font-semibold text-destructive"><ArrowDown className="h-4 w-4" /> {currency(Math.abs(row.change_amount))} {row.change_percent !== null ? `(${row.change_percent}%)` : ""}</span>;
  return <span className="inline-flex items-center gap-1 text-muted-foreground"><Minus className="h-4 w-4" /> {"\u20B9"}0</span>;
}

function CategoryTabs({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {CATEGORIES.map((category) => (
        <button
          key={category.value}
          type="button"
          onClick={() => onChange(category.value)}
          className={`min-h-16 rounded-xl border px-2 py-2 text-center transition sm:min-h-0 sm:px-4 sm:py-3 sm:text-left ${value === category.value ? "border-primary bg-secondary text-primary-dark shadow-sm" : "border-border bg-background hover:bg-secondary/60"}`}
        >
          <div className="font-display text-sm font-semibold leading-tight sm:text-base">{category.label}</div>
          <div className="mt-0.5 text-[11px] leading-tight text-muted-foreground sm:text-xs">{category.mr}</div>
        </button>
      ))}
    </div>
  );
}

function MarketPriceReadOnly({ mode }: { mode: "public" | "trader" }) {
  const [rows, setRows] = useState<MarketPriceRow[]>([]);
  const [date, setDate] = useState("");
  const [lastPublished, setLastPublished] = useState<string | null>(null);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [historyItem, setHistoryItem] = useState<MarketPriceRow | null>(null);
  const [history, setHistory] = useState<MarketPriceRow[]>([]);

  const load = async () => {
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (search.trim()) params.set("search", search.trim());
    const response = await fetch(`/api/v1/public/market-prices?${params.toString()}`);
    const result = await response.json();
    if (result.ok) {
      setRows(result.prices || []);
      setDate(result.date || "");
      setLastPublished(result.lastPublished || null);
    }
  };

  useEffect(() => { load().catch(() => undefined); }, [category]);

  const filtered = useMemo(() => rows.filter((row) => {
    const q = search.toLowerCase();
    return !q
      || row.name_en.toLowerCase().includes(q)
      || row.name_mr.includes(search)
      || (row.variety || "").toLowerCase().includes(q)
      || (row.parent_name_en || "").toLowerCase().includes(q)
      || (row.parent_name_mr || "").includes(search);
  }), [rows, search]);

  const groups = useMemo(() => buildMarketGroups(filtered), [filtered]);

  const openHistory = async (row: MarketPriceRow) => {
    setHistoryItem(row);
    const response = await fetch(`/api/v1/public/market-prices/${row.item_id}/history`);
    const result = await response.json();
    if (result.ok) setHistory((result.history || []).slice(0, 1));
  };

  const content = (
    <>
      {mode !== "public" && (
        <section>
          <h1 className="font-display text-3xl font-bold sm:text-5xl">Today's Market Prices</h1>
          <p className="mt-2 text-muted-foreground">{"\u0906\u091c\u091a\u0947 \u092c\u093e\u091c\u093e\u0930 \u092d\u093e\u0935"}</p>
          <div className="mt-4 text-sm text-muted-foreground">
            Last Updated: {formatDate(lastPublished, true)}
          </div>
        </section>
      )}
      <section className={mode === "public" ? "py-10" : "mt-6"}>
        <div className={mode === "public" ? "container-page" : ""}>
          <CategoryTabs value={category} onChange={setCategory} />
          <Card className="mt-5 border-border/60">
            <CardContent className="p-4 sm:p-5">
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search commodity..." className="pl-9" />
                </div>
                <Button variant="outline" onClick={load}><Filter className="mr-2 h-4 w-4" /> Refresh</Button>
              </div>
              <div className="mt-5 hidden overflow-hidden rounded-lg border md:block">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/60 text-left text-muted-foreground">
                    <tr>
                      <th className="p-3">Commodity</th>
                      <th className="p-3 text-right">Min</th>
                      <th className="p-3 text-right">Max</th>
                      <th className="p-3 text-right">Avg</th>
                      <th className="p-3">Change</th>
                      <th className="p-3">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((group) => {
                      const grouped = group.children.some((row) => row.parent_name_en);
                      return (
                        <Fragment key={group.key}>
                          {grouped && (
                            <tr className="border-t bg-secondary/35">
                              <td className="p-3" colSpan={6}>
                                <div className="font-display font-semibold text-primary-dark">{group.nameEn} / {group.nameMr}</div>
                                <div className="text-xs text-muted-foreground">{group.children.length} varieties</div>
                              </td>
                            </tr>
                          )}
                          {group.children.map((row) => (
                            <tr key={row.item_id} className="border-t">
                              <td className={`p-3 ${grouped ? "pl-8" : ""}`}>
                                <div className="font-display font-semibold text-primary-dark">{itemTitle(row)}</div>
                                <div className="text-xs text-muted-foreground">{row.parent_name_en ? parentTitle(row) : categoryLabel(row.category)}</div>
                              </td>
                              <td className="p-3 text-right font-semibold">{currency(row.min_price)}</td>
                              <td className="p-3 text-right font-semibold">{currency(row.max_price)}</td>
                              <td className="p-3 text-right font-bold text-primary-dark">{currency(row.modal_price)}</td>
                              <td className="p-3">{changeView(row)}</td>
                              <td className="p-3">{row.unit}</td>
                            </tr>
                          ))}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-5 overflow-hidden rounded-lg border md:hidden">
                <div className="grid grid-cols-[minmax(0,1.15fr)_46px_46px_46px_52px] items-center gap-1.5 border-b bg-secondary/40 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  <span>Commodity</span>
                  <span className="text-left">Min</span>
                  <span className="text-left">Max</span>
                  <span className="text-left">Avg</span>
                  <span className="text-left">Unit</span>
                </div>
                {filtered.filter(isPriceableRow).map((row) => {
                  const changeLabel =
                    row.change_amount === null
                      ? "New"
                      : row.change_direction === "up"
                        ? `\u2191 ${currency(row.change_amount)}`
                        : row.change_direction === "down"
                          ? `\u2193 ${currency(Math.abs(row.change_amount))}`
                          : `\u2014 \u20B90`;

                  const changeClassName =
                    row.change_amount === null
                      ? "text-muted-foreground"
                      : row.change_direction === "up"
                        ? "text-success"
                        : row.change_direction === "down"
                          ? "text-destructive"
                          : "text-muted-foreground";

                  return (
                    <div key={row.item_id} className="border-t px-3 py-2.5 first:border-t-0">
                      <div className="grid grid-cols-[minmax(0,1.15fr)_46px_46px_46px_52px] items-center gap-1.5">
                        <div className="min-w-0">
                          <div className="whitespace-normal break-words font-display text-[13px] font-semibold leading-snug text-primary-dark">{row.name_en}</div>
                          <div className="truncate text-[11px] text-muted-foreground">{row.name_mr}</div>
                          <div className="mt-0.5 truncate text-[10px] text-muted-foreground">{row.parent_name_en ? parentTitle(row) : categoryLabel(row.category)}</div>
                        </div>
                        <div className="text-left text-[12px] font-semibold text-primary-dark">{currency(row.min_price)}</div>
                        <div className="text-left text-[12px] font-semibold text-primary-dark">{currency(row.max_price)}</div>
                        <div className="text-left text-[12px] font-bold text-primary-dark">{currency(row.modal_price)}</div>
                        <div className="text-left text-[11px] font-medium text-muted-foreground">{row.unit}</div>
                      </div>
                      <div className="mt-2 flex items-center justify-start gap-2 border-t border-dashed pt-2 text-[10px]">
                        <span className={`truncate font-medium ${changeClassName}`}>{changeLabel}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {filtered.length === 0 && (
                <div className="rounded-lg border p-8 text-center text-muted-foreground">
                  Today's market prices have not been published yet. Please check again shortly.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Dialog open={!!historyItem} onOpenChange={(open) => !open && setHistoryItem(null)}>
        <DialogContent className="max-w-xl">
          {historyItem && (
            <>
              <DialogHeader>
                <DialogTitle>{historyItem.name_en} / {historyItem.name_mr}</DialogTitle>
                <DialogDescription>Today's published price</DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                {history.map((row) => (
                  <div key={row.price_id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <div className="font-medium">{formatDate(row.price_date)}</div>
                      <div className="text-xs text-muted-foreground">{row.quality_grade || "Standard"} - {row.unit}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-lg font-bold text-primary-dark">{currency(row.modal_price)}</div>
                      <div className="text-xs text-muted-foreground">{currency(row.min_price)} - {currency(row.max_price)}</div>
                    </div>
                  </div>
                ))}
                {history.length === 0 && <div className="rounded-lg border p-3 text-sm text-muted-foreground">No published price available for today.</div>}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );

  if (mode === "trader") return <DashLayout kind="owner">{content}</DashLayout>;
  return <SiteLayout>{content}</SiteLayout>;
}

export function PublicMarketPricesPage() {
  return <MarketPriceReadOnly mode="public" />;
}

export function TraderMarketPricesPage() {
  return <MarketPriceReadOnly mode="trader" />;
}

export function AdminMarketPricesPage() {
  const [date, setDate] = useState(todayInput());
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<MarketPriceRow[]>([]);
  const [summary, setSummary] = useState<MarketSummary | null>(null);
  const [drafts, setDrafts] = useState<Record<number, DraftRow>>({});
  const [saving, setSaving] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [historyItem, setHistoryItem] = useState<MarketPriceRow | null>(null);
  const [history, setHistory] = useState<MarketPriceRow[]>([]);
  const [newItem, setNewItem] = useState({ category: "vegetable", nameEn: "", nameMr: "", variety: "", defaultUnit: "Kg", displayOrder: "100", isActive: true });
  const [editItem, setEditItem] = useState<{ id: number; category: string; nameEn: string; nameMr: string; variety: string; defaultUnit: string; displayOrder: string; isActive: boolean } | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const load = async () => {
    const params = new URLSearchParams({ date });
    if (category !== "all") params.set("category", category);
    if (search.trim()) params.set("search", search.trim());
    const response = await fetch(`/api/v1/admin/market-prices?${params.toString()}`, { credentials: "include" });
    const result = await response.json();
    if (!result.ok) throw new Error(result.error || "Market prices failed to load");
    const uniquePrices = dedupeMarketItems(result.prices || []);
    const priceablePrices = uniquePrices.filter(isPriceableRow);
    setRows(uniquePrices);
    setSummary(result.summary ? {
      ...result.summary,
      total_items: priceablePrices.length,
      updated_today: priceablePrices.filter((row) => row.price_id).length,
      pending_update: priceablePrices.filter((row) => !row.price_id).length,
    } : null);
    const nextDrafts: Record<number, DraftRow> = {};
    priceablePrices.forEach((row: MarketPriceRow) => {
      nextDrafts[row.item_id] = {
        itemId: row.item_id,
        minPrice: row.min_price?.toString() || "",
        maxPrice: row.max_price?.toString() || "",
        modalPrice: row.modal_price?.toString() || "",
        unit: row.unit || row.default_unit || "Kg",
        arrivalQuantity: row.arrival_quantity?.toString() || "",
        arrivalUnit: row.arrival_unit || row.default_unit || "Kg",
        qualityGrade: row.quality_grade || "",
        notes: row.notes || "",
      };
    });
    setDrafts(nextDrafts);
  };

  useEffect(() => { load().catch((error) => toast.error(error.message)); }, [date, category]);

  const filtered = useMemo(() => rows.filter((row) => {
    const q = search.toLowerCase();
    return !q
      || row.name_en.toLowerCase().includes(q)
      || row.name_mr.includes(search)
      || (row.variety || "").toLowerCase().includes(q)
      || (row.parent_name_en || "").toLowerCase().includes(q)
      || (row.parent_name_mr || "").includes(search);
  }), [rows, search]);

  const groups = useMemo(() => buildMarketGroups(filtered), [filtered]);

  const setDraft = (itemId: number, field: keyof DraftRow, value: string) => {
    setDrafts((current) => {
      const row = current[itemId];
      const next = { ...row, [field]: value };
      if ((field === "minPrice" || field === "maxPrice") && next.minPrice !== "" && next.maxPrice !== "") {
        const min = Number(next.minPrice);
        const max = Number(next.maxPrice);
        if (Number.isFinite(min) && Number.isFinite(max)) next.modalPrice = String(((min + max) / 2).toFixed(2).replace(/\.00$/, ""));
      }
      return { ...current, [itemId]: next };
    });
  };

  const saveRows = async (status: "draft" | "published") => {
    const records = Object.values(drafts).filter((row) => row.minPrice !== "" || row.maxPrice !== "" || row.modalPrice !== "");
    if (records.length === 0) {
      toast.error("Enter at least one commodity price");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/v1/admin/market-prices/bulk-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ date, status, records }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Save failed");
      toast.success(status === "published" ? "Today's market prices published" : "Draft prices saved");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const copyPrevious = async () => {
    const response = await fetch("/api/v1/admin/market-prices/copy-previous", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ date }),
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      toast.error(result.error || "Copy failed");
      return;
    }
    toast.success(`${result.copied || 0} previous prices copied as draft`);
    await load();
  };

  const saveItem = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch("/api/v1/admin/market-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...newItem, displayOrder: Number(newItem.displayOrder), defaultUnit: newItem.defaultUnit }),
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      toast.error(result.error || "Item save failed");
      return;
    }
    toast.success("New market item added");
    setAddOpen(false);
    setNewItem({ category: "vegetable", nameEn: "", nameMr: "", variety: "", defaultUnit: "Kg", displayOrder: "100", isActive: true });
    await load();
  };


  const startEditItem = (row: MarketPriceRow) => {
    setEditItem({
      id: row.item_id,
      category: row.category,
      nameEn: row.name_en,
      nameMr: row.name_mr,
      variety: row.variety || "",
      defaultUnit: row.default_unit || "Kg",
      displayOrder: String(row.display_order || 100),
      isActive: row.is_active !== 0,
    });
  };

  const updateItem = async (event: FormEvent) => {
    event.preventDefault();
    if (!editItem) return;
    const response = await fetch(`/api/v1/admin/market-items/${editItem.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...editItem, displayOrder: Number(editItem.displayOrder), defaultUnit: editItem.defaultUnit }),
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      toast.error(result.error || "Item update failed");
      return;
    }
    toast.success("Market item updated");
    setEditItem(null);
    await load();
  };

  const deleteItem = async (row: MarketPriceRow) => {
    if (!window.confirm(`Delete ${itemTitle(row)}?`)) return;
    const response = await fetch(`/api/v1/admin/market-items/${row.item_id}`, { method: "DELETE", credentials: "include" });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      toast.error(result.error || "Item delete failed");
      return;
    }
    toast.success("Market item deleted");
    await load();
  };
  const openHistory = async (row: MarketPriceRow) => {
    setHistoryItem(row);
    const response = await fetch(`/api/v1/admin/market-prices/${row.item_id}/history`, { credentials: "include" });
    const result = await response.json();
    if (result.ok) setHistory((result.history || []).slice(0, 1));
  };

  return (
    <DashLayout kind="admin">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary-dark">Daily Market Prices</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage today's vegetable and fruit market prices</p>
          <p className="text-sm font-semibold text-primary">{"\u0926\u0948\u0928\u093f\u0915 \u092c\u093e\u091c\u093e\u0930 \u092d\u093e\u0935"}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => window.open(`/api/v1/admin/market-prices/export?date=${date}`, "_blank")}><Download className="mr-2 h-4 w-4" /> Export Today's Prices</Button>
          <Button onClick={() => setAddOpen(true)} className="bg-saffron text-saffron-foreground hover:bg-saffron/90"><Plus className="mr-2 h-4 w-4" /> Add New Item</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Card><CardContent className="flex items-center gap-3 p-5"><Calendar className="h-9 w-9 rounded-lg bg-secondary p-2 text-primary" /><div><div className="text-xs text-muted-foreground">Today's Date</div><div className="font-display font-bold text-primary-dark">{formatDate(date)}</div></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-5"><Store className="h-9 w-9 rounded-lg bg-primary p-2 text-white" /><div><div className="text-xs text-muted-foreground">Total Items</div><div className="font-display text-2xl font-bold text-primary-dark">{summary?.total_items || 0}</div></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-5"><Save className="h-9 w-9 rounded-lg bg-success p-2 text-white" /><div><div className="text-xs text-muted-foreground">Updated Today</div><div className="font-display text-2xl font-bold text-primary-dark">{summary?.updated_today || 0}</div></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-5"><IndianRupee className="h-9 w-9 rounded-lg bg-saffron p-2 text-primary-dark" /><div><div className="text-xs text-muted-foreground">Pending Update</div><div className="font-display text-2xl font-bold text-primary-dark">{summary?.pending_update || 0}</div></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-5"><BarChart3 className="h-9 w-9 rounded-lg bg-secondary p-2 text-primary" /><div><div className="text-xs text-muted-foreground">Last Published</div><div className="font-display text-sm font-bold text-primary-dark">{formatDate(summary?.last_published, true)}</div></div></CardContent></Card>
      </div>

      <div className="mt-6 grid gap-4">
        <CategoryTabs value={category} onChange={setCategory} />
        <Card className="overflow-visible border-border/60">
          <CardContent className="p-0">
            <div className="sticky top-0 z-40 grid gap-3 border-b bg-white p-4 shadow-md sm:p-5 lg:grid-cols-[180px_minmax(0,1fr)_auto_auto_auto]">
              <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search English or Marathi commodity..." className="pl-9" />
              </div>
              <Button variant="outline" onClick={copyPrevious}><Copy className="mr-2 h-4 w-4" /> Copy Previous Day</Button>
              <Button variant="outline" disabled={saving} onClick={() => saveRows("draft")}>Save Draft</Button>
              <Button disabled={saving} onClick={() => saveRows("published")} className="bg-saffron text-saffron-foreground hover:bg-saffron/90">Save & Publish Today's Prices</Button>
            </div>

            <div className="overflow-x-auto rounded-b-lg bg-white">
              <table className="w-full min-w-[1180px] table-fixed text-sm">
                <colgroup>
                  <col className="w-[170px]" />
                  <col className="w-[95px]" />
                  <col className="w-[86px]" />
                  <col className="w-[86px]" />
                  <col className="w-[86px]" />
                  <col className="w-[130px]" />
                  <col className="w-[390px]" />
                </colgroup>
                <thead className="bg-secondary/60 text-left text-muted-foreground">
                  <tr>
                    <th className="whitespace-nowrap p-3">Item</th>
                    <th className="whitespace-nowrap p-3">Yesterday</th>
                    <th className="whitespace-nowrap p-3">Min</th>
                    <th className="whitespace-nowrap p-3">Max</th>
                    <th className="whitespace-nowrap p-3">Avg</th>
                    <th className="whitespace-nowrap p-3">Unit</th>
                    <th className="whitespace-nowrap p-3 pl-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((group) => {
                    const grouped = group.children.some((row) => row.parent_name_en);
                    const collapsed = collapsedGroups[group.key] === true;
                    return (
                      <Fragment key={group.key}>
                        {grouped && (
                          <tr className="border-t bg-secondary/35 align-middle">
                            <td className="p-3" colSpan={7}>
                              <button
                                type="button"
                                onClick={() => setCollapsedGroups((current) => ({ ...current, [group.key]: !collapsed }))}
                                className="flex w-full items-center gap-2 text-left"
                              >
                                {collapsed ? <ChevronRight className="h-4 w-4 text-primary" /> : <ChevronDown className="h-4 w-4 text-primary" />}
                                <span className="font-display font-semibold text-primary-dark">{group.nameEn} / {group.nameMr}</span>
                                <Badge className="bg-background text-primary-dark">{group.children.length} varieties</Badge>
                              </button>
                            </td>
                          </tr>
                        )}
                        {!collapsed && group.children.map((row) => {
                          const draft = drafts[row.item_id];
                          return (
                            <tr key={row.item_id} className="border-t align-top">
                              <td className={`p-3 ${grouped ? "pl-8" : ""}`}>
                                <div className="whitespace-normal break-words font-display font-semibold leading-snug text-primary-dark">{itemTitle(row)}</div>
                                <div className="truncate text-xs text-muted-foreground">{row.parent_name_en ? parentTitle(row) : categoryLabel(row.category)}</div>
                              </td>
                              <td className="whitespace-nowrap p-3">{currency(row.previous_price)}</td>
                              <td className="p-3"><Input className="h-9 w-16 px-2" type="number" min="0" value={draft?.minPrice || ""} onChange={(event) => setDraft(row.item_id, "minPrice", event.target.value)} /></td>
                              <td className="p-3"><Input className="h-9 w-16 px-2" type="number" min="0" value={draft?.maxPrice || ""} onChange={(event) => setDraft(row.item_id, "maxPrice", event.target.value)} /></td>
                              <td className="p-3"><Input className="h-9 w-16 px-2" type="number" min="0" value={draft?.modalPrice || ""} onChange={(event) => setDraft(row.item_id, "modalPrice", event.target.value)} /></td>
                              <td className="p-3">
                                <Select value={draft?.unit || row.default_unit} onValueChange={(value) => setDraft(row.item_id, "unit", value)}>
                                  <SelectTrigger className="h-9 w-24 px-2"><SelectValue /></SelectTrigger>
                                  <SelectContent>{UNITS.map((unit) => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}</SelectContent>
                                </Select>
                              </td>
                              <td className="whitespace-nowrap p-3 pl-4 pr-6 text-left">
                                <div className="flex flex-nowrap justify-start gap-3">
                                  <Button size="sm" variant="outline" onClick={() => openHistory(row)}><Eye className="mr-1 h-4 w-4" /> View</Button>
                                  <Button size="sm" variant="outline" onClick={() => startEditItem(row)}><Pencil className="mr-1 h-4 w-4" /> Edit</Button>
                                  <Button size="sm" variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive hover:text-white" onClick={() => deleteItem(row)}><Trash2 className="mr-1 h-4 w-4" /> Delete</Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Market Item</DialogTitle>
            <DialogDescription>New item becomes available immediately for daily price entry.</DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={saveItem}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Category *</Label><Select value={newItem.category} onValueChange={(value) => setNewItem((item) => ({ ...item, category: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CATEGORIES.filter((item) => item.value !== "all").map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Default Unit *</Label><Select value={newItem.defaultUnit} onValueChange={(value) => setNewItem((item) => ({ ...item, defaultUnit: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{UNITS.map((unit) => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Item Name - English *</Label><Input value={newItem.nameEn} onChange={(event) => setNewItem((item) => ({ ...item, nameEn: event.target.value }))} required /></div>
              <div><Label>Item Name - Marathi *</Label><Input value={newItem.nameMr} onChange={(event) => setNewItem((item) => ({ ...item, nameMr: event.target.value }))} required /></div>
              <div><Label>Variety</Label><Input value={newItem.variety} onChange={(event) => setNewItem((item) => ({ ...item, variety: event.target.value }))} placeholder="Local, Hybrid, Grade A" /></div>
              <div><Label>Display Order</Label><Input type="number" value={newItem.displayOrder} onChange={(event) => setNewItem((item) => ({ ...item, displayOrder: event.target.value }))} /></div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border p-3">
              <input type="checkbox" checked={newItem.isActive} onChange={(event) => setNewItem((item) => ({ ...item, isActive: event.target.checked }))} />
              <span className="text-sm font-medium">Active item</span>
            </div>
            <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button><Button type="submit" className="bg-saffron text-saffron-foreground hover:bg-saffron/90">Save Item</Button></div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent className="max-w-2xl">
          {editItem && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Market Item</DialogTitle>
                <DialogDescription>Update item name, category, unit, order or active status.</DialogDescription>
              </DialogHeader>
              <form className="grid gap-4" onSubmit={updateItem}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><Label>Category *</Label><Select value={editItem.category} onValueChange={(value) => setEditItem((item) => item ? { ...item, category: value } : item)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CATEGORIES.filter((item) => item.value !== "all").map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></div>
                  <div><Label>Default Unit *</Label><Select value={editItem.defaultUnit} onValueChange={(value) => setEditItem((item) => item ? { ...item, defaultUnit: value } : item)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{UNITS.map((unit) => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}</SelectContent></Select></div>
                  <div><Label>Item Name - English *</Label><Input value={editItem.nameEn} onChange={(event) => setEditItem((item) => item ? { ...item, nameEn: event.target.value } : item)} required /></div>
                  <div><Label>Item Name - Marathi *</Label><Input value={editItem.nameMr} onChange={(event) => setEditItem((item) => item ? { ...item, nameMr: event.target.value } : item)} required /></div>
                  <div><Label>Variety</Label><Input value={editItem.variety} onChange={(event) => setEditItem((item) => item ? { ...item, variety: event.target.value } : item)} /></div>
                  <div><Label>Display Order</Label><Input type="number" value={editItem.displayOrder} onChange={(event) => setEditItem((item) => item ? { ...item, displayOrder: event.target.value } : item)} /></div>
                </div>
                <label className="flex items-center gap-2 rounded-lg border p-3 text-sm font-medium">
                  <input type="checkbox" checked={editItem.isActive} onChange={(event) => setEditItem((item) => item ? { ...item, isActive: event.target.checked } : item)} />
                  Active item
                </label>
                <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setEditItem(null)}>Cancel</Button><Button type="submit" className="bg-saffron text-saffron-foreground hover:bg-saffron/90">Update Item</Button></div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={!!historyItem} onOpenChange={(open) => !open && setHistoryItem(null)}>
        <DialogContent className="max-w-xl">
          {historyItem && (
            <>
              <DialogHeader><DialogTitle>{historyItem.name_en} / {historyItem.name_mr}</DialogTitle><DialogDescription>Today's published price</DialogDescription></DialogHeader>
              <Textarea className="hidden" />
              <div className="space-y-2">
                {history.map((row) => (
                  <div key={row.price_id} className="grid grid-cols-[1fr_auto] gap-3 rounded-lg border p-3">
                    <div><div className="font-semibold">{formatDate(row.price_date)}</div><div className="text-xs text-muted-foreground">{row.status} - {row.quality_grade || "Standard"}</div></div>
                    <div className="text-right"><div className="font-display font-bold text-primary-dark">{currency(row.modal_price)}</div><div className="text-xs text-muted-foreground">{currency(row.min_price)} - {currency(row.max_price)} / {row.unit}</div></div>
                  </div>
                ))}
                {history.length === 0 && <div className="rounded-lg border p-3 text-sm text-muted-foreground">No published price available for today.</div>}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashLayout>
  );
}
