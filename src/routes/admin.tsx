import { createFileRoute, Link, Outlet, useRouterState } from "@/lib/simple-router";
import { DashLayout } from "@/components/dashboard/DashLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Users, ClipboardList, MessageSquare, TrendingUp, Ban, CheckCircle2, AlertTriangle,
  Search, Eye, ThumbsUp, ThumbsDown, MoreHorizontal, Upload, Phone, FileText, Newspaper, Download, Smartphone,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard - Shri Chhatrapati Shivaji Market Yard Adte Association" }] }),
  component: AdminDash,
});

const CHART_COLORS = ["#86c127", "#e37814", "#86c127", "#D92D20", "#7C3AED", "#0284C7"];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    approved: "bg-success/15 text-success",
    pending: "bg-warning/15 text-warning",
    rejected: "bg-destructive/15 text-destructive",
    blacklisted: "bg-destructive text-white",
    submitted: "bg-info/15 text-info",
    under_review: "bg-chart-5/15 text-chart-5",
    in_progress: "bg-warning/15 text-warning",
    resolved: "bg-success/15 text-success",
    closed: "bg-muted text-muted-foreground",
    waiting_info: "bg-saffron/20 text-saffron-foreground",
    assigned: "bg-info/15 text-info",
  };
  return <Badge className={`inline-flex min-w-max whitespace-nowrap capitalize ${map[status] || "bg-muted text-muted-foreground"}`}>{status.replace(/_/g, " ")}</Badge>;
}

