import { createFileRoute, Link, useRouter } from "@/lib/simple-router";
import { useState } from "react";
import { SiteLayout } from "@/components/public/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import type { UserRole } from "@/lib/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login - Shree Chhatrapati Shivaji Market Yard Adte Association Portal" }, { name: "description", content: "Sign in to the Shree Chhatrapati Shivaji Market Yard Adte Association portal as Member or admin." }] }),
  component: LoginPage,
});

function LoginForm({ role }: { role: UserRole }) {
  const { login } = useAuth();
  const router = useRouter();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await login(id.trim(), pw, role);
    if (!res.ok) { setErr(res.message); return; }
    toast.success(res.message);
    router.navigate({ to: role === "owner" ? "/member" : "/admin" });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label>Mobile number or username</Label>
        <Input required value={id} onChange={(e) => setId(e.target.value)} placeholder={role === "owner" ? "Registered mobile number" : "Username"} autoComplete="username" />
      </div>
      <div>
        <div className="flex items-center justify-between"><Label>Password</Label><Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link></div>
        <Input required type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" />
      </div>
      {err && <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{err}</div>}
      <Button type="submit" className="w-full bg-saffron text-saffron-foreground hover:bg-saffron/90" size="lg">Sign in</Button>
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
            <p className="mt-3 text-muted-foreground">Access market updates, notices, customer records and Member services.</p>
            <div className="mt-6 space-y-3">
              <Card className="border-border/60">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary"><User className="h-5 w-5" /></div>
                  <div><div className="font-semibold text-primary-dark text-sm">Member Portal</div><div className="text-xs text-muted-foreground">Sign in with your registered mobile number.</div></div>
                </CardContent>
              </Card>
            </div>
          </div>
          <Card className="border-border/60">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-2">
                <div className="grid h-10 w-10 place-items-center rounded-xl saffron-gradient"><KeyRound className="h-5 w-5 text-primary-dark" /></div>
                <div className="font-display font-bold text-primary-dark">Member sign in</div>
              </div>
              <LoginForm role="owner" />
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
