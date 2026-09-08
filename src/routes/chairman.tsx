import { createFileRoute } from "@/lib/simple-router";
import { useEffect, useState } from "react";
import { Briefcase, Phone, Store, UserRound } from "lucide-react";
import { SiteLayout } from "@/components/public/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import sourabhKunjirImg from "@/assets/Sourabh Kunjir.jpeg";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/chairman")({
  head: () => ({
    meta: [
      { title: "Board of Directors - Shree Chhatrapati Shivaji Market Yard Adte Association" },
      { name: "description", content: "Meet our current chairman, board of directors, past chairmen and committee members." },
      { property: "og:title", content: "Board of Directors - Shree Chhatrapati Shivaji Market Yard Adte Association" },
      { property: "og:description", content: "Leadership serving 850+ members." },
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
  phone_number: string | null;
  term_label: string | null;
  message: string | null;
  photo_url: string | null;
};

function Chairman() {
  const { lang } = useI18n();
  const [members, setMembers] = useState<CommitteeMemberRecord[]>([]);
  const [selectedMember, setSelectedMember] = useState<CommitteeMemberRecord | null>(null);
  const isMr = lang === "mr";

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
  const MARATHI_SHRI_PREFIX = "\u0936\u094d\u0930\u0940.";
  const withMarathiShri = (name: string) => {
    const cleanName = String(name || "").trim();
    return /^\u0936\u094d\u0930\u0940\.?/.test(cleanName) ? cleanName : `${MARATHI_SHRI_PREFIX} ${cleanName}`;
  };
  const displayCommitteeName = (member: CommitteeMemberRecord) => isMr ? withMarathiShri(member.name_mr || member.full_name) : member.full_name;
  const displayCommitteeDesignation = (member: CommitteeMemberRecord) => isMr ? member.designation_mr || member.designation : member.designation;
  const displayChairmanName = (name?: string | null) => name && /sourabh\s+kunjir/i.test(name) ? "Shri. Sourabh Shekhar Kunjir" : name || "Shri. Sourabh Shekhar Kunjir";
  const displayChairmanNameMr = (name?: string | null, englishName?: string | null) => withMarathiShri(englishName && /sourabh\s+kunjir/i.test(englishName) ? "\u0938\u094c\u0930\u092d \u0936\u0947\u0916\u0930 \u0915\u0941\u0902\u091c\u0940\u0930" : name || "\u0938\u094c\u0930\u092d \u0936\u0947\u0916\u0930 \u0915\u0941\u0902\u091c\u0940\u0930");
  const chairmanCopy = isMr
    ? {
        current: "\u0938\u0927\u094d\u092f\u093e\u091a\u0947 \u0905\u0927\u094d\u092f\u0915\u094d\u0937",
        role: "\u0905\u0927\u094d\u092f\u0915\u094d\u0937",
        title: "\u0928\u0947\u0924\u0943\u0924\u094d\u0935",
        term: "\u0915\u093e\u0930\u094d\u092f\u0915\u093e\u0933",
        name: displayChairmanNameMr(chairman?.name_mr, chairman?.full_name),
        secondaryName: "",
        intro: "\u0924\u094d\u092f\u093e\u0902\u091a\u094d\u092f\u093e \u0928\u0947\u0924\u0943\u0924\u094d\u0935\u093e\u0916\u093e\u0932\u0940 \u0938\u0902\u0918\u091f\u0928\u093e \u092a\u093e\u0930\u0926\u0930\u094d\u0936\u0915 \u092a\u094d\u0930\u0936\u093e\u0938\u0928, \u091c\u0932\u0926 \u0924\u0915\u094d\u0930\u093e\u0930 \u0928\u093f\u0935\u093e\u0930\u0923, \u0928\u093f\u092f\u092e\u093f\u0924 \u092c\u093e\u091c\u093e\u0930 \u092e\u093e\u0939\u093f\u0924\u0940 \u0906\u0923\u093f \u092a\u094d\u0930\u0924\u094d\u092f\u0947\u0915 \u0935\u094d\u092f\u093e\u092a\u093e\u0930\u0940 \u0935 \u0917\u093e\u0933\u093e\u0927\u093e\u0930\u0915\u093e\u0938\u093e\u0920\u0940 \u0905\u0927\u093f\u0915 \u091a\u093e\u0902\u0917\u0932\u094d\u092f\u093e \u0921\u093f\u091c\u093f\u091f\u0932 \u0938\u0947\u0935\u093e\u0902\u0935\u0930 \u0932\u0915\u094d\u0937 \u0915\u0947\u0902\u0926\u094d\u0930\u093f\u0924 \u0915\u0947\u0932\u0947 \u0906\u0939\u0947.",
        quote: "\u092a\u094d\u0930\u0924\u094d\u092f\u0947\u0915 \u0935\u094d\u092f\u093e\u092a\u093e\u0931\u094d\u092f\u093e\u0938\u093e\u0920\u0940 \u092a\u093e\u0930\u0926\u0930\u094d\u0936\u0915, \u0921\u093f\u091c\u093f\u091f\u0932 \u0906\u0923\u093f \u0938\u0947\u0935\u093e-\u0915\u0947\u0902\u0926\u094d\u0930\u093f\u0924 \u092e\u093e\u0930\u094d\u0915\u0947\u091f \u092f\u093e\u0930\u094d\u0921 \u0909\u092d\u093e\u0930\u0923\u094d\u092f\u093e\u0938\u093e\u0920\u0940 \u0906\u092a\u0923 \u0938\u0930\u094d\u0935\u091c\u0923 \u090f\u0915\u0924\u094d\u0930 \u0915\u093e\u092e \u0915\u0930\u0924 \u0906\u0939\u094b\u0924.",
        focus: ["\u0921\u093f\u091c\u093f\u091f\u0932 \u0938\u0942\u091a\u0928\u093e \u092a\u094d\u0930\u0935\u0947\u0936", "\u0938\u092d\u093e\u0938\u0926-\u0915\u0947\u0902\u0926\u094d\u0930\u093f\u0924 \u092e\u0926\u0924", "\u092c\u093e\u091c\u093e\u0930 \u092e\u093e\u0939\u093f\u0924\u0940", "\u092a\u093e\u0930\u0926\u0930\u094d\u0936\u0915 \u0915\u093e\u0930\u094d\u092f\u092a\u094d\u0930\u0935\u093e\u0939"],
      }
    : {
        current: "Current Chairman",
        role: "Chairman",
        title: "Leadership",
        term: "Term",
        name: displayChairmanName(chairman?.full_name),
        secondaryName: chairman?.name_mr || "",
        intro: "Under his leadership, the association is focused on transparent administration, faster complaint resolution, regular market communication, and better digital services for every trader and gala owner.",
        quote: chairman?.message || "Together, we are building a transparent, digital and service-focused market yard for every trader.",
        focus: ["Digital notice access", "Member-first support", "Market updates", "Transparent workflow"],
      };
  const labels = isMr
    ? { section: "\u0938\u0902\u091a\u093e\u0932\u0915 \u092e\u0902\u0921\u0933", fullName: "\u092a\u0942\u0930\u094d\u0923 \u0928\u093e\u0935", phone: "\u092b\u094b\u0928 \u0928\u0902\u092c\u0930", designation: "\u092a\u0926", gala: "\u0917\u093e\u0933\u093e \u0928\u0902\u092c\u0930", notPublished: "\u0938\u0927\u094d\u092f\u093e \u0915\u094b\u0923\u0924\u0947\u0939\u0940 \u0938\u092e\u093f\u0924\u0940 \u0938\u0926\u0938\u094d\u092f \u092a\u094d\u0930\u0915\u093e\u0936\u093f\u0924 \u0928\u093e\u0939\u0940\u0924.", quote: "\u092c\u0933\u0915\u091f \u092e\u093e\u0930\u094d\u0915\u0947\u091f \u092f\u093e\u0930\u094d\u0921\u0938\u093e\u0920\u0940 \u090f\u0915\u0924\u094d\u0930 \u0915\u093e\u092e \u0915\u0930\u0924 \u0906\u0939\u094b\u0924" }
    : { section: "Board of Directors", fullName: "Full Name", phone: "Phone Number", designation: "Designation", gala: "Gala Number", notPublished: "No committee members published yet.", quote: "Working together for a stronger Market Yard" };

  const CommitteeAvatar = ({ member }: { member: CommitteeMemberRecord }) => {
    const [imageFailed, setImageFailed] = useState(false);
    if (!member.photo_url || imageFailed) return <>{initials(member.full_name)}</>;
    return <img src={member.photo_url} alt={member.full_name} className="h-full w-full object-cover object-top" onError={() => setImageFailed(true)} />;
  };

  const DetailRow = ({ icon: Icon, label, value }: { icon: typeof UserRound; label: string; value?: string | null }) => {
    if (!value) return null;
    return (
      <div className="flex gap-3">
        <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-medium text-muted-foreground">{label}</div>
          <div className="text-base font-semibold leading-snug text-foreground">{value}</div>
        </div>
      </div>
    );
  };

  return (
    <SiteLayout>
      <section className="py-14">
        <div className="container-page">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">{isMr ? "\u0905\u0927\u094d\u092f\u0915\u094d\u0937\u093e\u0902\u091a\u0947 \u092e\u0928\u094b\u0917\u0924" : "Chairman's Desk"}</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-primary-dark sm:text-4xl">{chairmanCopy.title}</h2>
          </div>
          <div className="mx-auto mt-10 max-w-6xl">
            <Card className="overflow-hidden border-border/60 shadow-sm">
              <CardContent className="grid gap-0 p-0 md:grid-cols-[minmax(0,54%)_minmax(0,46%)]">
                <div className="relative min-h-[420px] bg-secondary sm:min-h-[500px] lg:min-h-[560px]">
                  <img src={chairman?.photo_url || sourabhKunjirImg} alt={displayChairmanName(chairman?.full_name)} className="absolute inset-0 h-full w-full object-cover object-[center_18%]" />
                  <div className="absolute left-5 top-5"><Badge className="rounded-full bg-saffron px-4 py-2 text-sm font-bold text-saffron-foreground shadow-sm hover:bg-saffron sm:text-base">{chairmanCopy.current}</Badge></div>
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
                  <Badge variant="outline" className="w-fit rounded-full border-2 border-primary bg-white px-4 py-2 text-base font-bold text-primary shadow-sm sm:px-5 sm:text-lg">{chairmanCopy.role}</Badge>
                  <h3 className="mt-4 font-display text-3xl font-bold text-primary-dark sm:text-4xl">{chairmanCopy.name}</h3>
                  {chairmanCopy.secondaryName && <div className="mt-1 text-base text-muted-foreground">{chairmanCopy.secondaryName}</div>}
                  {chairman?.term_label && <div className="mt-3 text-sm font-semibold text-primary">{chairmanCopy.term}: {chairman.term_label}</div>}
                  <p className="mt-5 text-base leading-relaxed text-foreground/80">{chairmanCopy.intro}</p>
                  <p className="mt-5 border-l-4 border-saffron pl-4 text-base leading-relaxed text-foreground/80 italic">"{chairmanCopy.quote}"</p>
                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    {chairmanCopy.focus.map((item) => <div key={item} className="rounded-lg bg-secondary/55 px-4 py-3 text-sm font-semibold text-primary-dark">{item}</div>)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-leaf py-14">
        <div className="container-page">
          <h2 className="font-display text-2xl font-bold text-primary-dark">{labels.section}</h2>
          <div className="mx-auto mt-8 grid max-w-6xl grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
            {committeeGridMembers.map((m) => (
              <Card
                key={m.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedMember(m)}
                onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSelectedMember(m); }}
                className="mx-auto w-full max-w-[19rem] cursor-pointer overflow-hidden rounded-xl border-border/60 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:scale-[1.01] hover:border-primary/45 hover:shadow-lg hover:shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <CardContent className="px-1.5 py-2.5 sm:px-3 sm:py-4">
                  <div className="mx-auto grid h-18 w-18 place-items-center overflow-hidden rounded-full border-4 border-white bg-secondary font-display text-base font-bold text-primary shadow-md ring-1 ring-border sm:h-36 sm:w-36 sm:text-2xl"><CommitteeAvatar member={m} /></div>
                  <h3 className="mt-2 font-display text-xs font-semibold leading-snug text-primary-dark sm:text-base">{displayCommitteeName(m)}</h3>
                  {lang === "en" && m.name_mr && <div className="mt-0.5 text-[10px] leading-tight text-muted-foreground sm:text-xs">{m.name_mr}</div>}
                  <div className="mt-1 inline-flex max-w-full rounded-full bg-secondary px-1.5 py-1 text-[9px] font-semibold leading-tight text-primary sm:px-2.5 sm:text-[11px]">{displayCommitteeDesignation(m)}</div>
                  {m.gala_number && <div className="mt-1.5 text-xs font-medium text-muted-foreground">{labels.gala} {m.gala_number}</div>}
                </CardContent>
              </Card>
            ))}
            {members.length === 0 && <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">{labels.notPublished}</div>}
          </div>
        </div>
      </section>

      <Dialog open={Boolean(selectedMember)} onOpenChange={(open) => !open && setSelectedMember(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-[920px]">
          {selectedMember && (
            <div className="grid gap-0 md:grid-cols-[minmax(0,42%)_minmax(0,58%)]">
              <div className="bg-secondary p-5 sm:p-7">
                <div className="aspect-[4/5] overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                  {selectedMember.photo_url ? <img src={selectedMember.photo_url} alt={selectedMember.full_name} className="h-full w-full object-cover object-top" /> : <div className="grid h-full place-items-center font-display text-5xl font-bold text-primary">{initials(selectedMember.full_name)}</div>}
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <DialogHeader className="pr-8 text-left">
                  <DialogTitle className="font-display text-3xl font-bold leading-tight text-primary-dark sm:text-4xl">{selectedMember.full_name}</DialogTitle>
                  {selectedMember.name_mr && <DialogDescription className="text-xl font-semibold text-primary-dark">{selectedMember.name_mr}</DialogDescription>}
                </DialogHeader>
                <Badge className="mt-4 rounded-full bg-success/15 px-3 py-1 text-sm font-semibold text-success hover:bg-success/15">{displayCommitteeDesignation(selectedMember)}</Badge>
                <div className="mt-7 space-y-5">
                  <DetailRow icon={UserRound} label={labels.fullName} value={selectedMember.full_name} />
                  <DetailRow icon={Phone} label={labels.phone} value={selectedMember.phone_number ? `+91 ${selectedMember.phone_number}` : null} />
                  <DetailRow icon={Briefcase} label={labels.designation} value={displayCommitteeDesignation(selectedMember)} />
                  <DetailRow icon={Store} label={labels.gala} value={selectedMember.gala_number || null} />
                </div>
                {selectedMember.message ? <p className="mt-7 border-l-4 border-saffron pl-4 text-base italic leading-relaxed text-foreground/75">"{selectedMember.message}"</p> : <p className="mt-7 border-t pt-5 text-center font-display text-lg font-semibold italic text-primary-dark">"{labels.quote}"</p>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SiteLayout>
  );
}