function AdminDash() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/admin") return <Outlet />;

  const [q, setQ] = useState("");
  type AdminTrader = {
    id: number;
    trader_code: string;
    full_name: string;
    business_name: string;
    mobile: string;
    email: string | null;
    gala_number: string | null;
    business_category: string | null;
    verification_status: string;
  };
  type ComplaintRow = {
    id: number;
    ticket_number: string;
    subject: string;
    status: string;
    priority: string;
    created_by_name: string;
    created_by_mobile: string;
    created_by_role: string;
    trader_code: string | null;
    business_name: string | null;
    gala_number: string | null;
    parsed?: { category?: string; description?: string };
  };
  type ContentRow = {
    id: number;
    title_en: string;
    published_at: string | null;
    created_at: string;
    parsed?: { category?: string; details?: string };
    attachments?: Array<{ id: number; attachment_type: string; original_filename: string }>;
  };
  type MobileRequestRow = {
    id: number;
    request_code: string;
    trader_name: string;
    trader_code: string;
    business_name: string;
    gala_number: string | null;
    old_mobile: string;
    new_mobile: string;
    reason: string;
    status: string;
  };
  const [analyticsSummary, setAnalyticsSummary] = useState<{
    portal_logins_30d?: number;
    file_downloads?: number;
    active_complaints?: number;
    resolved_complaints?: number;
    emergency_complaints?: number;
    published_notices?: number;
    total_traders?: number;
    approved_traders?: number;
    pending_traders?: number;
    published_content?: number;
    pwa_installs_total?: number;
    pwa_installs_today?: number;
    pwa_installs_week?: number;
    pwa_installs_month?: number;
    pwa_installs_mobile?: number;
    pwa_installs_desktop?: number;
  } | null>(null);
  const [analyticsCharts, setAnalyticsCharts] = useState<{
    registrations: Array<{ month: string; count: number }>;
    complaintsByCategory: Array<{ category: string; count: number }>;
    downloads: Array<{ month: string; downloads: number }>;
  }>({ registrations: [], complaintsByCategory: [], downloads: [] });
  const [traders, setTraders] = useState<AdminTrader[]>([]);
  const [loadingTraders, setLoadingTraders] = useState(true);
  const [complaints, setComplaints] = useState<ComplaintRow[]>([]);
  const [updates, setUpdates] = useState<ContentRow[]>([]);
  const [notices, setNotices] = useState<ContentRow[]>([]);
  const [mobileRequests, setMobileRequests] = useState<MobileRequestRow[]>([]);

  const loadDashboardData = async () => {
    setLoadingTraders(true);
    try {
      const [tradersResponse, analyticsResponse, complaintsResponse, updatesResponse, noticesResponse, mobileResponse] = await Promise.all([
        fetch("/api/v1/admin/traders?status=all", { credentials: "include" }),
        fetch("/api/v1/admin/reports/analytics", { credentials: "include" }),
        fetch("/api/v1/admin/complaints", { credentials: "include" }),
        fetch("/api/v1/public/posts", { credentials: "include" }),
        fetch("/api/v1/public/notices", { credentials: "include" }),
        fetch("/api/v1/admin/mobile-change-requests?status=all", { credentials: "include" }),
      ]);
      const tradersResult = await tradersResponse.json();
      const analyticsResult = await analyticsResponse.json();
      const complaintsResult = await complaintsResponse.json();
      const updatesResult = await updatesResponse.json();
      const noticesResult = await noticesResponse.json();
      const mobileResult = await mobileResponse.json();
      if (!tradersResponse.ok || !tradersResult.ok) throw new Error(tradersResult.error || "Could not load Members");
      if (!analyticsResponse.ok || !analyticsResult.ok) throw new Error(analyticsResult.error || "Could not load analytics");
      if (!complaintsResponse.ok || !complaintsResult.ok) throw new Error(complaintsResult.error || "Could not load complaints");
      if (!updatesResponse.ok || !updatesResult.ok) throw new Error(updatesResult.error || "Could not load updates");
      if (!noticesResponse.ok || !noticesResult.ok) throw new Error(noticesResult.error || "Could not load notices");
      if (!mobileResponse.ok || !mobileResult.ok) throw new Error(mobileResult.error || "Could not load mobile requests");
      setTraders(tradersResult.traders || []);
      setAnalyticsSummary(analyticsResult.summary || null);
      setAnalyticsCharts({
        registrations: (analyticsResult.charts?.registrations || []).map((row: { month: string; count: number | string }) => ({ month: row.month, count: Number(row.count || 0) })),
        complaintsByCategory: (analyticsResult.charts?.complaintsByCategory || []).map((row: { category: string; count: number | string }) => ({ category: row.category, count: Number(row.count || 0) })),
        downloads: (analyticsResult.charts?.downloads || []).map((row: { month: string; downloads: number | string }) => ({ month: row.month, downloads: Number(row.downloads || 0) })),
      });
      setComplaints((complaintsResult.complaints || []).slice(0, 15));
      setUpdates((updatesResult.posts || []).slice(0, 10));
      setNotices((noticesResult.notices || []).slice(0, 10));
      setMobileRequests((mobileResult.requests || []).slice(0, 15));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load dashboard data");
    } finally {
      setLoadingTraders(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const decideTrader = async (Member: AdminTrader, decision: "approve" | "reject") => {
    try {
      const response = await fetch(
        decision === "approve"
          ? `/api/v1/admin/trader-requests/${Member.id}/approve`
          : `/api/v1/admin/trader-requests/${Member.id}/reject`,
        {
          method: "PATCH",
          credentials: "include",
          headers: decision === "approve" ? undefined : { "Content-Type": "application/json" },
          body: decision === "approve" ? undefined : JSON.stringify({ remarks: "Rejected from admin dashboard" }),
        },
      );
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Decision failed");
      toast.success(`${Member.full_name} ${decision === "approve" ? "approved" : "rejected"}`);
      loadTraders();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Decision failed");
    }
  };

  const filteredOwners = traders.filter((o) => (
    `${o.full_name} ${o.business_name} ${o.gala_number || ""} ${o.mobile}`
  ).toLowerCase().includes(q.toLowerCase()));

  const dashboardStats = {
    total: traders.length,
    approved: traders.filter((item) => item.verification_status === "approved").length,
    pending: traders.filter((item) => ["submitted", "under_review", "correction_required"].includes(item.verification_status)).length,
    rejected: traders.filter((item) => item.verification_status === "rejected").length,
    suspended: traders.filter((item) => ["suspended", "deactivated"].includes(item.verification_status)).length,
  };

  return (
    <DashLayout kind="admin">
      <Tabs defaultValue="overview">
        <TabsList className="w-full flex-wrap justify-start h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="owners">Members</TabsTrigger>
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
          <TabsTrigger value="updates">Market Updates</TabsTrigger>
          <TabsTrigger value="notices">Notices</TabsTrigger>
          <TabsTrigger value="mobile">Mobile Requests</TabsTrigger>
        </TabsList>

        <Card className="mt-4 border-saffron/40 bg-saffron/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <div className="font-medium text-primary-dark">Auto cleanup note</div>
              <div className="text-sm text-muted-foreground">
                Published market updates, market prices, and resolved or closed complaints are removed automatically after 1 hour.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Users, label: "Total Members", value: dashboardStats.total, color: "bg-primary text-white" },
              { icon: CheckCircle2, label: "Approved", value: dashboardStats.approved, color: "bg-success text-white" },
              { icon: ClipboardList, label: "Pending", value: dashboardStats.pending, color: "bg-warning text-white" },
              { icon: Ban, label: "Rejected / Suspended", value: dashboardStats.rejected + dashboardStats.suspended, color: "bg-destructive text-white" },
              { icon: MessageSquare, label: "Active Complaints", value: (analyticsSummary?.active_complaints || 0).toLocaleString(), color: "bg-info text-white" },
              { icon: CheckCircle2, label: "Resolved Complaints", value: (analyticsSummary?.resolved_complaints || 0).toLocaleString(), color: "bg-success text-white" },
              { icon: AlertTriangle, label: "Emergency", value: (analyticsSummary?.emergency_complaints || 0).toLocaleString(), color: "bg-destructive text-white" },
              { icon: TrendingUp, label: "Monthly Logins", value: (analyticsSummary?.portal_logins_30d || 0).toLocaleString(), color: "bg-saffron text-primary-dark" },
              { icon: Download, label: "File downloads", value: (analyticsSummary?.file_downloads || 0).toLocaleString(), color: "bg-primary text-white" },
              { icon: Smartphone, label: "Total App Installs", value: (analyticsSummary?.pwa_installs_total || 0).toLocaleString(), color: "bg-info text-white" },
              { icon: Smartphone, label: "Today's Installs", value: (analyticsSummary?.pwa_installs_today || 0).toLocaleString(), color: "bg-success text-white" },
              { icon: Smartphone, label: "This Month", value: (analyticsSummary?.pwa_installs_month || 0).toLocaleString(), color: "bg-saffron text-primary-dark" },
              { icon: Smartphone, label: "Mobile Installs", value: (analyticsSummary?.pwa_installs_mobile || 0).toLocaleString(), color: "bg-primary text-white" },
            ].map((s) => (
              <Card key={s.label} className="border-border/60">
                <CardContent className="p-5 flex items-center gap-3">
                  <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${s.color}`}><s.icon className="h-5 w-5" /></div>
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                    <div className="font-display text-xl font-bold text-primary-dark">{s.value}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-border/60">
              <CardContent className="p-6">
                <h3 className="font-display font-bold text-primary-dark mb-4">Monthly registrations</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsCharts.registrations}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#667085" fontSize={12} />
                      <YAxis stroke="#667085" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#86c127" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60">
              <CardContent className="p-6">
                <h3 className="font-display font-bold text-primary-dark mb-4">Complaints by category</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={analyticsCharts.complaintsByCategory} dataKey="count" nameKey="category" outerRadius={90} label>
                        {analyticsCharts.complaintsByCategory.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60 lg:col-span-2">
              <CardContent className="p-6">
                <h3 className="font-display font-bold text-primary-dark mb-4">File downloads trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsCharts.downloads}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#667085" fontSize={12} />
                      <YAxis stroke="#667085" fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="downloads" stroke="#e37814" strokeWidth={3} dot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* OWNERS */}
        <TabsContent value="owners" className="mt-6">
          <Card className="border-border/60">
            <CardContent className="p-6">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="relative min-w-0 flex-1 sm:min-w-[200px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, gala, mobile..." className="pl-9" />
                </div>
                <Button variant="outline"><Download className="h-4 w-4 mr-1" /> Export</Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Mobile</TableHead>
                      <TableHead>Gala</TableHead><TableHead>Category</TableHead><TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOwners.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-mono text-xs">{o.trader_code}</TableCell>
                        <TableCell><div className="font-medium">{o.full_name}</div><div className="text-xs text-muted-foreground">{o.business_name}</div></TableCell>
                        <TableCell>{o.mobile}</TableCell>
                        <TableCell><Badge variant="outline">{o.gala_number || "-"}</Badge></TableCell>
                        <TableCell>{o.business_category || "-"}</TableCell>
                        <TableCell><StatusBadge status={o.verification_status} /></TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex gap-1">
                            <Button size="icon" variant="ghost" asChild><Link to={`/traders/${o.id}`}><Eye className="h-4 w-4" /></Link></Button>
                            {["submitted", "under_review", "correction_required"].includes(o.verification_status) && (
                              <>
                                <Button size="icon" variant="ghost" onClick={() => decideTrader(o, "approve")}><ThumbsUp className="h-4 w-4 text-success" /></Button>
                                <Button size="icon" variant="ghost" onClick={() => decideTrader(o, "reject")}><ThumbsDown className="h-4 w-4 text-destructive" /></Button>
                              </>
                            )}
                            {o.verification_status === "approved" && (
                              <Button size="icon" variant="ghost" onClick={() => toast.warning(`${o.full_name} suspend action is available in Member Management`)}><Ban className="h-4 w-4 text-destructive" /></Button>
                            )}
                            <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {!loadingTraders && filteredOwners.length === 0 && <div className="py-8 text-center text-sm text-muted-foreground">No Members found in database.</div>}
                {loadingTraders && <div className="py-8 text-center text-sm text-muted-foreground">Loading Members from database...</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* COMPLAINTS */}
        <TabsContent value="complaints" className="mt-6">
          <Card className="border-border/60">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead><TableHead>Subject</TableHead><TableHead>Owner</TableHead>
                      <TableHead>Category</TableHead><TableHead>Priority</TableHead><TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complaints.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-mono text-xs">{c.id}</TableCell>
                        <TableCell><div className="font-medium">{c.subject}</div><div className="text-xs text-muted-foreground">{c.ticket_number}</div></TableCell>
                        <TableCell><div className="text-sm">{c.created_by_name}</div><div className="text-xs text-muted-foreground">{c.business_name || c.created_by_mobile}</div></TableCell>
                        <TableCell>{c.parsed?.category || "-"}</TableCell>
                        <TableCell>
                          <Badge className={`capitalize ${c.priority === "emergency" ? "bg-destructive text-white" : c.priority === "high" ? "bg-warning text-white" : "bg-secondary text-primary-dark"}`}>{c.priority}</Badge>
                        </TableCell>
                        <TableCell><StatusBadge status={c.status} /></TableCell>
                        <TableCell className="text-right">
                          <Button size="icon" variant="ghost" onClick={() => window.open("/admin/complaints", "_self")}><Eye className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* UPDATES */}
        <TabsContent value="updates" className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]">
          <Card className="border-border/60">
            <CardContent className="p-6">
              <h3 className="font-display font-bold text-primary-dark mb-4">Published market updates</h3>
              <div className="space-y-3">
                {updates.map((u) => (
                  <div key={u.id} className="flex items-start gap-3 rounded-lg border p-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary"><Newspaper className="h-4 w-4" /></div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">{u.parsed?.category || "General"} - {new Date(u.published_at || u.created_at).toLocaleDateString("en-IN")}</div>
                      <div className="truncate font-medium text-primary-dark">{u.title_en}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-saffron/40 bg-saffron/5">
            <CardContent className="p-6">
              <h3 className="font-display font-bold text-primary-dark mb-4">Publish new update</h3>
              <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); toast.info("Use the Market Updates admin page to publish real content."); }}>
                <div><Label>Title</Label><Input required placeholder="e.g. Onion rate update" /></div>
                <div><Label>Category</Label>
                  <Select defaultValue="Vegetable prices">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{["Vegetable prices", "Fruit prices", "Grain prices", "Market arrivals", "Weather alert", "Market holiday", "General market news"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Summary</Label><Textarea required rows={3} /></div>
                <label className="flex items-center gap-2 rounded-lg border-2 border-dashed p-3 text-sm cursor-pointer hover:border-primary">
                  <Upload className="h-4 w-4 text-primary" /> Attach image / PDF / video
                  <input type="file" className="hidden" />
                </label>
                <Button type="submit" className="w-full bg-primary">Publish update</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTICES */}
        <TabsContent value="notices" className="mt-6">
          <Card className="border-border/60">
            <CardContent className="p-6">
              <div className="space-y-3">
                {notices.map((n) => (
                  <div key={n.id} className="flex items-start gap-3 rounded-lg border p-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary"><FileText className="h-4 w-4" /></div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">{n.parsed?.category || "Notice"} - {new Date(n.published_at || n.created_at).toLocaleDateString("en-IN")}</div>
                      <div className="truncate font-medium text-primary-dark">{n.title_en}</div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => window.open("/notices", "_blank")}><Eye className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MOBILE REQUESTS */}
        <TabsContent value="mobile" className="mt-6">
          <Card className="border-border/60">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>ID</TableHead><TableHead>Owner</TableHead><TableHead>Old</TableHead>
                    <TableHead>New</TableHead><TableHead>Reason</TableHead><TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {mobileRequests.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-mono text-xs">{r.request_code}</TableCell>
                        <TableCell><div className="font-medium">{r.trader_name}</div><div className="text-xs text-muted-foreground">{r.business_name} - Gala {r.gala_number || "-"}</div></TableCell>
                        <TableCell className="font-mono text-xs">{r.old_mobile}</TableCell>
                        <TableCell className="font-mono text-xs">{r.new_mobile}</TableCell>
                        <TableCell className="text-sm">{r.reason}</TableCell>
                        <TableCell><StatusBadge status={r.status} /></TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => window.open("/admin/mobile-requests", "_blank")}>Open</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashLayout>
  );
}
