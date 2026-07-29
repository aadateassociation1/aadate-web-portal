import { createFileRoute, Link, useRouter } from "@/lib/simple-router";
import { useState } from "react";
import { SiteLayout } from "@/components/public/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { KeyRound, User, Shield, ShieldCheck, Info } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { DEMO_CREDS, type UserRole } from "@/lib/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login â€” VPP Market Yard Portal" }, { name: "description", content: "Sign in to the VPP Market Yard portal as member or admin." }] }),
  component: LoginPage,
});

function LoginForm({ role }: { role: UserRole }) {
  const { login } = useAuth();
  const router = useRouter();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(id.trim(), pw, role);
    if (!res.ok) { setErr(res.message); return; }
    toast.success(res.message);
    router.navigate({ to: role === "owner" ? "/owner" : "/admin" });
  };

  const creds = DEMO_CREDS[role];

  return (
    <form onSubmit={submit} className="space-y-4">
      <Alert className="border-saffron/40 bg-saffron/10">
        <Info className="h-4 w-4 text-saffron" />
        <AlertDescription className="text-xs">
          <span className="font-semibold">Demo credentials:</span> {creds.mobile} / {creds.username} Â· <code className="rounded bg-primary/10 px-1">{creds.password}</code>
        </AlertDescription>
      </Alert>
      <div>
        <Label>Mobile number or username</Label>
        <Input required value={id} onChange={(e) => setId(e.target.value)} placeholder={role === "owner" ? "Registered mobile number" : "Username"} autoComplete="username" />
      </div>
      <div>
        <div className="flex items-center justify-between"><Label>Password</Label><Link to="/login" className="text-xs text-primary hover:underline">Forgot password?</Link></div>
        <Input required type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" />
      </div>
      {err && <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{err}</div>}
      <Button type="submit" className="w-full bg-primary" size="lg">Sign in</Button>
    </form>
  );
}

function LoginPage() {
  return (
    <SiteLayout>
      <section className="bg-leaf py-12 md:py-16">
        <div className="container-page grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,460px)] lg:items-start">
          <div>
            <h1 className="font-display text-3xl font-bold text-primary-dark sm:text-4xl">Sign in to the portal</h1>
            <p className="mt-3 text-muted-foreground">Access market updates, notices, complaints and administration.</p>
            <div className="mt-6 space-y-3">
              {[
                { icon: User, title: "Members", body: "Sign in with your registered mobile number." },
                { icon: ShieldCheck, title: "User Admin", body: "Support complaints, users and content." },
                { icon: Shield, title: "Main Admin", body: "Full portal administration and approvals." },
              ].map((r) => (
                <Card key={r.title} className="border-border/60">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary"><r.icon className="h-5 w-5" /></div>
                    <div><div className="font-semibold text-primary-dark text-sm">{r.title}</div><div className="text-xs text-muted-foreground">{r.body}</div></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <Card className="border-border/60">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-2">
                <div className="grid h-10 w-10 place-items-center rounded-xl saffron-gradient"><KeyRound className="h-5 w-5 text-primary-dark" /></div>
                <div className="font-display font-bold text-primary-dark">Choose your role</div>
              </div>
              <Tabs defaultValue="owner">
                <TabsList className="grid h-auto w-full grid-cols-3">
                  <TabsTrigger value="owner" className="px-1.5 text-xs sm:px-3 sm:text-sm">Member</TabsTrigger>
                  <TabsTrigger value="user_admin" className="px-1.5 text-xs sm:px-3 sm:text-sm">User Admin</TabsTrigger>
                  <TabsTrigger value="main_admin" className="px-1.5 text-xs sm:px-3 sm:text-sm">Main Admin</TabsTrigger>
                </TabsList>
                <TabsContent value="owner" className="mt-5"><LoginForm role="owner" /></TabsContent>
                <TabsContent value="user_admin" className="mt-5"><LoginForm role="user_admin" /></TabsContent>
                <TabsContent value="main_admin" className="mt-5"><LoginForm role="main_admin" /></TabsContent>
              </Tabs>
              <div className="mt-6 border-t pt-4 text-center text-sm text-muted-foreground">
                New here? <Link to="/register" className="font-semibold text-primary hover:underline">Register your gala</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </SiteLayout>
  );
}
