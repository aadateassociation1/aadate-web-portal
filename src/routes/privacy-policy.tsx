import { createFileRoute, Link } from "@/lib/simple-router";
import { SiteLayout } from "@/components/public/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, FileText, LockKeyhole, Mail, ShieldCheck, UserCheck } from "lucide-react";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy - Shree Chhatrapati Shivaji Market Yard Adte Association" },
      { name: "description", content: "Privacy practices for the Market Yard digital portal, member records, complaints, notices, and gallery content." },
    ],
  }),
  component: PrivacyPolicy,
});

const sections = [
  { icon: UserCheck, title: "Information we collect", body: "We collect member registration details, gala information, contact numbers, KYC documents, customer records submitted by members, complaint details, ratings, and media uploaded through the portal." },
  { icon: Database, title: "How we use data", body: "Information is used for association administration, member verification, complaint resolution, market notices, public gallery publishing, audit records, and secure dashboard access." },
  { icon: LockKeyhole, title: "Access and security", body: "Dashboard access is role based. Admin functions are limited to authorised users, and member areas require login. Uploaded records are handled for portal operations and compliance purposes." },
  { icon: ShieldCheck, title: "Public visibility", body: "Only approved public content such as notices, gallery items, market updates, and reshared reviews appears on the public website. Private member documents are not displayed publicly." },
];

function PrivacyPolicy() {
  return (
    <SiteLayout>
      <section className="bg-leaf py-14 md:py-18">
        <div className="container-page">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Portal policy</span>
            <h1 className="mt-3 font-display text-3xl font-bold text-primary-dark sm:text-4xl">Privacy Policy</h1>
            <p className="mt-4 text-justify leading-relaxed text-muted-foreground [hyphens:auto]">
              Shree Chhatrapati Shivaji Market Yard Adte Association uses this digital portal to provide member services, notices, complaint handling, gallery publishing, and administrative workflows. This policy explains how portal information is collected, used, and protected.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-page grid gap-4 md:grid-cols-2">
          {sections.map((section) => (
            <Card key={section.title} className="border-border/60">
              <CardContent className="p-6">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-secondary text-primary">
                  <section.icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 font-display text-xl font-bold text-primary-dark">{section.title}</h2>
                <p className="mt-2 text-justify text-sm leading-relaxed text-muted-foreground [hyphens:auto]">{section.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="pb-16">
        <div className="container-page">
          <Card className="border-saffron/40 bg-saffron/5">
            <CardContent className="grid gap-5 p-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h2 className="font-display text-xl font-bold text-primary-dark">Questions about privacy?</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Contact the association office for corrections, access requests, or questions about portal records.</p>
              </div>
              <Button asChild className="bg-saffron text-saffron-foreground hover:bg-saffron/90"><Link to="/contact"><Mail className="mr-1 h-4 w-4" /> Contact Office</Link></Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </SiteLayout>
  );
}