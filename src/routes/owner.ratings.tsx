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
import { translateToMarathi } from "@/lib/marathi";

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

const NAME_MR_WORDS: Record<string, string> = {
  ayush: "आयुष",
  borkar: "बोरकर",
  vaishnavi: "वैष्णवी",
  vijay: "विजय",
  pawar: "पवार",
  stall: "स्टॉल",
};

function displayMarathiName(value?: string | null) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (/[\u0900-\u097F]/.test(text)) return text;
  return text
    .split(/(\s+|[./,&()-])/)
    .map((part) => {
      if (!/[A-Za-z]/.test(part)) return part;
      const key = part.toLowerCase().replace(/[^a-z]/g, "");
      return NAME_MR_WORDS[key] || translateToMarathi(part);
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

function displayMarathiStatus(value?: string | null) {
  const labels: Record<string, string> = {
    approved: "मंजूर",
    verified: "पडताळलेले",
    active: "सक्रिय",
    linked: "जोडलेले",
    submitted: "सादर",
    pending: "प्रलंबित",
    rejected: "नाकारले",
  };
  const normalized = String(value || "").toLowerCase().replace(/\s+/g, "_");
  return labels[normalized] || translateToMarathi(String(value || ""));
}

function StatusBadge({ status, lang = "en" }: { status: MyRating["moderation_status"]; lang?: string }) {
  const config = {
    pending: { className: "bg-warning/15 text-warning", icon: Clock, label: lang === "mr" ? "मंजुरी प्रतीक्षेत" : "Pending approval" },
    approved: { className: "bg-success/15 text-success", icon: CheckCircle2, label: lang === "mr" ? "मंजूर" : "Approved" },
    rejected: { className: "bg-destructive/15 text-destructive", icon: ThumbsDown, label: lang === "mr" ? "नाकारले" : "Rejected" },
  }[status];
  const Icon = config.icon;
  return <Badge className={config.className}><Icon className="mr-1 h-3.5 w-3.5" /> {config.label}</Badge>;
}

function TraderRatings() {
  const { logout } = useAuth();
  const { lang } = useI18n();
  const isMr = lang === "mr";
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
  const displayBusinessName = isMr ? displayMarathiName(profile?.business_name || profile?.business_name_en) : profile?.business_name_en || profile?.business_name;
  const displayMemberName = isMr ? displayMarathiName(profile?.full_name || profile?.full_name_en) : profile?.full_name_en || profile?.full_name;
  const displayBusinessCategory = isMr ? translateToMarathi(profile?.business_category || "Market Member") : profile?.business_category || "Market Member";
  const copy = isMr
    ? {
        title: "पोर्टल रिव्ह्यू",
        subtitle: "पोर्टल आणि प्रशासकीय सेवेबद्दल सभासद किंवा ग्राहक अभिप्राय सादर करा. मुख्य वेबसाईटवर दिसण्यापूर्वी प्रशासक मंजुरी आवश्यक आहे.",
        submitTitle: "पोर्टल रिव्ह्यू सादर करा",
        reviewFrom: "रिव्ह्यू सादर करणारे",
        yourBusiness: "तुमचा व्यवसाय",
        member: "सभासद",
        gala: "गाळा",
        reviewerLabel: "हा रिव्ह्यू कोण देत आहे? *",
        memberOwner: "सभासद / गाळा मालक",
        linkedCustomer: "माझ्या गाळ्याशी जोडलेला ग्राहक",
        chooseCustomer: "ग्राहक निवडा *",
        loadingCustomers: "ग्राहक लोड होत आहेत...",
        selectCustomer: "ग्राहक निवडा",
        noCustomers: "अजून ग्राहक जोडलेले नाहीत. आधी ग्राहक KYC जोडा, त्यानंतर ग्राहक रिव्ह्यू सादर करता येतील.",
        starRating: "स्टार रेटिंग *",
        reviewText: "रिव्ह्यू मजकूर",
        reviewPlaceholder: "पोर्टल प्रवेश, प्रशासकीय मदत, तक्रार हाताळणी, सूचना किंवा सेवांबद्दल अभिप्राय लिहा...",
        publicNote: "फक्त प्रशासकाने मंजूर केलेले रिव्ह्यू मुख्य सार्वजनिक वेबसाईटवर पुन्हा शेअर केले जातील.",
        images: "रिव्ह्यू फोटो",
        videos: "रिव्ह्यू व्हिडिओ",
        uploadImages: "फोटो अपलोड करा",
        uploadVideos: "व्हिडिओ अपलोड करा",
        imageSelected: "फोटो निवडला",
        videoSelected: "व्हिडिओ निवडला",
        imageHelp: "JPG, PNG, WEBP - प्रत्येकी 1 MB पर्यंत",
        videoHelp: "MP4, MOV, WEBM - प्रत्येकी 1 MB पर्यंत",
        submitting: "सादर करत आहे...",
        submit: "रिव्ह्यू सादर करा",
        myReviews: "माझे सादर केलेले पोर्टल रिव्ह्यू",
        refresh: "स्थिती रिफ्रेश करा",
        reviewBy: "रिव्ह्यू देणारे",
        customer: "ग्राहक",
        noReviews: "अजून पोर्टल रिव्ह्यू सादर केलेले नाहीत.",
        loadingReviews: "रिव्ह्यू लोड होत आहेत...",
        selectCustomerError: "ग्राहक रिव्ह्यू देणारा निवडा.",
        selectRatingError: "स्टार रेटिंग निवडा.",
        writeReviewError: "सादर करण्यापूर्वी रिव्ह्यू लिहा.",
        sizeError: "प्रत्येक रिव्ह्यू फोटो किंवा व्हिडिओ 1 MB किंवा त्यापेक्षा कमी असावा.",
        success: "रिव्ह्यू प्रशासक मंजुरीसाठी पाठवला.",
      }
    : {
        title: "Portal Reviews",
        subtitle: "Submit Member or customer feedback about the portal and admin service. Admin approval is required before it appears on the main website.",
        submitTitle: "Submit portal review",
        reviewFrom: "Review submitted from",
        yourBusiness: "Your business",
        member: "Member",
        gala: "Gala",
        reviewerLabel: "Who is giving this review? *",
        memberOwner: "Member / gala owner",
        linkedCustomer: "Customer linked to my gala",
        chooseCustomer: "Choose customer *",
        loadingCustomers: "Loading customers...",
        selectCustomer: "Select your customer",
        noCustomers: "No customers are linked yet. Add Customer KYC first, then customer reviews can be submitted.",
        starRating: "Star rating *",
        reviewText: "Review text",
        reviewPlaceholder: "Write feedback about portal access, admin support, complaint handling, notices, or services...",
        publicNote: "Only admin-approved reviews will be reshared on the main public website.",
        images: "Review images",
        videos: "Review videos",
        uploadImages: "Upload images",
        uploadVideos: "Upload videos",
        imageSelected: "image selected",
        videoSelected: "video selected",
        imageHelp: "JPG, PNG, WEBP - up to 1 MB each",
        videoHelp: "MP4, MOV, WEBM - up to 1 MB each",
        submitting: "Submitting...",
        submit: "Submit Review",
        myReviews: "My submitted portal reviews",
        refresh: "Refresh status",
        reviewBy: "Review by",
        customer: "customer",
        noReviews: "No portal reviews submitted yet.",
        loadingReviews: "Loading reviews...",
        selectCustomerError: "Select a customer reviewer.",
        selectRatingError: "Select a star rating.",
        writeReviewError: "Write a review before submitting.",
        sizeError: "Each review image or video must be 1 MB or smaller.",
        success: "Rating sent to admin for approval",
      };

  const submitRating = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (reviewerType === "customer" && !selectedCustomerId) {
      toast.error(copy.selectCustomerError);
      return;
    }
    if (rating < 1) {
      toast.error(copy.selectRatingError);
      return;
    }
    if (!reviewText.trim()) {
      toast.error(copy.writeReviewError);
      return;
    }
    const oversized = [...imageFiles, ...videoFiles].find((file) => file.size > 1 * 1024 * 1024);
    if (oversized) {
      toast.error(copy.sizeError);
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
      toast.success(copy.success);
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
        <h1 className="font-display text-2xl font-bold text-primary-dark">{copy.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{copy.subtitle}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
        <Card className="border-border/60">
          <CardContent className="p-6">
            <h2 className="font-display text-lg font-bold text-primary-dark">{copy.submitTitle}</h2>
            <form className="mt-5 space-y-5" onSubmit={submitRating}>
              <div className="rounded-lg border bg-secondary/30 p-4">
                <div className="text-xs font-semibold uppercase text-muted-foreground">{copy.reviewFrom}</div>
                <div className="mt-2 font-semibold text-primary-dark">{displayBusinessName || copy.yourBusiness}</div>
                <div className="mt-1 text-sm text-muted-foreground">{displayMemberName || copy.member} - {profile?.trader_code || copy.member}</div>
                <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  <span className="inline-flex items-center gap-2"><Store className="h-4 w-4 text-primary" /> {copy.gala} {profile?.gala_number || "-"}</span>
                  <span className="inline-flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> {displayBusinessCategory}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{copy.reviewerLabel}</Label>
                <Select value={reviewerType} onValueChange={(value) => {
                  setReviewerType(value as "trader" | "customer");
                  if (value === "trader") setSelectedCustomerId("");
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trader">{copy.memberOwner}</SelectItem>
                    <SelectItem value="customer">{copy.linkedCustomer}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {reviewerType === "customer" && (
                <div className="space-y-2">
                  <Label>{copy.chooseCustomer}</Label>
                  <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                    <SelectTrigger>
                      <SelectValue placeholder={loading ? copy.loadingCustomers : copy.selectCustomer} />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={String(customer.id)}>
                          {isMr ? displayMarathiName(customer.full_name) : customer.full_name} - {customer.customer_code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!loading && customers.length === 0 && <p className="text-xs text-muted-foreground">{copy.noCustomers}</p>}
                </div>
              )}

              {selectedCustomer && (
                <div className="rounded-lg border bg-secondary/30 p-4">
                <div className="font-semibold text-primary-dark">{isMr ? displayMarathiName(selectedCustomer.full_name) : selectedCustomer.full_name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{selectedCustomer.customer_code} - {selectedCustomer.mobile}</div>
                  <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    <span className="inline-flex items-center gap-2"><UserRound className="h-4 w-4 text-primary" /> {isMr ? displayMarathiStatus(selectedCustomer.kyc_status) : selectedCustomer.kyc_status}</span>
                    <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> {isMr ? displayMarathiStatus(selectedCustomer.relationship_status) : selectedCustomer.relationship_status}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>{copy.starRating}</Label>
                <Stars value={rating} onChange={setRating} />
              </div>

              <div className="space-y-2">
                <Label>{copy.reviewText}</Label>
                <Textarea value={reviewText} onChange={(event) => setReviewText(event.target.value)} maxLength={1000} rows={5} placeholder={copy.reviewPlaceholder} />
                <p className="text-xs text-muted-foreground">{copy.publicNote}</p>
              </div>

              <div className="space-y-3">
                <Label>{copy.images}</Label>
                <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-center text-sm transition hover:border-primary">
                  <Upload className="h-4 w-4 text-primary" />
                  <span className="font-medium text-primary-dark">{imageFiles.length ? `${imageFiles.length} ${copy.imageSelected}` : copy.uploadImages}</span>
                  <span className="text-xs text-muted-foreground">{copy.imageHelp}</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(event) => setImageFiles(Array.from(event.target.files || []))} />
                </label>
                <Label>{copy.videos}</Label>
                <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-center text-sm transition hover:border-primary">
                  <Upload className="h-4 w-4 text-primary" />
                  <span className="font-medium text-primary-dark">{videoFiles.length ? `${videoFiles.length} ${copy.videoSelected}` : copy.uploadVideos}</span>
                  <span className="text-xs text-muted-foreground">{copy.videoHelp}</span>
                  <input type="file" accept="video/mp4,video/quicktime,video/webm" multiple className="hidden" onChange={(event) => setVideoFiles(Array.from(event.target.files || []))} />
                </label>
              </div>

              <Button type="submit" className="w-full bg-saffron text-saffron-foreground hover:bg-saffron/90" disabled={submitting || loading}>
                {submitting ? copy.submitting : copy.submit}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold text-primary-dark">{copy.myReviews}</h2>
              <Button type="button" size="sm" variant="outline" onClick={loadData} disabled={loading}>
                <RefreshCw className="mr-1 h-4 w-4" /> {copy.refresh}
              </Button>
            </div>
            <div className="mt-5 space-y-3">
              {myRatings.map((item) => (
                <div key={item.id} className="rounded-lg border bg-background px-4 py-3">
                  <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2">
                    <div className="min-w-[180px] flex-1">
                      <div className="truncate font-semibold text-primary-dark">{isMr ? displayMarathiName(item.reviewer_name || item.customer_name || copy.customer) : item.reviewer_name || item.customer_name || "Customer"}</div>
                      <div className="text-xs capitalize text-muted-foreground">
                        {copy.reviewBy} {item.reviewer_type === "customer" ? `${copy.customer}${item.customer_code ? ` - ${item.customer_code}` : ""}` : copy.memberOwner}
                      </div>
                    </div>
                    <Stars value={item.rating_value} compact />
                    <StatusBadge status={item.moderation_status} lang={lang} />
                    <div className="whitespace-nowrap text-sm text-foreground">{new Date(item.created_at).toLocaleDateString(isMr ? "mr-IN" : "en-IN")}</div>
                    {item.moderation_status !== "approved" && item.moderation_remarks && (
                      <div className="min-w-[160px] flex-1 truncate text-sm text-muted-foreground">{item.moderation_remarks}</div>
                    )}
                  </div>
                </div>
              ))}
              {!loading && myRatings.length === 0 && <div className="py-8 text-center text-sm text-muted-foreground">{copy.noReviews}</div>}
              {loading && <div className="py-8 text-center text-sm text-muted-foreground">{copy.loadingReviews}</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashLayout>
  );
}
