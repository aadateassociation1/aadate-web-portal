import { createFileRoute, useRouter } from "@/lib/simple-router";
import { useEffect, useState, type FormEvent } from "react";
import { DashLayout } from "@/components/dashboard/DashLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Building2, CheckCircle2, Clock, RefreshCw, Star, Store, ThumbsDown, Upload, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/owner/ratings")({
  head: () => ({ meta: [{ title: "Portal Reviews - Member Portal" }] }),
  component: TraderRatings,
});

type TraderProfile = {
  id: number;
  trader_code: string;
  business_name: string;
  business_name_en?: string | null;
  full_name: string;
  full_name_en?: string | null;
  gala_number: string | null;
  business_category: string | null;
};

type Customer = {
  id: number;
  customer_code: string;
  full_name: string;
  mobile: string;
  kyc_status: string;
  relationship_status: string;
};

type MyRating = {
  id: number;
  trader_id: number;
  trader_code: string;
  trader_name: string;
  business_name: string;
  gala_number: string | null;
  reviewer_name: string | null;
  reviewer_mobile: string | null;
  reviewer_type: "trader" | "customer";
  customer_code: string | null;
  customer_name: string | null;
  rating_value: number;
  review_text: string | null;
  moderation_status: "pending" | "approved" | "rejected";
  moderation_remarks: string | null;
  created_at: string;
  attachments?: Array<{ id: number; attachment_type: "image" | "video"; original_filename: string; mime_type: string; file_size_bytes: number }>;
};

