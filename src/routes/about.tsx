import { createFileRoute } from "@/lib/simple-router";
import { SiteLayout } from "@/components/public/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart, Trophy, Users, Building2 } from "lucide-react";
import heroImg from "@/assets/market-hero.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us - Shri Chhatrapati Shivaji Market Yard Adte Association" },
      { name: "description", content: "History, mission, vision and objectives of Shri Chhatrapati Shivaji Market Yard Adte Association." },
      { property: "og:title", content: "About Us - Shri Chhatrapati Shivaji Market Yard Adte Association" },
      { property: "og:description", content: "Serving 850+ Members with transparent digital administration since 2009." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="hero-gradient text-white py-16 md:py-20">
        <div className="container-page">
          <h1 className="font-display text-3xl font-bold sm:text-5xl">About Our Association</h1>
          <p className="mt-4 max-w-2xl text-white/85">
            The digital face of Shri Chhatrapati Shivaji Market Yard Adte Association - connecting Members, farmers and administrators.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <img src={heroImg} alt="Market yard" width={1600} height={900} loading="lazy" className="rounded-3xl shadow-xl object-cover aspect-[4/3]" />
          <div>
            <h2 className="font-display text-3xl font-bold text-primary-dark">Our Story</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Shri Chhatrapati Shivaji Market Yard Adte Association serves Members and commission agents operating from the Market Yard at Gultekdi, Pune. The association office is located on the first floor of Pan Bazar Building, Shri Chhatrapati Shivaji Market Yard Adte Association Hall, Gultekdi, Pune - 411037.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              With the launch of this digital portal in 2026, every Member now has 24/7 access to market updates, official notices, complaint filing and administration in both English and Marathi.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { n: "852", l: "Members" },
                { n: "10", l: "Market Sections" },
                { n: "15+", l: "Years of service" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl bg-secondary p-4 text-center">
                  <div className="font-display text-2xl font-bold text-primary-dark">{s.n}</div>
                  <div className="text-xs text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-leaf py-16">
        <div className="container-page grid gap-6 md:grid-cols-3">
          {[
            { icon: Target, title: "Mission", body: "Empower every Member with transparent, digital and timely administration." },
            { icon: Eye, title: "Vision", body: "To be Maharashtra's most connected and farmer-friendly market yard." },
            { icon: Heart, title: "Values", body: "Trust, transparency, cooperation and continuous improvement." },
          ].map((v) => (
            <Card key={v.title} className="border-border/60">
              <CardContent className="p-6">
                <div className="grid h-12 w-12 place-items-center rounded-xl saffron-gradient">
                  <v.icon className="h-6 w-6 text-primary-dark" />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-primary-dark">{v.title}</h3>
                <p className="mt-2 text-muted-foreground text-sm">{v.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <h2 className="font-display text-3xl font-bold text-primary-dark">Facilities &amp; Achievements</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Building2, title: "Cold storage", body: "500 MT capacity for perishables" },
              { icon: Users, title: "Committee training", body: "Monthly farmer awareness camps" },
              { icon: Trophy, title: "State award", body: "Best market yard, Pune district 2026" },
              { icon: Target, title: "24x7 security", body: "CCTV across all sections" },
            ].map((f) => (
              <Card key={f.title} className="border-border/60">
                <CardContent className="p-5">
                  <f.icon className="h-6 w-6 text-primary" />
                  <div className="mt-3 font-display font-semibold text-primary-dark">{f.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{f.body}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
