import { Link, useRouter, useRouterState } from "@/lib/simple-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  LayoutDashboard, User, FileText, Bell, MessageSquare, Phone, ImagePlus, LifeBuoy,
  Lock, LogOut, Menu, X, Users, ClipboardList, Newspaper, FileStack,
  ShieldAlert, ChartBar, Home, Store, IdCard, Star, IndianRupee,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { installNotificationSoundUnlock, playNotificationTone, unlockNotificationSound } from "@/lib/notification-sound";
import { canUseWebPush, enableWebPush, getPushStatus, sendTestWebPush } from "@/lib/push-notifications";

const OWNER_NAV = [
  { to: "/member", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/member/profile", label: "My Profile", icon: User },
  { to: "/member/gala", label: "My Gala Details", icon: Store },
  { to: "/member/market-prices", label: "Market Prices", icon: IndianRupee },
  { to: "/member/updates", label: "Market Updates", icon: Newspaper },
  { to: "/member/notices", label: "Notices & Documents", icon: FileText },
  { to: "/member/complaints", label: "My Complaints", icon: MessageSquare },
  { to: "/member/new-complaint", label: "Raise Complaint", icon: ClipboardList },
  { to: "/member/kyc", label: "Customer KYC", icon: IdCard },
  { to: "/member/post", label: "Submit Post", icon: ImagePlus },
  { to: "/member/shared-posts", label: "Shared Posts", icon: Newspaper },
  { to: "/member/ratings", label: "Portal Reviews", icon: Star },
  { to: "/member/mobile-change", label: "Mobile Number Change", icon: Phone },
  { to: "/member/notifications", label: "Notifications", icon: Bell },
];

const ADMIN_NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/users", label: "Member Management", icon: Users },
  { to: "/admin/kyc", label: "Member KYC", icon: IdCard },
  { to: "/admin/registrations", label: "Registration Approvals", icon: ClipboardList },
  { to: "/admin/complaints", label: "Complaint Management", icon: MessageSquare },
  { to: "/admin/posts", label: "Owner Posts", icon: ImagePlus },
  { to: "/admin/reviews", label: "Portal Reviews", icon: Star },
  { to: "/admin/gallery", label: "Gallery Management", icon: ImagePlus },
  { to: "/admin/market-prices", label: "Daily Market Prices", icon: IndianRupee },
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
  const [adminCounts, setAdminCounts] = useState<Record<string, number>>({});
  const [memberUnreadCount, setMemberUnreadCount] = useState(0);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushChecking, setPushChecking] = useState(false);
  const previousMemberUnreadCount = useRef<number | null>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (loading) return;
    if (!user) { router.navigate({ to: kind === "admin" ? "/admin/login" : "/login" }); return; }
    if (kind === "owner" && user.role !== "owner") { router.navigate({ to: "/admin" }); }
    if (kind === "admin" && user.role === "owner") { router.navigate({ to: "/member" }); }
  }, [user, loading, kind, router]);

  useEffect(() => {
    if (kind !== "admin" || loading || !user || user.role === "owner") return;
    let active = true;
    const loadCounts = () => {
      fetch("/api/v1/admin/notification-counts", { credentials: "include" })
        .then((response) => response.json())
        .then((result) => {
          if (active && result.ok) setAdminCounts(result.counts || {});
        })
        .catch(() => undefined);
    };
    loadCounts();
    const timer = window.setInterval(loadCounts, 30000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [kind, loading, user]);

  useEffect(() => {
    if (kind !== "owner" || loading || !user || user.role !== "owner") return;
    let active = true;
    const cleanupSoundUnlock = installNotificationSoundUnlock();

    const loadCounts = () => {
      fetch("/api/v1/trader/notification-counts", { credentials: "include" })
        .then((response) => response.json())
        .then((result) => {
          if (!active || !result.ok) return;
          const nextCount = Number(result.unreadCount || 0);
          if (previousMemberUnreadCount.current !== null && nextCount > previousMemberUnreadCount.current) {
            toast.warning("New notification", {
              description: "Open Notifications to view the latest member update.",
              action: {
                label: "View",
                onClick: () => {
                  unlockNotificationSound();
                  playNotificationTone();
                  router.navigate({ to: "/member/notifications" });
                },
              },
            });
            if (!playNotificationTone()) {
              toast.info("Tap once to enable notification sound", {
                action: {
                  label: "Enable",
                  onClick: () => {
                    unlockNotificationSound();
                    playNotificationTone();
                  },
                },
              });
            }
          }
          previousMemberUnreadCount.current = nextCount;
          setMemberUnreadCount(nextCount);
        })
        .catch(() => undefined);
    };
    loadCounts();
    const timer = window.setInterval(loadCounts, 30000);
    return () => {
      active = false;
      window.clearInterval(timer);
      cleanupSoundUnlock();
    };
  }, [kind, loading, user, router]);

  useEffect(() => {
    if (kind !== "owner" || loading || !user || user.role !== "owner" || !canUseWebPush()) return;
    let active = true;
    getPushStatus()
      .then((status) => {
        if (active) setPushEnabled(status.permission === "granted" && Number(status.activeCount || 0) > 0);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [kind, loading, user]);

  if (loading || !user) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading...</div>;
  }

  const nav = kind === "owner" ? OWNER_NAV : ADMIN_NAV;
  const title = kind === "owner" ? "Member Portal" : user.role === "main_admin" ? "Main Admin Portal" : "User Admin Portal";
  const helpLink = kind === "owner" ? "/member/help" : "/admin/help";
  const passwordLink = kind === "owner" ? "/member/change-password" : "/admin/change-password";

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
    router.navigate({ to: "/" });
  };
  const handleEnablePush = async () => {
    setPushChecking(true);
    try {
      await enableWebPush();
      setPushEnabled(true);
      toast.success("Phone notifications enabled");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not enable notifications.");
    } finally {
      setPushChecking(false);
    }
  };
  const handlePushAction = async () => {
    if (!pushEnabled) {
      await handleEnablePush();
      return;
    }

    setPushChecking(true);
    try {
      await sendTestWebPush();
      toast.success("Test notification sent to this phone");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send test notification.");
    } finally {
      setPushChecking(false);
    }
  };
  const memberInitials = (user.name || "Member")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-muted/40">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[min(18rem,86vw)] shrink-0 flex-col overflow-hidden bg-sidebar text-sidebar-foreground transition-transform lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex min-h-24 shrink-0 items-center border-b border-sidebar-border px-4 py-4">
          {kind === "owner" ? (
            <div className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-3 py-3">
              <div className="grid h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-white/20 bg-white/10 ring-2 ring-white/10">
                {user.photoUrl ? (
                  <img src={user.photoUrl} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-secondary font-display text-sm font-bold text-primary-dark">
                    {memberInitials || "M"}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-white">{user.name}</div>
                <div className="truncate text-xs text-sidebar-foreground/70">{title}</div>
              </div>
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-2xl border border-white/10 bg-white/8 px-3 py-3">
              <div className="text-center">
                <div className="text-sm font-semibold text-white">{title}</div>
                <div className="mt-1 text-xs text-sidebar-foreground/70">Signed in as {user.name}</div>
              </div>
            </div>
          )}
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
          <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/55">
            Navigation
          </div>
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to) && n.to !== "/member" && n.to !== "/admin";
            const activeExact = n.exact && pathname === n.to;
            const count = kind === "admin" ? adminCounts[n.to] || 0 : n.to === "/member/notifications" ? memberUnreadCount : 0;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.75 text-sm font-medium transition ${
                  active || activeExact
                    ? "bg-saffron text-saffron-foreground shadow-sm"
                    : "text-sidebar-foreground/82 hover:bg-white/8 hover:text-white"
                }`}
              >
                <n.icon className="h-4 w-4 shrink-0 opacity-90" />
                <span className="min-w-0 flex-1 truncate">{n.label}</span>
                {count > 0 && (
                  <span className={`ml-auto grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-bold ${active || activeExact ? "bg-primary text-white" : "bg-saffron text-primary-dark"}`}>
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="shrink-0 border-t border-sidebar-border p-3 space-y-1">
          <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/55">
            Account
          </div>
          <Link to={helpLink} className={`flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.75 text-sm font-medium transition ${pathname === helpLink ? "bg-saffron text-saffron-foreground shadow-sm" : "text-sidebar-foreground/82 hover:bg-white/8 hover:text-white"}`}>
            <LifeBuoy className="h-4 w-4" /> Help & Support
          </Link>
          <Link to={passwordLink} className={`flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.75 text-sm font-medium transition ${pathname === passwordLink ? "bg-saffron text-saffron-foreground shadow-sm" : "text-sidebar-foreground/82 hover:bg-white/8 hover:text-white"}`}>
            <Lock className="h-4 w-4" /> Change Password
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.75 text-sm text-sidebar-foreground/82 hover:bg-destructive hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-24 items-center gap-2 border-b border-border bg-background px-3 sm:gap-3 sm:px-6">
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
            {user.role === "main_admin" ? "Main Admin" : user.role === "user_admin" ? "User Admin" : "Member"}
          </Badge>
          {kind === "owner" && canUseWebPush() && (
            <Button
              type="button"
              variant={pushEnabled ? "secondary" : "outline"}
              size="sm"
              className="shrink-0"
              onClick={handlePushAction}
              disabled={pushChecking}
              title="Get instant Market Yard notices and updates on your phone."
            >
              <Bell className="mr-1 h-4 w-4" />
              <span className="hidden md:inline">{pushEnabled ? "Test Notification" : "Enable Notifications"}</span>
              <span className="md:hidden">{pushEnabled ? "Test" : "Enable"}</span>
            </Button>
          )}
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
