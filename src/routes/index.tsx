import { createFileRoute, Link } from "@/lib/simple-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/public/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ArrowRight, Bell, ClipboardList, Download, FileText, Newspaper, Phone,
  UserCog, MessageSquare, ShieldCheck,
  CheckCircle2, UserPlus, LogIn, FolderCheck, Sparkles, Camera, Star, IndianRupee, Eye,
} from "lucide-react";
import heroImg from "@/assets/market-hero.jpg";
import marketyardImg from "@/assets/marketyard.webp";
import sourabhKunjirImg from "@/assets/sourabh Kunjir.png";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shri Chhatrapati Shivaji Market Yard Adte Association - Digital Portal" },
      { name: "description", content: "Connecting 850+ Members with market yard administration. Market updates, notices, complaints, official documents." },
      { property: "og:title", content: "Shri Chhatrapati Shivaji Market Yard Adte Association - Digital Portal" },
      { property: "og:description", content: "Secure digital platform for Members of Shri Chhatrapati Shivaji Market Yard Adte Association." },
    ],
  }),
  component: Home,
});

const SERVICES = [
  { icon: Newspaper, title: "Daily Market Updates", desc: "Live vegetable, fruit and grain rates published every morning." },
  { icon: MessageSquare, title: "Raise a Complaint", desc: "Submit water, electricity, cleanliness or facility issues with attachments." },
  { icon: FileText, title: "Download Notices", desc: "Access all official notices, circulars and meeting minutes." },
  { icon: Bell, title: "Association News", desc: "Stay updated with association announcements and events." },
  { icon: UserCog, title: "Update Profile", desc: "Keep your gala profile and business details up to date." },
  { icon: Phone, title: "Mobile Number Change", desc: "Request registered mobile update with admin approval workflow." },
  { icon: ClipboardList, title: "Complaint Status", desc: "Track every complaint from submission to resolution." },
  { icon: Download, title: "Admin Documents", desc: "Download official PDFs, images and videos published by admin." },
];

const HOW_STEPS = [
  { n: 1, icon: UserPlus, title: "Register your gala", desc: "Fill the multi-step registration form with gala and business details." },
  { n: 2, icon: FolderCheck, title: "Admin verifies details", desc: "Main Admin reviews your documents and approves within 48 hours." },
  { n: 3, icon: LogIn, title: "Login using mobile number", desc: "Use your registered mobile number and password to sign in." },
  { n: 4, icon: Sparkles, title: "Access dashboard & notices", desc: "View market updates, notices and download official documents." },
  { n: 5, icon: MessageSquare, title: "Raise and track complaints", desc: "Submit complaints with photos, videos and track status live." },
];

const GALLERY_TILES = [
  "Vegetable market at dawn",
  "Monthly committee meeting",
  "Cleanliness drive",
  "Ganesh festival celebration",
  "New cold storage inauguration",
  "Farmer awareness camp",
];