function fileToUploadPayload(file: File): Promise<{ originalFilename: string; mimeType: string; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ originalFilename: file.name, mimeType: file.type, dataUrl: String(reader.result || "") });
    reader.onerror = () => reject(new Error(`Could not read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

function Stars({ value, onChange, compact = false }: { value: number; onChange?: (value: number) => void; compact?: boolean }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={`rounded-md p-1 transition hover:bg-secondary disabled:cursor-default ${star <= value ? "text-saffron" : "text-foreground"}`}
          disabled={!onChange}
          aria-label={`${star} stars`}
        >
          <Star className={`${compact ? "h-5 w-5" : "h-7 w-7"} ${star <= value ? "fill-current" : ""}`} />
        </button>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: MyRating["moderation_status"] }) {
  const config = {
    pending: { className: "bg-warning/15 text-warning", icon: Clock, label: "Pending approval" },
    approved: { className: "bg-success/15 text-success", icon: CheckCircle2, label: "Approved" },
    rejected: { className: "bg-destructive/15 text-destructive", icon: ThumbsDown, label: "Rejected" },
  }[status];
  const Icon = config.icon;
  return <Badge className={config.className}><Icon className="mr-1 h-3.5 w-3.5" /> {config.label}</Badge>;
}

function TraderRatings() {
  const { logout } = useAuth();
  const { lang } = useI18n();
  const router = useRouter();
  const [profile, setProfile] = useState<TraderProfile | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [myRatings, setMyRatings] = useState<MyRating[]>([]);
  const [reviewerType, setReviewerType] = useState<"trader" | "customer">("trader");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleExpiredSession = () => {
    logout();
    router.navigate({ to: "/login" });
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileResponse, customersResponse, ratingsResponse] = await Promise.all([
        fetch("/api/v1/trader/profile", { credentials: "include" }),
        fetch("/api/v1/trader/customers", { credentials: "include" }),
        fetch("/api/v1/trader/my-ratings", { credentials: "include" }),
      ]);
      const profileResult = await profileResponse.json();
      const customersResult = await customersResponse.json();
      const ratingsResult = await ratingsResponse.json();
      if ([profileResponse, customersResponse, ratingsResponse].some((response) => response.status === 401)) {
        handleExpiredSession();
        throw new Error("Your session expired. Please sign in again.");
      }
      if (!profileResponse.ok || !profileResult.ok) throw new Error(profileResult.error || "Could not load Member profile.");
      if (!customersResponse.ok || !customersResult.ok) throw new Error(customersResult.error || "Could not load customers.");
      if (!ratingsResponse.ok || !ratingsResult.ok) throw new Error(ratingsResult.error || "Could not load ratings.");
      setProfile(profileResult.trader || null);
      setCustomers(customersResult.customers || []);
      setMyRatings(ratingsResult.ratings || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load rating data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedCustomer = customers.find((customer) => String(customer.id) === selectedCustomerId);
  const displayBusinessName = lang === "en" ? profile?.business_name_en || profile?.business_name : profile?.business_name || profile?.business_name_en;
  const displayMemberName = lang === "en" ? profile?.full_name_en || profile?.full_name : profile?.full_name || profile?.full_name_en;

  const submitRating = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (reviewerType === "customer" && !selectedCustomerId) {
      toast.error("Select a customer reviewer.");
      return;
    }
    if (rating < 1) {
      toast.error("Select a star rating.");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Write a review before submitting.");
      return;
    }
    const oversized = [...imageFiles, ...videoFiles].find((file) => file.size > 1 * 1024 * 1024);
    if (oversized) {
      toast.error("Each review image or video must be 1 MB or smaller.");
      return;
    }
    setSubmitting(true);
    try {
      const images = await Promise.all(imageFiles.slice(0, 4).map(fileToUploadPayload));
      const videos = await Promise.all(videoFiles.slice(0, 2).map(fileToUploadPayload));
      const response = await fetch("/api/v1/ratings", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewerType,
          customerId: reviewerType === "customer" ? Number(selectedCustomerId) : null,
          ratingValue: rating,
          reviewText,
          attachments: { images, videos },
        }),
      });
      const result = await response.json();
      if (response.status === 401) {
        handleExpiredSession();
        throw new Error("Your session expired. Please sign in again.");
      }
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not submit rating.");
      toast.success("Rating sent to admin for approval");
      setReviewerType("trader");
      setSelectedCustomerId("");
      setRating(0);
      setReviewText("");
      setImageFiles([]);
      setVideoFiles([]);
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit rating.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashLayout kind="owner">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-primary-dark">Portal Reviews</h1>
        <p className="mt-1 text-sm text-muted-foreground">Submit Member or customer feedback about the portal and admin service. Admin approval is required before it appears on the main website.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
        <Card className="border-border/60">
          <CardContent className="p-6">
            <h2 className="font-display text-lg font-bold text-primary-dark">Submit portal review</h2>
            <form className="mt-5 space-y-5" onSubmit={submitRating}>
              <div className="rounded-lg border bg-secondary/30 p-4">
                <div className="text-xs font-semibold uppercase text-muted-foreground">Review submitted from</div>
                <div className="mt-2 font-semibold text-primary-dark">{displayBusinessName || "Your business"}</div>
                <div className="mt-1 text-sm text-muted-foreground">{displayMemberName || "Member"} - {profile?.trader_code || "Member"}</div>
                <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  <span className="inline-flex items-center gap-2"><Store className="h-4 w-4 text-primary" /> Gala {profile?.gala_number || "-"}</span>
                  <span className="inline-flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> {profile?.business_category || "Market Member"}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Who is giving this review? *</Label>
                <Select value={reviewerType} onValueChange={(value) => {
                  setReviewerType(value as "trader" | "customer");
                  if (value === "trader") setSelectedCustomerId("");
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trader">Member / gala owner</SelectItem>
                    <SelectItem value="customer">Customer linked to my gala</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {reviewerType === "customer" && (
                <div className="space-y-2">
                  <Label>Choose customer *</Label>
                  <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                    <SelectTrigger>
                      <SelectValue placeholder={loading ? "Loading customers..." : "Select your customer"} />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={String(customer.id)}>
                          {customer.full_name} - {customer.customer_code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!loading && customers.length === 0 && <p className="text-xs text-muted-foreground">No customers are linked yet. Add Customer KYC first, then customer reviews can be submitted.</p>}
                </div>
              )}

              {selectedCustomer && (
                <div className="rounded-lg border bg-secondary/30 p-4">
                <div className="font-semibold text-primary-dark">{selectedCustomer.full_name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{selectedCustomer.customer_code} - {selectedCustomer.mobile}</div>
                  <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    <span className="inline-flex items-center gap-2"><UserRound className="h-4 w-4 text-primary" /> {selectedCustomer.kyc_status}</span>
                    <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> {selectedCustomer.relationship_status}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Star rating *</Label>
                <Stars value={rating} onChange={setRating} />
              </div>

              <div className="space-y-2">
                <Label>Review text</Label>
                <Textarea value={reviewText} onChange={(event) => setReviewText(event.target.value)} maxLength={1000} rows={5} placeholder="Write feedback about portal access, admin support, complaint handling, notices, or services..." />
                <p className="text-xs text-muted-foreground">Only admin-approved reviews will be reshared on the main public website.</p>
              </div>

              <div className="space-y-3">
                <Label>Review images</Label>
                <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-center text-sm transition hover:border-primary">
                  <Upload className="h-4 w-4 text-primary" />
                  <span className="font-medium text-primary-dark">{imageFiles.length ? `${imageFiles.length} image selected` : "Upload images"}</span>
                  <span className="text-xs text-muted-foreground">JPG, PNG, WEBP - up to 1 MB each</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(event) => setImageFiles(Array.from(event.target.files || []))} />
                </label>
                <Label>Review videos</Label>
                <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-center text-sm transition hover:border-primary">
                  <Upload className="h-4 w-4 text-primary" />
                  <span className="font-medium text-primary-dark">{videoFiles.length ? `${videoFiles.length} video selected` : "Upload videos"}</span>
                  <span className="text-xs text-muted-foreground">MP4, MOV, WEBM - up to 1 MB each</span>
                  <input type="file" accept="video/mp4,video/quicktime,video/webm" multiple className="hidden" onChange={(event) => setVideoFiles(Array.from(event.target.files || []))} />
                </label>
              </div>

              <Button type="submit" className="w-full bg-saffron text-saffron-foreground hover:bg-saffron/90" disabled={submitting || loading}>
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold text-primary-dark">My submitted portal reviews</h2>
              <Button type="button" size="sm" variant="outline" onClick={loadData} disabled={loading}>
                <RefreshCw className="mr-1 h-4 w-4" /> Refresh status
              </Button>
            </div>
            <div className="mt-5 space-y-3">
              {myRatings.map((item) => (
                <div key={item.id} className="rounded-lg border bg-background px-4 py-3">
                  <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2">
                    <div className="min-w-[180px] flex-1">
                      <div className="truncate font-semibold text-primary-dark">{item.reviewer_name || item.customer_name || "Customer"}</div>
                      <div className="text-xs capitalize text-muted-foreground">
                        Review by {item.reviewer_type === "customer" ? `customer${item.customer_code ? ` - ${item.customer_code}` : ""}` : "member / gala owner"}
                      </div>
                    </div>
                    <Stars value={item.rating_value} compact />
                    <StatusBadge status={item.moderation_status} />
                    <div className="whitespace-nowrap text-sm text-foreground">{new Date(item.created_at).toLocaleDateString("en-IN")}</div>
                    {item.moderation_status !== "approved" && item.moderation_remarks && (
                      <div className="min-w-[160px] flex-1 truncate text-sm text-muted-foreground">{item.moderation_remarks}</div>
                    )}
                  </div>
                </div>
              ))}
              {!loading && myRatings.length === 0 && <div className="py-8 text-center text-sm text-muted-foreground">No portal reviews submitted yet.</div>}
              {loading && <div className="py-8 text-center text-sm text-muted-foreground">Loading reviews...</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashLayout>
  );
}
