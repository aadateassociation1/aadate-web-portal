import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/public/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CURRENT_CHAIRMAN, LOBBY_CHAIRMAN, PAST_CHAIRMEN, COMMITTEE } from "@/lib/mock";
import sourabhKunjirImg from "@/assets/sourabh kunjir.jpeg";

export const Route = createFileRoute("/chairman")({
  head: () => ({
    meta: [
      { title: "Chairman & Committee — VPP Market Yard" },
      { name: "description", content: "Meet our current chairman, lobby chairman, past chairmen and committee members." },
      { property: "og:title", content: "Chairman & Committee — VPP Market Yard" },
      { property: "og:description", content: "Leadership serving 850+ gala owners." },
    ],
  }),
  component: Chairman,
});

function Chairman() {
  return (
    <SiteLayout>
      <section className="hero-gradient text-white py-16">
        <div className="container-page">
          <h1 className="font-display text-3xl font-bold sm:text-5xl">Chairman &amp; Committee</h1>
          <p className="mt-4 max-w-2xl text-white/85">Meet the leaders serving our 850+ gala owners.</p>
        </div>
      </section>

      <section className="py-14">
        <div className="container-page grid justify-center gap-10 lg:grid-cols-[minmax(0,460px)_minmax(0,460px)] lg:gap-14">
          <Card className="overflow-hidden border-border/60 shadow-sm">
            <div className="relative h-72 bg-secondary sm:h-80">
              <img
                src={sourabhKunjirImg}
                alt="Sourabh Kunjir"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute left-5 top-5">
                <Badge className="bg-saffron text-saffron-foreground hover:bg-saffron">Current Chairman</Badge>
              </div>
            </div>
            <CardContent className="p-8">
              <h2 className="font-display text-3xl font-bold text-primary-dark">{CURRENT_CHAIRMAN.name}</h2>
              <div className="text-sm text-muted-foreground">{CURRENT_CHAIRMAN.nameMr}</div>
              <div className="mt-2 text-sm font-semibold text-primary">Term: {CURRENT_CHAIRMAN.term}</div>
              <p className="mt-4 text-foreground/80 italic leading-relaxed">"{CURRENT_CHAIRMAN.message}"</p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-border/60 shadow-sm">
            <div className="grid h-72 place-items-center bg-secondary sm:h-80">
              <div className="grid h-44 w-44 place-items-center rounded-3xl bg-background font-display text-5xl font-bold text-primary shadow-md">AD</div>
            </div>
            <CardContent className="p-8">
              <Badge variant="outline" className="mt-4 border-primary text-primary">Lobby Chairman</Badge>
              <h2 className="mt-3 font-display text-3xl font-bold text-primary-dark">{LOBBY_CHAIRMAN.name}</h2>
              <p className="mt-4 text-foreground/80 leading-relaxed">{LOBBY_CHAIRMAN.intro}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-leaf py-14">
        <div className="container-page">
          <h2 className="font-display text-2xl font-bold text-primary-dark">Committee Members</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {COMMITTEE.map((m) => (
              <Card key={m.id} className="text-center border-border/60">
                <CardContent className="p-6">
                  <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-secondary font-display text-xl font-bold text-primary">
                    {m.name === CURRENT_CHAIRMAN.name ? (
                      <img src={sourabhKunjirImg} alt={m.name} className="h-full w-full rounded-full object-cover" />
                    ) : (
                      m.name.split(" ").slice(-1)[0][0]
                    )}
                  </div>
                  <h3 className="mt-3 font-display font-semibold text-primary-dark">{m.name}</h3>
                  <div className="text-xs font-medium text-primary">{m.designation}</div>
                  {m.gala && <div className="mt-1 text-xs text-muted-foreground">Gala {m.gala}</div>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-page">
          <h2 className="font-display text-2xl font-bold text-primary-dark">Past Chairmen</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PAST_CHAIRMEN.map((p) => (
              <Card key={p.name} className="border-border/60">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-secondary font-display text-lg font-bold text-primary">
                      {p.name.split(" ").slice(-1)[0][0]}
                    </div>
                    <div>
                      <div className="font-display font-semibold text-primary-dark">{p.name}</div>
                      <div className="text-xs text-primary font-medium">{p.period}</div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{p.contribution}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
