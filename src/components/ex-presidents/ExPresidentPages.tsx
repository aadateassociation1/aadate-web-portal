import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Camera, Eye, Pencil, Plus, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { DashLayout } from "@/components/dashboard/DashLayout";
import { SiteLayout } from "@/components/public/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useI18n } from "@/lib/i18n";

type ExPresidentRecord = {
  id: number;
  name_en: string;
  name_mr: string;
  designation_en: string;
  designation_mr: string;
  image_url: string | null;
  photo_original_filename?: string | null;
  phone: string | null;
  gala_number: string | null;
  category_en: string | null;
  category_mr: string | null;
  tenure_from: number | null;
  tenure_to: number | null;
  sort_order: number;
  is_active: number;
};

type CommitteeMemberRecord = {
  id: number;
  full_name: string;
  name_mr: string | null;
  designation: string;
  designation_mr: string | null;
  term_label: string | null;
  message: string | null;
  photo_url: string | null;
};

const EX_PRESIDENT_MR = "\u092e\u093e\u091c\u0940 \u0905\u0927\u094d\u092f\u0915\u094d\u0937";
const TENURE_MR = "\u0915\u093e\u0930\u094d\u092f\u0915\u093e\u0933";
const EMPTY_MR = "\u092e\u093e\u091c\u0940 \u0905\u0927\u094d\u092f\u0915\u094d\u0937\u093e\u0902\u091a\u0940 \u092e\u093e\u0939\u093f\u0924\u0940 \u0909\u092a\u0932\u092c\u094d\u0927 \u0928\u093e\u0939\u0940.";

const emptyForm = {
  nameEn: "",
  nameMr: "",
  designationEn: "Ex-President",
  designationMr: EX_PRESIDENT_MR,
  tenureFrom: "",
  tenureTo: "",
  phone: "",
  galaNumber: "",
  categoryEn: "",
  categoryMr: "",
  sortOrder: "100",
  isActive: "1",
};

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(-1)[0]?.[0]?.toUpperCase() || name[0]?.toUpperCase() || "P";
}

function formatTenure(member: Pick<ExPresidentRecord, "tenure_from" | "tenure_to">) {
  if (member.tenure_from && member.tenure_to) return `${member.tenure_from} - ${member.tenure_to}`;
  if (member.tenure_from) return String(member.tenure_from);
  if (member.tenure_to) return String(member.tenure_to);
  return "";
}

function fileToUploadPayload(file: File): Promise<{ originalFilename: string; mimeType: string; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ originalFilename: file.name, mimeType: file.type, dataUrl: String(reader.result) });
    reader.onerror = () => reject(new Error("Unable to read selected photo."));
    reader.readAsDataURL(file);
  });
}

function ProfilePhoto({ member, size = "card" }: { member: ExPresidentRecord; size?: "card" | "modal" | "admin" }) {
  const [failed, setFailed] = useState(false);
  const className = size === "modal" ? "h-full w-full object-cover object-top" : "h-full w-full object-cover object-top";
  if (!member.image_url || failed) {
    return (
      <div className="grid h-full w-full place-items-center bg-secondary font-display font-bold text-primary">
        {size === "admin" ? <UserRound className="h-5 w-5" /> : initials(member.name_en)}
      </div>
    );
  }
  return <img src={member.image_url} alt={member.name_en} className={className} onError={() => setFailed(true)} />;
}

