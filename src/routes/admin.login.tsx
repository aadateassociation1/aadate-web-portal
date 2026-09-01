import { createFileRoute, Link, useRouter } from "@/lib/simple-router";
import { useState } from "react";
import { ShieldCheck, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import type { UserRole } from "@/lib/mock";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login - Shree Chhatrapati Shivaji Market Yard Adte Association" },
      { name: "description", content: "Hidden admin hub login for Main Admin and User Admin." },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginForm({ role }: { role: Extract<UserRole, "main_admin" | "user_admin"> }) {
  const { login } = useAuth();
  const router = useRouter();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const res = await login(id.trim(), pw, role);
    if (!res.ok) {
      setErr(res.message);
      return;
    }

    toast.success(res.message);
    router.navigate({ to: "/admin" });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label>Email, mobile number, or username</Label>
        <Input required value={id} onChange={(event) => setId(event.target.value)} placeholder="Admin email, username, or mobile" autoComplete="username" />
      </div>
      <div>
        <Label>Password</Label>
        <Input required type="password" value={pw} onChange={(event) => setPw(event.target.value)} autoComplete="current-password" />
      </div>
      {err && <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{err}</div>}
      <Button type="submit" className="w-full bg-saffron text-saffron-foreground hover:bg-saffron/90" size="lg">Sign in to Admin Hub</Button>
    </form>
  );
}

function AdminLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-muted/40 px-4 py-10">
      <Card className="w-full max-w-md border-border/60">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl saffron-gradient">
              <KeyRound className="h-5 w-5 text-primary-dark" />
            </div>
            <div>
              <div className="font-display text-lg font-bold text-primary-dark">Admin Hub</div>
              <div className="text-xs text-muted-foreground">Main Admin and User Admin access</div>
            </div>
          </div>

          <Tabs defaultValue="user_admin">
            <TabsList className="grid h-auto w-full grid-cols-2">
              <TabsTrigger value="user_admin">User Admin</TabsTrigger>
              <TabsTrigger value="main_admin">Main Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="user_admin" className="mt-5">
              <AdminLoginForm role="user_admin" />
            </TabsContent>
            <TabsContent value="main_admin" className="mt-5">
              <AdminLoginForm role="main_admin" />
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex items-center justify-between border-t pt-4 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary">Public website</Link>
            <Link to="/login" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
              <ShieldCheck className="h-4 w-4" /> Member login
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
