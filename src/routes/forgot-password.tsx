import { createFileRoute, Link, useRouter } from "@/lib/simple-router";
import { useState } from "react";
import { SiteLayout } from "@/components/public/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const limitDigits = (value: string, maxLength: number) => value.replace(/\D/g, "").slice(0, maxLength);

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot Password - Shree Chhatrapati Shivaji Market Yard Adte Association Portal" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<"mobile" | "otp" | "password">("mobile");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    const cleaned = mobile.trim().replace(/\D/g, "");
    if (!/^\d{10}$/.test(cleaned)) {
      toast.error("Enter a valid registered mobile number.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/v1/auth/trader/password-reset/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: cleaned }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not send OTP.");
      setMobile(cleaned);
      setStep("otp");
      toast.success(result.message || "OTP sent to registered mobile number.");
      if (result.devOtp) toast.info(`Dev OTP: ${result.devOtp}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!/^\d{6}$/.test(otp.trim())) {
      toast.error("Enter the 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/v1/auth/trader/password-reset/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobile.trim(), otp: otp.trim() }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not verify OTP.");
      setResetToken(result.resetToken || "");
      setStep("password");
      toast.success("OTP verified.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/v1/auth/trader/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not update password.");
      toast.success("Password updated successfully.");
      router.navigate({ to: "/login" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <section className="bg-leaf py-12 md:py-16">
        <div className="container-page grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,460px)] lg:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-saffron/40 bg-saffron/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-saffron">
              <ShieldCheck className="h-3.5 w-3.5" /> Password recovery
            </span>
            <h1 className="mt-5 font-display text-3xl font-bold text-primary-dark sm:text-4xl">Reset your member password</h1>
            <p className="mt-3 max-w-xl text-muted-foreground">Enter your registered mobile number, verify the OTP, and set a new password.</p>
            <div className="mt-6 rounded-lg border bg-background p-4 text-sm text-muted-foreground">
              Flow: Enter Mobile Number → Send OTP → Verify OTP → New Password → Confirm Password → Password Updated
            </div>
          </div>
          <Card className="border-border/60">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-2">
                <div className="grid h-10 w-10 place-items-center rounded-xl saffron-gradient"><KeyRound className="h-5 w-5 text-primary-dark" /></div>
                <div className="font-display font-bold text-primary-dark">Forgot password</div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Registered mobile number</Label>
                  <Input value={mobile} onChange={(event) => setMobile(limitDigits(event.target.value, 10))} placeholder="10-digit mobile number" inputMode="numeric" maxLength={10} pattern="\d{10}" disabled={step !== "mobile"} />
                </div>
                <Button type="button" className="w-full bg-saffron text-saffron-foreground hover:bg-saffron/90" onClick={sendOtp} disabled={loading || step !== "mobile"}>
                  {loading && step === "mobile" ? "Sending..." : "Send OTP"}
                </Button>

                {step !== "mobile" && (
                  <>
                    <div>
                      <Label>OTP</Label>
                      <Input value={otp} onChange={(event) => setOtp(limitDigits(event.target.value, 6))} placeholder="6-digit OTP" inputMode="numeric" maxLength={6} pattern="\d{6}" />
                    </div>
                    <Button type="button" className="w-full bg-saffron text-saffron-foreground hover:bg-saffron/90" onClick={verifyOtp} disabled={loading || step !== "otp"}>
                      {loading && step === "otp" ? "Verifying..." : "Verify OTP"}
                    </Button>
                  </>
                )}

                {step === "password" && (
                  <>
                    <div>
                      <Label>New password</Label>
                      <Input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="New password" />
                    </div>
                    <div>
                      <Label>Confirm password</Label>
                      <Input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm password" />
                    </div>
                    <Button type="button" className="w-full bg-saffron text-saffron-foreground hover:bg-saffron/90" onClick={updatePassword} disabled={loading}>
                      {loading ? "Updating..." : "Update password"}
                    </Button>
                  </>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between border-t pt-4 text-sm">
                <Link to="/login" className="text-muted-foreground hover:text-primary">Back to login</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </SiteLayout>
  );
}
