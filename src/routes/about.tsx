import { createFileRoute } from "@/lib/simple-router";
import { SiteLayout } from "@/components/public/SiteLayout";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart, Trophy, Users, Building2 } from "lucide-react";
import marketyardImg from "@/assets/marketyard.webp";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us - Shree Chhatrapati Shivaji Market Yard Adte Association" },
      { name: "description", content: "History, mission, vision and objectives of Shree Chhatrapati Shivaji Market Yard Adte Association." },
      { property: "og:title", content: "About Us - Shree Chhatrapati Shivaji Market Yard Adte Association" },
      { property: "og:description", content: "Serving 850+ Members with transparent digital administration since 2009." },
    ],
  }),
  component: About,
});

function About() {
  const { lang } = useI18n();
  const isMr = lang === "mr";
  const stats = [
    { n: "852", l: isMr ? "\u0938\u092d\u093e\u0938\u0926" : "Members" },
    { n: "10", l: isMr ? "\u092c\u093e\u091c\u093e\u0930 \u0935\u093f\u092d\u093e\u0917" : "Market Sections" },
    { n: isMr ? "१९७९ साला पासून" : "Since 1979", l: isMr ? "\u0938\u0947\u0935\u0947\u091a\u0940 \u0935\u0930\u094d\u0937\u0947" : "Years of service" },
  ];
  const pillars = [
    {
      icon: Target,
      title: isMr ? "\u0927\u094d\u092f\u0947\u092f" : "Mission",
      body: isMr ? "\u092a\u094d\u0930\u0924\u094d\u092f\u0947\u0915 \u0938\u092d\u093e\u0938\u0926\u093e\u0932\u093e \u0938\u094b\u092a\u0940, \u092a\u093e\u0930\u0926\u0930\u094d\u0936\u0915 \u0906\u0923\u093f \u0935\u0947\u0933\u0947\u0935\u0930 \u0921\u093f\u091c\u093f\u091f\u0932 \u0938\u0947\u0935\u093e \u0926\u0947\u0923\u0947." : "Empower every Member with transparent, digital and timely administration.",
    },
    {
      icon: Eye,
      title: isMr ? "\u0926\u0943\u0937\u094d\u091f\u0940\u0915\u094b\u0928" : "Vision",
      body: isMr ? "\u0936\u0947\u0924\u0915\u0930\u0940, \u0935\u094d\u092f\u093e\u092a\u093e\u0930\u0940 \u0906\u0923\u093f \u0938\u092d\u093e\u0938\u0926\u093e\u0902\u0928\u093e \u091c\u094b\u0921\u0923\u093e\u0930\u0947 \u0935\u093f\u0936\u094d\u0935\u093e\u0938\u093e\u0930\u094d\u0939 \u092c\u093e\u091c\u093e\u0930 \u092f\u093e\u0930\u094d\u0921 \u092c\u0928\u0923\u0947." : "To be Maharashtra's most connected and farmer-friendly market yard.",
    },
    {
      icon: Heart,
      title: isMr ? "\u092e\u0942\u0932\u094d\u092f\u0947" : "Values",
      body: isMr ? "\u0935\u093f\u0936\u094d\u0935\u093e\u0938, \u092a\u093e\u0930\u0926\u0930\u094d\u0936\u0915\u0924\u093e, \u0938\u0939\u0915\u093e\u0930\u094d\u092f \u0906\u0923\u093f \u0938\u0924\u0924 \u091a\u093e\u0902\u0917\u0932\u0940 \u0938\u0947\u0935\u093e." : "Trust, transparency, cooperation and continuous improvement.",
    },
  ];
  const facilities = [
    { icon: Building2, title: isMr ? "\u0936\u0940\u0924\u0917\u0943\u0939" : "Cold storage", body: isMr ? "\u0928\u093e\u0936\u0935\u0902\u0924 \u092e\u093e\u0932\u093e\u0938\u093e\u0920\u0940 500 \u092e\u0947\u091f\u094d\u0930\u093f\u0915 \u091f\u0928 \u0915\u094d\u0937\u092e\u0924\u093e" : "500 MT capacity for perishables" },
    { icon: Users, title: isMr ? "\u0938\u092e\u093f\u0924\u0940 \u092a\u094d\u0930\u0936\u093f\u0915\u094d\u0937\u0923" : "Committee training", body: isMr ? "\u0926\u0930\u092e\u0939\u093e \u0936\u0947\u0924\u0915\u0930\u0940 \u091c\u0928\u091c\u093e\u0917\u0943\u0924\u0940 \u0936\u093f\u092c\u093f\u0930\u0947" : "Monthly farmer awareness camps" },
    { icon: Trophy, title: isMr ? "\u0930\u093e\u091c\u094d\u092f \u092a\u0941\u0930\u0938\u094d\u0915\u093e\u0930" : "State award", body: isMr ? "\u092a\u0941\u0923\u0947 \u091c\u093f\u0932\u094d\u0939\u094d\u092f\u093e\u0924\u0940\u0932 \u0909\u0924\u094d\u0915\u0943\u0937\u094d\u091f \u092c\u093e\u091c\u093e\u0930 \u092f\u093e\u0930\u094d\u0921, 2026" : "Best market yard, Pune district 2026" },
    { icon: Target, title: isMr ? "24x7 \u0938\u0941\u0930\u0915\u094d\u0937\u093e" : "24x7 security", body: isMr ? "\u0938\u0930\u094d\u0935 \u0935\u093f\u092d\u093e\u0917\u093e\u0902\u092e\u0927\u094d\u092f\u0947 CCTV \u0938\u0941\u0935\u093f\u0927\u093e" : "CCTV across all sections" },
  ];

  return (
    <SiteLayout>
      <div data-no-translate>
      <section className="py-16">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <img src={marketyardImg} alt="Market yard" width={1600} height={900} loading="lazy" className="rounded-3xl shadow-xl object-cover aspect-[4/3]" />
          <div>
            <h2 className="font-display text-3xl font-bold text-primary-dark">{isMr ? "\u0906\u092e\u091a\u0940 \u0935\u093e\u091f\u091a\u093e\u0932" : "Our Story"}</h2>
            <p className="mt-4 text-justify leading-relaxed text-muted-foreground [hyphens:auto]">
              {isMr ? "१९७९ साला पासून मार्केट यार्ड आडते व्यापारी ह्यांची सक्रिय शेतकऱ्यांना शेती माल विक्री करण्याची सक्षम बाजारपेठ उपलब्ध आहे." : "Since 1979, the Market Yard Adte traders have been providing active farmers with a capable marketplace for selling agricultural produce."}
            </p>
            <p className="mt-4 text-justify leading-relaxed text-muted-foreground [hyphens:auto]">
              {isMr ? "श्री छत्रपती शिवाजी मार्केट यार्ड आडते असोसिएशन पुणे आडते व्यापारी हित ह्यासाठी कायम कटिबद्ध आहे." : "Shree Chhatrapati Shivaji Market Yard Adte Association, Pune is always committed to protecting the interests of Adte traders."}
            </p>
            <p className="mt-4 text-justify leading-relaxed text-muted-foreground [hyphens:auto]">
              {isMr ? "सर्व सभासद आडते ह्यांच्या दैनंदिन कामकाज करताना अडचणी, बाजार भाव, प्रशासनाशी निगडित कामकाज, व्यापार उधारी बद्दल आडते संरक्षण, आदी कामे एप्लीकेशन मार्फत सोपी व सोयीस्कर होतील ह्याची खात्री आहे." : "This application will make the day-to-day work of all member Adte traders easier and more convenient, including work-related difficulties, market rates, administration-related work, protection regarding trade credit, and other related activities."}
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {stats.map((s) => (
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
          {pillars.map((v) => (
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
          <h2 className="text-center font-display text-2xl font-bold leading-tight text-primary-dark sm:text-left sm:text-3xl">
            {isMr ? "\u0938\u0941\u0935\u093f\u0927\u093e \u0906\u0923\u093f \u0915\u093e\u092e\u0917\u093f\u0930\u0940" : (
              <>
                <span className="sm:inline">Facilities</span>
                <span className="block sm:inline sm:ml-2">&amp; Achievements</span>
              </>
            )}
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-4">
            {facilities.map((f) => (
              <Card key={f.title} className="border-border/60">
                <CardContent className="p-3 text-center sm:p-5 sm:text-left">
                  <f.icon className="mx-auto h-6 w-6 text-primary sm:mx-0" />
                  <div className="mt-3 font-display text-sm font-semibold leading-snug text-primary-dark sm:text-base">{f.title}</div>
                  <div className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">{f.body}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      </div>
    </SiteLayout>
  );
}