import { createFileRoute, Link } from "@/lib/simple-router";
import { SiteLayout } from "@/components/public/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, FileCheck2, Mail, ShieldCheck, UserCog } from "lucide-react";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions - Shree Chhatrapati Shivaji Market Yard Adte Association" },
      { name: "description", content: "Terms for using the Market Yard digital portal, member dashboards, complaints, notices, and public content." },
    ],
  }),
  component: TermsAndConditions,
});

const terms = [
  { icon: UserCog, title: "Portal access", body: "Members and admins must use their own login credentials and keep mobile numbers, profile details, and account access secure. Unauthorised access or sharing of login details is not allowed." },
  { icon: FileCheck2, title: "Submitted content", body: "Complaints, gallery media, reviews, KYC details, and post submissions must be accurate and relevant to association or market yard operations. Admin review may be required before public display." },
  { icon: ShieldCheck, title: "Administrative decisions", body: "The association may approve, reject, archive, or request corrections for portal records when required for accuracy, security, moderation, or operational reasons." },
  { icon: AlertTriangle, title: "Acceptable use", body: "Users must not upload misleading, abusive, unlawful, or unrelated content. The portal should be used only for legitimate member services, market communication, and administrative work." },
];

function TermsAndConditions() {
  return (
    <SiteLayout>
      <section className="bg-leaf py-14 md:py-18">
        <div className="container-page">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Portal terms</span>
            <h1 className="mt-3 font-display text-3xl font-bold text-primary-dark sm:text-4xl">Terms & Conditions</h1>
            <p className="mt-4 text-justify leading-relaxed text-muted-foreground [hyphens:auto]">
              By using the Shree Chhatrapati Shivaji Market Yard Adte Association digital portal, members, customers, and authorised administrators agree to use the platform responsibly for association services and official communication.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-page grid gap-4 md:grid-cols-2">
          {terms.map((term) => (
            <Card key={term.title} className="border-border/60">
              <CardContent className="p-6">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-secondary text-primary">
                  <term.icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 font-display text-xl font-bold text-primary-dark">{term.title}</h2>
                <p className="mt-2 text-justify text-sm leading-relaxed text-muted-foreground [hyphens:auto]">{term.body}</p>
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
                <h2 className="font-display text-xl font-bold text-primary-dark">Need help with portal terms?</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">For account, content, or service-related questions, contact the association office.</p>
              </div>
              <Button asChild className="bg-saffron text-saffron-foreground hover:bg-saffron/90"><Link to="/contact"><Mail className="mr-1 h-4 w-4" /> Contact Office</Link></Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </SiteLayout>
  );
}