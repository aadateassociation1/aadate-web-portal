import { createFileRoute, Outlet, useRouterState } from "@/lib/simple-router";
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
  Search, Eye, ThumbsUp, ThumbsDown, MoreHorizontal, Upload, Phone, FileText, Newspaper, Download,
} from "lucide-react";
import { useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  OWNERS, COMPLAINTS, MARKET_UPDATES, NOTICES, MOBILE_REQUESTS, DASHBOARD_STATS,
  CHART_REGISTRATIONS, CHART_COMPLAINTS_CATEGORY, CHART_DOWNLOADS,
} from "@/lib/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard - VPP Market Yard" }] }),
  component: AdminDash,
});

const CHART_COLORS = ["#176B3A", "#F59E0B", "#38A169", "#D92D20", "#7C3AED", "#0284C7"];

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
  return <Badge className={`capitalize ${map[status] || "bg-muted text-muted-foreground"}`}>{status.replace(/_/g, " ")}</Badge>;
}

function AdminDash() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/admin") return <Outlet />;

  const [q, setQ] = useState("");
  const filteredOwners = OWNERS.filter((o) => (o.name + o.gala + o.mobile).toLowerCase().includes(q.toLowerCase()));

  return (
    <DashLayout kind="admin">
      <Tabs defaultValue="overview">
        <TabsList className="w-full flex-wrap justify-start h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="owners">Traders</TabsTrigger>
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
          <TabsTrigger value="updates">Market Updates</TabsTrigger>
          <TabsTrigger value="notices">Notices</TabsTrigger>
          <TabsTrigger value="mobile">Mobile Requests</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Users, label: "Total Traders", value: DASHBOARD_STATS.totalOwners, color: "bg-primary text-white" },
              { icon: CheckCircle2, label: "Approved", value: DASHBOARD_STATS.approved, color: "bg-success text-white" },
              { icon: ClipboardList, label: "Pending", value: DASHBOARD_STATS.pending, color: "bg-warning text-white" },
              { icon: Ban, label: "Blacklisted", value: DASHBOARD_STATS.blacklisted, color: "bg-destructive text-white" },
              { icon: MessageSquare, label: "Active Complaints", value: DASHBOARD_STATS.activeComplaints, color: "bg-info text-white" },
              { icon: CheckCircle2, label: "Resolved Complaints", value: DASHBOARD_STATS.resolvedComplaints, color: "bg-success text-white" },
              { icon: AlertTriangle, label: "Emergency", value: DASHBOARD_STATS.emergencyComplaints, color: "bg-destructive text-white" },
              { icon: TrendingUp, label: "Monthly Logins", value: DASHBOARD_STATS.monthlyLogins.toLocaleString(), color: "bg-saffron text-primary-dark" },
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
                    <BarChart data={CHART_REGISTRATIONS}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#667085" fontSize={12} />
                      <YAxis stroke="#667085" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#176B3A" radius={[6, 6, 0, 0]} />
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
                      <Pie data={CHART_COMPLAINTS_CATEGORY} dataKey="count" nameKey="category" outerRadius={90} label>
                        {CHART_COMPLAINTS_CATEGORY.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
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
                <h3 className="font-display font-bold text-primary-dark mb-4">Document downloads trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={CHART_DOWNLOADS}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#667085" fontSize={12} />
                      <YAxis stroke="#667085" fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="downloads" stroke="#F59E0B" strokeWidth={3} dot={{ r: 5 }} />
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
                        <TableCell className="font-mono text-xs">{o.id}</TableCell>
                        <TableCell><div className="font-medium">{o.name}</div><div className="text-xs text-muted-foreground">{o.nameMr}</div></TableCell>
                        <TableCell>{o.mobile}</TableCell>
                        <TableCell><Badge variant="outline">{o.gala}</Badge></TableCell>
                        <TableCell>{o.category}</TableCell>
                        <TableCell><StatusBadge status={o.status} /></TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex gap-1">
                            <Button size="icon" variant="ghost" onClick={() => toast.info(`Opening profile of ${o.name}`)}><Eye className="h-4 w-4" /></Button>
                            {o.status === "pending" && (
                              <>
                                <Button size="icon" variant="ghost" onClick={() => toast.success(`${o.name} approved`)}><ThumbsUp className="h-4 w-4 text-success" /></Button>
                                <Button size="icon" variant="ghost" onClick={() => toast.error(`${o.name} rejected`)}><ThumbsDown className="h-4 w-4 text-destructive" /></Button>
                              </>
                            )}
                            {o.status === "approved" && (
                              <Button size="icon" variant="ghost" onClick={() => toast.warning(`${o.name} blacklisted`)}><Ban className="h-4 w-4 text-destructive" /></Button>
                            )}
                            <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                    {COMPLAINTS.slice(0, 15).map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-mono text-xs">{c.id}</TableCell>
                        <TableCell><div className="font-medium">{c.subject}</div></TableCell>
                        <TableCell><div className="text-sm">{c.ownerName}</div><div className="text-xs text-muted-foreground">{c.gala}</div></TableCell>
                        <TableCell>{c.category}</TableCell>
                        <TableCell>
                          <Badge className={`capitalize ${c.priority === "emergency" ? "bg-destructive text-white" : c.priority === "high" ? "bg-warning text-white" : "bg-secondary text-primary-dark"}`}>{c.priority}</Badge>
                        </TableCell>
                        <TableCell><StatusBadge status={c.status} /></TableCell>
                        <TableCell className="text-right">
                          <Button size="icon" variant="ghost" onClick={() => toast.info(`Opening ${c.id}`)}><Eye className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" onClick={() => toast.success(`${c.id} marked resolved`)}><CheckCircle2 className="h-4 w-4 text-success" /></Button>
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
                {MARKET_UPDATES.slice(0, 10).map((u) => (
                  <div key={u.id} className="flex items-start gap-3 rounded-lg border p-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary"><Newspaper className="h-4 w-4" /></div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">{u.category} - {u.views} views</div>
                      <div className="truncate font-medium text-primary-dark">{u.title}</div>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => toast.success(`${u.id} deleted`)}>Delete</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-saffron/40 bg-saffron/5">
            <CardContent className="p-6">
              <h3 className="font-display font-bold text-primary-dark mb-4">Publish new update</h3>
              <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); toast.success("Market update published"); (e.target as HTMLFormElement).reset(); }}>
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
                {NOTICES.map((n) => (
                  <div key={n.id} className="flex items-start gap-3 rounded-lg border p-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary"><FileText className="h-4 w-4" /></div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">#{n.number} - {n.category}</div>
                      <div className="truncate font-medium text-primary-dark">{n.title}</div>
                    </div>
                    <Button size="sm" variant="outline"><Eye className="h-4 w-4" /></Button>
                    <Button size="sm" variant="outline" onClick={() => toast.error(`${n.number} deleted`)}>Delete</Button>
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
                    {MOBILE_REQUESTS.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-mono text-xs">{r.id}</TableCell>
                        <TableCell><div className="font-medium">{r.ownerName}</div><div className="text-xs text-muted-foreground">{r.gala}</div></TableCell>
                        <TableCell className="font-mono text-xs">{r.oldMobile}</TableCell>
                        <TableCell className="font-mono text-xs">{r.newMobile}</TableCell>
                        <TableCell className="text-sm">{r.reason}</TableCell>
                        <TableCell><StatusBadge status={r.status} /></TableCell>
                        <TableCell className="text-right">
                          {r.status === "pending" && (
                            <div className="inline-flex gap-1">
                              <Button size="sm" className="bg-success text-white" onClick={() => toast.success(`${r.id} approved - mobile updated`)}>Approve</Button>
                              <Button size="sm" variant="outline" onClick={() => toast.error(`${r.id} rejected`)}>Reject</Button>
                            </div>
                          )}
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
