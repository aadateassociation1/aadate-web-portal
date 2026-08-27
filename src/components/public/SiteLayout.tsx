import { Link, useRouterState } from "@/lib/simple-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Menu, X,
  Clock, Mail,
  Facebook, Twitter, Youtube, MapPin, ChevronRight,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import logoSrc from "@/assets/logo.png";

const NAV = [
  { to: "/", key: "nav.home" as const },
  { to: "/about", key: "nav.about" as const },
  { to: "/chairman", key: "nav.chairman" as const },
  { to: "/market-prices", key: "nav.marketPrices" as const },
  { to: "/updates", key: "nav.updates" as const },
  { to: "/notices", key: "nav.notices" as const },
  { to: "/gallery", key: "nav.gallery" as const },
  { to: "/contact", key: "nav.contact" as const },
];

const ASSOCIATION_NAME = "Shri Chhatrapati Shivaji Market Yard Adte Association";
const ASSOCIATION_REGISTRATION = "Registration No.: Maharashtra-1026/2013";
const ASSOCIATION_PTR = "P.T.R. No.: F. 41841 / Pune";
const ASSOCIATION_ADDRESS = "First Floor, Pan Bazar Building, Shri Chhatrapati Shivaji Market Yard Adte Association Hall, Gultekdi, Pune - 411037.";
const ASSOCIATION_EMAIL = "aadateassociation1@gmail.com";

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
          <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {ASSOCIATION_EMAIL}</span>
          <span className="hidden md:inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {ASSOCIATION_REGISTRATION}</span>
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
        <Link to="/" className="flex min-w-0 shrink items-center sm:min-w-[220px] xl:shrink-0">
          <img
            src={logoSrc}
            alt={ASSOCIATION_NAME}
            className="h-12 w-auto max-w-[190px] object-contain sm:h-14 sm:max-w-[230px]"
          />
        </Link>

        <nav className="mx-auto hidden min-w-0 items-center justify-center gap-0.5 xl:flex">
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
  const { t, lang } = useI18n();
  const ideationPrefix = lang === "mr" ? "\u0938\u0902\u0915\u0932\u094d\u092a\u0928\u093e" : "Ideation by";
  const chairmanLine = "Chaiman of Shri Chhatrapati Shivaji Market Yard Adte Association";
  return (
    <footer className="mt-16 bg-primary-dark text-white/90">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="mb-3">
            <img
              src={logoSrc}
              alt={ASSOCIATION_NAME}
              className="h-14 w-auto max-w-[230px] rounded bg-white p-1.5 object-contain"
            />
          </div>
          <p className="text-sm leading-relaxed text-white/70">
            {ASSOCIATION_REGISTRATION}<br />
            {ASSOCIATION_PTR}
          </p>
          <div className="mt-4 flex gap-3">
            <a className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-saffron hover:text-primary-dark"><Facebook className="h-4 w-4" /></a>
            <a className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-saffron hover:text-primary-dark"><Twitter className="h-4 w-4" /></a>
            <a className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-saffron hover:text-primary-dark"><Youtube className="h-4 w-4" /></a>
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
            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-saffron" /> {ASSOCIATION_ADDRESS}</li>
            <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-saffron" /> {ASSOCIATION_EMAIL}</li>
            <li className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-saffron" /> {ASSOCIATION_REGISTRATION}</li>
            <li className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-saffron" /> {ASSOCIATION_PTR}</li>
            <li className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-saffron" /> Mon-Sat, 8 AM - 6 PM</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        {/* Permanent portal credit: do not change this name for the lifetime of this portal. */}
        <div className="container-page py-5 text-center">
          <div className="font-display text-2xl font-bold text-white sm:text-3xl">
            {ideationPrefix} <span className="text-saffron">Sourabh Kunjir</span>
          </div>
          <div className="mt-1 text-sm font-medium text-white/70 sm:text-base">
            {chairmanLine}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-center gap-2 py-4 text-center text-xs text-white/60">
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
        </div>
      </div>
    </footer>
  );
}

function ScrollTopFAB() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 320);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-24 right-5 z-50 grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl transition hover:scale-105 hover:bg-primary/90 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollTopFAB />
    </div>
  );
}
