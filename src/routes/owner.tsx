import { createFileRoute, Link, Outlet, useRouterState } from "@/lib/simple-router";
import { useEffect, useState } from "react";
import { DashLayout } from "@/components/dashboard/DashLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ClipboardList, FileText, Newspaper, Phone, MessageSquare, Clock, ImagePlus, IdCard,
  Star, Store,
} from "lucide-react";

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
      trader_code: string;
      business_name: string;
      gala_number: string | null;
      verification_status: string;
    };
    galas?: Array<{
      id: number;
      business_name: string;
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
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [sharedPosts, setSharedPosts] = useState<SharedPost[]>([]);

  useEffect(() => {
    fetch("/api/v1/trader/dashboard", { credentials: "include" })
      .then((response) => response.json())
      .then((result) => {
        if (result.ok) setDashboard(result);
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
      <Card className="mb-6 border-border/60">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-bold leading-tight text-primary-dark">Welcome back, {profile?.full_name || "Member"}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{selectedGala?.business_name || profile?.business_name || "Your business dashboard will appear after approval."}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2 md:justify-end">
              <Badge variant="outline" className="whitespace-nowrap">{profile?.trader_code || "Member"}</Badge>
              <Badge className="whitespace-nowrap bg-secondary text-primary-dark">{profile?.verification_status || "approved"}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Overview cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { icon: ClipboardList, label: "Selected Gala / Shop", value: selectedGala?.gala_number || profile?.gala_number || "-", color: "bg-primary text-white" },
          { icon: MessageSquare, label: "Linked Customers", value: metrics?.totalCustomers ?? 0, color: "bg-warning text-white" },
        ].map((s) => (
          <Card key={s.label} className="border-border/60">
            <CardContent className="flex min-h-[92px] items-center gap-4 p-5">
              <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${s.color}`}><s.icon className="h-5 w-5" /></div>
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className="truncate font-display text-2xl font-bold leading-tight text-primary-dark">{s.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6 border-border/60">
        <CardContent className="p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display font-bold text-primary-dark">Your Galas / Shops</h2>
              <p className="mt-1 text-sm text-muted-foreground">One login can manage multiple shops linked to your mobile number.</p>
            </div>
            <Button asChild size="sm" variant="outline"><Link to="/register">Add Another Gala / Shop</Link></Button>
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
                    <div className="mt-1 text-sm text-muted-foreground">{gala.business_name}</div>
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
      <Card className="mt-6 border-border/60">
        <CardContent className="p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display font-bold text-primary-dark">Quick actions</h2>
            <Badge className="w-fit max-w-full whitespace-normal bg-secondary text-primary-dark">{selectedGala?.business_name || profile?.business_name || "Fresh dashboard"}</Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
            {quickActions.map((a) => (
              <Button key={a.to} asChild variant="outline" className="h-16 min-w-0 justify-start px-4 py-3">
                <Link to={a.to} className="min-w-0">
                  <a.icon className="mr-2 h-5 w-5 shrink-0 text-primary" />
                  <span className="min-w-0 whitespace-normal text-left leading-snug">{a.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 border-border/60">
        <CardContent className="p-6">
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
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardContent className="min-h-[210px] p-6">
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
          <CardContent className="min-h-[210px] p-6">
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
      <Card className="mt-6 border-border/60">
        <CardContent className="p-6">
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

