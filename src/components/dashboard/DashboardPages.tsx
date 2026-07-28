import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  AlertTriangle, Bell, Camera, CheckCircle2, ClipboardList, Download, Eye, FileText,
  HelpCircle, History, ImagePlus, KeyRound, Mail, MessageSquare, Newspaper, Phone, Plus, Search,
  Send, ShieldAlert, Store, ThumbsDown, ThumbsUp, Upload, User, Users, Video,
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { toast } from "sonner";
import { DashLayout } from "@/components/dashboard/DashLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  CHART_COMPLAINTS_CATEGORY, CHART_DOWNLOADS, CHART_REGISTRATIONS, COMMITTEE, COMPLAINTS,
  DASHBOARD_STATS, GALLERY_ITEMS, MARKET_UPDATES, MOBILE_REQUESTS, NOTICES, NOTIFICATIONS, OWNERS,
  type GalleryItem,
} from "@/lib/mock";
import { useAuth } from "@/lib/auth";

const CHART_COLORS = ["#176B3A", "#F59E0B", "#38A169", "#D92D20", "#7C3AED", "#0284C7"];

function PageTitle({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary-dark">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone = "primary" }: { icon: React.ElementType; label: string; value: string | number; tone?: "primary" | "success" | "warning" | "danger" | "saffron" }) {
  const tones = {
    primary: "bg-primary text-white",
    success: "bg-success text-white",
    warning: "bg-warning text-white",
    danger: "bg-destructive text-white",
    saffron: "bg-saffron text-primary-dark",
  };
  return (
    <Card className="border-border/60">
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="font-display text-2xl font-bold text-primary-dark">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    approved: "bg-success/15 text-success",
    pending: "bg-warning/15 text-warning",
    rejected: "bg-destructive/15 text-destructive",
    blacklisted: "bg-destructive text-white",
    submitted: "bg-info/15 text-info",
    under_review: "bg-chart-5/15 text-chart-5",
    assigned: "bg-info/15 text-info",
    in_progress: "bg-warning/15 text-warning",
    waiting_info: "bg-saffron/20 text-saffron-foreground",
    resolved: "bg-success/15 text-success",
    closed: "bg-muted text-muted-foreground",
    reshared: "bg-success/15 text-success",
  };
  return <Badge className={`capitalize ${map[status] || "bg-muted text-muted-foreground"}`}>{status.replace(/_/g, " ")}</Badge>;
}

function SearchBar({ placeholder = "Search..." }: { placeholder?: string }) {
  return (
    <div className="relative min-w-[220px] flex-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input className="pl-9" placeholder={placeholder} />
    </div>
  );
}

export function AdminUsersPage() {
  return (
    <DashLayout kind="admin">
      <PageTitle title="Gala Owner Management" subtitle="Search, verify, approve, reject, or blacklist gala owner accounts." action={<Button><Plus className="mr-1 h-4 w-4" /> Add Owner</Button>} />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total owners" value={DASHBOARD_STATS.totalOwners} />
        <StatCard icon={CheckCircle2} label="Approved" value={DASHBOARD_STATS.approved} tone="success" />
        <StatCard icon={ClipboardList} label="Pending" value={DASHBOARD_STATS.pending} tone="warning" />
        <StatCard icon={ShieldAlert} label="Blacklisted" value={DASHBOARD_STATS.blacklisted} tone="danger" />
      </div>
      <Card className="border-border/60">
        <CardContent className="p-6">
          <div className="mb-4 flex flex-wrap gap-3">
            <SearchBar placeholder="Search by name, gala, mobile..." />
            <Button variant="outline"><Download className="mr-1 h-4 w-4" /> Export</Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Owner</TableHead><TableHead>Contact</TableHead><TableHead>Gala</TableHead><TableHead>Category</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {OWNERS.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">{o.id}</TableCell>
                    <TableCell><div className="font-medium">{o.name}</div><div className="text-xs text-muted-foreground">{o.business}</div></TableCell>
                    <TableCell><div>{o.mobile}</div><div className="text-xs text-muted-foreground">{o.email}</div></TableCell>
                    <TableCell><Badge variant="outline">{o.gala}</Badge></TableCell>
                    <TableCell>{o.category}</TableCell>
                    <TableCell><StatusBadge status={o.status} /></TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => toast.info(`Viewing ${o.name}`)}><Eye className="h-4 w-4" /></Button>
                      {o.status === "pending" && <Button size="sm" variant="ghost" onClick={() => toast.success(`${o.name} approved`)}><ThumbsUp className="h-4 w-4 text-success" /></Button>}
                      {o.status === "approved" && <Button size="sm" variant="ghost" onClick={() => toast.warning(`${o.name} blacklisted`)}><ShieldAlert className="h-4 w-4 text-destructive" /></Button>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashLayout>
  );
}

export function AdminRegistrationsPage() {
  const pending = OWNERS.filter((o) => o.status === "pending");
  return (
    <DashLayout kind="admin">
      <PageTitle title="Registration Approvals" subtitle="Review new gala owner registrations and document verification status." />
      <div className="grid gap-4 lg:grid-cols-2">
        {pending.map((o) => (
          <Card key={o.id} className="border-border/60">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-secondary font-display font-bold text-primary">{o.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><h3 className="font-display font-bold text-primary-dark">{o.name}</h3><StatusBadge status={o.status} /></div>
                  <div className="mt-1 text-sm text-muted-foreground">{o.business} · Gala {o.gala}</div>
                  <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                    <div><span className="text-muted-foreground">Mobile:</span> {o.mobile}</div>
                    <div><span className="text-muted-foreground">Section:</span> {o.section}</div>
                    <div><span className="text-muted-foreground">Category:</span> {o.category}</div>
                    <div><span className="text-muted-foreground">Applied:</span> {new Date(o.regDate).toLocaleDateString("en-IN")}</div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button size="sm" className="bg-success text-white" onClick={() => toast.success(`${o.name} approved`)}><ThumbsUp className="mr-1 h-4 w-4" /> Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => toast.error(`${o.name} rejected`)}><ThumbsDown className="mr-1 h-4 w-4" /> Reject</Button>
                    <Button size="sm" variant="ghost">Request info</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashLayout>
  );
}

export function AdminComplaintsPage() {
  return (
    <DashLayout kind="admin">
      <PageTitle title="Complaint Management" subtitle="Assign, prioritize, comment on, and resolve owner complaints." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={MessageSquare} label="Active" value={DASHBOARD_STATS.activeComplaints} tone="warning" />
        <StatCard icon={CheckCircle2} label="Resolved" value={DASHBOARD_STATS.resolvedComplaints} tone="success" />
        <StatCard icon={AlertTriangle} label="Emergency" value={DASHBOARD_STATS.emergencyComplaints} tone="danger" />
        <StatCard icon={ClipboardList} label="Assigned today" value="12" />
      </div>
      <Card className="border-border/60">
        <CardContent className="p-6">
          <div className="mb-4 flex flex-wrap gap-3"><SearchBar placeholder="Search complaints..." /><Button variant="outline">Filter status</Button></div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Complaint</TableHead><TableHead>Owner</TableHead><TableHead>Priority</TableHead><TableHead>Status</TableHead><TableHead>Assigned</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
              <TableBody>
                {COMPLAINTS.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-xs">{c.id}</TableCell>
                    <TableCell><div className="font-medium">{c.subject}</div><div className="text-xs text-muted-foreground">{c.category} · {c.attachments} attachments</div></TableCell>
                    <TableCell><div>{c.ownerName}</div><div className="text-xs text-muted-foreground">{c.gala}</div></TableCell>
                    <TableCell><Badge className={c.priority === "emergency" ? "bg-destructive text-white" : c.priority === "high" ? "bg-warning text-white" : "bg-secondary text-primary-dark"}>{c.priority}</Badge></TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
                    <TableCell>{c.assignedTo}</TableCell>
                    <TableCell className="text-right"><Button size="sm" onClick={() => toast.success(`${c.id} updated`)}>Update</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashLayout>
  );
}

export function AdminUpdatesPage() {
  return (
    <DashLayout kind="admin">
      <PageTitle title="Market Updates" subtitle="Publish daily rates, arrivals, emergency alerts, and general market news." />
      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="space-y-3">
              {MARKET_UPDATES.map((u) => (
                <div key={u.id} className="flex items-start gap-3 rounded-lg border p-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary"><Newspaper className="h-4 w-4" /></div>
                  <div className="min-w-0 flex-1"><div className="text-xs text-muted-foreground">{u.category} · {u.views} views</div><div className="font-medium text-primary-dark">{u.title}</div><p className="mt-1 text-sm text-muted-foreground">{u.summary}</p></div>
                  {u.emergency && <Badge className="bg-destructive text-white">Alert</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <PublishCard kind="update" />
      </div>
    </DashLayout>
  );
}

export function AdminNoticesPage() {
  return (
    <DashLayout kind="admin">
      <PageTitle title="Notices & Documents" subtitle="Upload circulars, meeting notices, PDFs, images, and video announcements." />
      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <Card className="border-border/60">
          <CardContent className="grid gap-3 p-6 md:grid-cols-2">
            {NOTICES.map((n) => (
              <div key={n.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between gap-2"><Badge variant="outline">{n.category}</Badge><span className="text-xs text-muted-foreground">#{n.number}</span></div>
                <h3 className="mt-3 font-display font-semibold text-primary-dark">{n.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{n.description}</p>
                <div className="mt-4 flex gap-2"><Button size="sm" variant="outline"><Eye className="mr-1 h-4 w-4" /> View</Button><Button size="sm" variant="outline"><Download className="mr-1 h-4 w-4" /> Download</Button></div>
              </div>
            ))}
          </CardContent>
        </Card>
        <PublishCard kind="notice" />
      </div>
    </DashLayout>
  );
}

const OWNER_POSTS = [
  {
    id: "POST-101",
    ownerName: "Ramesh Shinde",
    gala: "A-101",
    section: "Vegetable Section A",
    type: "Sale or Availability",
    title: "Fresh tomato stock available",
    body: "Fresh tomato crates are available near Gala A-101 for interested buyers and section owners.",
    status: "submitted",
    date: "2026-07-28",
    images: ["tomato-stock-photo.jpg"],
    videos: ["tomato-stock-walkthrough.mp4"],
  },
  {
    id: "POST-102",
    ownerName: "Suresh Pawar",
    gala: "B-214",
    section: "Onion Section B",
    type: "Market Update",
    title: "Onion arrivals increased today",
    body: "Heavy arrivals in Section B. Please keep the loading lane clear during morning unloading.",
    status: "reshared",
    date: "2026-07-28",
    images: ["onion-arrival-section-b.jpg"],
    videos: ["onion-arrival-video.mp4"],
  },
  {
    id: "POST-103",
    ownerName: "Anil Jadhav",
    gala: "C-032",
    section: "Fruit Section C",
    type: "General Request",
    title: "Extra cleaning required near fruit lane",
    body: "Fruit lane needs extra cleaning after evening closing due to waste near the common walkway.",
    status: "under_review",
    date: "2026-07-27",
    images: ["fruit-lane-cleaning.jpg"],
    videos: [],
  },
];

function MediaDownloads({ images, videos }: { images: string[]; videos: string[] }) {
  const files = [
    ...images.map((file) => ({ file, type: "Image", icon: Camera })),
    ...videos.map((file) => ({ file, type: "Video", icon: Video })),
  ];

  return (
    <div className="mt-4 grid gap-2 sm:grid-cols-2">
      {files.map(({ file, type, icon: Icon }) => (
        <Button key={file} size="sm" variant="outline" className="h-auto min-w-0 justify-start py-2" onClick={() => toast.success(`${file} download started`)}>
          <Icon className="mr-2 h-4 w-4 shrink-0 text-primary" />
          <span className="min-w-0 flex-1 truncate text-left">{file}</span>
          <span className="ml-2 shrink-0 text-xs text-muted-foreground">{type}</span>
          <Download className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      ))}
    </div>
  );
}

export function AdminGalleryPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<GalleryItem[]>(GALLERY_ITEMS);
  const [mediaType, setMediaType] = useState<GalleryItem["type"]>("image");
  const [files, setFiles] = useState<File[]>([]);

  const uploader = user?.role === "main_admin" ? "Main Admin" : "User Admin";
  const imageCount = items.filter((item) => item.type === "image").length;
  const videoCount = items.filter((item) => item.type === "video").length;

  const publishGalleryItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const title = String(data.get("title") || "").trim();
    const section = String(data.get("section") || "").trim();

    if (!title || !section || files.length === 0) {
      toast.error("Add title, section, and at least one image or video");
      return;
    }

    const nextItem: GalleryItem = {
      id: `GAL-${String(items.length + 1).padStart(3, "0")}`,
      title,
      section,
      type: mediaType,
      count: files.length,
      date: new Date().toISOString().slice(0, 10),
      uploadedBy: uploader,
      status: "published",
    };

    setItems([nextItem, ...items]);
    setFiles([]);
    form.reset();
    setMediaType("image");
    toast.success(`${mediaType === "image" ? "Images" : "Video"} added to gallery`);
  };

  return (
    <DashLayout kind="admin">
      <PageTitle title="Gallery Management" subtitle="Add public gallery images and videos from Main Admin or User Admin dashboard." />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={Camera} label="Image albums" value={imageCount} />
        <StatCard icon={Video} label="Video albums" value={videoCount} tone="saffron" />
        <StatCard icon={CheckCircle2} label="Published items" value={items.length} tone="success" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <Card className="border-saffron/40 bg-saffron/5">
          <CardContent className="p-6">
            <h2 className="font-display text-lg font-bold text-primary-dark">Add gallery media</h2>
            <p className="mt-1 text-sm text-muted-foreground">Upload images or videos and publish them to the public gallery page.</p>
            <form className="mt-5 space-y-4" onSubmit={publishGalleryItem}>
              <div>
                <Label>Gallery title *</Label>
                <Input name="title" required placeholder="e.g. Annual meeting photos" />
              </div>
              <div>
                <Label>Section / event *</Label>
                <Input name="section" required placeholder="e.g. Association Hall" />
              </div>
              <div>
                <Label>Media type *</Label>
                <Select value={mediaType} onValueChange={(value) => setMediaType(value as GalleryItem["type"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/30 bg-background p-6 text-center text-sm transition hover:border-primary">
                <Upload className="h-7 w-7 text-primary" />
                <span className="font-medium text-primary-dark">
                  Upload {mediaType === "image" ? "images" : "videos"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {mediaType === "image" ? "JPG, PNG, WEBP" : "MP4, WEBM, MOV"} files supported
                </span>
                <input
                  type="file"
                  multiple
                  accept={mediaType === "image" ? "image/*" : "video/*"}
                  className="hidden"
                  onChange={(event) => setFiles(Array.from(event.target.files || []))}
                />
              </label>
              {files.length > 0 && (
                <div className="rounded-lg border bg-background p-3 text-sm">
                  <div className="font-medium text-primary-dark">{files.length} file{files.length > 1 ? "s" : ""} selected</div>
                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {files.slice(0, 4).map((file) => <div key={file.name} className="truncate">{file.name}</div>)}
                    {files.length > 4 && <div>+{files.length - 4} more</div>}
                  </div>
                </div>
              )}
              <Button type="submit" className="w-full bg-primary">
                <ImagePlus className="mr-1 h-4 w-4" /> Publish to Gallery
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-primary-dark">Published gallery</h2>
                <p className="text-sm text-muted-foreground">These items are visible on the public gallery page.</p>
              </div>
              <Button asChild variant="outline">
                <Link to="/gallery"><Eye className="mr-1 h-4 w-4" /> View Public Gallery</Link>
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((item, index) => (
                <div key={item.id} className="overflow-hidden rounded-lg border bg-background">
                  <div className="relative grid h-40 place-items-center bg-secondary">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(245,158,11,0.22),transparent_32%),linear-gradient(135deg,rgba(23,107,58,0.18),rgba(56,161,105,0.08))]" />
                    <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-background text-primary shadow-md">
                      {item.type === "video" ? <Video className="h-7 w-7" /> : <Camera className="h-7 w-7" />}
                    </div>
                    <Badge className="absolute left-3 top-3 bg-primary text-white">{item.type === "video" ? "Video" : "Images"}</Badge>
                    {index === 0 && <Badge className="absolute right-3 top-3 bg-saffron text-primary-dark">Latest</Badge>}
                  </div>
                  <div className="p-4">
                    <div className="font-display font-semibold text-primary-dark">{item.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{item.section} · {new Date(item.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <Badge variant="outline" className="border-primary/40 text-primary">{item.count} {item.type === "video" ? "clips" : "photos"}</Badge>
                      <span className="text-xs text-muted-foreground">By {item.uploadedBy}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashLayout>
  );
}

function PostMediaPreview({ images, videos }: { images: string[]; videos: string[] }) {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <div className="rounded-lg border bg-secondary/40 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-primary-dark"><Camera className="h-4 w-4 text-primary" /> Images</div>
        <div className="mt-2 text-2xl font-bold text-primary-dark">{images.length}</div>
        <div className="text-xs text-muted-foreground">{images.length ? images.join(", ") : "No image attached"}</div>
      </div>
      <div className="rounded-lg border bg-secondary/40 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-primary-dark"><Video className="h-4 w-4 text-primary" /> Videos</div>
        <div className="mt-2 text-2xl font-bold text-primary-dark">{videos.length}</div>
        <div className="text-xs text-muted-foreground">{videos.length ? videos.join(", ") : "No video attached"}</div>
      </div>
    </div>
  );
}

function SharedPostCard({ post, adminView = false, framed = true }: { post: (typeof OWNER_POSTS)[number]; adminView?: boolean; framed?: boolean }) {
  const content = (
    <>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono">{post.id}</span>
              <Badge variant="outline">{post.type}</Badge>
              <span>{new Date(post.date).toLocaleDateString("en-IN")}</span>
            </div>
            <h2 className="mt-2 font-display text-lg font-bold text-primary-dark">{post.title}</h2>
          </div>
          <StatusBadge status={post.status} />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{post.body}</p>
        <div className="mt-4 rounded-lg border bg-secondary/50 p-3">
          <div className="text-sm font-semibold text-primary-dark">Posted by {post.ownerName}</div>
          <div className="text-xs text-muted-foreground">Gala {post.gala} · {post.section}</div>
        </div>
        {adminView && <PostMediaPreview images={post.images} videos={post.videos} />}
        <MediaDownloads images={post.images} videos={post.videos} />
    </>
  );

  if (!framed) return <div>{content}</div>;

  return (
    <Card className="border-border/60">
      <CardContent className="p-6">{content}</CardContent>
    </Card>
  );
}

export function AdminOwnerPostsPage() {
  const pendingPosts = OWNER_POSTS.filter((post) => post.status !== "reshared");
  const resharedPosts = OWNER_POSTS.filter((post) => post.status === "reshared");

  return (
    <DashLayout kind="admin">
      <PageTitle title="Owner Posts" subtitle="Review gala owner posts and reshare approved posts to all gala owners." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={ImagePlus} label="Submitted posts" value={OWNER_POSTS.length} />
        <StatCard icon={ClipboardList} label="Waiting for review" value={pendingPosts.length} tone="warning" />
        <StatCard icon={Send} label="Reshared posts" value={resharedPosts.length} tone="success" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display font-bold text-primary-dark">Admin review queue</h2>
                <p className="mt-1 text-sm text-muted-foreground">Posts here are visible only to admin until reshared.</p>
              </div>
              <Badge className="bg-saffron text-primary-dark">{pendingPosts.length} pending</Badge>
            </div>
            <div className="space-y-4">
              {pendingPosts.map((post) => (
                <div key={post.id} className="rounded-lg border bg-background p-4">
                  <SharedPostCard post={post} adminView framed={false} />
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button className="bg-primary" onClick={() => toast.success(`${post.title} reshared to all gala owners`)}>
                      <Send className="mr-1 h-4 w-4" /> Reshare Post
                    </Button>
                    <Button variant="outline" onClick={() => toast.error(`${post.id} rejected`)}>Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-6">
            <h2 className="font-display font-bold text-primary-dark">Already reshared</h2>
            <p className="mt-1 text-sm text-muted-foreground">These are visible in Gala Owner Shared Posts.</p>
            <div className="mt-4 space-y-3">
              {resharedPosts.map((post) => (
                <div key={post.id} className="rounded-lg border p-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="outline">{post.type}</Badge>
                    <StatusBadge status={post.status} />
                  </div>
                  <div className="mt-2 font-medium text-primary-dark">{post.title}</div>
                  <div className="text-xs text-muted-foreground">Posted by {post.ownerName} · Gala {post.gala}</div>
                  <MediaDownloads images={post.images} videos={post.videos} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashLayout>
  );
}

function PublishCard({ kind }: { kind: "update" | "notice" }) {
  return (
    <Card className="border-saffron/40 bg-saffron/5">
      <CardContent className="p-6">
        <h2 className="font-display font-bold text-primary-dark">Publish new {kind}</h2>
        <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); toast.success(`${kind === "update" ? "Market update" : "Notice"} published`); (e.currentTarget as HTMLFormElement).reset(); }}>
          <div><Label>Title</Label><Input required placeholder={kind === "update" ? "Onion price update" : "Meeting notice"} /></div>
          <div><Label>Category</Label><Select defaultValue="General"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["General", "Emergency", "Meeting", "Payment", "Water Supply", "Electricity", "Market Holiday"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Description</Label><Textarea required rows={4} /></div>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed p-3 text-sm hover:border-primary"><Upload className="h-4 w-4 text-primary" /> Attach file<input type="file" className="hidden" /></label>
          <Button type="submit" className="w-full bg-primary">Publish</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function AdminMobileRequestsPage() {
  return (
    <DashLayout kind="admin">
      <PageTitle title="Mobile Change Requests" subtitle="Verify owner identity before updating registered mobile numbers." />
      <Card className="border-border/60">
        <CardContent className="p-6">
          <Table>
            <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Owner</TableHead><TableHead>Old Mobile</TableHead><TableHead>New Mobile</TableHead><TableHead>Reason</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Decision</TableHead></TableRow></TableHeader>
            <TableBody>{MOBILE_REQUESTS.map((r) => <TableRow key={r.id}><TableCell className="font-mono text-xs">{r.id}</TableCell><TableCell>{r.ownerName}<div className="text-xs text-muted-foreground">{r.gala}</div></TableCell><TableCell>{r.oldMobile}</TableCell><TableCell>{r.newMobile}</TableCell><TableCell>{r.reason}</TableCell><TableCell><StatusBadge status={r.status} /></TableCell><TableCell className="text-right"><Button size="sm" className="mr-2 bg-success text-white" onClick={() => toast.success(`${r.id} approved`)}>Approve</Button><Button size="sm" variant="outline" onClick={() => toast.error(`${r.id} rejected`)}>Reject</Button></TableCell></TableRow>)}</TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashLayout>
  );
}

export function AdminCommitteePage() {
  return (
    <DashLayout kind="admin">
      <PageTitle title="Chairman & Committee" subtitle="Maintain association leadership details shown on the public site." action={<Button><Plus className="mr-1 h-4 w-4" /> Add Member</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {COMMITTEE.map((m) => (
          <Card key={m.id} className="border-border/60">
            <CardContent className="p-5 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary font-display text-lg font-bold text-primary">{m.name.split(" ").slice(-1)[0][0]}</div>
              <h3 className="mt-3 font-display font-semibold text-primary-dark">{m.name}</h3>
              <div className="text-sm text-primary">{m.designation}</div>
              {m.gala && <div className="mt-1 text-xs text-muted-foreground">Gala {m.gala}</div>}
              <Button className="mt-4 w-full" size="sm" variant="outline">Edit profile</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashLayout>
  );
}

export function AdminReportsPage() {
  return (
    <DashLayout kind="admin">
      <PageTitle title="Reports & Analytics" subtitle="Track registrations, complaints, downloads, and portal engagement." action={<Button variant="outline"><Download className="mr-1 h-4 w-4" /> Export report</Button>} />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Portal logins" value={DASHBOARD_STATS.monthlyLogins.toLocaleString()} />
        <StatCard icon={Download} label="Downloads" value={DASHBOARD_STATS.totalDownloads.toLocaleString()} tone="saffron" />
        <StatCard icon={MessageSquare} label="Resolved complaints" value={DASHBOARD_STATS.resolvedComplaints} tone="success" />
        <StatCard icon={FileText} label="Notices" value={DASHBOARD_STATS.totalNotices} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Monthly registrations"><BarChart data={CHART_REGISTRATIONS}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#176B3A" radius={[6, 6, 0, 0]} /></BarChart></ChartCard>
        <ChartCard title="Document downloads"><LineChart data={CHART_DOWNLOADS}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="downloads" stroke="#F59E0B" strokeWidth={3} /></LineChart></ChartCard>
        <ChartCard title="Complaints by category"><PieChart><Pie data={CHART_COMPLAINTS_CATEGORY} dataKey="count" nameKey="category" outerRadius={90} label>{CHART_COMPLAINTS_CATEGORY.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ChartCard>
      </div>
    </DashLayout>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return <Card className="border-border/60"><CardContent className="p-6"><h2 className="mb-4 font-display font-bold text-primary-dark">{title}</h2><div className="h-72"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div></CardContent></Card>;
}

export function AdminAuditPage() {
  const rows = ["Approved GO-012 registration", "Published market closure notice", "Assigned CMP-2408 to Security Department", "Rejected mobile request MCR-105", "Updated committee member profile", "Downloaded monthly complaint report"];
  return (
    <DashLayout kind="admin">
      <PageTitle title="Audit Logs" subtitle="Transparent activity trail for admin decisions and portal changes." />
      <Card className="border-border/60">
        <CardContent className="p-6">
          <div className="space-y-3">{rows.map((row, i) => <div key={row} className="flex items-center gap-3 rounded-lg border p-3"><div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary"><History className="h-4 w-4" /></div><div className="flex-1"><div className="font-medium text-primary-dark">{row}</div><div className="text-xs text-muted-foreground">Admin · 2026-07-{28 - i} · {10 + i}:30 AM</div></div><Badge variant="outline">Recorded</Badge></div>)}</div>
        </CardContent>
      </Card>
    </DashLayout>
  );
}

const me = OWNERS[0];
const myComplaints = COMPLAINTS.filter((c) => c.ownerId === me.id);

export function OwnerProfilePage() {
  return (
    <DashLayout kind="owner">
      <PageTitle title="My Profile" subtitle="Manage personal, contact, and business identity details." action={<Button>Save changes</Button>} />
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="border-border/60"><CardContent className="p-6 text-center"><div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-secondary font-display text-3xl font-bold text-primary">RS</div><h2 className="mt-4 font-display text-xl font-bold text-primary-dark">{me.name}</h2><p className="text-sm text-muted-foreground">{me.business}</p><Badge className="mt-3 bg-success/15 text-success">Verified Owner</Badge></CardContent></Card>
        <Card className="border-border/60"><CardContent className="grid gap-4 p-6 sm:grid-cols-2"><Field label="Full name" value={me.name} /><Field label="Email" value={me.email} /><Field label="Registered mobile" value={me.mobile} /><Field label="Username" value={me.username} /><Field label="Address" value={me.address} wide /></CardContent></Card>
      </div>
    </DashLayout>
  );
}

function Field({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return <div className={wide ? "sm:col-span-2" : ""}><Label>{label}</Label><Input defaultValue={value} /></div>;
}

export function OwnerGalaPage() {
  return (
    <DashLayout kind="owner">
      <PageTitle title="My Gala Details" subtitle="Verified gala, section, business category, and document profile." />
      <div className="grid gap-6 lg:grid-cols-3">
        <StatCard icon={Store} label="Gala number" value={me.gala} />
        <StatCard icon={Users} label="Section" value={me.section} tone="saffron" />
        <StatCard icon={CheckCircle2} label="Status" value="Approved" tone="success" />
      </div>
      <Card className="mt-6 border-border/60"><CardContent className="grid gap-4 p-6 sm:grid-cols-2"><Field label="Business name" value={me.business} /><Field label="Business category" value={me.category} /><Field label="Market section" value={me.section} /><Field label="Registered address" value={me.address} wide /></CardContent></Card>
    </DashLayout>
  );
}

export function OwnerUpdatesPage() {
  return <OwnerListPage title="Market Updates" subtitle="Daily market prices, arrivals, weather alerts, and public announcements." icon={Newspaper} items={MARKET_UPDATES.map((u) => ({ id: u.id, title: u.title, meta: `${u.category} · ${new Date(u.date).toLocaleDateString("en-IN")}`, body: u.summary, alert: u.emergency }))} />;
}

export function OwnerNoticesPage() {
  return <OwnerListPage title="Notices & Documents" subtitle="Official documents, circulars, meeting notices, and downloadable files." icon={FileText} items={NOTICES.map((n) => ({ id: n.id, title: n.title, meta: `#${n.number} · ${n.category}`, body: n.description, file: n.attachment }))} />;
}

function OwnerListPage({ title, subtitle, icon: Icon, items }: { title: string; subtitle: string; icon: React.ElementType; items: Array<{ id: string; title: string; meta: string; body: string; alert?: boolean; file?: string }> }) {
  return (
    <DashLayout kind="owner">
      <PageTitle title={title} subtitle={subtitle} />
      <Card className="border-border/60"><CardContent className="p-6"><div className="mb-4 flex flex-wrap gap-3"><SearchBar /><Button variant="outline">Filter</Button></div><div className="grid gap-3 md:grid-cols-2">{items.map((item) => <div key={item.id} className="rounded-lg border p-4"><div className="flex items-start gap-3"><div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary"><Icon className="h-4 w-4" /></div><div className="min-w-0 flex-1"><div className="text-xs text-muted-foreground">{item.meta}</div><h3 className="mt-1 font-display font-semibold text-primary-dark">{item.title}</h3><p className="mt-1 text-sm text-muted-foreground">{item.body}</p></div>{item.alert && <Badge className="bg-destructive text-white">Alert</Badge>}</div>{item.file && <Button className="mt-4" size="sm" variant="outline"><Download className="mr-1 h-4 w-4" /> {item.file}</Button>}</div>)}</div></CardContent></Card>
    </DashLayout>
  );
}

export function OwnerComplaintsPage() {
  return (
    <DashLayout kind="owner">
      <PageTitle title="My Complaints" subtitle="Track complaint status, assigned department, and admin comments." action={<Button asChild><Link to="/owner/new-complaint"><Plus className="mr-1 h-4 w-4" /> New Complaint</Link></Button>} />
      <div className="grid gap-4">
        {myComplaints.map((c) => <Card key={c.id} className="border-border/60"><CardContent className="p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="text-xs text-muted-foreground">{c.id} · {c.category}</div><h2 className="font-display font-semibold text-primary-dark">{c.subject}</h2><p className="mt-1 text-sm text-muted-foreground">{c.description}</p></div><StatusBadge status={c.status} /></div><div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground"><Badge variant="outline">{c.priority}</Badge><span>Assigned to {c.assignedTo}</span><span>{c.attachments} attachments</span></div></CardContent></Card>)}
      </div>
    </DashLayout>
  );
}

export function OwnerNewComplaintPage() {
  return (
    <DashLayout kind="owner">
      <PageTitle title="Raise Complaint" subtitle="Submit a facility issue with priority, details, and supporting media." />
      <ComplaintForm />
    </DashLayout>
  );
}

export function OwnerPostPage() {
  return (
    <DashLayout kind="owner">
      <PageTitle title="Create Post" subtitle="Share a market update, gala announcement, or request with image and video attachments." />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="border-border/60">
          <CardContent className="p-6">
            <form
              className="grid gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Post submitted for admin review");
                (e.currentTarget as HTMLFormElement).reset();
              }}
            >
              <div className="rounded-lg bg-secondary/60 p-4">
                <h2 className="font-display font-semibold text-primary-dark">Posting as</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Gala owner name</Label>
                    <Input value={me.name} disabled />
                  </div>
                  <div>
                    <Label>Gala number</Label>
                    <Input value={me.gala} disabled />
                  </div>
                  <div>
                    <Label>Business name</Label>
                    <Input value={me.business} disabled />
                  </div>
                  <div>
                    <Label>Market section</Label>
                    <Input value={me.section} disabled />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Post type *</Label>
                  <Select defaultValue="Market Update">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Market Update", "Gala Announcement", "Sale or Availability", "Lost and Found", "General Request"].map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Visible to *</Label>
                  <Input value="Association Admin only" disabled />
                </div>
              </div>

              <div>
                <Label>Post title *</Label>
                <Input required placeholder="Short title for your post" />
              </div>

              <div>
                <Label>Post details *</Label>
                <Textarea required rows={6} placeholder="Write the update, announcement, request, or details clearly." />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/40 p-4 text-center text-sm transition hover:border-primary hover:bg-secondary">
                  <Camera className="h-7 w-7 text-primary" />
                  <span className="font-medium text-primary-dark">Upload post images</span>
                  <span className="text-xs text-muted-foreground">JPG, PNG, WEBP. Multiple allowed.</span>
                  <input type="file" accept="image/*" className="hidden" multiple />
                </label>
                <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/40 p-4 text-center text-sm transition hover:border-primary hover:bg-secondary">
                  <Video className="h-7 w-7 text-primary" />
                  <span className="font-medium text-primary-dark">Upload post videos</span>
                  <span className="text-xs text-muted-foreground">MP4, MOV, WEBM. Multiple allowed.</span>
                  <input type="file" accept="video/*" className="hidden" multiple />
                </label>
              </div>

              <label className="flex items-start gap-3 rounded-lg border p-4 text-sm">
                <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-border" />
                <span>I confirm this post is related to my gala or market yard activity and can be reviewed by the association team.</span>
              </label>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">Your post will go only to admin. Other gala owners can see it only after admin reshares it.</p>
                <Button className="bg-primary"><Upload className="mr-1 h-4 w-4" /> Submit Post</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-saffron/40 bg-saffron/5">
            <CardContent className="p-6">
              <h2 className="font-display font-bold text-primary-dark">Post guidelines</h2>
              <div className="mt-4 space-y-3 text-sm">
                {["Use clear photos or videos", "Add location or gala details when needed", "Avoid duplicate posts", "Admin approval may be required"].map((item) => (
                  <div key={item} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-6">
              <h2 className="font-display font-bold text-primary-dark">My submitted posts</h2>
              <div className="mt-4 space-y-3">
                {OWNER_POSTS.filter((post) => post.ownerName === me.name).map((post) => (
                  <div key={post.title} className="rounded-lg border p-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline">{post.type}</Badge>
                      <StatusBadge status={post.status} />
                    </div>
                    <div className="mt-2 font-medium text-primary-dark">{post.title}</div>
                    <div className="text-xs text-muted-foreground">Sent to admin · Gala {post.gala}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-6">
              <h2 className="font-display font-bold text-primary-dark">Visible after reshare</h2>
              <p className="mt-2 text-sm text-muted-foreground">Admin-approved posts appear on the Shared Posts page for all gala owners with owner name and download options.</p>
              <Button asChild className="mt-4 w-full bg-primary">
                <Link to="/owner/shared-posts"><Newspaper className="mr-1 h-4 w-4" /> Open Shared Posts</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashLayout>
  );
}

export function OwnerSharedPostsPage() {
  const resharedPosts = OWNER_POSTS.filter((post) => post.status === "reshared");

  return (
    <DashLayout kind="owner">
      <PageTitle title="Shared Posts" subtitle="Admin-approved posts visible to all gala owners." action={<Button asChild><Link to="/owner/post"><Plus className="mr-1 h-4 w-4" /> Submit Post</Link></Button>} />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={Newspaper} label="Shared posts" value={resharedPosts.length} />
        <StatCard icon={Camera} label="Images available" value={resharedPosts.reduce((total, post) => total + post.images.length, 0)} tone="saffron" />
        <StatCard icon={Video} label="Videos available" value={resharedPosts.reduce((total, post) => total + post.videos.length, 0)} tone="success" />
      </div>
      <Card className="mb-6 border-border/60">
        <CardContent className="flex flex-wrap gap-3 p-4">
          <SearchBar placeholder="Search shared posts..." />
          <Button variant="outline">All sections</Button>
          <Button variant="outline">Latest first</Button>
        </CardContent>
      </Card>
      <div className="grid gap-4 xl:grid-cols-2">
        {resharedPosts.map((post) => <SharedPostCard key={post.id} post={post} />)}
      </div>
      {resharedPosts.length === 0 && (
        <Card className="border-border/60">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">No admin-reshared posts yet.</CardContent>
        </Card>
      )}
    </DashLayout>
  );
}

export function ComplaintForm({ compact = false }: { compact?: boolean }) {
  return (
    <Card className="border-border/60">
      <CardContent className={compact ? "p-5" : "p-6"}>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Complaint submitted with attachments");
            (e.currentTarget as HTMLFormElement).reset();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Complaint category *</Label>
              <Select defaultValue="Water Supply">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Water Supply", "Electricity", "Cleanliness", "Drainage", "Parking", "Security", "Market Facility", "Shop or Gala Issue"].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority *</Label>
              <Select defaultValue="medium">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["low", "medium", "high", "emergency"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Subject *</Label>
            <Input required placeholder="Short complaint title" />
          </div>
          <div>
            <Label>Description *</Label>
            <Textarea required rows={compact ? 4 : 6} placeholder="Describe the issue, location, and urgency clearly..." />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/40 p-4 text-center text-sm transition hover:border-primary hover:bg-secondary">
              <Camera className="h-6 w-6 text-primary" />
              <span className="font-medium text-primary-dark">Upload images</span>
              <span className="text-xs text-muted-foreground">JPG, PNG, WEBP</span>
              <input type="file" accept="image/*" className="hidden" multiple />
            </label>
            <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/40 p-4 text-center text-sm transition hover:border-primary hover:bg-secondary">
              <Video className="h-6 w-6 text-primary" />
              <span className="font-medium text-primary-dark">Upload videos</span>
              <span className="text-xs text-muted-foreground">MP4, MOV, WEBM</span>
              <input type="file" accept="video/*" className="hidden" multiple />
            </label>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">Your complaint will be sent to the admin team for review and assignment.</p>
            <Button className="bg-primary"><Upload className="mr-1 h-4 w-4" /> Submit Complaint</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function MobileChangeApplicationForm({ compact = false }: { compact?: boolean }) {
  return (
    <Card className="border-border/60">
      <CardContent className={compact ? "p-5" : "p-6"}>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Mobile number change application submitted");
            (e.currentTarget as HTMLFormElement).reset();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Gala owner name</Label>
              <Input value={me.name} disabled />
            </div>
            <div>
              <Label>Gala number</Label>
              <Input value={me.gala} disabled />
            </div>
            <div>
              <Label>Current registered mobile *</Label>
              <Input value={me.mobile} disabled />
            </div>
            <div>
              <Label>New mobile number *</Label>
              <Input required type="tel" pattern="\d{10}" maxLength={10} placeholder="10-digit mobile number" />
            </div>
            {!compact && (
              <>
                <div>
                  <Label>Alternate contact number</Label>
                  <Input type="tel" pattern="\d{10}" maxLength={10} placeholder="Optional 10-digit number" />
                </div>
                <div>
                  <Label>Reason for change *</Label>
                  <Select defaultValue="Lost SIM card">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Lost SIM card", "Changed service provider", "Old number inactive", "Phone theft", "Personal number change"].map((reason) => (
                        <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          {compact ? (
            <div>
              <Label>Reason for change *</Label>
              <Textarea required rows={3} placeholder="Write a short application note." />
            </div>
          ) : (
            <div>
              <Label>Application note *</Label>
              <Textarea required rows={4} placeholder="Write a short request explaining why the registered mobile number should be changed." />
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/40 p-4 text-center text-sm transition hover:border-primary hover:bg-secondary">
              <User className="h-5 w-5 text-primary" />
              <span className="font-medium text-primary-dark">Upload ID proof *</span>
              <span className="text-xs text-muted-foreground">Image or PDF</span>
              <input type="file" accept="image/*,.pdf" className="hidden" required />
            </label>
            <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/40 p-4 text-center text-sm transition hover:border-primary hover:bg-secondary">
              <Phone className="h-5 w-5 text-primary" />
              <span className="font-medium text-primary-dark">Upload mobile proof</span>
              <span className="text-xs text-muted-foreground">Bill, receipt, screenshot</span>
              <input type="file" accept="image/*,.pdf" className="hidden" />
            </label>
          </div>
          <label className="flex items-start gap-3 rounded-lg border p-3 text-sm">
            <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-border" />
            <span>I confirm this new mobile number belongs to me and should be used for portal login and updates.</span>
          </label>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">Admin approval is required before the new number becomes active.</p>
            <Button className="bg-primary"><Phone className="mr-1 h-4 w-4" /> Submit Application</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function OwnerMobileChangePage() {
  return (
    <DashLayout kind="owner">
      <PageTitle title="Mobile Number Change Application" subtitle="Submit a formal request to update your registered mobile number." />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="border-border/60">
          <CardContent className="p-6">
            <form
              className="grid gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Mobile number change application submitted");
                (e.currentTarget as HTMLFormElement).reset();
              }}
            >
              <div className="rounded-lg bg-secondary/60 p-4">
                <h2 className="font-display font-semibold text-primary-dark">Applicant details</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Gala owner name</Label>
                    <Input value={me.name} disabled />
                  </div>
                  <div>
                    <Label>Gala number</Label>
                    <Input value={me.gala} disabled />
                  </div>
                  <div>
                    <Label>Business name</Label>
                    <Input value={me.business} disabled />
                  </div>
                  <div>
                    <Label>Market section</Label>
                    <Input value={me.section} disabled />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Current registered mobile *</Label>
                  <Input value={me.mobile} disabled />
                </div>
                <div>
                  <Label>New mobile number *</Label>
                  <Input required type="tel" pattern="\d{10}" maxLength={10} placeholder="10-digit mobile number" />
                </div>
                <div>
                  <Label>Alternate contact number</Label>
                  <Input type="tel" pattern="\d{10}" maxLength={10} placeholder="Optional 10-digit number" />
                </div>
                <div>
                  <Label>Reason for change *</Label>
                  <Select defaultValue="Lost SIM card">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Lost SIM card", "Changed service provider", "Old number inactive", "Phone theft", "Personal number change"].map((reason) => (
                        <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Application note *</Label>
                <Textarea required rows={4} placeholder="Write a short request explaining why the registered mobile number should be changed." />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/40 p-4 text-center text-sm transition hover:border-primary hover:bg-secondary">
                  <User className="h-6 w-6 text-primary" />
                  <span className="font-medium text-primary-dark">Upload ID proof *</span>
                  <span className="text-xs text-muted-foreground">Aadhaar, PAN, or license image/PDF</span>
                  <input type="file" accept="image/*,.pdf" className="hidden" required />
                </label>
                <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/40 p-4 text-center text-sm transition hover:border-primary hover:bg-secondary">
                  <Phone className="h-6 w-6 text-primary" />
                  <span className="font-medium text-primary-dark">Upload mobile proof</span>
                  <span className="text-xs text-muted-foreground">SIM receipt, bill, or screenshot</span>
                  <input type="file" accept="image/*,.pdf" className="hidden" />
                </label>
              </div>

              <label className="flex items-start gap-3 rounded-lg border p-4 text-sm">
                <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-border" />
                <span>I confirm this new mobile number belongs to me and should be used for all future portal login, notices, and complaint updates.</span>
              </label>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">Admin approval is required before the new number becomes active.</p>
                <Button className="bg-primary"><Phone className="mr-1 h-4 w-4" /> Submit Application</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-saffron/40 bg-saffron/5">
            <CardContent className="p-6">
              <h2 className="font-display font-bold text-primary-dark">Application checklist</h2>
              <div className="mt-4 space-y-3 text-sm">
                {["New mobile must be active", "ID proof is mandatory", "Admin may call for verification", "Approval usually takes 24-48 hours"].map((item) => (
                  <div key={item} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-6">
              <h2 className="font-display font-bold text-primary-dark">Recent applications</h2>
              <div className="mt-4 space-y-3">
                {MOBILE_REQUESTS.slice(0, 3).map((r) => (
                  <div key={r.id} className="rounded-lg border p-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-mono text-xs text-muted-foreground">{r.id}</div>
                      <StatusBadge status={r.status} />
                    </div>
                    <div className="mt-2 font-medium text-primary-dark">{r.newMobile}</div>
                    <div className="text-xs text-muted-foreground">{r.reason}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashLayout>
  );
}

export function OwnerNotificationsPage() {
  return (
    <DashLayout kind="owner">
      <PageTitle title="Notifications" subtitle="Recent alerts about notices, complaints, and market updates." />
      <Card className="border-border/60"><CardContent className="p-6"><div className="space-y-3">{NOTIFICATIONS.map((n) => <div key={n.id} className={`flex items-center gap-3 rounded-lg border p-3 ${!n.read ? "bg-secondary/60" : ""}`}><div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-white"><Bell className="h-4 w-4" /></div><div className="flex-1"><div className="font-medium text-primary-dark">{n.title}</div><div className="text-xs text-muted-foreground">{new Date(n.date).toLocaleDateString("en-IN")}</div></div>{!n.read && <Badge className="bg-saffron text-primary-dark">New</Badge>}</div>)}</div></CardContent></Card>
    </DashLayout>
  );
}

export function OwnerHelpPage() {
  return (
    <DashLayout kind="owner">
      <PageTitle title="Help & Support" subtitle="Contact association office or learn how to use portal services." />
      <div className="grid gap-4 md:grid-cols-3"><SupportCard icon={Phone} title="Call office" body="+91 20 2645 1122" /><SupportCard icon={Mail} title="Email support" body="office@vpp-marketyard.in" /><SupportCard icon={HelpCircle} title="Portal desk" body="Mon-Sat, 8 AM-6 PM" /></div>
      <Card className="mt-6 border-border/60"><CardContent className="p-6"><h2 className="font-display font-bold text-primary-dark">Common help topics</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{["How to raise a complaint", "How to download notices", "How mobile number approval works", "How to update gala profile"].map((t) => <div key={t} className="rounded-lg border p-4 text-sm font-medium text-primary-dark">{t}</div>)}</div></CardContent></Card>
    </DashLayout>
  );
}

export function AdminHelpPage() {
  return (
    <DashLayout kind="admin">
      <PageTitle title="Help & Support" subtitle="Admin support desk, escalation contacts, and portal operating guidance." />
      <div className="grid gap-4 md:grid-cols-3">
        <SupportCard icon={Phone} title="Admin helpline" body="+91 20 2645 1122" />
        <SupportCard icon={Mail} title="Technical support" body="office@vpp-marketyard.in" />
        <SupportCard icon={HelpCircle} title="Office hours" body="Mon-Sat, 8 AM-6 PM" />
      </div>
      <Card className="mt-6 border-border/60">
        <CardContent className="p-6">
          <h2 className="font-display font-bold text-primary-dark">Admin help topics</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {["Approving owner registrations", "Assigning complaints", "Publishing notices and updates", "Exporting reports", "Managing mobile change requests", "Reviewing audit logs"].map((t) => (
              <div key={t} className="rounded-lg border p-4 text-sm font-medium text-primary-dark">{t}</div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashLayout>
  );
}

function SupportCard({ icon: Icon, title, body }: { icon: React.ElementType; title: string; body: string }) {
  return <Card className="border-border/60"><CardContent className="p-6"><Icon className="h-6 w-6 text-primary" /><h2 className="mt-3 font-display font-semibold text-primary-dark">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{body}</p></CardContent></Card>;
}

export function OwnerChangePasswordPage() {
  return (
    <DashLayout kind="owner">
      <PageTitle title="Change Password" subtitle="Update your portal password securely." />
      <Card className="max-w-xl border-border/60"><CardContent className="p-6"><form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Password changed"); }}><div><Label>Current password</Label><Input type="password" required /></div><div><Label>New password</Label><Input type="password" required /></div><div><Label>Confirm new password</Label><Input type="password" required /></div><Button className="bg-primary"><KeyRound className="mr-1 h-4 w-4" /> Update Password</Button></form></CardContent></Card>
    </DashLayout>
  );
}

export function AdminChangePasswordPage() {
  return (
    <DashLayout kind="admin">
      <PageTitle title="Change Password" subtitle="Update your admin portal password securely." />
      <Card className="max-w-xl border-border/60">
        <CardContent className="p-6">
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Admin password changed"); }}>
            <div><Label>Current password</Label><Input type="password" required /></div>
            <div><Label>New password</Label><Input type="password" required /></div>
            <div><Label>Confirm new password</Label><Input type="password" required /></div>
            <Button className="bg-primary"><KeyRound className="mr-1 h-4 w-4" /> Update Password</Button>
          </form>
        </CardContent>
      </Card>
    </DashLayout>
  );
}
