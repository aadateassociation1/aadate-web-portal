import { createFileRoute } from "@/lib/simple-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/public/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PAST_CHAIRMEN } from "@/lib/mock";
import sourabhKunjirImg from "@/assets/sourabh Kunjir.png";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/chairman")({
  head: () => ({
    meta: [
      { title: "Chairman & Committee - Shri Chhatrapati Shivaji Market Yard Adte Association" },
      { name: "description", content: "Meet our current chairman, lobby chairman, past chairmen and committee Members." },
      { property: "og:title", content: "Chairman & Committee - Shri Chhatrapati Shivaji Market Yard Adte Association" },
      { property: "og:description", content: "Leadership serving 850+ Members." },
    ],
  }),
  component: Chairman,
});

type CommitteeMemberRecord = {
  id: number;
  full_name: string;
  name_mr: string | null;
  designation: string;
  designation_mr: string | null;
  gala_number: string | null;
  term_label: string | null;
  message: string | null;
  photo_url: string | null;
};

function Chairman() {
  const { lang } = useI18n();
  const [members, setMembers] = useState<CommitteeMemberRecord[]>([]);

  useEffect(() => {
    fetch("/api/v1/public/committee")
      .then((response) => response.json())
      .then((result) => {
        if (result.ok) setMembers(result.members || []);
      })
      .catch(() => undefined);
  }, []);

  const chairman = members.find((member) => member.designation.toLowerCase().includes("chairman") && !member.designation.toLowerCase().includes("lobby"));
  const committeeMembers = members.filter((member) => member.id !== chairman?.id);
  const committeeGridMembers = committeeMembers.length % 3 === 2 && chairman ? [...committeeMembers, chairman] : committeeMembers;
  const initials = (name: string) => name.split(" ").filter(Boolean).slice(-1)[0]?.[0]?.toUpperCase() || name[0]?.toUpperCase() || "M";
  const displayCommitteeName = (member: CommitteeMemberRecord) => lang === "mr" ? member.name_mr || member.full_name : member.full_name;
  const displayCommitteeDesignation = (member: CommitteeMemberRecord) => lang === "mr" ? member.designation_mr || member.designation : member.designation;
  const chairmanCopy = lang === "mr"
    ? {
        current: "सध्याचे अध्यक्ष",
        role: "अध्यक्ष",
        title: "नेतृत्व",
        term: "कार्यकाळ",
        name: chairman?.name_mr || "श्री. सौरभ कुंजीर",
        secondaryName: "",
        intro: "त्यांच्या नेतृत्वाखाली संघटना पारदर्शक प्रशासन, जलद तक्रार निवारण, नियमित बाजार माहिती आणि प्रत्येक व्यापारी व गाळाधारकासाठी अधिक चांगल्या डिजिटल सेवांवर लक्ष केंद्रित करत आहे.",
        quote: "प्रत्येक व्यापाऱ्यासाठी पारदर्शक, डिजिटल आणि सेवा-केंद्रित मार्केट यार्ड उभारण्यासाठी आपण सर्वजण एकत्र काम करत आहोत.",
        focus: ["डिजिटल सूचना प्रवेश", "सभासद-केंद्रित मदत", "बाजार अद्यतने", "पारदर्शक कार्यप्रवाह"],
      }
    : {
        current: "Current Chairman",
        role: "Chairman",
        title: "Leadership",
        term: "Term",
        name: chairman?.full_name || "Shri. Sourabh Kunjir",
        secondaryName: chairman?.name_mr || "",
        intro: "Under his leadership, the association is focused on transparent administration, faster complaint resolution, regular market communication, and better digital services for every trader and gala owner.",
        quote: chairman?.message || "Together, we are building a transparent, digital and service-focused market yard for every trader.",
        focus: ["Digital notice access", "Member-first support", "Market updates", "Transparent workflow"],
      };
  const CommitteeAvatar = ({ member }: { member: CommitteeMemberRecord }) => {
    const [imageFailed, setImageFailed] = useState(false);
    if (!member.photo_url || imageFailed) return <>{initials(member.full_name)}</>;
    return (
      <img
        src={member.photo_url}
        alt={member.full_name}
        className="h-full w-full object-cover object-top"
        onError={() => setImageFailed(true)}
      />
    );
  };

  return (
    <SiteLayout>
      <section className="py-14">
        <div className="container-page">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Chairman's Desk</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-primary-dark sm:text-4xl">{chairmanCopy.title}</h2>
          </div>
          <div className="mx-auto mt-10 max-w-6xl">
          {chairman && (
            <Card className="overflow-hidden border-border/60 shadow-sm">
              <CardContent className="grid gap-0 p-0 md:grid-cols-[minmax(0,54%)_minmax(0,46%)]">
                <div className="relative min-h-[420px] bg-secondary sm:min-h-[500px] lg:min-h-[560px]">
                  <img
                    src={chairman.photo_url || sourabhKunjirImg}
                    alt={chairman.full_name}
                    className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
                  />
                  <div className="absolute left-5 top-5">
                    <Badge className="bg-saffron text-saffron-foreground hover:bg-saffron">{chairmanCopy.current}</Badge>
                  </div>
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
                  <Badge variant="outline" className="w-fit border-primary text-primary">{chairmanCopy.role}</Badge>
                  <h3 className="mt-4 font-display text-3xl font-bold text-primary-dark sm:text-4xl">{chairmanCopy.name}</h3>
                  {chairmanCopy.secondaryName && <div className="mt-1 text-base text-muted-foreground">{chairmanCopy.secondaryName}</div>}
                  {chairman.term_label && <div className="mt-3 text-sm font-semibold text-primary">{chairmanCopy.term}: {chairman.term_label}</div>}
                  <p className="mt-5 text-base leading-relaxed text-foreground/80">{chairmanCopy.intro}</p>
                  <p className="mt-5 border-l-4 border-saffron pl-4 text-base leading-relaxed text-foreground/80 italic">
                    "{chairmanCopy.quote}"
                  </p>
                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    {chairmanCopy.focus.map((item) => (
                      <div key={item} className="rounded-lg bg-secondary/55 px-4 py-3 text-sm font-semibold text-primary-dark">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          </div>
        </div>
      </section>

      <section className="bg-leaf py-14">
        <div className="container-page">
          <h2 className="font-display text-2xl font-bold text-primary-dark">Committee Members</h2>
          <div className="mx-auto mt-8 grid max-w-6xl grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
            {committeeGridMembers.map((m) => (
              <Card key={m.id} className="mx-auto w-full max-w-[19rem] overflow-hidden rounded-xl border-border/60 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="px-1.5 py-2.5 sm:px-3 sm:py-4">
                  <div className="mx-auto grid h-18 w-18 place-items-center overflow-hidden rounded-full border-4 border-white bg-secondary font-display text-base font-bold text-primary shadow-md ring-1 ring-border sm:h-36 sm:w-36 sm:text-2xl">
                    <CommitteeAvatar member={m} />
                  </div>
                  <h3 className="mt-2 font-display text-xs font-semibold leading-snug text-primary-dark sm:text-base">{displayCommitteeName(m)}</h3>
                  {lang === "en" && m.name_mr && <div className="mt-0.5 text-[10px] leading-tight text-muted-foreground sm:text-xs">{m.name_mr}</div>}
                  <div className="mt-1 inline-flex max-w-full rounded-full bg-secondary px-1.5 py-1 text-[9px] font-semibold leading-tight text-primary sm:px-2.5 sm:text-[11px]">{displayCommitteeDesignation(m)}</div>
                  {m.gala_number && <div className="mt-1.5 text-xs font-medium text-muted-foreground">Gala {m.gala_number}</div>}
                </CardContent>
              </Card>
            ))}
            {members.length === 0 && <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">No committee members published yet.</div>}
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
