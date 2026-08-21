import { createFileRoute } from "@/lib/simple-router";
import { useState } from "react";
import { SiteLayout } from "@/components/public/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const ASSOCIATION_NAME = "Shri Chhatrapati Shivaji Market Yard Adte Association";
const ASSOCIATION_REGISTRATION = "Registration No.: Maharashtra-1026/2013";
const ASSOCIATION_PTR = "P.T.R. No.: F. 41841 / Pune";
const ASSOCIATION_ADDRESS = "First Floor, Pan Bazar Building, Shri Chhatrapati Shivaji Market Yard Adte Association Hall, Gultekdi, Pune - 411037.";
const ASSOCIATION_EMAIL = "aadateassociation1@gmail.com";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact Us - ${ASSOCIATION_NAME}` },
      { name: "description", content: "Reach our office, submit an enquiry or use emergency contacts." },
      { property: "og:title", content: `Contact Us - ${ASSOCIATION_NAME}` },
      { property: "og:description", content: "Office address, phone, email and enquiry form." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <SiteLayout>
      <section className="hero-gradient text-white py-14">
        <div className="container-page">
          <h1 className="font-display text-3xl font-bold sm:text-5xl">Contact Us</h1>
          <p className="mt-3 text-white/80">Reach us via phone, email or the enquiry form.</p>
        </div>
      </section>

      <section className="py-14">
        <div className="container-page grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-1">
            {[
              { icon: MapPin, title: "Office Address", body: ASSOCIATION_ADDRESS },
              { icon: Phone, title: "Registration No.", body: ASSOCIATION_REGISTRATION },
              { icon: AlertCircle, title: "P.T.R. No.", body: ASSOCIATION_PTR },
              { icon: Mail, title: "Email", body: ASSOCIATION_EMAIL },
              { icon: Clock, title: "Office Hours", body: "Mon - Sat, 8:00 AM - 6:00 PM" },
            ].map((c) => (
              <Card key={c.title} className="border-border/60">
                <CardContent className="p-5 flex gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display font-semibold text-primary-dark">{c.title}</div>
                    <div className="text-sm text-muted-foreground">{c.body}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/60">
              <CardContent className="p-6">
                <h2 className="font-display text-xl font-bold text-primary-dark">Send us a message</h2>
                <form
                  className="mt-5 grid gap-4"
                  onSubmit={(e) => { e.preventDefault(); setSent(true); toast.success("Message sent - we'll reply within 24 hours"); (e.target as HTMLFormElement).reset(); setTimeout(() => setSent(false), 3000); }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><Label>Full name</Label><Input required placeholder="Your name" /></div>
                    <div><Label>Mobile</Label><Input required type="tel" pattern="\d{10}" placeholder="10-digit mobile" /></div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><Label>Email</Label><Input required type="email" placeholder="you@example.com" /></div>
                    <div><Label>Subject</Label><Input required placeholder="Enquiry subject" /></div>
                  </div>
                  <div><Label>Message</Label><Textarea required rows={5} placeholder="How can we help you?" /></div>
                  <Button type="submit" className="w-full sm:w-auto bg-primary" disabled={sent}>{sent ? "Sent ✓" : "Send Message"}</Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-border/60 overflow-hidden">
              <div className="aspect-[16/9] bg-secondary grid place-items-center text-muted-foreground">
                <div className="text-center">
                  <MapPin className="mx-auto h-10 w-10 text-primary" />
                  <div className="mt-2 font-semibold text-primary-dark">Google Map placeholder</div>
                  <div className="text-xs">Gultekdi, Pune - 411037</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
