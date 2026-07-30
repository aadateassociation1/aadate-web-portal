import { createFileRoute, Link } from "@/lib/simple-router";
import { SiteLayout } from "@/components/public/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight, Bell, ClipboardList, Download, FileText, Newspaper, Phone,
  UserCog, MessageSquare, TrendingUp, Users, Clock, ShieldCheck,
  CheckCircle2, UserPlus, LogIn, FolderCheck, Sparkles, Camera,
} from "lucide-react";
import heroImg from "@/assets/market-hero.jpg";
import sourabhKunjirImg from "@/assets/sourabh kunjir.jpeg";
import { useI18n } from "@/lib/i18n";
import {
  MARKET_UPDATES, NOTICES, CURRENT_CHAIRMAN, LOBBY_CHAIRMAN, COMMITTEE,
} from "@/lib/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VPP Market Yard — Digital Portal for Traders" },
      { name: "description", content: "Connecting 850+ traders with market yard administration. Market updates, notices, complaints, official documents." },
      { property: "og:title", content: "VPP Market Yard — Digital Portal for Traders" },
      { property: "og:description", content: "Secure digital platform for traders of Vishal Purandhar Patasanstha Market Yard." },
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
  const ticker = MARKET_UPDATES.slice(0, 6);
  const updates = MARKET_UPDATES.slice(0, 6);
  const notices = NOTICES.slice(0, 4);

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
                  {lang === "mr" ? u.titleMr : u.title}
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
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/70 via-primary/30 to-primary-fresh/10" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/45 via-transparent to-white/10" aria-hidden />
        <div className="container-page relative grid gap-10 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-saffron/40 bg-saffron/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-saffron">
              <ShieldCheck className="h-3.5 w-3.5" /> Official Association Portal
            </span>
            <h1 className="mt-5 font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mt-5 max-w-xl text-base sm:text-lg text-white/85">
              {t("hero.sub")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-saffron text-saffron-foreground hover:bg-saffron/90">
                <Link to="/login">{t("hero.cta.login")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white hover:text-primary-dark">
                <Link to="/register">{t("hero.cta.register")}</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/10">
                <Link to="/updates">{t("hero.cta.updates")}</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, val: "850+", label: t("stats.owners") },
                { icon: Newspaper, val: "1", label: t("stats.portal") },
                { icon: Clock, val: "24/7", label: t("stats.access") },
                { icon: TrendingUp, val: "Fast", label: t("stats.resolution") },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                  <s.icon className="h-6 w-6 text-saffron" />
                  <div className="mt-3 font-display text-3xl font-bold text-white">{s.val}</div>
                  <div className="mt-1 text-xs text-white/80 leading-snug">{s.label}</div>
                </div>
              ))}
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
              Serving Maharashtra's farmers &amp; traders since 2009
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Vishal Purandhar Patasanstha Market Yard Owners Association represents over 850 traders
              operating across vegetable, fruit, grain, flower and agricultural sections. Our digital
              transformation initiative delivers transparent administration, faster complaint resolution
              and instant access to notices — all in Marathi and English.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {["Transparent complaint workflow", "Digital notice archive", "Bilingual EN / मराठी", "Verified trader accounts"].map((f) => (
                <div key={f} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-fresh" /> {f}
                </div>
              ))}
            </div>
            <Button asChild className="mt-8"><Link to="/about">Learn more about us <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          </div>
          <div className="relative">
            <img src={heroImg} alt="Market yard trading floor" width={1600} height={900} className="rounded-3xl shadow-xl object-cover aspect-[4/3]" />
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
              Everything a trader needs, in one portal
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <Card key={s.title} className="border-border/60 transition hover:border-primary hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display font-semibold text-primary-dark">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Chairman & Lobby chairman */}
      <section className="bg-cream py-16 md:py-20">
        <div className="container-page">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("section.chairman")}</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-primary-dark sm:text-4xl">Leadership</h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-5xl justify-center gap-10 md:grid-cols-[minmax(0,460px)_minmax(0,460px)] lg:gap-14">
            <Card className="overflow-hidden border-border/60">
              <div className="relative h-72 bg-secondary sm:h-80">
                <img
                  src={sourabhKunjirImg}
                  alt="Sourabh Kunjir"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute left-5 top-5">
                  <Badge className="bg-saffron text-saffron-foreground hover:bg-saffron">Current Chairman</Badge>
                </div>
              </div>
              <CardContent className="p-6 sm:p-8">
                <h3 className="font-display text-2xl font-bold text-primary-dark">{CURRENT_CHAIRMAN.name}</h3>
                <div className="text-sm text-muted-foreground">{CURRENT_CHAIRMAN.nameMr}</div>
                <div className="mt-1 text-xs font-semibold text-primary">Term: {CURRENT_CHAIRMAN.term}</div>
                <p className="mt-3 text-sm text-foreground/80 leading-relaxed italic">
                  "{CURRENT_CHAIRMAN.message}"
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-border/60">
              <div className="grid h-72 place-items-center bg-secondary sm:h-80">
                <div className="grid h-36 w-36 place-items-center rounded-3xl bg-background font-display text-4xl font-bold text-primary shadow-md">AD</div>
              </div>
              <CardContent className="p-6 sm:p-8">
                <Badge variant="outline" className="border-primary text-primary">Lobby Chairman</Badge>
                <h3 className="mt-2 font-display text-2xl font-bold text-primary-dark">{LOBBY_CHAIRMAN.name}</h3>
                <p className="mt-3 text-sm text-foreground/80 leading-relaxed">{LOBBY_CHAIRMAN.intro}</p>
              </CardContent>
            </Card>
          </div>

          {/* Committee */}
          <div className="mt-14">
            <h3 className="font-display text-2xl font-bold text-primary-dark">{t("section.committee")}</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {COMMITTEE.slice(2).map((m) => (
                <Card key={m.id} className="border-border/60 text-center">
                  <CardContent className="p-5">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary font-display text-lg font-bold text-primary">
                      {m.name.split(" ").slice(-1)[0][0]}
                    </div>
                    <h4 className="mt-3 font-semibold text-primary-dark">{m.name}</h4>
                    <div className="text-xs text-primary font-medium">{m.designation}</div>
                    {m.gala && <div className="mt-1 text-xs text-muted-foreground">Gala {m.gala}</div>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Market updates */}
      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("section.updates")}</span>
              <h2 className="mt-3 font-display text-3xl font-bold text-primary-dark sm:text-4xl">Fresh from the market floor</h2>
            </div>
            <Button asChild variant="outline"><Link to="/updates">View all updates <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {updates.map((u) => (
              <Card key={u.id} className="border-border/60 transition hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-secondary text-primary-dark">{u.category}</Badge>
                    {u.emergency && <Badge className="bg-destructive text-white">Emergency</Badge>}
                    {u.featured && <Badge className="bg-saffron text-saffron-foreground">Featured</Badge>}
                  </div>
                  <h3 className="mt-3 font-display font-semibold text-primary-dark line-clamp-2">
                    {lang === "mr" ? u.titleMr : u.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{u.summary}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(u.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                    <span>{u.views} views</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Notices */}
      <section className="bg-leaf py-16 md:py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("section.notices")}</span>
              <h2 className="mt-3 font-display text-3xl font-bold text-primary-dark sm:text-4xl">Latest official notices</h2>
            </div>
            <Button asChild variant="outline"><Link to="/notices">View all notices <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {notices.map((n) => (
              <Card key={n.id} className="border-border/60">
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="border-primary/40 text-primary">{n.category}</Badge>
                    <span>Notice #{n.number}</span>
                    <span>· {new Date(n.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                  <h3 className="mt-3 font-display font-semibold text-primary-dark">{n.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{n.description}</p>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline"><FileText className="h-4 w-4 mr-1" /> View</Button>
                    <Button size="sm" className="bg-primary"><Download className="h-4 w-4 mr-1" /> Download</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("section.how")}</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-primary-dark sm:text-4xl">Five simple steps</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3 lg:grid-cols-5">
            {HOW_STEPS.map((s) => (
              <div key={s.n} className="relative rounded-2xl border border-border bg-card p-6 text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 grid h-9 w-9 place-items-center rounded-full saffron-gradient font-display font-bold text-primary-dark shadow">
                  {s.n}
                </div>
                <div className="mx-auto mt-3 grid h-12 w-12 place-items-center rounded-xl bg-secondary text-primary">
                  <s.icon className="h-6 w-6" />
                </div>
                <h4 className="mt-4 font-display font-semibold text-primary-dark">{s.title}</h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      <section className="bg-cream py-16 md:py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("section.gallery")}</span>
              <h2 className="mt-3 font-display text-3xl font-bold text-primary-dark sm:text-4xl">Moments from the market yard</h2>
            </div>
            <Button asChild variant="outline"><Link to="/gallery">Open gallery <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          </div>
          <div className="mt-10 grid gap-4 grid-cols-2 md:grid-cols-3">
            {GALLERY_TILES.map((label, i) => (
              <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${heroImg})`, filter: `hue-rotate(${i * 25}deg)` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/85 via-primary-dark/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-saffron">
                    <Camera className="h-3.5 w-3.5" /> Photo
                  </div>
                  <div className="mt-1 font-display font-semibold">{label}</div>
                </div>
              </div>
            ))}
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
                <Link to="/login">Traders</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
