import { Fragment, useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, BarChart3, Calendar, ChevronDown, ChevronRight, Copy, Download, Eye, Filter, IndianRupee, Minus, Pencil, Plus, Save, Search, Store, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DashLayout } from "@/components/dashboard/DashLayout";
import { SiteLayout } from "@/components/public/SiteLayout";
import { useI18n } from "@/lib/i18n";
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
  member_min_price?: number | null;
  member_max_price?: number | null;
  member_avg_price?: number | null;
  member_unit?: string | null;
  member_status?: "draft" | "submitted" | null;
  member_updated_at?: string | null;
  published_at: string | null;
  price_updated_at: string | null;
  previous_price: number | null;
  change_amount: number | null;
  change_percent: number | null;
  change_direction: "up" | "down" | "same" | "none";
  raw_submission_count?: number;
  valid_submission_count?: number;
  submission_count?: number;
  aggregate_status?: "collecting" | "updated" | "final" | string;
};

type MarketSummary = {
  total_items: number;
  updated_today: number;
  pending_update: number;
  last_published: string | null;
  your_updates?: number;
  market_items_updated?: number;
  members_contributed?: number;
  last_market_update?: string | null;
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

function formatDate(value: string | null | undefined, withTime = false, locale = "en-IN") {
  if (!value) return "-";
  return new Date(value).toLocaleString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

function currency(value: number | null | undefined) {
  return value === null || value === undefined ? "-" : `\u20B9${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function marketPriceAmount(value: number | null | undefined) {
  return value === null || value === undefined ? "-" : Number(value).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function publicPriceRange(row: MarketPriceRow) {
  if (row.min_price === null && row.max_price === null) return marketPriceAmount(row.modal_price);
  if (row.min_price === row.max_price) return marketPriceAmount(row.min_price);
  return `${marketPriceAmount(row.min_price)}-${marketPriceAmount(row.max_price)}`;
}

const MARKET_ITEM_IMAGE_ICONS: Array<{ terms: string[]; src: string; className: string }> = [
  { terms: ["tomato"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Tomato_je.jpg?width=96", className: "bg-red-50" },
  { terms: ["onion", "kanda"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Onion_on_White.JPG?width=96", className: "bg-rose-50" },
  { terms: ["potato", "batata"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Potato_and_cross_section.jpg?width=96", className: "bg-amber-50" },
  { terms: ["brinjal", "eggplant", "vangi"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Aubergine.jpg?width=96", className: "bg-purple-50" },
  { terms: ["cabbage"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Cabbage_and_cross_section_on_white.jpg?width=96", className: "bg-lime-50" },
  { terms: ["cauliflower"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Cauliflower.JPG?width=96", className: "bg-stone-50" },
  { terms: ["chilli", "mirchi"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Green_chilli.jpg?width=96", className: "bg-red-50" },
  { terms: ["capsicum", "bell pepper"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Bell_pepper.jpg?width=96", className: "bg-green-50" },
  { terms: ["lady finger", "okra", "bhendi"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Okra.jpg?width=96", className: "bg-green-50" },
  { terms: ["cucumber"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Cucumber_BNC.jpg?width=96", className: "bg-teal-50" },
  { terms: ["carrot"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Carrots_of_many_colors.jpg?width=96", className: "bg-orange-50" },
  { terms: ["beetroot"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Beetroot.jpg?width=96", className: "bg-fuchsia-50" },
  { terms: ["bitter gourd", "karle"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Bitter_gourd.jpg?width=96", className: "bg-emerald-50" },
  { terms: ["bottle gourd"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Fresh_Bottle_Gourd_%28Lauki%29_from_Home_Garden.jpg?width=96", className: "bg-lime-50" },
  { terms: ["ridge gourd"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Luffa_acutangula.jpg?width=96", className: "bg-green-50" },
  { terms: ["pumpkin"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Pumpkin.jpg?width=96", className: "bg-orange-50" },
  { terms: ["green peas"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Peas_in_pods_-_Studio.jpg?width=96", className: "bg-green-50" },
  { terms: ["spinach", "palak"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Spinacia_oleracea_Spinazie_bloeiend.jpg?width=96", className: "bg-green-50" },
  { terms: ["coriander"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Coriandrum_sativum_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-193.jpg?width=96", className: "bg-emerald-50" },
  { terms: ["fenugreek", "methi"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Methi_leaves.jpg?width=96", className: "bg-lime-50" },
  { terms: ["drumstick"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Moringa_oleifera_drumstick_pods.JPG?width=96", className: "bg-green-50" },
  { terms: ["garlic", "lasun"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/GarlicBasket.jpg?width=96", className: "bg-slate-50" },
  { terms: ["ginger"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Ginger.jpg?width=96", className: "bg-yellow-50" },
  { terms: ["sweet corn", "corn"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Corncobs.jpg?width=96", className: "bg-yellow-50" },
  { terms: ["apple"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Red_Apple.jpg?width=96", className: "bg-red-50" },
  { terms: ["banana", "keli"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Banana-Single.jpg?width=96", className: "bg-yellow-50" },
  { terms: ["orange"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Orange-Fruit-Pieces.jpg?width=96", className: "bg-orange-50" },
  { terms: ["pomegranate"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Pomegranate_fruit_-_whole_and_piece_with_arils.jpg?width=96", className: "bg-rose-50" },
  { terms: ["grape"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Table_grapes_on_white.jpg?width=96", className: "bg-violet-50" },
  { terms: ["papaya"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Papaya_cross_section_BNC.jpg?width=96", className: "bg-orange-50" },
  { terms: ["watermelon"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Watermelon_cross_BNC.jpg?width=96", className: "bg-green-50" },
  { terms: ["muskmelon"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Cantaloupe_and_canary_melon.jpg?width=96", className: "bg-amber-50" },
  { terms: ["guava"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Guava_ID.jpg?width=96", className: "bg-green-50" },
  { terms: ["pineapple", "ananas"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Pineapple.png?width=96", className: "bg-amber-50" },
  { terms: ["mango"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Mango_4.jpg?width=96", className: "bg-orange-50" },
  { terms: ["sweet lime", "mosambi"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/%28Citrus%20limetta%29%20Mosambi%20at%20a%20market%20in%20Seethammadhara.jpg?width=96", className: "bg-lime-50" },
  { terms: ["chikoo", "sapodilla"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sapodilla%20fruit.jpg?width=96", className: "bg-amber-50" },
  { terms: ["custard apple", "sitaphal", "sitafal"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Custard_apple.jpg?width=96", className: "bg-lime-50" },
  { terms: ["coconut"], src: "https://commons.wikimedia.org/wiki/Special:FilePath/Coconut_in_half.jpg?width=96", className: "bg-stone-50" },
];

const MARKET_ITEM_ICONS: Array<{ terms: string[]; icon: string; className: string }> = [
  { terms: ["pineapple", "ananas"], icon: "\uD83C\uDF4D", className: "bg-amber-100 text-amber-800" },
  { terms: ["onion", "kanda"], icon: "\uD83E\uDDC5", className: "bg-rose-100 text-rose-700" },
  { terms: ["potato", "batata"], icon: "\uD83E\uDD54", className: "bg-amber-100 text-amber-800" },
  { terms: ["tomato"], icon: "\uD83C\uDF45", className: "bg-red-100 text-red-700" },
  { terms: ["cauliflower"], icon: "\uD83E\uDD66", className: "bg-stone-100 text-stone-700" },
  { terms: ["cabbage"], icon: "\uD83E\uDD6C", className: "bg-lime-100 text-lime-700" },
  { terms: ["coriander"], icon: "\uD83C\uDF3F", className: "bg-emerald-100 text-emerald-700" },
  { terms: ["spinach", "palak"], icon: "\uD83E\uDD6C", className: "bg-green-100 text-green-700" },
  { terms: ["fenugreek", "methi"], icon: "\uD83C\uDF31", className: "bg-lime-100 text-lime-700" },
  { terms: ["chilli", "mirchi"], icon: "\uD83C\uDF36\uFE0F", className: "bg-red-100 text-red-700" },
  { terms: ["ginger"], icon: "\uD83E\uDDC4", className: "bg-yellow-100 text-yellow-800" },
  { terms: ["garlic", "lasun"], icon: "\uD83E\uDDC4", className: "bg-slate-100 text-slate-700" },
  { terms: ["lemon", "limbu"], icon: "\uD83C\uDF4B", className: "bg-yellow-100 text-yellow-700" },
  { terms: ["beetroot"], icon: "\uD83C\uDF60", className: "bg-fuchsia-100 text-fuchsia-700" },
  { terms: ["brinjal", "eggplant", "vangi"], icon: "\uD83C\uDF46", className: "bg-purple-100 text-purple-700" },
  { terms: ["okra", "lady finger", "bhendi"], icon: "\uD83E\uDED1", className: "bg-green-100 text-green-700" },
  { terms: ["bitter gourd", "karle"], icon: "\uD83E\uDD52", className: "bg-emerald-100 text-emerald-700" },
  { terms: ["carrot"], icon: "\uD83E\uDD55", className: "bg-orange-100 text-orange-700" },
  { terms: ["cucumber"], icon: "\uD83E\uDD52", className: "bg-teal-100 text-teal-700" },
  { terms: ["coconut"], icon: "\uD83E\uDD65", className: "bg-stone-100 text-stone-700" },
  { terms: ["banana", "keli"], icon: "\uD83C\uDF4C", className: "bg-yellow-100 text-yellow-700" },
  { terms: ["apple"], icon: "\uD83C\uDF4E", className: "bg-red-100 text-red-700" },
  { terms: ["mango"], icon: "\uD83E\uDD6D", className: "bg-orange-100 text-orange-700" },
  { terms: ["grape"], icon: "\uD83C\uDF47", className: "bg-violet-100 text-violet-700" },
  { terms: ["orange"], icon: "\uD83C\uDF4A", className: "bg-orange-100 text-orange-700" },
  { terms: ["pomegranate"], icon: "\uD83C\uDF4E", className: "bg-rose-100 text-rose-700" },
  { terms: ["watermelon"], icon: "\uD83C\uDF49", className: "bg-green-100 text-green-700" },
  { terms: ["corn"], icon: "\uD83C\uDF3D", className: "bg-yellow-100 text-yellow-700" },
  { terms: ["mushroom"], icon: "\uD83C\uDF44", className: "bg-stone-100 text-stone-700" },
  { terms: ["broccoli"], icon: "\uD83E\uDD66", className: "bg-green-100 text-green-700" },
];

function marketItemIcon(row: MarketPriceRow) {
  const haystack = `${row.name_en} ${row.name_mr} ${row.variety || ""} ${row.parent_name_en || ""} ${row.parent_name_mr || ""}`.toLowerCase();
  const image = MARKET_ITEM_IMAGE_ICONS.find((item) => item.terms.some((term) => haystack.includes(term)));
  if (image) return { ...image, icon: "" };
  return MARKET_ITEM_ICONS.find((item) => item.terms.some((term) => haystack.includes(term))) || {
    icon: row.category === "fruit" ? "\uD83C\uDF4F" : "\uD83E\uDD6C",
    className: row.category === "fruit" ? "bg-orange-100 text-orange-700" : "bg-emerald-100 text-emerald-700",
  };
}

function MarketItemIcon({ row, size = "md" }: { row: MarketPriceRow; size?: "sm" | "md" | "lg" }) {
  const [imageFailed, setImageFailed] = useState(false);
  const item = marketItemIcon(row);
  const fallback = MARKET_ITEM_ICONS.find((fallbackItem) => fallbackItem.terms.some((term) => `${row.name_en} ${row.name_mr} ${row.variety || ""} ${row.parent_name_en || ""} ${row.parent_name_mr || ""}`.toLowerCase().includes(term))) || {
    icon: row.category === "fruit" ? "\uD83C\uDF4F" : "\uD83E\uDD6C",
  };
  const sizeClass = size === "lg" ? "h-12 w-12 text-2xl" : size === "sm" ? "h-8 w-8 text-lg" : "h-10 w-10 text-xl";
  return (
    <span className={`grid shrink-0 place-items-center rounded-full shadow-sm ring-1 ring-black/5 ${sizeClass} ${item.className}`} aria-hidden="true">
      {"src" in item && !imageFailed ? (
        <img src={item.src} alt="" className="h-full w-full rounded-full object-contain p-1" loading="lazy" referrerPolicy="no-referrer" onError={() => setImageFailed(true)} />
      ) : item.icon || fallback.icon}
    </span>
  );
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

function aggregateStatusLabel(row: MarketPriceRow, lang: string) {
  const count = Number(row.submission_count || row.valid_submission_count || 0);
  const status = row.aggregate_status || (row.price_id ? "updated" : "collecting");
  if (lang === "mr") {
    if (status === "final") return "अंतिम";
    if (status === "updated") return "अपडेट झाले";
    return count > 0 ? "दर गोळा होत आहेत" : "प्रलंबित";
  }
  if (status === "final") return "Final";
  if (status === "updated") return "Updated";
  return count > 0 ? "Collecting Prices" : "Pending";
}

function membersUpdatedLabel(row: MarketPriceRow, lang: string) {
  const count = Number(row.submission_count || row.valid_submission_count || 0);
  return lang === "mr" ? `${count} सभासद` : `${count} Members`;
}

function CategoryTabs({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { lang } = useI18n();
  const isMarathi = lang === "mr";
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {CATEGORIES.map((category) => (
        <button
          key={category.value}
          type="button"
          onClick={() => onChange(category.value)}
          className={`min-h-16 rounded-xl border px-2 py-2 text-center transition sm:min-h-0 sm:px-4 sm:py-3 sm:text-left ${value === category.value ? "border-primary bg-secondary text-primary-dark shadow-sm" : "border-border bg-background hover:bg-secondary/60"}`}
        >
          <div className="font-display text-sm font-semibold leading-tight sm:text-base">{isMarathi ? category.mr : category.label}</div>
          {!isMarathi && <div className="mt-0.5 text-[11px] leading-tight text-muted-foreground sm:text-xs">{category.mr}</div>}
        </button>
      ))}
    </div>
  );
}

function MarketPriceReadOnly({ mode }: { mode: "public" | "trader" }) {
  const { lang } = useI18n();
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
  const publicRows = useMemo(() => filtered.filter(isPriceableRow), [filtered]);
  const publicColumns = useMemo(() => {
    const midpoint = Math.ceil(publicRows.length / 2);
    return [publicRows.slice(0, midpoint), publicRows.slice(midpoint)];
  }, [publicRows]);
  const isMarathi = lang === "mr";
  const publicDateLocale = isMarathi ? "mr-IN" : "en-IN";
  const publicText = {
    title: isMarathi ? "दैनिक बाजार भाव" : "Daily Market Prices",
    subtitle: isMarathi ? "पुणे मंडई घाऊक दर" : "Pune Market Yard Wholesale Rates",
    items: isMarathi ? "वस्तू" : "Items",
    fresh: isMarathi ? "ताजे" : "Fresh",
    refresh: isMarathi ? "ताजे करा" : "Refresh",
    search: isMarathi ? "भाजी किंवा फळ शोधा..." : "Search commodity...",
    location: isMarathi ? "पुणे मंडई" : "Pune Market Yard",
    quality: isMarathi ? "उत्तम गुणवत्ता योग्य दरात" : "Quality produce at fair rates",
    empty: isMarathi ? "आजचे बाजारभाव अजून प्रकाशित झालेले नाहीत. कृपया थोड्या वेळाने तपासा." : "Today's market prices have not been published yet. Please check again shortly.",
    lastUpdated: isMarathi ? "शेवटचे अद्यतन" : "Last Updated",
  };

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
      <section className={mode === "public" ? "bg-[#f6fbf3] py-8 sm:py-12" : "mt-6"}>
        <div className={mode === "public" ? "container-page" : ""}>
          {mode === "public" ? (
            <div className="overflow-hidden rounded-3xl border border-primary/20 bg-white shadow-xl shadow-primary-dark/10" data-no-translate>
              <div className="relative overflow-hidden bg-[linear-gradient(135deg,#0d3f2a_0%,#155f3e_58%,#f5fbf2_58%,#f5fbf2_100%)] px-4 py-5 text-white sm:px-8 sm:py-7">
                <div className="absolute inset-x-0 bottom-0 h-px bg-primary/20" />
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-primary-dark shadow-sm">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(date || lastPublished, false, publicDateLocale)}
                    </div>
                    <h1 className="mt-3 font-display text-4xl font-black leading-none text-white sm:text-6xl">
                      {publicText.title}
                    </h1>
                    <p className="mt-2 text-lg font-semibold text-emerald-50 sm:text-2xl">{publicText.subtitle}</p>
                  </div>
                  <div className="grid w-full max-w-xs grid-cols-2 gap-2 rounded-2xl border border-primary/15 bg-white/85 p-3 text-center text-primary-dark shadow-sm backdrop-blur md:w-72">
                    <div>
                      <div className="text-2xl font-black text-primary-dark">{publicRows.length}</div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{publicText.items}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-primary-dark">100%</div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{publicText.fresh}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white px-4 py-4 sm:px-6">
                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={publicText.search} className="h-11 rounded-full border-primary/20 bg-white pl-9 shadow-sm" />
                  </div>
                  <Button className="rounded-full bg-primary font-bold text-white hover:bg-primary-dark" onClick={load}><Filter className="mr-2 h-4 w-4" /> {publicText.refresh}</Button>
                </div>
                <div className="mt-4">
                  <CategoryTabs value={category} onChange={setCategory} />
                </div>
              </div>

              <div className="bg-[#f8fbf6] p-3 sm:p-5">
                {publicRows.length > 0 && (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {publicColumns.filter((column) => column.length > 0).map((column, columnIndex) => (
                      <div key={columnIndex} className="overflow-hidden rounded-2xl border border-primary/25 bg-white shadow-sm">
                        {column.map((row) => (
                          <div key={row.item_id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-dashed border-slate-300 px-3 py-2.5 last:border-b-0 sm:px-4">
                            <div className="flex min-w-0 items-center gap-3">
                              <MarketItemIcon row={row} size="md" />
                              <div className="min-w-0">
                                <div className="truncate font-display text-base font-black leading-tight text-primary-dark sm:text-lg">{isMarathi ? (row.name_mr || row.name_en) : row.name_en}</div>
                                {!isMarathi && row.name_mr && <div className="truncate text-xs font-semibold text-muted-foreground">{row.name_mr}</div>}
                              </div>
                            </div>
                            <div className="flex items-baseline gap-1 text-right font-black text-[#8f2532]">
                              <IndianRupee className="h-4 w-4" />
                              <span className="text-lg sm:text-xl">{publicPriceRange(row)}</span>
                              <span className="text-xs font-bold text-slate-700">/{row.unit || row.default_unit || "Kg"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
                {publicRows.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-primary/30 bg-white p-8 text-center text-sm font-semibold text-muted-foreground">
                    {publicText.empty}
                  </div>
                )}
              </div>

              <div className="grid gap-3 border-t border-primary/15 bg-[#edf7e9] px-4 py-4 text-primary-dark sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:px-6">
                <div className="font-display text-xl font-black">{publicText.location}</div>
                <div className="rounded-full border border-primary/25 bg-white px-5 py-2 text-center text-sm font-black">{publicText.quality}</div>
                <div className="text-sm font-semibold text-muted-foreground sm:text-right">{publicText.lastUpdated}: {formatDate(lastPublished, true, publicDateLocale)}</div>
              </div>
            </div>
          ) : (
            <>
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
                      <th className="p-3">Updated By</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((group) => {
                      const grouped = group.children.some((row) => row.parent_name_en);
                      return (
                        <Fragment key={group.key}>
                          {grouped && (
                            <tr className="border-t bg-secondary/35">
                              <td className="p-3" colSpan={8}>
                                <div className="font-display font-semibold text-primary-dark">{group.nameEn} / {group.nameMr}</div>
                                <div className="text-xs text-muted-foreground">{group.children.length} varieties</div>
                              </td>
                            </tr>
                          )}
                          {group.children.map((row) => (
                            <tr key={row.item_id} className="border-t">
                              <td className={`p-3 ${grouped ? "pl-8" : ""}`}>
                                <div className="flex items-center gap-3">
                                  <MarketItemIcon row={row} />
                                  <div className="min-w-0">
                                    <div className="font-display font-semibold text-primary-dark">{itemTitle(row)}</div>
                                    <div className="text-xs text-muted-foreground">{row.parent_name_en ? parentTitle(row) : categoryLabel(row.category)}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 text-right font-semibold">{currency(row.min_price)}</td>
                              <td className="p-3 text-right font-semibold">{currency(row.max_price)}</td>
                              <td className="p-3 text-right font-bold text-primary-dark">{currency(row.modal_price)}</td>
                              <td className="p-3">{changeView(row)}</td>
                              <td className="p-3">{row.unit}</td>
                              <td className="p-3 font-semibold text-primary-dark">{membersUpdatedLabel(row, lang)}</td>
                              <td className="p-3"><Badge variant="secondary" className="bg-secondary text-primary-dark">{aggregateStatusLabel(row, lang)}</Badge></td>
                            </tr>
                          ))}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-5 overflow-hidden rounded-lg border md:hidden">
                <div className="grid grid-cols-[minmax(0,1.25fr)_52px_52px_52px] items-center gap-2 border-b bg-secondary/40 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  <span>Commodity</span>
                  <span className="text-left">Min</span>
                  <span className="text-left">Max</span>
                  <span className="text-left">Avg</span>
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
                    <div key={row.item_id} className="border-t px-3 py-3 first:border-t-0">
                      <div className="grid grid-cols-[minmax(0,1.25fr)_52px_52px_52px] items-center gap-2">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <MarketItemIcon row={row} size="sm" />
                          <div className="min-w-0">
                            <div className="whitespace-normal break-words font-display text-[13px] font-semibold leading-snug text-primary-dark">{row.name_en}</div>
                            <div className="truncate text-[11px] text-muted-foreground">{row.name_mr}</div>
                            <div className="mt-0.5 truncate text-[10px] text-muted-foreground">{row.parent_name_en ? parentTitle(row) : categoryLabel(row.category)}</div>
                          </div>
                        </div>
                        <div className="text-left text-[12px] font-semibold text-primary-dark">{currency(row.min_price)}</div>
                        <div className="text-left text-[12px] font-semibold text-primary-dark">{currency(row.max_price)}</div>
                        <div className="text-left text-[12px] font-bold text-primary-dark">{currency(row.modal_price)}</div>
                      </div>
                      <div className="mt-2 flex items-center justify-start gap-2 border-t border-dashed pt-2 text-[10px]">
                        <span className="rounded-full bg-secondary px-2 py-0.5 font-semibold text-primary-dark">{row.unit}</span>
                        <span className={`truncate font-medium ${changeClassName}`}>{changeLabel}</span>
                        <span className="text-muted-foreground">{membersUpdatedLabel(row, lang)}</span>
                        <span className="font-semibold text-primary-dark">{aggregateStatusLabel(row, lang)}</span>
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
            </>
          )}
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


function MemberMarketPricesPage() {
  const { lang } = useI18n();
  const [date] = useState(todayInput());
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<MarketPriceRow[]>([]);
  const [summary, setSummary] = useState<MarketSummary | null>(null);
  const [drafts, setDrafts] = useState<Record<number, DraftRow>>({});
  const [saving, setSaving] = useState(false);
  const [historyItem, setHistoryItem] = useState<MarketPriceRow | null>(null);
  const [history, setHistory] = useState<MarketPriceRow[]>([]);
  const [submissionClosed, setSubmissionClosed] = useState(false);
  const [deadlineHour, setDeadlineHour] = useState(13);

  const load = async () => {
    const params = new URLSearchParams({ date });
    if (category !== "all") params.set("category", category);
    if (search.trim()) params.set("search", search.trim());
    const response = await fetch(`/api/v1/trader/market-prices?${params.toString()}`, { credentials: "include" });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || "Market prices failed to load");
    const priceableRows = dedupeMarketItems(result.prices || []).filter(isPriceableRow);
    setRows(priceableRows);
    setSubmissionClosed(Boolean(result.submissionClosed));
    setDeadlineHour(Number(result.submissionDeadlineHour || 13));
    setSummary({
      total_items: priceableRows.length,
      updated_today: Number(result.summary?.your_updates || 0),
      pending_update: Math.max(0, priceableRows.length - Number(result.summary?.your_updates || 0)),
      last_published: result.summary?.last_market_update || null,
      your_updates: Number(result.summary?.your_updates || 0),
      market_items_updated: Number(result.summary?.market_items_updated || 0),
      members_contributed: Number(result.summary?.members_contributed || 0),
      last_market_update: result.summary?.last_market_update || null,
    });
    const nextDrafts: Record<number, DraftRow> = {};
    priceableRows.forEach((row) => {
      nextDrafts[row.item_id] = {
        itemId: row.item_id,
        minPrice: row.member_min_price?.toString() || "",
        maxPrice: row.member_max_price?.toString() || "",
        modalPrice: row.member_avg_price?.toString() || "",
        unit: row.member_unit || row.unit || row.default_unit || "Kg",
        arrivalQuantity: "",
        arrivalUnit: row.default_unit || "Kg",
        qualityGrade: "",
        notes: "",
      };
    });
    setDrafts(nextDrafts);
  };

  useEffect(() => { load().catch((error) => toast.error(error.message)); }, [category]);

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
      if (field === "minPrice" || field === "maxPrice") {
        const min = next.minPrice !== "" ? Number(next.minPrice) : null;
        const max = next.maxPrice !== "" ? Number(next.maxPrice) : null;
        if (min !== null && max !== null && Number.isFinite(min) && Number.isFinite(max)) {
          next.modalPrice = String(((min + max) / 2).toFixed(2).replace(/\.00$/, ""));
        } else if (min !== null && Number.isFinite(min)) {
          next.modalPrice = String(min);
        } else if (max !== null && Number.isFinite(max)) {
          next.modalPrice = String(max);
        } else {
          next.modalPrice = "";
        }
      }
      return { ...current, [itemId]: next };
    });
  };

  const saveRows = async (status: "draft" | "submitted") => {
    const records = Object.values(drafts).filter((row) => row.minPrice !== "" || row.maxPrice !== "");
    if (records.length === 0) {
      toast.error("Enter at least one price for at least one item");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/v1/trader/market-prices/bulk-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ date, status, records }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Save failed");
      toast.success(status === "submitted" ? "Today's prices submitted" : "Draft prices saved");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const openHistory = async (row: MarketPriceRow) => {
    setHistoryItem(row);
    const response = await fetch(`/api/v1/public/market-prices/${row.item_id}/history`, { credentials: "include" });
    const result = await response.json();
    if (result.ok) setHistory((result.history || []).slice(0, 5));
  };

  return (
    <DashLayout kind="owner">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary-dark">Daily Market Prices</h1>
          <p className="mt-1 text-sm font-semibold text-primary">{"\u0906\u091c\u091a\u0947 \u092c\u093e\u091c\u093e\u0930\u092d\u093e\u0935"}</p>
        </div>
        <div className="text-sm text-muted-foreground">Today's Date: <span className="font-semibold text-primary-dark">{formatDate(date)}</span></div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Card><CardContent className="flex items-center gap-3 p-5"><Calendar className="h-9 w-9 rounded-lg bg-secondary p-2 text-primary" /><div><div className="text-xs text-muted-foreground">Today's Date</div><div className="font-display font-bold text-primary-dark">{formatDate(date)}</div></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-5"><Save className="h-9 w-9 rounded-lg bg-success p-2 text-white" /><div><div className="text-xs text-muted-foreground">Your Updates</div><div className="font-display text-2xl font-bold text-primary-dark">{summary?.your_updates || 0}</div></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-5"><Store className="h-9 w-9 rounded-lg bg-primary p-2 text-white" /><div><div className="text-xs text-muted-foreground">Market Items Updated</div><div className="font-display text-2xl font-bold text-primary-dark">{summary?.market_items_updated || 0}</div></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-5"><BarChart3 className="h-9 w-9 rounded-lg bg-saffron p-2 text-primary-dark" /><div><div className="text-xs text-muted-foreground">Members Contributed</div><div className="font-display text-2xl font-bold text-primary-dark">{summary?.members_contributed || 0}</div></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-5"><IndianRupee className="h-9 w-9 rounded-lg bg-secondary p-2 text-primary" /><div><div className="text-xs text-muted-foreground">Pending Items</div><div className="font-display text-2xl font-bold text-primary-dark">{summary?.pending_update || 0}</div></div></CardContent></Card>
      </div>

      <div className="mt-6 grid gap-4">
        <div className="rounded-lg border border-saffron/40 bg-saffron/10 px-4 py-3 text-sm font-semibold text-primary-dark">
          {lang === "mr" ? (
          <>
            <span className="font-bold">{"\u0938\u0942\u091a\u0928\u093e: "}</span>{"\u0938\u0930\u094d\u0935 \u0905\u0921\u0924\u094d\u092f\u093e\u0902\u0928\u0940 \u0930\u094b\u091c \u0926\u0941\u092a\u093e\u0930\u0940 "}{deadlineHour > 12 ? deadlineHour - 12 : deadlineHour}{":00 \u0935\u093e\u091c\u0947\u092a\u0930\u094d\u092f\u0902\u0924 \u0936\u0947\u0924\u0915\u0930\u0940 \u092e\u093e\u0932\u093e\u091a\u0947 \u092c\u093e\u091c\u093e\u0930\u092d\u093e\u0935 \u0905\u092a\u0921\u0947\u091f \u0915\u0930\u0923\u0947 \u0906\u0935\u0936\u094d\u092f\u0915 \u0906\u0939\u0947. \u0926\u0941\u092a\u093e\u0930\u0940 1 \u0928\u0902\u0924\u0930 \u0938\u092c\u092e\u093f\u091f \u0915\u0947\u0932\u0947\u0932\u0947 \u092d\u093e\u0935 \u0938\u094d\u0935\u0940\u0915\u093e\u0930\u0932\u0947 \u091c\u093e\u0923\u093e\u0930 \u0928\u093e\u0939\u0940\u0924. "}{submissionClosed ? "\u0906\u091c\u091a\u0940 \u0938\u092c\u092e\u093f\u0936\u0928 \u0935\u0947\u0933 \u0938\u0902\u092a\u0932\u0940 \u0906\u0939\u0947." : "\u0938\u0927\u094d\u092f\u093e \u092d\u093e\u0935 \u0938\u092c\u092e\u093f\u091f \u0915\u0930\u0924\u093e \u092f\u0947\u0924\u0940\u0932."}
          </>
        ) : (
          <>
            <span className="font-bold">Note: </span>All members must update farmer produce market prices every day before {deadlineHour > 12 ? deadlineHour - 12 : deadlineHour}:00 PM. Prices submitted after 1:00 PM IST will not be accepted. {submissionClosed ? "Today's submission window is closed." : "Prices can be submitted now."}
          </>
          )}
        </div>
        <div className="sticky -top-8 z-40 -mx-3 space-y-4 bg-background px-3 pb-4 pt-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <CategoryTabs value={category} onChange={setCategory} />
          <Card className="border-border/60 shadow-sm">
            <CardContent className="grid gap-3 bg-white p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search English or Marathi commodity..." className="pl-9" />
              </div>
              <Button variant="outline" disabled={saving} onClick={() => saveRows("draft")}>Save Draft</Button>
              <Button disabled={saving || submissionClosed} onClick={() => saveRows("submitted")} className="bg-saffron text-saffron-foreground hover:bg-saffron/90">Submit / Update Today's Prices</Button>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden border-border/60">
          <CardContent className="p-0">
            <div className="overflow-x-auto bg-white">
              <table className="w-full min-w-[1060px] table-fixed text-sm">
                <colgroup><col className="w-[230px]" /><col className="w-[95px]" /><col className="w-[95px]" /><col className="w-[95px]" /><col className="w-[95px]" /><col className="w-[110px]" /><col className="w-[130px]" /><col className="w-[130px]" /><col className="w-[90px]" /></colgroup>
                <thead className="bg-secondary/60 text-left text-muted-foreground"><tr><th className="p-3">Item</th><th className="p-3">Yesterday</th><th className="p-3">Min</th><th className="p-3">Max</th><th className="p-3">Avg</th><th className="p-3">Unit</th><th className="p-3">Your Price</th><th className="p-3">Market Average</th><th className="p-3">History</th></tr></thead>
                <tbody>
                  {groups.map((group) => (
                    <Fragment key={group.key}>
                      {group.children.some((row) => row.parent_name_en) && <tr className="border-t bg-secondary/35"><td className="p-3" colSpan={9}><div className="font-display font-semibold text-primary-dark">{group.nameEn} / {group.nameMr}</div><div className="text-xs text-muted-foreground">{group.children.length} varieties</div></td></tr>}
                      {group.children.map((row) => {
                        const draft = drafts[row.item_id];
                        const updated = row.member_status === "submitted";
                        return (
                          <tr key={row.item_id} className="border-t align-top">
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <MarketItemIcon row={row} />
                                <div className="min-w-0">
                                  <div className="font-display font-semibold leading-snug text-primary-dark">{itemTitle(row)}</div>
                                  <div className="text-xs text-muted-foreground">{row.parent_name_en ? parentTitle(row) : categoryLabel(row.category)}</div>
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap p-3">{currency(row.previous_price)}</td>
                            <td className="p-3"><Input className="h-9 w-20 px-2" type="number" min="0" value={draft?.minPrice || ""} onChange={(event) => setDraft(row.item_id, "minPrice", event.target.value)} /></td>
                            <td className="p-3"><Input className="h-9 w-20 px-2" type="number" min="0" value={draft?.maxPrice || ""} onChange={(event) => setDraft(row.item_id, "maxPrice", event.target.value)} /></td>
                            <td className="p-3"><Input className="h-9 w-20 px-2 bg-secondary/40" readOnly value={draft?.modalPrice || ""} /></td>
                            <td className="p-3"><Select value={draft?.unit || row.default_unit} onValueChange={(value) => setDraft(row.item_id, "unit", value)}><SelectTrigger className="h-9 w-24 px-2"><SelectValue /></SelectTrigger><SelectContent>{UNITS.map((unit) => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}</SelectContent></Select></td>
                            <td className="p-3"><Badge className={updated ? "bg-success/15 text-success hover:bg-success/15" : row.member_status === "draft" ? "bg-saffron/20 text-primary-dark hover:bg-saffron/20" : "bg-muted text-muted-foreground hover:bg-muted"}>{updated ? "Updated" : row.member_status === "draft" ? "Draft" : "Pending"}</Badge></td>
                            <td className="p-3"><div className="font-semibold text-primary-dark">{currency(row.modal_price)}</div><div className="text-xs text-muted-foreground">{row.price_id ? `${currency(row.min_price)} - ${currency(row.max_price)}` : "Insufficient updates"}</div><div className="mt-1 text-xs font-medium text-primary-dark">{membersUpdatedLabel(row, lang)} • {aggregateStatusLabel(row, lang)}</div></td>
                            <td className="p-3"><Button size="sm" variant="outline" onClick={() => openHistory(row)}><Eye className="mr-1 h-4 w-4" /> View</Button></td>
                          </tr>
                        );
                      })}
                    </Fragment>
                  ))}
                  {filtered.length === 0 && <tr><td className="p-8 text-center text-muted-foreground" colSpan={9}>No market items found.</td></tr>}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!historyItem} onOpenChange={(open) => !open && setHistoryItem(null)}>
        <DialogContent className="max-w-xl">
          {historyItem && <><DialogHeader><DialogTitle>{historyItem.name_en} / {historyItem.name_mr}</DialogTitle><DialogDescription>Market price history</DialogDescription></DialogHeader><div className="space-y-2">{history.map((row) => <div key={row.price_id} className="flex items-center justify-between rounded-lg border p-3"><div><div className="font-medium">{formatDate(row.price_date)}</div><div className="text-xs text-muted-foreground">{row.unit}</div></div><div className="text-right"><div className="font-display text-lg font-bold text-primary-dark">{currency(row.modal_price)}</div><div className="text-xs text-muted-foreground">{currency(row.min_price)} - {currency(row.max_price)}</div></div></div>)}{history.length === 0 && <div className="rounded-lg border p-3 text-sm text-muted-foreground">No published price history available.</div>}</div></>}
        </DialogContent>
      </Dialog>
    </DashLayout>
  );
}
export function PublicMarketPricesPage() {
  return <MarketPriceReadOnly mode="public" />;
}

export function TraderMarketPricesPage() {
  return <MemberMarketPricesPage />;
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
        <div className="sticky -top-8 z-40 -mx-3 space-y-4 bg-background px-3 pb-4 pt-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <CategoryTabs value={category} onChange={setCategory} />
          <Card className="border-border/60 shadow-sm">
            <CardContent className="grid gap-3 bg-white p-4 sm:p-5 lg:grid-cols-[180px_minmax(0,1fr)_auto_auto_auto]">
              <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search English or Marathi commodity..." className="pl-9" />
              </div>
              <Button variant="outline" onClick={copyPrevious}><Copy className="mr-2 h-4 w-4" /> Copy Previous Day</Button>
              <Button variant="outline" disabled={saving} onClick={() => saveRows("draft")}>Save Draft</Button>
              <Button disabled={saving} onClick={() => saveRows("published")} className="bg-saffron text-saffron-foreground hover:bg-saffron/90">Save & Publish Today's Prices</Button>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden border-border/60">
          <CardContent className="p-0">
            <div className="overflow-x-auto bg-white">
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
