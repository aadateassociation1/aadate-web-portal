import { createFileRoute, Link, Outlet, useRouterState } from "@/lib/simple-router";
import { useEffect, useState } from "react";
import { DashLayout } from "@/components/dashboard/DashLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ClipboardList, FileText, Newspaper, Phone, MessageSquare, Clock, ImagePlus, IdCard,
  Star, Store, CheckCircle2,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/owner")({
  head: () => ({ meta: [{ title: "Member Dashboard - Shri Chhatrapati Shivaji Market Yard Adte Association" }] }),
  component: OwnerDash,
});

function OwnerDash() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/owner" && pathname !== "/trader" && pathname !== "/member") return <Outlet />;

  type DashboardData = {
    profile?: {
      full_name: string;
      full_name_en?: string | null;
      trader_code: string;
      business_name: string;
      business_name_en?: string | null;
      gala_number: string | null;
      verification_status: string;
    };
    galas?: Array<{
      id: number;
      business_name: string;
      business_name_en?: string | null;
      market_section: string | null;
      market_registration_number: string | null;
      status: string;
      is_primary: number | boolean;
      verified_at: string | null;
      created_at: string;
      gala_number: string;
      business_category: string | null;
    }>;
    metrics: {
      totalCustomers: number;
      verifiedCustomers: number;
      kycPending: number;
      totalInvoices: number;
      totalBilled: number;
      totalReceived: number;
      totalOutstanding: number;
      dueToday: number;
      overdueAmount: number;
      warning1Count: number;
      warning2Count: number;
    };
  };
  type SharedPost = {
    id: number;
    title_en: string;
    published_at: string | null;
    created_at: string;
    created_by_name: string;
    business_name: string | null;
    trader_code: string | null;
    gala_number: string | null;
    parsed?: { category?: string; details?: string };
  };
  type PendingFeedback = { id: number; complaint_id: number; ticket_number: string; subject: string; resolved_at?: string | null; parsed?: { category?: string } };
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [sharedPosts, setSharedPosts] = useState<SharedPost[]>([]);
  const [pendingFeedback, setPendingFeedback] = useState<PendingFeedback[]>([]);
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  const { lang } = useI18n();

  useEffect(() => {
    fetch("/api/v1/trader/dashboard", { credentials: "include" })
      .then((response) => response.json())
      .then((result) => {
        if (result.ok) setDashboard(result);
      })
      .catch(() => undefined);
    fetch("/api/v1/trader/complaints/pending-feedback", { credentials: "include" })
      .then((response) => response.json())
      .then((result) => {
        if (!result.ok) return;
        const items = result.feedbackRequests || [];
        setPendingFeedback(items);
        if (items.length > 0) setShowFeedbackPrompt(true);
      })
      .catch(() => undefined);
    fetch("/api/v1/trader/shared-posts", { credentials: "include" })
      .then((response) => response.json())
      .then((result) => {
        if (result.ok) setSharedPosts(result.posts || []);
      })
      .catch(() => undefined);
  }, []);

  const profile = dashboard?.profile;
  const galas = dashboard?.galas || [];
  const [selectedGalaId, setSelectedGalaId] = useState<number | null>(null);
  const selectedGala = galas.find((gala) => gala.id === selectedGalaId) || galas[0] || null;
  const metrics = dashboard?.metrics;
  const displayMemberName = lang === "en" ? profile?.full_name_en || profile?.full_name : profile?.full_name || profile?.full_name_en;
  const displayBusinessName = lang === "en"
    ? selectedGala?.business_name_en || profile?.business_name_en || selectedGala?.business_name || profile?.business_name
    : selectedGala?.business_name || profile?.business_name || selectedGala?.business_name_en || profile?.business_name_en;
  const galaBusinessName = (gala: { business_name: string; business_name_en?: string | null }) =>
    lang === "en" ? gala.business_name_en || gala.business_name : gala.business_name || gala.business_name_en || "";
  const quickActions = [
    { to: "/member/new-complaint", icon: ClipboardList, label: "Raise Complaint" },
    { to: "/member/kyc", icon: IdCard, label: "Customer KYC" },
    { to: "/member/post", icon: ImagePlus, label: "Submit Post" },
    { to: "/member/shared-posts", icon: Newspaper, label: "Shared Posts" },
    { to: "/member/ratings", icon: Star, label: "Portal Reviews" },
    { to: "/member/notices", icon: FileText, label: "Download Notice" },
    { to: "/member/updates", icon: Newspaper, label: "Market Update" },
    { to: "/member/mobile-change", icon: Phone, label: "Mobile Change" },
  ];

  return (
    <DashLayout kind="owner">
      <Card className="mb-4 border-border/60 sm:mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <h1 className="font-display text-xl font-bold leading-tight text-primary-dark sm:text-2xl">Welcome back, {displayMemberName || "Member"}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{displayBusinessName || "Your business dashboard will appear after approval."}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2 md:justify-end">
              <Badge variant="outline" className="whitespace-nowrap">{profile?.trader_code || "Member"}</Badge>
              <Badge className="whitespace-nowrap bg-secondary text-primary-dark">{profile?.verification_status || "approved"}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      {pendingFeedback.length > 0 && (
        <Card className="mb-4 border-saffron/50 bg-saffron/5 sm:mb-6">
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <h2 className="font-display font-bold text-primary-dark">{lang === "mr" ? "\u092a\u094d\u0930\u0932\u0902\u092c\u093f\u0924 \u0905\u092d\u093f\u092a\u094d\u0930\u093e\u092f" : "Pending Feedback"}</h2>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{pendingFeedback[0]?.ticket_number} - {pendingFeedback[0]?.subject}</p>
              </div>
              <Button asChild className="bg-saffron text-saffron-foreground hover:bg-saffron/90"><Link to="/member/complaints">{lang === "mr" ? "\u0905\u092d\u093f\u092a\u094d\u0930\u093e\u092f \u0926\u094d\u092f\u093e" : "Give Feedback"}</Link></Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={showFeedbackPrompt && pendingFeedback.length > 0} onOpenChange={setShowFeedbackPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{lang === "mr" ? "\u0906\u092a\u0932\u094d\u092f\u093e \u0924\u0915\u094d\u0930\u093e\u0930\u0940\u091a\u0947 \u0928\u093f\u0930\u093e\u0915\u0930\u0923 \u0915\u0938\u0947 \u091d\u093e\u0932\u0947?" : "How was your complaint resolution?"}</DialogTitle>
            <DialogDescription>{lang === "mr" ? "\u0906\u092a\u0932\u0940 \u0924\u0915\u094d\u0930\u093e\u0930 \u0928\u093f\u0930\u093e\u0915\u0930\u0923 \u091d\u093e\u0932\u094d\u092f\u093e\u091a\u0947 \u0928\u094b\u0902\u0926\u0935\u093f\u0923\u094d\u092f\u093e\u0924 \u0906\u0932\u0947 \u0906\u0939\u0947. \u0915\u0943\u092a\u092f\u093e \u0905\u092d\u093f\u092a\u094d\u0930\u093e\u092f \u0926\u094d\u092f\u093e." : "Your complaint has been marked as resolved. Please share your feedback."}</DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border bg-secondary/40 p-4">
            <div className="font-mono text-xs text-muted-foreground">{pendingFeedback[0]?.ticket_number}</div>
            <div className="mt-1 font-display font-semibold text-primary-dark">{pendingFeedback[0]?.subject}</div>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={() => setShowFeedbackPrompt(false)}>{lang === "mr" ? "\u0928\u0902\u0924\u0930 \u0906\u0920\u0935\u0923 \u0915\u0930\u0942\u0928 \u0926\u094d\u092f\u093e" : "Remind Me Later"}</Button>
            <Button asChild className="bg-saffron text-saffron-foreground hover:bg-saffron/90"><Link to="/member/complaints">{lang === "mr" ? "\u0905\u092d\u093f\u092a\u094d\u0930\u093e\u092f \u0926\u094d\u092f\u093e" : "Open Feedback"}</Link></Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Overview cards */}
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        {[
          { icon: ClipboardList, label: "Selected Gala / Shop", value: selectedGala?.gala_number || profile?.gala_number || "-", color: "bg-primary text-white" },
          { icon: MessageSquare, label: "Linked Customers", value: metrics?.totalCustomers ?? 0, color: "bg-warning text-white" },
        ].map((s) => (
          <Card key={s.label} className="border-border/60">
            <CardContent className="flex min-h-[82px] items-center gap-3 p-4 sm:min-h-[92px] sm:gap-4 sm:p-5">
              <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl sm:h-12 sm:w-12 ${s.color}`}><s.icon className="h-5 w-5" /></div>
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className="truncate font-display text-xl font-bold leading-tight text-primary-dark sm:text-2xl">{s.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-4 border-border/60 sm:mt-6">
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display font-bold text-primary-dark">Your Galas / Shops</h2>
              <p className="mt-1 text-sm text-muted-foreground">One login can manage multiple shops linked to your mobile number.</p>
            </div>
            <Button asChild size="sm" variant="outline" className="w-full sm:w-auto"><Link to="/register">Add Another Gala / Shop</Link></Button>
          </div>
          <div className="grid gap-3 lg:grid-cols-3">
            {galas.map((gala) => (
              <button
                key={gala.id}
                type="button"
                className={`rounded-lg border p-4 text-left transition hover:border-primary hover:bg-secondary/30 ${selectedGala?.id === gala.id ? "border-primary bg-secondary/40 ring-2 ring-primary/15" : "bg-background"}`}
                onClick={() => setSelectedGalaId(gala.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 shrink-0 text-primary" />
                      <div className="font-display font-semibold text-primary-dark">Gala {gala.gala_number}</div>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{galaBusinessName(gala)}</div>
                  </div>
                  {gala.is_primary ? <Badge className="bg-primary text-white">Primary</Badge> : null}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline">{gala.business_category || gala.market_section || "General"}</Badge>
                  <Badge className={gala.status === "approved" ? "bg-success text-white" : gala.status === "rejected" ? "bg-destructive text-white" : "bg-saffron text-primary-dark"}>
                    {gala.status.replace(/_/g, " ")}
                  </Badge>
                </div>
                {gala.market_registration_number && <div className="mt-3 text-xs text-muted-foreground">Registration: {gala.market_registration_number}</div>}
              </button>
            ))}
            {galas.length === 0 && <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground lg:col-span-3">No gala/shop records found yet.</div>}
          </div>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <Card className="mt-4 border-border/60 sm:mt-6">
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display font-bold text-primary-dark">Quick actions</h2>
            <Badge className="w-fit max-w-full whitespace-normal bg-secondary text-primary-dark">{displayBusinessName || "Fresh dashboard"}</Badge>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
            {quickActions.map((a) => (
              <Button key={a.to} asChild variant="outline" className="h-14 min-w-0 justify-start px-4 py-3 sm:h-16">
                <Link to={a.to} className="min-w-0">
                  <a.icon className="mr-2 h-5 w-5 shrink-0 text-primary" />
                  <span className="min-w-0 whitespace-normal text-left leading-snug">{a.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4 border-border/60 sm:mt-6">
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display font-bold text-primary-dark">Latest shared posts</h2>
              <p className="mt-1 text-sm text-muted-foreground">Admin-reshared posts visible to your Member category.</p>
            </div>
            <Button asChild size="sm" variant="ghost"><Link to="/member/shared-posts">View all</Link></Button>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            {sharedPosts.slice(0, 4).map((post) => (
              <div key={post.id} className="rounded-lg border bg-secondary/20 p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">{post.parsed?.category || "General Request"}</Badge>
                  <span>{new Date(post.published_at || post.created_at).toLocaleDateString("en-IN")}</span>
                </div>
                <h3 className="mt-2 whitespace-normal break-words font-display font-semibold leading-snug text-primary-dark">{post.title_en}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.parsed?.details || ""}</p>
                <div className="mt-3 text-xs text-muted-foreground">
                  {post.created_by_name} - Gala {post.gala_number || "-"} - {post.trader_code || post.business_name || "-"}
                </div>
              </div>
            ))}
            {sharedPosts.length === 0 && <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground lg:col-span-2">No shared posts yet.</div>}
          </div>
        </CardContent>
      </Card>

      {/* Two column: complaints + updates */}
      <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardContent className="min-h-[180px] p-4 sm:min-h-[210px] sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display font-bold text-primary-dark">My recent complaints</h2>
              <Button asChild size="sm" variant="ghost"><Link to="/member/complaints">View all</Link></Button>
            </div>
            <div className="space-y-3">
              <div className="py-8 text-center text-sm text-muted-foreground">No complaints yet.</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="min-h-[180px] p-4 sm:min-h-[210px] sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display font-bold text-primary-dark">Latest market updates</h2>
              <Button asChild size="sm" variant="ghost"><Link to="/member/updates">View all</Link></Button>
            </div>
            <div className="space-y-3">
              <div className="py-8 text-center text-sm text-muted-foreground">No market updates yet.</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notices */}
      <Card className="mt-4 border-border/60 sm:mt-6">
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display font-bold text-primary-dark">Recent notices</h2>
            <Button asChild size="sm" variant="ghost"><Link to="/member/notices">View all</Link></Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="py-8 text-center text-sm text-muted-foreground md:col-span-2">No notices yet.</div>
          </div>
        </CardContent>
      </Card>
    </DashLayout>
  );
}

