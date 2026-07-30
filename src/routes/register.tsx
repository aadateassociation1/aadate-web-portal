import { createFileRoute, Link, useRouter } from "@/lib/simple-router";
import { useState } from "react";
import { SiteLayout } from "@/components/public/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, ChevronLeft, ChevronRight, Upload } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Register Your Gala â€” VPP Market Yard Portal" }, { name: "description", content: "Multi-step trader registration form." }] }),
  component: Register,
});

const STEPS = ["Personal Info", "Gala Info", "Login Info", "Documents", "Review"];
const CATEGORIES = ["Vegetables", "Fruits", "Grains", "Flowers", "Spices", "Agricultural goods", "Grocery", "Packaging material", "Transport service", "Other"];

function Register() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, string>>({ category: "Vegetables" });
  const [agree, setAgree] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const router = useRouter();

  const set = (k: string, v: string) => setData((d) => ({ ...d, [k]: v }));
  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const submit = () => {
    if (!agree) { toast.error("Please accept the terms and conditions"); return; }
    if (data.password !== data.confirm) { toast.error("Passwords do not match"); return; }
    if (!/^\d{10}$/.test(data.mobile || "")) { toast.error("Mobile number must be 10 digits"); return; }
    const app = `REG-${Math.floor(100000 + Math.random() * 899999)}`;
    setDone(app);
    toast.success("Registration submitted successfully");
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
                <p className="mt-3 text-muted-foreground">Your application <span className="font-mono font-bold text-primary">{done}</span> has been received. You will be able to log in after admin approval â€” typically within 48 hours.</p>
                <div className="mt-6 flex justify-center gap-3">
                  <Button asChild variant="outline"><Link to="/">Back to Home</Link></Button>
                  <Button asChild className="bg-primary"><Link to="/login">Go to Login</Link></Button>
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
          <p className="mt-2 text-muted-foreground">Complete all 5 steps. Admin approval is required before you can log in.</p>

          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2 shrink-0">
                <div className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${i <= step ? "bg-primary text-white" : "bg-secondary text-muted-foreground"}`}>{i + 1}</div>
                <span className={`text-xs font-medium ${i === step ? "text-primary" : "text-muted-foreground"}`}>{s}</span>
                {i < STEPS.length - 1 && <div className={`h-0.5 w-6 ${i < step ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          <Card className="mt-6">
            <CardContent className="p-6 sm:p-8">
              {step === 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2"><Label>Full name *</Label><Input required onChange={(e) => set("name", e.target.value)} defaultValue={data.name} /></div>
                  <div><Label>Name in Marathi</Label><Input onChange={(e) => set("nameMr", e.target.value)} defaultValue={data.nameMr} placeholder="à¤®à¤°à¤¾à¤ à¥€à¤¤ à¤¨à¤¾à¤µ" /></div>
                  <div><Label>Date of birth</Label><Input type="date" onChange={(e) => set("dob", e.target.value)} defaultValue={data.dob} /></div>
                  <div><Label>Gender</Label>
                    <Select onValueChange={(v) => set("gender", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div><Label>Aadhaar (last 4)</Label><Input maxLength={4} onChange={(e) => set("aadhaar", e.target.value)} placeholder="XXXX" /></div>
                  <div><Label>Email *</Label><Input required type="email" onChange={(e) => set("email", e.target.value)} defaultValue={data.email} /></div>
                  <div><Label>Registered mobile *</Label><Input required type="tel" pattern="\d{10}" maxLength={10} onChange={(e) => set("mobile", e.target.value)} defaultValue={data.mobile} placeholder="10-digit" /></div>
                  <div><Label>Alternate mobile</Label><Input type="tel" maxLength={10} onChange={(e) => set("altMobile", e.target.value)} defaultValue={data.altMobile} /></div>
                </div>
              )}
              {step === 1 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><Label>Gala number *</Label><Input required onChange={(e) => set("gala", e.target.value)} defaultValue={data.gala} placeholder="e.g. A-101" /></div>
                  <div><Label>Market section</Label><Input onChange={(e) => set("section", e.target.value)} defaultValue={data.section} placeholder="e.g. Vegetable Section A" /></div>
                  <div><Label>Shop category</Label>
                    <Select value={data.category} onValueChange={(v) => set("category", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Business name</Label><Input onChange={(e) => set("business", e.target.value)} defaultValue={data.business} /></div>
                  <div><Label>Ownership type</Label>
                    <Select onValueChange={(v) => set("ownership", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent><SelectItem value="owned">Owned</SelectItem><SelectItem value="rented">Rented</SelectItem><SelectItem value="lease">Lease</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div><Label>Year of establishment</Label><Input type="number" min="1950" max="2026" onChange={(e) => set("estYear", e.target.value)} defaultValue={data.estYear} /></div>
                  <div><Label>License number</Label><Input onChange={(e) => set("license", e.target.value)} defaultValue={data.license} /></div>
                  <div><Label>License expiry</Label><Input type="date" onChange={(e) => set("licenseExp", e.target.value)} defaultValue={data.licenseExp} /></div>
                  <div className="sm:col-span-2"><Label>Shop address</Label><Textarea rows={2} onChange={(e) => set("address", e.target.value)} defaultValue={data.address} /></div>
                </div>
              )}
              {step === 2 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><Label>Username *</Label><Input required onChange={(e) => set("username", e.target.value)} defaultValue={data.username} /></div>
                  <div><Label>Registered mobile</Label><Input value={data.mobile || ""} disabled /></div>
                  <div><Label>Password *</Label><Input required type="password" minLength={8} onChange={(e) => set("password", e.target.value)} /></div>
                  <div><Label>Confirm password *</Label><Input required type="password" minLength={8} onChange={(e) => set("confirm", e.target.value)} /></div>
                  <div className="sm:col-span-2 text-xs text-muted-foreground">Password must be at least 8 characters, include a number and a symbol.</div>
                </div>
              )}
              {step === 3 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {["Profile photo", "Gala ownership document", "Market license", "ID proof (Aadhaar)", "Other document"].map((doc) => (
                    <label key={doc} className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border p-6 cursor-pointer hover:border-primary hover:bg-secondary/50 transition">
                      <Upload className="h-6 w-6 text-primary" />
                      <div className="text-sm font-medium text-primary-dark text-center">{doc}</div>
                      <div className="text-xs text-muted-foreground">Click to upload (max 5 MB)</div>
                      <input type="file" className="hidden" />
                    </label>
                  ))}
                </div>
              )}
              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="font-display font-semibold text-primary-dark">Review your details</h3>
                  <div className="grid gap-2 rounded-xl border p-4 text-sm sm:grid-cols-2">
                    {Object.entries(data).filter(([, v]) => v).map(([k, v]) => (
                      <div key={k}><span className="text-muted-foreground capitalize">{k}: </span><span className="font-medium">{k === "password" || k === "confirm" ? "â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" : v}</span></div>
                    ))}
                  </div>
                  <label className="flex gap-3 rounded-xl border p-4 cursor-pointer">
                    <Checkbox checked={agree} onCheckedChange={(v) => setAgree(Boolean(v))} />
                    <span className="text-sm">I accept the association's terms &amp; conditions, portal guidelines and confirm all details are accurate.</span>
                  </label>
                </div>
              )}

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={prev} disabled={step === 0}><ChevronLeft className="h-4 w-4 mr-1" /> Back</Button>
                {step < STEPS.length - 1 ? (
                  <Button onClick={next} className="bg-primary">Next <ChevronRight className="h-4 w-4 ml-1" /></Button>
                ) : (
                  <Button onClick={submit} className="bg-saffron text-saffron-foreground hover:bg-saffron/90">Submit Registration</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </SiteLayout>
  );
}
