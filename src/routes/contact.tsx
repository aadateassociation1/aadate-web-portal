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

const ASSOCIATION_NAME = "Shree Chhatrapati Shivaji Market Yard Adte Association";
const ASSOCIATION_REGISTRATION = "Registration No.: Maharashtra-1026/2013";
const ASSOCIATION_PTR = "P.T.R. No.: F. 41841 / Pune";
const ASSOCIATION_ADDRESS = "First Floor, Pan Bazar Building, Shree Chhatrapati Shivaji Market Yard Adte Association Hall, Gultekdi, Pune - 411037.";
const ASSOCIATION_EMAIL = "aadateassociation1@gmail.com";
const ASSOCIATION_MAP_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121086.05561617303!2d73.71149379726565!3d18.486411300000007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c022bfffffff%3A0xdca80b98f93f015e!2sShree%20Chhatrapati%20Shivaji%20Market%20Yard%20Adate%20Assoc!5e0!3m2!1sen!2sin!4v1788258576279!5m2!1sen!2sin";
const ASSOCIATION_MAP_LINK_URL = "https://www.google.com/maps/search/?api=1&query=Shree%20Chhatrapati%20Shivaji%20Market%20Yard%20Adate%20Assoc%2C%20First%20Floor%2C%20Pan%20Bazar%20Building%2C%20Gultekdi%2C%20Pune%20411037";
const limitDigits = (value: string, maxLength: number) => value.replace(/\D/g, "").slice(0, maxLength);

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
      <section className="py-14">
        <div className="container-page grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-1">
            {[
              { icon: MapPin, title: "Office Address", body: ASSOCIATION_ADDRESS, mapUrl: ASSOCIATION_MAP_LINK_URL },
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
                    <div className="text-sm text-muted-foreground">{"mapUrl" in c && c.mapUrl ? <a href={c.mapUrl} target="_blank" rel="noreferrer" className="hover:text-primary hover:underline">{c.body}</a> : c.body}</div>
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
                    <div><Label>Mobile</Label><Input required type="tel" inputMode="numeric" maxLength={10} pattern="\d{10}" placeholder="10-digit mobile" onInput={(event) => { event.currentTarget.value = limitDigits(event.currentTarget.value, 10); }} /></div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><Label>Email</Label><Input required type="email" placeholder="you@example.com" /></div>
                    <div><Label>Subject</Label><Input required placeholder="Enquiry subject" /></div>
                  </div>
                  <div><Label>Message</Label><Textarea required rows={5} placeholder="How can we help you?" /></div>
                  <Button type="submit" className="w-full sm:w-auto bg-saffron text-saffron-foreground hover:bg-saffron/90" disabled={sent}>{sent ? "Sent ✓" : "Send Message"}</Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-border/60 overflow-hidden">
              <iframe
                src={ASSOCIATION_MAP_EMBED_URL}
                title="Shree Chhatrapati Shivaji Market Yard Adte Association location"
                className="aspect-[16/9] w-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </Card>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
