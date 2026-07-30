import { Link, useRouterState } from "@/lib/simple-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Menu, X,
  Clock, Mail, MessageCircle, Phone, Sprout,
  Facebook, Twitter, Youtube, MapPin, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

const NAV = [
  { to: "/", key: "nav.home" as const },
  { to: "/about", key: "nav.about" as const },
  { to: "/chairman", key: "nav.chairman" as const },
  { to: "/updates", key: "nav.updates" as const },
  { to: "/notices", key: "nav.notices" as const },
  { to: "/gallery", key: "nav.gallery" as const },
  { to: "/contact", key: "nav.contact" as const },
];

function LangSwitcher({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { lang, setLang } = useI18n();
  const isLight = tone === "light";
  const active = isLight ? "bg-saffron text-saffron-foreground" : "bg-saffron text-saffron-foreground";
  const inactive = isLight ? "text-foreground/70 hover:bg-secondary hover:text-primary" : "text-white/90 hover:bg-white/10";
  const border = isLight ? "border-border bg-background shadow-sm" : "border-white/30";

  return (
    <div className={`inline-flex overflow-hidden rounded-full border text-xs font-semibold ${border}`} aria-label="Language selector">
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1.5 transition ${lang === "en" ? active : inactive}`}
        aria-label="English"
      >
        English
      </button>
      <button
        onClick={() => setLang("mr")}
        className={`px-3 py-1.5 transition ${lang === "mr" ? active : inactive}`}
        aria-label="Marathi"
      >
        {"\u092e\u0930\u093e\u0920\u0940"}
      </button>
    </div>
  );
}


function TopBar() {
  const { lang } = useI18n();
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="hero-gradient text-white/90 text-xs">
      <div className="container-page flex flex-wrap items-center justify-between gap-2 py-2">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> +91 20 2645 1122</span>
          <span className="hidden sm:inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> office@vpp-marketyard.in</span>
          <span className="hidden md:inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Mon-Sat, 8 AM - 6 PM</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">{now.toLocaleString(lang === "mr" ? "mr-IN" : "en-IN", { dateStyle: "medium", timeStyle: "medium" })}</span>
        </div>
      </div>
    </div>
  );
}

function Header() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  const dashLink =
    user?.role === "main_admin" ? "/admin" :
    user?.role === "user_admin" ? "/admin" :
    user?.role === "owner" ? "/owner" : null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 shadow-sm backdrop-blur-sm">
      <div className="container-page flex min-h-[66px] items-center gap-3 py-2 xl:gap-5">
        <Link to="/" className="flex min-w-0 shrink items-center gap-2.5 sm:min-w-[250px] xl:shrink-0">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl saffron-gradient shadow-sm sm:h-12 sm:w-12">
            <Sprout className="h-6 w-6 text-primary-dark" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <div className="truncate font-display text-sm font-bold leading-tight text-primary-dark sm:text-base">
              {t("assoc.name")}
            </div>
            <div className="truncate text-[11px] font-medium leading-tight text-muted-foreground">
              {t("assoc.short")}
            </div>
          </div>
        </Link>

        <nav className="ml-auto hidden min-w-0 items-center justify-end gap-0.5 xl:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium text-foreground/75 transition hover:bg-secondary hover:text-primary xl:px-3"
              activeProps={{ className: "whitespace-nowrap rounded-md bg-secondary px-2.5 py-2 text-sm font-semibold text-primary xl:px-3" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {t(n.key)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 xl:ml-2">
          <div className="hidden sm:inline-flex">
            <LangSwitcher tone="light" />
          </div>
          {dashLink ? (
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to={dashLink}>Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                <Link to="/login">{t("nav.login")}</Link>
              </Button>
              <Button asChild size="sm" className="hidden sm:inline-flex bg-saffron text-saffron-foreground hover:bg-saffron/90">
                <Link to="/register">{t("nav.register")}</Link>
              </Button>
            </>
          )}
          <button
            onClick={() => setOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-md border border-border text-foreground xl:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-background xl:hidden">
          <div className="container-page grid gap-1 py-3">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-secondary">
                {t(n.key)}
              </Link>
            ))}
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {dashLink ? (
                <Button asChild className="flex-1"><Link to={dashLink}>Dashboard</Link></Button>
              ) : (
                <>
                  <Button asChild variant="outline"><Link to="/login">{t("nav.login")}</Link></Button>
                  <Button asChild className="bg-saffron text-saffron-foreground hover:bg-saffron/90"><Link to="/register">{t("nav.register")}</Link></Button>
                </>
              )}
            </div>
            <div className="mt-2">
              <LangSwitcher tone="light" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-16 bg-primary-dark text-white/90">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl saffron-gradient">
              <Sprout className="h-6 w-6 text-primary-dark" strokeWidth={2.5} />
            </div>
            <div className="font-display font-bold text-white">{t("assoc.short")}</div>
          </div>
          <p className="text-sm text-white/70 leading-relaxed">
            Serving 850+ traders with transparent digital administration since 2009.
          </p>
          <div className="mt-4 flex gap-3">
            <a className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-saffron hover:text-primary-dark transition"><Facebook className="h-4 w-4" /></a>
            <a className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-saffron hover:text-primary-dark transition"><Twitter className="h-4 w-4" /></a>
            <a className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-saffron hover:text-primary-dark transition"><Youtube className="h-4 w-4" /></a>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-saffron">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="inline-flex items-center gap-1 text-white/70 hover:text-white">
                  <ChevronRight className="h-3.5 w-3.5" /> {t(n.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-saffron">Services</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>Daily Market Updates</li>
            <li>Raise a Complaint</li>
            <li>Download Notices</li>
            <li>Mobile Number Change</li>
            <li>Portal Guidelines</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-saffron">Contact</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-saffron" /> Market Yard Road, Saswad, Purandar, Pune 412301</li>
            <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-saffron" /> +91 20 2645 1122</li>
            <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-saffron" /> office@vpp-marketyard.in</li>
            <li className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-saffron" /> Mon-Sat, 8 AM - 6 PM</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-4 text-xs text-white/60 sm:flex-row">
          <div>
            © 2026 {t("assoc.name")}. {t("footer.rights")} By{" "}
            <a
              href="https://webakoof.com"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-saffron hover:text-saffron/80"
            >
              Webakoof
            </a>
          </div>
          {/* Permanent portal credit: do not change this name for the lifetime of this portal. */}
          <div>Portal designed by <span className="text-saffron font-semibold">Sourbh Kunjir</span></div>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppFAB() {
  return (
    <a
      href="https://wa.me/912026451122"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl hover:scale-105 transition"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
