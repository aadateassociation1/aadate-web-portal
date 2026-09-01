import { createFileRoute, Link } from "@/lib/simple-router";
import { useState, type FormEvent } from "react";
import { SiteLayout } from "@/components/public/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Member Registration - Shree Chhatrapati Shivaji Market Yard Adte Association Portal" }, { name: "description", content: "Member registration form." }] }),
  component: Register,
});

const DEPARTMENT_OPTIONS = [
  { value: "भाजीपाला / Vegetables", label: "भाजीपाला / Vegetables" },
  { value: "केळी विभाग / Banana Department", label: "केळी विभाग / Banana Department" },
  { value: "फळविभाग / Fruit Department", label: "फळविभाग / Fruit Department" },
  { value: "कांदा-बटाटा / Onion-Potato", label: "कांदा-बटाटा / Onion-Potato" },
];
const limitDigits = (value: string, maxLength: number) => value.replace(/\D/g, "").slice(0, maxLength);

function Register() {
  const [mode, setMode] = useState<"new" | "add-gala">("new");
  const [agree, setAgree] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [duplicateMember, setDuplicateMember] = useState<{ memberName?: string; traderCode?: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const srNo = String(formData.get("srNo") || "").trim();
    const number = String(formData.get("number") || "").trim();
    const business = String(formData.get("business") || "").trim();
    const name = String(formData.get("name") || "").trim();
    const address = String(formData.get("address") || "").trim();
    const section = String(formData.get("section") || "").trim();
    const mobile = String(formData.get("mobile") || "").replace(/\D/g, "");
    const username = String(formData.get("username") || "").trim();
    const password = String(formData.get("password") || "");
    const confirm = String(formData.get("confirm") || "");

    if (!business || !address || !section || (mode === "new" && (!name || !username))) {
      toast.error("Please fill all registration fields.");
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      toast.error("Contact number must be 10 digits.");
      return;
    }
    if (password.length < 8 || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      toast.error("Password must be 8+ characters with a number and symbol.");
      return;
    }
    if (mode === "new" && password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!agree) {
      toast.error("Please accept the confirmation checkbox.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(mode === "new" ? "/api/v1/auth/trader/register" : "/api/v1/auth/trader/add-gala", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          username,
          mobile,
          password,
          business,
          gala: address,
          address,
          section,
          associationSequenceNumber: srNo,
          associationRegistrationNumber: number,
        }),
      });
      const text = await response.text();
      const result = text ? JSON.parse(text) : null;
      if (!response.ok || !result?.ok) {
        if (result?.duplicateMobile) {
          setDuplicateMember({ memberName: result.memberName, traderCode: result.traderCode });
          setMode("add-gala");
        }
        throw new Error(result?.error || `Registration failed (${response.status})`);
      }
      setDone(result.applicationId);
      toast.success("Registration submitted successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <SiteLayout>
        <section className="py-20">
          <div className="container-page max-w-xl">
            <Card className="border-primary/40 text-center">
              <CardContent className="p-10">
                <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
                <h1 className="mt-5 font-display text-2xl font-bold text-primary-dark">Registration submitted</h1>
                <p className="mt-3 text-muted-foreground">Your application <span className="font-mono font-bold text-primary">{done}</span> has been received. You will be able to log in after admin approval.</p>
                <div className="mt-6 flex justify-center gap-3">
                  <Button asChild variant="outline"><Link to="/">Back to Home</Link></Button>
                  <Button asChild className="bg-saffron text-saffron-foreground hover:bg-saffron/90"><Link to="/login">Go to Login</Link></Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="bg-leaf py-12">
        <div className="container-page max-w-3xl">
          <h1 className="font-display text-3xl font-bold text-primary-dark">Register Your Gala</h1>
          <p className="mt-2 text-muted-foreground">
            {mode === "new" ? "Fill member details, login details, and confirmation." : "Add one more gala/shop to an existing member login using the registered mobile and password."}
          </p>

          <div className="mt-5 inline-flex max-w-full flex-wrap gap-1 rounded-lg border bg-background p-1 shadow-sm">
            <Button type="button" size="sm" variant={mode === "new" ? "default" : "ghost"} className={mode === "new" ? "h-9 bg-saffron text-saffron-foreground hover:bg-saffron/90 px-4" : "h-9 px-4"} onClick={() => { setMode("new"); setDuplicateMember(null); }}>
              New Member Registration
            </Button>
            <Button type="button" size="sm" variant={mode === "add-gala" ? "default" : "ghost"} className={mode === "add-gala" ? "h-9 bg-saffron text-saffron-foreground hover:bg-saffron/90 px-4" : "h-9 px-4"} onClick={() => setMode("add-gala")}>
              Add Another Gala / Shop
            </Button>
          </div>

          {duplicateMember && (
            <div className="mt-4 rounded-xl border border-saffron/40 bg-saffron/10 p-4 text-sm text-primary-dark">
              <div className="font-semibold">This mobile number is already registered.</div>
              <div className="mt-1">Add another Gala / Shop to {duplicateMember.memberName || "this member"} {duplicateMember.traderCode ? `(${duplicateMember.traderCode})` : ""} using the existing password.</div>
            </div>
          )}

          <Card className="mt-6">
            <CardContent className="p-6 sm:p-8">
              <form className="grid gap-4 sm:grid-cols-2" onSubmit={submit}>
                <div>
                  <Label>अ.नु.क्रमांक / Sr. No.</Label>
                  <Input name="srNo" />
                </div>
                <div>
                  <Label>क्रमांक / Number</Label>
                  <Input name="number" />
                </div>
                <div>
                  <Label>फर्मचे नाव / Firm Name *</Label>
                  <Input name="business" required />
                </div>
                <div>
                  <Label>सभासदाचे नाव / Member Name *</Label>
                  <Input name="name" required={mode === "new"} />
                </div>
                <div className="sm:col-span-2">
                  <Label>पत्ता : गाळा क्रमांक / Address / Gala (Shop) No. *</Label>
                  <Textarea name="address" required rows={2} />
                </div>
                <div>
                  <Label>बाजार सेक्शन / Market section *</Label>
                  <select
                    name="section"
                    required
                    defaultValue=""
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="" disabled>Select market section</option>
                    {DEPARTMENT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>संपर्क / Contact *</Label>
                  <Input name="mobile" required type="tel" inputMode="numeric" pattern="\d{10}" maxLength={10} placeholder="10-digit" onInput={(event) => { event.currentTarget.value = limitDigits(event.currentTarget.value, 10); }} />
                </div>
                {mode === "new" && (
                  <div>
                    <Label>Username *</Label>
                    <Input name="username" required />
                  </div>
                )}
                <div>
                  <Label>{mode === "new" ? "Password *" : "Existing account password *"}</Label>
                  <div className="relative">
                    <Input
                      name="password"
                      required
                      type={showPassword ? "text" : "password"}
                      minLength={8}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground transition hover:text-foreground"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {mode === "new" && (
                  <div>
                    <Label>Confirm password *</Label>
                    <div className="relative">
                      <Input
                        name="confirm"
                        required
                        type={showConfirmPassword ? "text" : "password"}
                        minLength={8}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground transition hover:text-foreground"
                        onClick={() => setShowConfirmPassword((value) => !value)}
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}
                <div className="self-end text-xs text-muted-foreground">Password must be 8+ characters with a number and symbol.</div>
                <label className="flex cursor-pointer gap-3 rounded-xl border p-4 sm:col-span-2">
                  <Checkbox checked={agree} onCheckedChange={(value) => setAgree(Boolean(value))} />
                  <span className="text-sm">I confirm all details are accurate and accept the association's portal guidelines.</span>
                </label>
                <div className="flex justify-end sm:col-span-2">
                  <Button className="bg-saffron text-saffron-foreground hover:bg-saffron/90" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Registration"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </SiteLayout>
  );
}
