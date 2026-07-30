import { Link, useRouter, useRouterState } from "@/lib/simple-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard, User, FileText, Bell, MessageSquare, Phone, ImagePlus, LifeBuoy,
  Lock, LogOut, Menu, X, Sprout, Users, ClipboardList, Newspaper, FileStack,
  ShieldAlert, ChartBar, Home, Store, IdCard,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const OWNER_NAV = [
  { to: "/owner", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/owner/profile", label: "My Profile", icon: User },
  { to: "/owner/gala", label: "My Gala Details", icon: Store },
  { to: "/owner/updates", label: "Market Updates", icon: Newspaper },
  { to: "/owner/notices", label: "Notices & Documents", icon: FileText },
  { to: "/owner/complaints", label: "My Complaints", icon: MessageSquare },
  { to: "/owner/new-complaint", label: "Raise Complaint", icon: ClipboardList },
  { to: "/owner/kyc", label: "Customer KYC", icon: IdCard },
  { to: "/owner/post", label: "Submit Post", icon: ImagePlus },
  { to: "/owner/shared-posts", label: "Shared Posts", icon: Newspaper },
  { to: "/owner/mobile-change", label: "Mobile Number Change", icon: Phone },
  { to: "/owner/notifications", label: "Notifications", icon: Bell },
];

const ADMIN_NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/users", label: "Trader Management", icon: Users },
  { to: "/admin/registrations", label: "Registration Approvals", icon: ClipboardList },
  { to: "/admin/complaints", label: "Complaint Management", icon: MessageSquare },
  { to: "/admin/posts", label: "Owner Posts", icon: ImagePlus },
  { to: "/admin/gallery", label: "Gallery Management", icon: ImagePlus },
  { to: "/admin/updates", label: "Market Updates", icon: Newspaper },
  { to: "/admin/notices", label: "Notices & Documents", icon: FileStack },
  { to: "/admin/mobile-requests", label: "Mobile Change Requests", icon: Phone },
  { to: "/admin/committee", label: "Chairman & Committee", icon: Users },
  { to: "/admin/reports", label: "Reports & Analytics", icon: ChartBar },
  { to: "/admin/audit", label: "Audit Logs", icon: ShieldAlert },
];

interface Props {
  kind: "owner" | "admin";
  children: ReactNode;
}

function HeaderLangSwitcher() {
  const { lang, setLang } = useI18n();
  const active = "bg-primary text-primary-foreground";
  const inactive = "text-muted-foreground hover:bg-secondary hover:text-foreground";

  return (
    <div className="inline-flex shrink-0 overflow-hidden rounded-full border border-border bg-background text-xs font-semibold" aria-label="Language selector">
      <button
        onClick={() => setLang("en")}
        className={`px-2.5 py-1.5 transition sm:px-3 ${lang === "en" ? active : inactive}`}
        aria-label="English"
      >
        <span className="sm:hidden">EN</span>
        <span className="hidden sm:inline">English</span>
      </button>
      <button
        onClick={() => setLang("mr")}
        className={`px-2.5 py-1.5 transition sm:px-3 ${lang === "mr" ? active : inactive}`}
        aria-label="Marathi"
      >
        <span className="sm:hidden">MR</span>
        <span className="hidden sm:inline">{"\u092e\u0930\u093e\u0920\u0940"}</span>
      </button>
    </div>
  );
}

export function DashLayout({ kind, children }: Props) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (loading) return;
    if (!user) { router.navigate({ to: "/login" }); return; }
    if (kind === "owner" && user.role !== "owner") { router.navigate({ to: "/admin" }); }
    if (kind === "admin" && user.role === "owner") { router.navigate({ to: "/owner" }); }
  }, [user, loading, kind, router]);

  if (loading || !user) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading...</div>;
  }

  const nav = kind === "owner" ? OWNER_NAV : ADMIN_NAV;
  const title = kind === "owner" ? "Trader Portal" : user.role === "main_admin" ? "Main Admin Portal" : "User Admin Portal";
  const helpLink = kind === "owner" ? "/owner/help" : "/admin/help";
  const passwordLink = kind === "owner" ? "/owner/change-password" : "/admin/change-password";

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
    router.navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-muted/40">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[min(18rem,86vw)] shrink-0 flex-col overflow-hidden bg-sidebar text-sidebar-foreground transition-transform lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-sidebar-border px-5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg saffron-gradient">
            <Sprout className="h-5 w-5 text-primary-dark" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <div className="font-display truncate text-sm font-bold text-white">VPP Market Yard</div>
            <div className="truncate text-[11px] text-sidebar-foreground/70">{title}</div>
          </div>
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto p-3 space-y-0.5">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to) && n.to !== "/owner" && n.to !== "/admin";
            const activeExact = n.exact && pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex min-h-10 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${active || activeExact ? "bg-saffron text-saffron-foreground" : "text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-white"}`}
              >
                <n.icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{n.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="shrink-0 border-t border-sidebar-border p-3 space-y-0.5">
          <Link to={helpLink} className={`flex min-h-10 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${pathname === helpLink ? "bg-saffron text-saffron-foreground" : "text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-white"}`}>
            <LifeBuoy className="h-4 w-4" /> Help & Support
          </Link>
          <Link to={passwordLink} className={`flex min-h-10 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${pathname === passwordLink ? "bg-saffron text-saffron-foreground" : "text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-white"}`}>
            <Lock className="h-4 w-4" /> Change Password
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-sidebar-foreground/85 hover:bg-destructive hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex min-h-16 items-center gap-2 border-b border-border bg-background px-3 py-2 sm:gap-3 sm:px-6">
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden grid h-10 w-10 place-items-center rounded-md border border-border"
            aria-label="Toggle sidebar"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="min-w-0 flex-1">
            <div className="text-sm text-muted-foreground">{title}</div>
            <div className="truncate font-display text-base font-semibold text-foreground">
              Welcome back, {user.name}
            </div>
          </div>
          <Badge variant="secondary" className="hidden sm:inline-flex bg-secondary text-primary-dark">
            {user.role === "main_admin" ? "Main Admin" : user.role === "user_admin" ? "User Admin" : "Trader"}
          </Badge>
          <HeaderLangSwitcher />
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex shrink-0">
            <Link to="/"><Home className="h-4 w-4 mr-1" /><span className="hidden md:inline">Public Site</span><span className="md:hidden">Site</span></Link>
          </Button>
        </header>
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
