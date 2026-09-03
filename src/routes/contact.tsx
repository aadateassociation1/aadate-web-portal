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
import { useI18n } from "@/lib/i18n";

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
  const { lang } = useI18n();
  const [sent, setSent] = useState(false);
  const copy = lang === "mr"
    ? {
        addressTitle: "\u0915\u093e\u0930\u094d\u092f\u093e\u0932\u092f \u092a\u0924\u094d\u0924\u093e",
        address: "\u092a\u0939\u093f\u0932\u093e \u092e\u091c\u0932\u093e, \u092a\u093e\u0928 \u092c\u093e\u091c\u093e\u0930 \u092c\u093f\u0932\u094d\u0921\u093f\u0902\u0917, \u0936\u094d\u0930\u0940 \u091b\u0924\u094d\u0930\u092a\u0924\u0940 \u0936\u093f\u0935\u093e\u091c\u0940 \u092e\u093e\u0930\u094d\u0915\u0947\u091f \u092f\u093e\u0930\u094d\u0921 \u0905\u0921\u0924\u0947 \u0938\u0902\u0918\u091f\u0928\u093e \u0939\u0949\u0932, \u0917\u0941\u0932\u091f\u0947\u0915\u0921\u0940, \u092a\u0941\u0923\u0947 - \u096a\u0967\u0967\u0966\u0969\u096d.",
        registrationTitle: "\u0928\u094b\u0902\u0926\u0923\u0940 \u0915\u094d\u0930.",
        registrationBody: "\u0928\u094b\u0902\u0926\u0923\u0940 \u0915\u094d\u0930.: \u092e\u0939\u093e\u0930\u093e\u0937\u094d\u091f\u094d\u0930-\u0967\u0966\u0968\u096c/\u0968\u0966\u0967\u0969",
        ptrTitle: "\u092a\u0940.\u091f\u0940.\u0906\u0930. \u0915\u094d\u0930.",
        ptrBody: "\u092a\u0940.\u091f\u0940.\u0906\u0930. \u0915\u094d\u0930.: F. \u096a\u0967\u096e\u096a\u0967 / \u092a\u0941\u0923\u0947",
        emailTitle: "\u0908\u092e\u0947\u0932",
        hoursTitle: "\u0915\u093e\u0930\u094d\u092f\u093e\u0932\u092f\u0940\u0928 \u0935\u0947\u0933",
        hoursBody: "\u0938\u094b\u092e\u0935\u093e\u0930 \u0924\u0947 \u0936\u0928\u093f\u0935\u093e\u0930, \u0938\u0915\u093e\u0933\u0940 \u096e:\u0966\u0966 \u0924\u0947 \u0938\u0902\u0927\u094d\u092f\u093e\u0915\u093e\u0933\u0940 \u096c:\u0966\u0966",
        heading: "\u0906\u092e\u094d\u0939\u093e\u0932\u093e \u0938\u0902\u0926\u0947\u0936 \u092a\u093e\u0920\u0935\u093e",
        fullName: "\u092a\u0942\u0930\u094d\u0923 \u0928\u093e\u0935",
        fullNamePlaceholder: "\u0924\u0941\u092e\u091a\u0947 \u0928\u093e\u0935",
        mobile: "\u092e\u094b\u092c\u093e\u0908\u0932",
        mobilePlaceholder: "\u0967\u0966 \u0905\u0902\u0915\u0940 \u092e\u094b\u092c\u093e\u0908\u0932",
        email: "\u0908\u092e\u0947\u0932",
        subject: "\u0935\u093f\u0937\u092f",
        subjectPlaceholder: "\u091a\u094c\u0915\u0936\u0940\u091a\u093e \u0935\u093f\u0937\u092f",
        message: "\u0938\u0902\u0926\u0947\u0936",
        messagePlaceholder: "\u0906\u092e\u094d\u0939\u0940 \u0915\u0936\u0940 \u092e\u0926\u0924 \u0915\u0930\u0942 \u0936\u0915\u0924\u094b?",
        send: "\u0938\u0902\u0926\u0947\u0936 \u092a\u093e\u0920\u0935\u093e",
        sent: "\u0938\u0902\u0926\u0947\u0936 \u092a\u093e\u0920\u0935\u0932\u093e",
        toast: "\u0938\u0902\u0926\u0947\u0936 \u092a\u093e\u0920\u0935\u0932\u093e - \u0906\u092e\u094d\u0939\u0940 \u0968\u096a \u0924\u093e\u0938\u093e\u0902\u0924 \u0909\u0924\u094d\u0924\u0930 \u0926\u0947\u090a",
      }
    : {
        addressTitle: "Office Address",
        address: ASSOCIATION_ADDRESS,
        registrationTitle: "Registration No.",
        registrationBody: ASSOCIATION_REGISTRATION,
        ptrTitle: "P.T.R. No.",
        ptrBody: ASSOCIATION_PTR,
        emailTitle: "Email",
        hoursTitle: "Office Hours",
        hoursBody: "Mon - Sat, 8:00 AM - 6:00 PM",
        heading: "Send us a message",
        fullName: "Full name",
        fullNamePlaceholder: "Your name",
        mobile: "Mobile",
        mobilePlaceholder: "10-digit mobile",
        email: "Email",
        subject: "Subject",
        subjectPlaceholder: "Enquiry subject",
        message: "Message",
        messagePlaceholder: "How can we help you?",
        send: "Send Message",
        sent: "Sent",
        toast: "Message sent - we'll reply within 24 hours",
      };

  return (
    <SiteLayout>
      <section className="py-14">
        <div className="container-page grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-1">
            {[
              { icon: MapPin, title: copy.addressTitle, body: copy.address, mapUrl: ASSOCIATION_MAP_LINK_URL },
              { icon: Phone, title: copy.registrationTitle, body: copy.registrationBody },
              { icon: AlertCircle, title: copy.ptrTitle, body: copy.ptrBody },
              { icon: Mail, title: copy.emailTitle, body: ASSOCIATION_EMAIL },
              { icon: Clock, title: copy.hoursTitle, body: copy.hoursBody },
            ].map((c) => (
              <Card key={c.title} className="border-border/60">
                <CardContent className="flex gap-3 p-5" data-no-translate>
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

          <div className="space-y-6 lg:col-span-2">
            <Card className="border-border/60">
              <CardContent className="p-6">
                <h2 className="font-display text-xl font-bold text-primary-dark" data-no-translate>{copy.heading}</h2>
                <form
                  className="mt-5 grid gap-4"
                  data-no-translate
                  onSubmit={(e) => { e.preventDefault(); setSent(true); toast.success(copy.toast); (e.target as HTMLFormElement).reset(); setTimeout(() => setSent(false), 3000); }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><Label data-no-translate>{copy.fullName}</Label><Input required placeholder={copy.fullNamePlaceholder} /></div>
                    <div><Label data-no-translate>{copy.mobile}</Label><Input required type="tel" inputMode="numeric" maxLength={10} pattern="\d{10}" placeholder={copy.mobilePlaceholder} onInput={(event) => { event.currentTarget.value = limitDigits(event.currentTarget.value, 10); }} /></div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><Label data-no-translate>{copy.email}</Label><Input required type="email" placeholder="you@example.com" /></div>
                    <div><Label data-no-translate>{copy.subject}</Label><Input required placeholder={copy.subjectPlaceholder} /></div>
                  </div>
                  <div><Label data-no-translate>{copy.message}</Label><Textarea required rows={5} placeholder={copy.messagePlaceholder} /></div>
                  <Button type="submit" className="w-full bg-saffron text-saffron-foreground hover:bg-saffron/90 sm:w-auto" disabled={sent} data-no-translate>{sent ? copy.sent : copy.send}</Button>
                </form>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-border/60">
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