function ExPresidentModal({ member, open, onOpenChange }: { member: ExPresidentRecord | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { lang } = useI18n();
  const tenure = member ? formatTenure(member) : "";
  const rows = useMemo(() => {
    if (!member) return [];
    return [
      tenure ? { label: lang === "mr" ? TENURE_MR : "Tenure", value: tenure } : null,
      member.gala_number ? { label: lang === "mr" ? "\u0917\u093e\u0933\u093e \u0915\u094d\u0930\u092e\u093e\u0902\u0915" : "Gala Number", value: member.gala_number } : null,
      member.phone ? { label: lang === "mr" ? "\u092b\u094b\u0928 \u0928\u0902\u092c\u0930" : "Phone", value: member.phone } : null,
      (lang === "mr" ? member.category_mr || member.category_en : member.category_en || member.category_mr) ? { label: lang === "mr" ? "\u0935\u093f\u092d\u093e\u0917" : "Department", value: lang === "mr" ? member.category_mr || member.category_en : member.category_en || member.category_mr } : null,
    ].filter(Boolean) as Array<{ label: string; value: string }>;
  }, [lang, member, tenure]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl overflow-hidden p-0">
        {member && (
          <div className="grid md:grid-cols-[190px_minmax(0,1fr)]">
            <div className="flex items-center justify-center bg-secondary/70 p-5">
              <div className="h-44 w-36 overflow-hidden rounded-xl border-4 border-white bg-background shadow-md ring-1 ring-border">
                <ProfilePhoto member={member} size="modal" />
              </div>
            </div>
            <div className="flex min-w-0 flex-col justify-center p-5 sm:p-6">
              <DialogHeader>
                <DialogTitle className="font-display text-xl leading-tight text-primary-dark sm:text-[1.65rem]">
                  {lang === "mr" ? member.name_mr || member.name_en : member.name_en}
                </DialogTitle>
                <DialogDescription className="space-y-2">
                  {lang === "en" && member.name_mr ? <span className="block text-sm text-muted-foreground">{member.name_mr}</span> : null}
                  <span className="inline-flex w-fit rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-primary">
                    {lang === "mr" ? member.designation_mr || member.designation_en : member.designation_en}
                  </span>
                  {lang === "en" && member.designation_mr ? <span className="block text-xs text-muted-foreground">{member.designation_mr}</span> : null}
                </DialogDescription>
              </DialogHeader>
              {rows.length > 0 && (
                <div className="mt-4 grid gap-2">
                  {rows.map((row) => (
                    <div key={row.label} className="rounded-lg border bg-secondary/30 px-3 py-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{row.label}</div>
                      <div className="mt-0.5 font-medium text-primary-dark">{row.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function PublicExPresidentPage() {
  const { lang } = useI18n();
  const [members, setMembers] = useState<ExPresidentRecord[]>([]);
  const [chairman, setChairman] = useState<CommitteeMemberRecord | null>(null);
  const [selected, setSelected] = useState<ExPresidentRecord | null>(null);

  useEffect(() => {
    fetch("/api/v1/public/ex-presidents")
      .then((response) => response.json())
      .then((result) => {
        if (result.ok) setMembers(result.members || []);
      })
      .catch(() => undefined);
    fetch("/api/v1/public/committee")
      .then((response) => response.json())
      .then((result) => {
        if (!result.ok) return;
        const committee = (result.members || []) as CommitteeMemberRecord[];
        const current = committee.find((member) => member.designation.toLowerCase().includes("chairman") && !member.designation.toLowerCase().includes("lobby"));
        setChairman(current || null);
      })
      .catch(() => undefined);
  }, []);

  const chairmanCopy = lang === "mr"
    ? {
        label: "\u0938\u0927\u094d\u092f\u093e\u091a\u0947 \u0905\u0927\u094d\u092f\u0915\u094d\u0937",
        role: "\u0905\u0927\u094d\u092f\u0915\u094d\u0937",
        name: chairman?.name_mr || "\u0936\u094d\u0930\u0940. \u0938\u094c\u0930\u092d \u0936\u0947\u0916\u0930 \u0915\u0941\u0902\u091c\u0940\u0930",
        secondaryName: "",
        intro: "\u0924\u094d\u092f\u093e\u0902\u091a\u094d\u092f\u093e \u0928\u0947\u0924\u0943\u0924\u094d\u0935\u093e\u0916\u093e\u0932\u0940 \u0938\u0902\u0918\u091f\u0928\u093e \u092a\u093e\u0930\u0926\u0930\u094d\u0936\u0915 \u092a\u094d\u0930\u0936\u093e\u0938\u0928, \u091c\u0932\u0926 \u0924\u0915\u094d\u0930\u093e\u0930 \u0928\u093f\u0935\u093e\u0930\u0923 \u0906\u0923\u093f \u0909\u0924\u094d\u0924\u092e \u0921\u093f\u091c\u093f\u091f\u0932 \u0938\u0947\u0935\u093e\u0902\u0935\u0930 \u0932\u0915\u094d\u0937 \u0915\u0947\u0902\u0926\u094d\u0930\u093f\u0924 \u0915\u0930\u0924 \u0906\u0939\u0947.",
        quote: "\u092a\u094d\u0930\u0924\u094d\u092f\u0947\u0915 \u0935\u094d\u092f\u093e\u092a\u093e\u0931\u094d\u092f\u093e\u0938\u093e\u0920\u0940 \u092a\u093e\u0930\u0926\u0930\u094d\u0936\u0915, \u0921\u093f\u091c\u093f\u091f\u0932 \u0906\u0923\u093f \u0938\u0947\u0935\u093e-\u0915\u0947\u0902\u0926\u094d\u0930\u093f\u0924 \u092e\u093e\u0930\u094d\u0915\u0947\u091f \u092f\u093e\u0930\u094d\u0921 \u0909\u092d\u093e\u0930\u0923\u094d\u092f\u093e\u0938\u093e\u0920\u0940 \u0906\u092a\u0923 \u0938\u0930\u094d\u0935\u091c\u0923 \u090f\u0915\u0924\u094d\u0930 \u0915\u093e\u092e \u0915\u0930\u0924 \u0906\u0939\u094b\u0924.",
        focus: ["\u0921\u093f\u091c\u093f\u091f\u0932 \u0938\u0942\u091a\u0928\u093e \u092a\u094d\u0930\u0935\u0947\u0936", "\u0938\u092d\u093e\u0938\u0926-\u0915\u0947\u0902\u0926\u094d\u0930\u093f\u0924 \u092e\u0926\u0924", "\u092c\u093e\u091c\u093e\u0930 \u092e\u093e\u0939\u093f\u0924\u0940", "\u092a\u093e\u0930\u0926\u0930\u094d\u0936\u0915 \u0915\u093e\u0930\u094d\u092f\u092a\u094d\u0930\u0935\u093e\u0939"],
      }
    : {
        label: "Current Chairman",
        role: "Chairman",
        name: chairman?.full_name || "Shri. Sourabh Shekhar Kunjir",
        secondaryName: chairman?.name_mr || "",
        intro: "Under his leadership, the association is focused on transparent administration, faster complaint resolution, regular market communication, and better digital services for every trader and gala owner.",
        quote: chairman?.message || "Together, we are building a transparent, digital and service-focused market yard for every trader.",
        focus: ["Digital notice access", "Member-first support", "Market updates", "Transparent workflow"],
      };

  return (
    <SiteLayout>
      <section className="bg-leaf py-14">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">{lang === "mr" ? EX_PRESIDENT_MR : "Ex-President"}</span>
            <h1 className="mt-3 font-display text-3xl font-bold text-primary-dark sm:text-5xl">{lang === "mr" ? EX_PRESIDENT_MR : "Ex-President"}</h1>
            <p className="mt-3 text-base text-muted-foreground">
              {lang === "mr"
                ? "\u0936\u094d\u0930\u0940 \u091b\u0924\u094d\u0930\u092a\u0924\u0940 \u0936\u093f\u0935\u093e\u091c\u0940 \u092e\u093e\u0930\u094d\u0915\u0947\u091f \u092f\u093e\u0930\u094d\u0921 \u0906\u0921\u0924\u0947 \u0905\u0938\u094b\u0938\u093f\u090f\u0936\u0928\u091a\u0947 \u092e\u093e\u091c\u0940 \u0905\u0927\u094d\u092f\u0915\u094d\u0937"
                : "Former Presidents of Shree Chhatrapati Shivaji Market Yard Aadte Association"}
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {members.map((member) => {
              const tenure = formatTenure(member);
              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => setSelected(member)}
                  className="group text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <Card className="h-full overflow-hidden rounded-xl border-border/60 text-center shadow-sm transition group-hover:-translate-y-0.5 group-hover:shadow-md">
                    <CardContent className="flex h-full flex-col items-center p-5">
                      <div className="grid h-32 w-32 place-items-center overflow-hidden rounded-full border-4 border-white bg-secondary font-display text-2xl font-bold text-primary shadow-md ring-1 ring-border">
                        <ProfilePhoto member={member} />
                      </div>
                      <h2 className="mt-4 font-display text-lg font-semibold leading-snug text-primary-dark">{lang === "mr" ? member.name_mr || member.name_en : member.name_en}</h2>
                      {lang === "en" && member.name_mr && <div className="mt-0.5 text-xs text-muted-foreground">{member.name_mr}</div>}
                      <div className="mt-2 inline-flex max-w-full rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                        {lang === "mr" ? member.designation_mr || member.designation_en : member.designation_en}
                      </div>
                      {tenure && <div className="mt-3 text-sm font-medium text-muted-foreground">{lang === "mr" ? TENURE_MR : "Tenure"}: {tenure}</div>}
                    </CardContent>
                  </Card>
                </button>
              );
            })}
            {members.length === 0 && (
              <div className="rounded-lg border bg-background p-8 text-center text-sm text-muted-foreground sm:col-span-2 lg:col-span-3 xl:col-span-4">
                {lang === "mr" ? EMPTY_MR : "No Ex-President records available."}
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="py-14">
        <div className="container-page">
          <Card className="mx-auto max-w-6xl overflow-hidden rounded-xl border-border/60 shadow-sm">
            <CardContent className="grid gap-0 p-0 md:grid-cols-[minmax(0,54%)_minmax(0,46%)]">
              <div className="relative min-h-[340px] bg-secondary sm:min-h-[420px]">
                <img
                  src={chairman?.photo_url || "/icons/favicon.png"}
                  alt={chairmanCopy.name}
                  className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
                />
                <div className="absolute left-5 top-5">
                  <Badge className="bg-saffron px-4 py-1.5 text-sm text-saffron-foreground hover:bg-saffron">{chairmanCopy.label}</Badge>
                </div>
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
                <Badge variant="outline" className="w-fit border-primary px-5 py-1.5 text-sm text-primary">{chairmanCopy.role}</Badge>
                <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-primary-dark sm:text-4xl">{chairmanCopy.name}</h2>
                {chairmanCopy.secondaryName && <div className="mt-1 text-base text-muted-foreground">{chairmanCopy.secondaryName}</div>}
                {chairman?.term_label && <div className="mt-3 text-sm font-semibold text-primary">{lang === "mr" ? TENURE_MR : "Term"}: {chairman.term_label}</div>}
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
        </div>
      </section>
      <ExPresidentModal member={selected} open={!!selected} onOpenChange={(open) => !open && setSelected(null)} />
    </SiteLayout>
  );
}

export function AdminExPresidentPage() {
  const [members, setMembers] = useState<ExPresidentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState<ExPresidentRecord | null>(null);
  const [editing, setEditing] = useState<ExPresidentRecord | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/admin/ex-presidents", { credentials: "include" });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Unable to load Ex-President records.");
      setMembers(result.members || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load Ex-President records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setPhotoFile(null);
    setOpen(true);
  };

  const openEdit = (member: ExPresidentRecord) => {
    setEditing(member);
    setForm({
      nameEn: member.name_en,
      nameMr: member.name_mr,
      designationEn: member.designation_en || "Ex-President",
      designationMr: member.designation_mr || EX_PRESIDENT_MR,
      tenureFrom: member.tenure_from ? String(member.tenure_from) : "",
      tenureTo: member.tenure_to ? String(member.tenure_to) : "",
      phone: member.phone || "",
      galaNumber: member.gala_number || "",
      categoryEn: member.category_en || "",
      categoryMr: member.category_mr || "",
      sortOrder: String(member.sort_order ?? 100),
      isActive: member.is_active ? "1" : "0",
    });
    setPhotoFile(null);
    setOpen(true);
  };

  const saveMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const endpoint = editing ? `/api/v1/admin/ex-presidents/${editing.id}` : "/api/v1/admin/ex-presidents";
    const method = editing ? "PATCH" : "POST";
    try {
      const response = await fetch(endpoint, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          photo: photoFile ? await fileToUploadPayload(photoFile) : undefined,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Unable to save Ex-President record.");
      toast.success(editing ? "Ex-President updated" : "Ex-President added");
      setOpen(false);
      setPhotoFile(null);
      await loadMembers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save Ex-President record.");
    }
  };

  const deleteMember = async (member: ExPresidentRecord) => {
    if (!window.confirm("Delete this Ex-President record?")) return;
    try {
      const response = await fetch(`/api/v1/admin/ex-presidents/${member.id}`, { method: "DELETE", credentials: "include" });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Unable to delete Ex-President record.");
      toast.success("Ex-President record deleted");
      await loadMembers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete Ex-President record.");
    }
  };

  return (
    <DashLayout kind="admin">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary-dark">Ex-President Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Add, edit, order and publish former president records.</p>
          <p className="text-sm font-semibold text-primary">{"\u092e\u093e\u091c\u0940 \u0905\u0927\u094d\u092f\u0915\u094d\u0937 \u0935\u094d\u092f\u0935\u0938\u094d\u0925\u093e\u092a\u0928"}</p>
        </div>
        <Button onClick={openNew}><Plus className="mr-1 h-4 w-4" /> Add Ex-President</Button>
      </div>

      <Card className="border-border/60">
        <CardContent className="p-4 sm:p-5">
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Marathi Name</TableHead>
                  <TableHead>Tenure</TableHead>
                  <TableHead>Gala</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="h-12 w-12 overflow-hidden rounded-full bg-secondary">
                        <ProfilePhoto member={member} size="admin" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-primary-dark">{member.name_en}</TableCell>
                    <TableCell>{member.name_mr}</TableCell>
                    <TableCell>{formatTenure(member)}</TableCell>
                    <TableCell>{member.gala_number || ""}</TableCell>
                    <TableCell>{member.phone || ""}</TableCell>
                    <TableCell><Badge className={member.is_active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}>{member.is_active ? "active" : "inactive"}</Badge></TableCell>
                    <TableCell>{member.sort_order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => setViewing(member)}><Eye className="h-4 w-4" /></Button>
                        <Button size="sm" variant="outline" onClick={() => openEdit(member)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => deleteMember(member)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {!loading && members.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">No Ex-President records available.</div>}
          {loading && <div className="p-8 text-center text-sm text-muted-foreground">Loading Ex-President records...</div>}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Ex-President" : "Add Ex-President"}</DialogTitle>
            <DialogDescription>Saved active records are shown on the public Ex-President page.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={saveMember}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Profile photo</Label>
                <label className={`flex min-h-28 cursor-pointer items-center gap-4 rounded-lg border-2 border-dashed p-4 transition hover:border-primary ${photoFile ? "border-success bg-success/10" : "border-border bg-secondary/40 hover:bg-secondary"}`}>
                  <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-background text-primary shadow-sm">
                    {photoFile ? (
                      <img src={URL.createObjectURL(photoFile)} alt="Selected Ex-President" className="h-full w-full object-cover" />
                    ) : editing?.image_url ? (
                      <img src={editing.image_url} alt={editing.name_en} className="h-full w-full object-cover" />
                    ) : (
                      <Camera className="h-6 w-6" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-primary-dark">{photoFile ? "Photo selected" : "Upload Ex-President photo"}</div>
                    <div className={`mt-1 max-w-full truncate text-xs ${photoFile ? "font-medium text-success" : "text-muted-foreground"}`}>
                      {photoFile?.name || editing?.photo_original_filename || "JPG, PNG, or WEBP up to 5 MB"}
                    </div>
                    <div className="mt-2 inline-flex rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white">Choose photo</div>
                  </div>
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => setPhotoFile(event.target.files?.[0] || null)} />
                </label>
              </div>
              <div className="space-y-2"><Label>Full Name - English *</Label><Input value={form.nameEn} onChange={(event) => setForm({ ...form, nameEn: event.target.value })} required /></div>
              <div className="space-y-2"><Label>Full Name - Marathi *</Label><Input value={form.nameMr} onChange={(event) => setForm({ ...form, nameMr: event.target.value })} required /></div>
              <div className="space-y-2"><Label>Designation - English *</Label><Input value={form.designationEn} onChange={(event) => setForm({ ...form, designationEn: event.target.value })} required /></div>
              <div className="space-y-2"><Label>Designation - Marathi *</Label><Input value={form.designationMr} onChange={(event) => setForm({ ...form, designationMr: event.target.value })} required /></div>
              <div className="space-y-2"><Label>From Year</Label><Input type="number" value={form.tenureFrom} onChange={(event) => setForm({ ...form, tenureFrom: event.target.value })} placeholder="2018" /></div>
              <div className="space-y-2"><Label>To Year</Label><Input type="number" value={form.tenureTo} onChange={(event) => setForm({ ...form, tenureTo: event.target.value })} placeholder="2021" /></div>
              <div className="space-y-2"><Label>Phone Number</Label><Input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></div>
              <div className="space-y-2"><Label>Gala Number</Label><Input value={form.galaNumber} onChange={(event) => setForm({ ...form, galaNumber: event.target.value })} /></div>
              <div className="space-y-2"><Label>Department / Category - English</Label><Input value={form.categoryEn} onChange={(event) => setForm({ ...form, categoryEn: event.target.value })} /></div>
              <div className="space-y-2"><Label>Department / Category - Marathi</Label><Input value={form.categoryMr} onChange={(event) => setForm({ ...form, categoryMr: event.target.value })} /></div>
              <div className="space-y-2"><Label>Display Order *</Label><Input type="number" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: event.target.value })} required /></div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.isActive} onValueChange={(value) => setForm({ ...form, isActive: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Active - show publicly</SelectItem>
                    <SelectItem value="0">Inactive - hide publicly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-saffron text-saffron-foreground hover:bg-saffron/90">Save Ex-President</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ExPresidentModal member={viewing} open={!!viewing} onOpenChange={(open) => !open && setViewing(null)} />
    </DashLayout>
  );
}
