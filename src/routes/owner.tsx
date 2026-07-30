import { createFileRoute, Link, Outlet, useRouterState } from "@/lib/simple-router";
import { DashLayout } from "@/components/dashboard/DashLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ClipboardList, FileText, Newspaper, Phone, MessageSquare, Bell, CheckCircle2, Clock, ImagePlus, IdCard,
} from "lucide-react";
import { MARKET_UPDATES, NOTICES, COMPLAINTS, NOTIFICATIONS, OWNERS } from "@/lib/mock";

export const Route = createFileRoute("/owner")({
  head: () => ({ meta: [{ title: "Trader Dashboard â€” VPP Market Yard" }] }),
  component: OwnerDash,
});

function OwnerDash() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/owner") return <Outlet />;

  const me = OWNERS[0]; // demo bind to Ramesh Shinde
  const myComplaints = COMPLAINTS.filter((c) => c.ownerId === me.id);
  const active = myComplaints.filter((c) => !["resolved", "closed", "rejected"].includes(c.status)).length;
  const resolved = myComplaints.filter((c) => c.status === "resolved").length;

  return (
    <DashLayout kind="owner">
      {/* Overview cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: ClipboardList, label: "Gala Number", value: me.gala, color: "bg-primary text-white" },
          { icon: MessageSquare, label: "Active Complaints", value: active, color: "bg-warning text-white" },
          { icon: CheckCircle2, label: "Resolved", value: resolved, color: "bg-success text-white" },
          { icon: Bell, label: "Unread Notices", value: NOTIFICATIONS.filter((n) => !n.read).length, color: "bg-saffron text-primary-dark" },
        ].map((s) => (
          <Card key={s.label} className="border-border/60">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${s.color}`}><s.icon className="h-5 w-5" /></div>
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className="font-display text-2xl font-bold text-primary-dark">{s.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <Card className="mt-6 border-border/60">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display font-bold text-primary-dark">Quick actions</h2>
            <Badge className="bg-secondary text-primary-dark">{me.section}</Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {[
              { to: "/owner/new-complaint", icon: ClipboardList, label: "Raise Complaint" },
              { to: "/owner/kyc", icon: IdCard, label: "Customer KYC" },
              { to: "/owner/post", icon: ImagePlus, label: "Submit Post" },
              { to: "/owner/shared-posts", icon: Newspaper, label: "Shared Posts" },
              { to: "/owner/notices", icon: FileText, label: "Download Notice" },
              { to: "/owner/updates", icon: Newspaper, label: "View Market Update" },
              { to: "/owner/mobile-change", icon: Phone, label: "Request Mobile Change" },
            ].map((a) => (
              <Button key={a.to} asChild variant="outline" className="justify-start h-auto py-4">
                <Link to={a.to}><a.icon className="h-5 w-5 mr-2 text-primary" /> {a.label}</Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Two column: complaints + updates */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display font-bold text-primary-dark">My recent complaints</h2>
              <Button asChild size="sm" variant="ghost"><Link to="/owner/complaints">View all</Link></Button>
            </div>
            <div className="space-y-3">
              {myComplaints.slice(0, 4).map((c) => (
                <div key={c.id} className="flex items-start gap-3 rounded-lg border p-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary"><MessageSquare className="h-4 w-4" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="font-mono">{c.id}</span> Â· {c.category}</div>
                    <div className="truncate text-sm font-medium text-primary-dark">{c.subject}</div>
                  </div>
                  <Badge className="capitalize" variant={c.status === "resolved" ? "default" : "secondary"}>{c.status.replace("_", " ")}</Badge>
                </div>
              ))}
              {myComplaints.length === 0 && <div className="py-6 text-center text-sm text-muted-foreground">No complaints yet.</div>}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display font-bold text-primary-dark">Latest market updates</h2>
              <Button asChild size="sm" variant="ghost"><Link to="/owner/updates">View all</Link></Button>
            </div>
            <div className="space-y-3">
              {MARKET_UPDATES.slice(0, 4).map((u) => (
                <div key={u.id} className="flex items-start gap-3 rounded-lg border p-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary"><Newspaper className="h-4 w-4" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-muted-foreground">{u.category} Â· {new Date(u.date).toLocaleDateString("en-IN")}</div>
                    <div className="truncate text-sm font-medium text-primary-dark">{u.title}</div>
                  </div>
                  {u.emergency && <Badge className="bg-destructive text-white">Alert</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notices */}
      <Card className="mt-6 border-border/60">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display font-bold text-primary-dark">Recent notices</h2>
            <Button asChild size="sm" variant="ghost"><Link to="/owner/notices">View all</Link></Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {NOTICES.slice(0, 4).map((n) => (
              <div key={n.id} className="flex items-start gap-3 rounded-lg border p-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary"><FileText className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-muted-foreground">#{n.number} Â· <Clock className="inline h-3 w-3" /> {new Date(n.date).toLocaleDateString("en-IN")}</div>
                  <div className="truncate text-sm font-medium text-primary-dark">{n.title}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashLayout>
  );
}