function Home() {
  const { t, lang } = useI18n();
  type PublicContent = { id: number; title_en: string; content_en?: string; published_at: string | null; created_at: string; parsed?: { category?: string; details?: string }; attachments?: Array<{ id: number; attachment_type: string; original_filename: string }> };
  type CommitteeMemberRecord = { id: number; full_name: string; name_mr: string | null; designation: string; designation_mr: string | null; gala_number: string | null; term_label: string | null; message: string | null; photo_url: string | null };
  type PublicReview = { id: number; rating_value: number; review_text: string | null; reviewer_type: "trader" | "customer"; reviewer_name: string; business_name: string; trader_code: string; trader_name: string; gala_number: string | null; customer_code: string | null; created_at: string; attachments?: Array<{ id: number; attachment_type: "image" | "video"; original_filename: string; mime_type: string; file_size_bytes: number }> };
  type PublicComplaintFeedback = { id: number; reaction: string; rating: number; comment: string; category: string; created_at: string };
  type PublicPrice = { item_id: number; category: string; name_en: string; name_mr: string; min_price: number; max_price: number; modal_price: number; unit: string; change_amount: number | null; change_direction: string; published_at: string | null };
  const [updates, setUpdates] = useState<PublicContent[]>([]);
  const [notices, setNotices] = useState<PublicContent[]>([]);
  const [gallery, setGallery] = useState<PublicContent[]>([]);
  const [committee, setCommittee] = useState<CommitteeMemberRecord[]>([]);
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [complaintFeedback, setComplaintFeedback] = useState<PublicComplaintFeedback[]>([]);
  const [complaintFeedbackApi, setComplaintFeedbackApi] = useState<CarouselApi>();
  const [prices, setPrices] = useState<PublicPrice[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<PublicContent | null>(null);
  useEffect(() => {
    fetch("/api/v1/public/posts").then((r) => r.json()).then((result) => { if (result.ok) setUpdates(result.posts || []); }).catch(() => undefined);
    fetch("/api/v1/public/notices").then((r) => r.json()).then((result) => { if (result.ok) setNotices(result.notices || []); }).catch(() => undefined);
    fetch("/api/v1/public/gallery").then((r) => r.json()).then((result) => { if (result.ok) setGallery(result.items || []); }).catch(() => undefined);
    fetch("/api/v1/public/committee").then((r) => r.json()).then((result) => { if (result.ok) setCommittee(result.members || []); }).catch(() => undefined);
    fetch("/api/v1/public/ratings").then((r) => r.json()).then((result) => { if (result.ok) setReviews(result.reviews || []); }).catch(() => undefined);
    fetch("/api/v1/public/complaint-feedback").then((r) => r.json()).then((result) => { if (result.ok) setComplaintFeedback(result.feedback || []); }).catch(() => undefined);
    fetch("/api/v1/public/market-prices").then((r) => r.json()).then((result) => { if (result.ok) setPrices(result.prices || []); }).catch(() => undefined);
  }, []);
  useEffect(() => {
    if (!complaintFeedbackApi || complaintFeedback.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => complaintFeedbackApi.scrollNext(), 3500);
    return () => window.clearInterval(timer);
  }, [complaintFeedbackApi, complaintFeedback.length]);

  const ticker = updates.slice(0, 6);
  const heroSubtitle = t("hero.sub");
  const chairman = committee.find((member) => member.designation.toLowerCase().includes("chairman") && !member.designation.toLowerCase().includes("lobby"));
  const committeeMembers = committee.filter((member) => member.id !== chairman?.id);
  const initials = (name: string) => name.split(" ").filter(Boolean).slice(-1)[0]?.[0]?.toUpperCase() || name[0]?.toUpperCase() || "M";
  const displayCommitteeName = (member: CommitteeMemberRecord) => lang === "mr" ? member.name_mr || member.full_name : member.full_name;
  const displayCommitteeDesignation = (member: CommitteeMemberRecord) => lang === "mr" ? member.designation_mr || member.designation : member.designation;
  const chairmanCopy = lang === "mr"
    ? {
        current: "सध्याचे अध्यक्ष",
        role: "अध्यक्ष",
        title: "नेतृत्व",
        term: "कार्यकाळ",
        name: chairman?.name_mr || "श्री. सौरभ कुंजीर",
        secondaryName: "",
        intro: "त्यांच्या नेतृत्वाखाली संघटना पारदर्शक प्रशासन, जलद तक्रार निवारण, नियमित बाजार माहिती आणि प्रत्येक व्यापारी व गाळाधारकासाठी अधिक चांगल्या डिजिटल सेवांवर लक्ष केंद्रित करत आहे.",
        quote: "प्रत्येक व्यापाऱ्यासाठी पारदर्शक, डिजिटल आणि सेवा-केंद्रित मार्केट यार्ड उभारण्यासाठी आपण सर्वजण एकत्र काम करत आहोत.",
        focus: ["डिजिटल सूचना प्रवेश", "सभासद-केंद्रित मदत", "बाजार अद्यतने", "पारदर्शक कार्यप्रवाह"],
      }
    : {
        current: "Current Chairman",
        role: "Chairman",
        title: "Leadership",
        term: "Term",
        name: chairman?.full_name || "Shri. Sourabh Kunjir",
        secondaryName: chairman?.name_mr || "",
        intro: "Under his leadership, the association is focused on transparent administration, faster complaint resolution, regular market communication, and better digital services for every trader and gala owner.",
        quote: chairman?.message || "Together, we are building a transparent, digital and service-focused market yard for every trader.",
        focus: ["Digital notice access", "Member-first support", "Market updates", "Transparent workflow"],
      };
  const CommitteeAvatar = ({ member }: { member: CommitteeMemberRecord }) => {
    const [imageFailed, setImageFailed] = useState(false);
    if (!member.photo_url || imageFailed) return <>{initials(member.full_name)}</>;
    return (
      <img
        src={member.photo_url}
        alt={member.full_name}
        className="h-full w-full object-cover object-top"
        onError={() => setImageFailed(true)}
      />
    );
  };
  const downloadNotice = (notice: PublicContent) => {
    const attachment = notice.attachments?.[0];
    if (attachment) {
      window.open(`/api/v1/public/content-attachments/${attachment.id}/download?download=1`, "_blank", "noopener,noreferrer");
      return;
    }
    const report = [
      "Shri Chhatrapati Shivaji Market Yard Adte Association",
      "Official Notice",
      "",
      `Title: ${notice.title_en}`,
      `Category: ${notice.parsed?.category || "Notice"}`,
      `Date: ${new Date(notice.published_at || notice.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`,
      "",
      notice.parsed?.details || notice.content_en || "",
    ].join("\n");
    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${notice.title_en || "notice"}.txt`.replace(/[\\/:*?"<>|]+/g, "-");
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <SiteLayout>
      {/* Announcement ticker */}
      <div className="bg-saffron/95 text-saffron-foreground border-b border-saffron">
        <div className="container-page flex items-center gap-3 py-2 text-sm font-medium overflow-hidden">
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary-dark/90 px-3 py-1 text-xs text-white uppercase tracking-wider font-bold">
            <Bell className="h-3.5 w-3.5" /> Live
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="flex gap-10 animate-marquee whitespace-nowrap">
              {[...ticker, ...ticker].map((u, i) => (
                <span key={i} className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-dark" />
                  {u.title_en}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImg})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/78 via-primary-dark/42 to-transparent" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/35 via-transparent to-white/5" aria-hidden />
        <div className="container-page relative py-16 md:py-24">
          <div className="text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-saffron/40 bg-saffron/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-saffron">
              <ShieldCheck className="h-3.5 w-3.5" /> Official Association Portal
            </span>
            <h1 className="mt-5 max-w-3xl text-left font-display text-3xl font-bold leading-snug drop-shadow-[0_3px_14px_rgba(0,0,0,0.55)] sm:text-4xl md:text-5xl lg:text-[3.4rem]">
              {t("hero.title")}
            </h1>
            {heroSubtitle && (
              <p className="mt-5 max-w-xl text-base text-white/95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] sm:text-lg">
                {heroSubtitle}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-saffron text-saffron-foreground hover:bg-saffron/90">
                <Link to="/login">{t("hero.cta.login")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white hover:text-primary-dark">
                <Link to="/register">{t("hero.cta.register")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white hover:text-primary-dark">
                <Link to="/updates">{t("hero.cta.updates")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About strip */}
      <section className="bg-leaf py-14 md:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">About the Association</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-primary-dark sm:text-4xl">
              Serving Maharashtra's farmers &amp; Members since 2009
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Shri Chhatrapati Shivaji Market Yard Adte Association represents Members
              operating from the Market Yard at Gultekdi, Pune. Our digital
              transformation initiative delivers transparent administration, faster complaint resolution
              and instant access to notices - all in Marathi and English.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {["Transparent complaint workflow", "Digital notice archive", "Bilingual EN / Marathi", "Verified Member accounts"].map((f) => (
                <div key={f} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-fresh" /> {f}
                </div>
              ))}
            </div>
            <Button asChild className="mt-8"><Link to="/about">Learn more about us <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          </div>
          <div className="relative">
            <img src={marketyardImg} alt="Market yard trading floor" width={1600} height={900} className="rounded-3xl shadow-xl object-cover aspect-[4/3]" />
            <div className="absolute -bottom-6 -left-6 hidden sm:block rounded-2xl bg-saffron px-5 py-4 shadow-xl">
              <div className="font-display text-2xl font-bold text-primary-dark">15+ years</div>
              <div className="text-xs font-semibold text-primary-dark/80">of trusted service</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("section.services")}</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-primary-dark sm:text-4xl">
              Everything a Member needs, in one portal
            </h2>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-2 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <Card key={s.title} className="border-border/60 transition hover:border-primary hover:shadow-lg">
                <CardContent className="p-2.5 text-center sm:p-6 sm:text-left">
                  <div className="mx-auto grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary sm:mx-0 sm:h-11 sm:w-11">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-2 font-display text-[11px] font-semibold leading-snug text-primary-dark sm:mt-4 sm:text-base">{s.title}</h3>
                  <p className="mt-1.5 hidden text-sm leading-relaxed text-muted-foreground sm:block">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Chairman */}
      <section className="bg-leaf py-16 md:py-20">
        <div className="container-page">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("section.chairman")}</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-primary-dark sm:text-4xl">{chairmanCopy.title}</h2>
          </div>
          <div className="mx-auto mt-10 max-w-6xl">
            {chairman && (
              <Card className="overflow-hidden border-border/60 shadow-sm">
                <CardContent className="grid gap-0 p-0 md:grid-cols-[minmax(0,54%)_minmax(0,46%)]">
                  <div className="relative min-h-[420px] bg-secondary sm:min-h-[500px] lg:min-h-[560px]">
                    <img
                      src={chairman.photo_url || sourabhKunjirImg}
                      alt={chairman.full_name}
                      className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
                    />
                    <div className="absolute left-5 top-5">
                      <Badge className="bg-saffron text-saffron-foreground hover:bg-saffron">{chairmanCopy.current}</Badge>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
                    <Badge variant="outline" className="w-fit border-primary text-primary">{chairmanCopy.role}</Badge>
                    <h3 className="mt-4 font-display text-3xl font-bold text-primary-dark sm:text-4xl">{chairmanCopy.name}</h3>
                    {chairmanCopy.secondaryName && <div className="mt-1 text-base text-muted-foreground">{chairmanCopy.secondaryName}</div>}
                    {chairman.term_label && <div className="mt-3 text-sm font-semibold text-primary">{chairmanCopy.term}: {chairman.term_label}</div>}
                    <p className="mt-5 text-base leading-relaxed text-foreground/80">
                      {chairmanCopy.intro}
                    </p>
                    <p className="mt-5 border-l-4 border-saffron pl-4 text-base leading-relaxed text-foreground/80 italic">
                      "{chairmanCopy.quote}"
                    </p>
                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                      {chairmanCopy.focus.map((item) => (
                        <div key={item} className="rounded-lg bg-secondary/55 px-4 py-3 text-sm font-semibold text-primary-dark">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Committee */}
          <div className="mt-14">
            <h3 className="font-display text-2xl font-bold text-primary-dark">{t("section.committee")}</h3>
            <div className="mt-6 grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3">
              {committeeMembers.slice(0, 8).map((m) => (
                <Card key={m.id} className="overflow-hidden border-border/60 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <CardContent className="px-1.5 py-3 sm:px-4">
                    <div className="mx-auto grid h-20 w-20 place-items-center overflow-hidden rounded-full border-4 border-white bg-secondary font-display text-lg font-bold text-primary shadow-md ring-1 ring-border sm:h-40 sm:w-40 sm:text-2xl">
                      <CommitteeAvatar member={m} />
                    </div>
                    <h4 className="mt-2 font-display text-xs font-semibold leading-snug text-primary-dark sm:text-base">{displayCommitteeName(m)}</h4>
                    {lang === "en" && m.name_mr && <div className="mt-0.5 text-[10px] leading-tight text-muted-foreground sm:text-xs">{m.name_mr}</div>}
                    <div className="mt-1.5 inline-flex max-w-full rounded-full bg-secondary px-1.5 py-1 text-[9px] font-semibold leading-tight text-primary sm:px-3 sm:text-xs">{displayCommitteeDesignation(m)}</div>
                    {m.gala_number && <div className="mt-1.5 text-xs font-medium text-muted-foreground">Gala {m.gala_number}</div>}
                  </CardContent>
                </Card>
              ))}
              {committee.length === 0 && <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">No committee members published yet.</div>}
            </div>
          </div>
        </div>
      </section>

      {/* Daily market prices */}
      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">आजचे बाजार भाव</span>
              <h2 className="mt-3 font-display text-3xl font-bold text-primary-dark sm:text-4xl">Daily Market Prices</h2>
              <p className="mt-3 text-sm text-muted-foreground">Latest published vegetable and fruit rates from the market yard.</p>
            </div>
            <Button asChild variant="outline"><Link to="/market-prices">View All Market Prices <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {prices.slice(0, 8).map((price) => (
              <Card key={price.item_id} className="border-border/60 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Badge variant="secondary" className="capitalize">{price.category}</Badge>
                      <h3 className="mt-3 font-display text-lg font-bold leading-snug text-primary-dark">{price.name_en}</h3>
                      <div className="text-sm text-muted-foreground">{price.name_mr}</div>
                    </div>
                    <IndianRupee className="h-9 w-9 shrink-0 rounded-lg bg-primary p-2 text-white" />
                  </div>
                  <div className="mt-5 font-display text-2xl font-bold text-primary-dark">
                    ₹{price.min_price} - ₹{price.max_price}
                    <span className="ml-1 text-sm font-semibold text-muted-foreground">/ {price.unit}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Average ₹{price.modal_price}</span>
                    <span className={price.change_direction === "up" ? "font-semibold text-success" : price.change_direction === "down" ? "font-semibold text-destructive" : "text-muted-foreground"}>
                      {price.change_amount === null ? "New" : price.change_direction === "up" ? `↑ ₹${price.change_amount}` : price.change_direction === "down" ? `↓ ₹${Math.abs(price.change_amount)}` : "— ₹0"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {prices.length === 0 && <div className="rounded-lg border bg-background p-8 text-center text-sm text-muted-foreground sm:col-span-2 lg:col-span-4">Today's market prices have not been published yet. Please check again shortly.</div>}
          </div>
        </div>
      </section>

      {/* Market updates */}
      <section className="bg-leaf py-16 md:py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("section.updates")}</span>
              <h2 className="mt-3 font-display text-3xl font-bold text-primary-dark sm:text-4xl">Fresh from the market floor</h2>
            </div>
            <Button asChild variant="outline"><Link to="/updates">View all updates <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {updates.slice(0, 6).map((u) => (
              <Card key={u.id} className="border-border/60 transition hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-secondary text-primary-dark">{u.parsed?.category || "General"}</Badge>
                  </div>
                  <h3 className="mt-3 font-display font-semibold text-primary-dark line-clamp-2">
                    {u.title_en}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{u.parsed?.details || ""}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(u.published_at || u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {updates.length === 0 && <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground md:col-span-2 lg:col-span-3">No market updates yet.</div>}
          </div>
        </div>
      </section>

      {/* Notices */}
      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("section.notices")}</span>
              <h2 className="mt-3 font-display text-3xl font-bold text-primary-dark sm:text-4xl">Latest official notices</h2>
            </div>
            <Button asChild variant="outline"><Link to="/notices">View all notices <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {notices.slice(0, 4).map((n) => (
              <Card key={n.id} className="border-border/60">
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="border-primary/40 text-primary">{n.parsed?.category || "Notice"}</Badge>
                    <span>Notice #{n.id}</span>
                    <span>- {new Date(n.published_at || n.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                  <h3 className="mt-3 font-display font-semibold text-primary-dark">{n.title_en}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{n.parsed?.details || ""}</p>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedNotice(n)}><FileText className="h-4 w-4 mr-1" /> View</Button>
                    <Button size="sm" className="bg-saffron text-saffron-foreground hover:bg-saffron/90" onClick={() => downloadNotice(n)}><Download className="h-4 w-4 mr-1" /> Download</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {notices.length === 0 && <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground md:col-span-2">No notices yet.</div>}
          </div>
        </div>
      </section>

      <Dialog open={!!selectedNotice} onOpenChange={(open) => !open && setSelectedNotice(null)}>
        <DialogContent className="max-w-2xl">
          {selectedNotice && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-primary/40 text-primary">{selectedNotice.parsed?.category || "Notice"}</Badge>
                  <span className="text-xs font-medium text-muted-foreground">
                    {new Date(selectedNotice.published_at || selectedNotice.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <DialogTitle className="pt-2 font-display text-2xl text-primary-dark">{selectedNotice.title_en}</DialogTitle>
                <DialogDescription>{selectedNotice.parsed?.details || selectedNotice.content_en || ""}</DialogDescription>
              </DialogHeader>
              <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
                <Button variant="outline" onClick={() => setSelectedNotice(null)}>Close</Button>
                <Button className="bg-saffron text-saffron-foreground hover:bg-saffron/90" onClick={() => downloadNotice(selectedNotice)}><Download className="mr-1 h-4 w-4" /> Download</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* How it works */}
      <section className="bg-leaf py-16 md:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("section.how")}</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-primary-dark sm:text-4xl">Five simple steps</h2>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
            {HOW_STEPS.map((s) => (
              <div key={s.n} className={`relative rounded-2xl border border-border bg-card px-3 pb-4 pt-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${s.n === 5 ? "col-span-2 mx-auto w-1/2 min-w-[150px] md:col-span-1 md:w-auto md:min-w-0" : ""}`}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 grid h-8 w-8 place-items-center rounded-full saffron-gradient font-display text-sm font-bold text-primary-dark shadow">
                  {s.n}
                </div>
                <div className="mx-auto mt-2 grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary sm:h-12 sm:w-12">
                  <s.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h4 className="mt-3 font-display text-sm font-semibold leading-snug text-primary-dark sm:text-base">{s.title}</h4>
                <p className="mt-1.5 line-clamp-3 text-[10px] leading-relaxed text-muted-foreground sm:text-xs">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("section.gallery")}</span>
              <h2 className="mt-3 font-display text-3xl font-bold text-primary-dark sm:text-4xl">Moments from the market yard</h2>
            </div>
            <Button asChild variant="outline"><Link to="/gallery">Open gallery <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          </div>
          <div className="mt-10 grid gap-4 grid-cols-2 md:grid-cols-3">
            {gallery.slice(0, 6).map((item) => {
              const image = item.attachments?.find((file) => file.attachment_type === "image");
              return (
              <div key={item.id} className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
                {image && <img src={`/api/v1/public/content-attachments/${image.id}/download`} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/55 via-primary-dark/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-saffron">
                    <Camera className="h-3.5 w-3.5" /> Photo
                  </div>
                  <div className="mt-1 font-display font-semibold">{item.title_en}</div>
                </div>
              </div>
            )})}
            {gallery.length === 0 && <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground md:col-span-3">No gallery items yet.</div>}
          </div>
        </div>
      </section>

      {/* Public reviews */}
      <section className="bg-leaf py-16 md:py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Portal reviews</span>
              <h2 className="mt-3 font-display text-3xl font-bold text-primary-dark sm:text-4xl">Portal Feedback</h2>
              <p className="mt-3 text-sm text-muted-foreground">Approved feedback from Members and customers.</p>
            </div>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.slice(0, 6).map((review) => (
              <Card key={review.id} className="border-border/60 shadow-sm">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex text-saffron">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`h-4 w-4 ${star <= review.rating_value ? "fill-current" : ""}`} />
                      ))}
                    </div>
                    <Badge variant="outline" className="capitalize">{review.reviewer_type}</Badge>
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/80">{review.review_text}</p>
                  {review.attachments && review.attachments.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {review.attachments.map((file) => (
                        <Button key={file.id} size="sm" variant="outline" onClick={() => window.open(`/api/v1/public/rating-attachments/${file.id}/download`, "_blank", "noopener,noreferrer")}>
                          <Eye className="mr-1 h-4 w-4" /> {file.attachment_type === "image" ? "View image" : "View video"}
                        </Button>
                      ))}
                    </div>
                  )}
                  <div className="mt-5 rounded-lg bg-secondary/40 p-3">
                    <div className="font-display font-semibold leading-snug text-primary-dark">{review.reviewer_name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {review.reviewer_type === "customer" ? `${review.customer_code || "Customer"} via ` : ""}
                      {review.business_name || review.trader_name} - Gala {review.gala_number || "-"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {reviews.length === 0 && <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground md:col-span-2 lg:col-span-3">No portal reviews reshared yet.</div>}
          </div>
        </div>
      </section>

      {/* Complaint feedback */}
      <section className="py-14 md:py-16">
        <div className="container-page">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-primary-dark sm:text-4xl">Member Complaint Resolution Reviews</h2>
            <div className="mt-2 flex justify-center text-saffron">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-2 text-sm font-medium text-muted-foreground">Feedback shared by members after their complaints were resolved.</p>
          </div>

          <div className="mx-auto mt-9 max-w-6xl px-10">
            {complaintFeedback.length > 0 ? (
              <Carousel setApi={setComplaintFeedbackApi} opts={{ align: "start", loop: complaintFeedback.length > 1 }} className="w-full">
                <CarouselContent>
                  {complaintFeedback.map((item) => (
                    <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                      <Card className="h-full overflow-hidden border-border/60 bg-background shadow-md transition hover:-translate-y-1 hover:shadow-xl">
                        <CardContent className="flex min-h-[250px] flex-col items-center p-6 text-center">
                          <div className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary-dark">
                            {item.category || "Resolved Complaint"}
                          </div>
                          <div className="mt-4 flex text-saffron">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className={`h-4 w-4 ${star <= Number(item.rating || 0) ? "fill-current" : ""}`} />
                            ))}
                          </div>
                          <p className="mt-5 line-clamp-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                            {item.comment}
                          </p>
                          <div className="mt-5 rounded-full bg-secondary px-5 py-2 font-display text-sm font-bold capitalize text-primary">
                            {item.reaction?.replace(/_/g, " ") || "Resolved"}
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 border-primary/20 bg-background text-primary shadow-sm hover:bg-primary hover:text-primary-foreground" />
                <CarouselNext className="right-0 border-primary/20 bg-background text-primary shadow-sm hover:bg-primary hover:text-primary-foreground" />
              </Carousel>
            ) : (
              <div className="rounded-lg border bg-background p-8 text-center text-sm text-muted-foreground">No approved complaint feedback yet.</div>
            )}
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="hero-gradient rounded-3xl px-6 py-14 md:px-14 md:py-16 text-center text-white shadow-xl">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold sm:text-4xl">
              Ready to join Maharashtra's most connected market yard?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/80">
              Register your gala today and unlock secure access to updates, notices, complaints and administration.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-saffron text-saffron-foreground hover:bg-saffron/90">
                <Link to="/register">Register Your Gala</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white hover:text-primary-dark">
                <Link to="/login">Members</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

