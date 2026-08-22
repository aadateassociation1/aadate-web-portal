import { createFileRoute, Link, useRouterState } from "@/lib/simple-router";
import { SiteLayout } from "@/components/public/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Eye, MapPin, Phone, Star, Store } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/traders/$id")({
  head: () => ({ meta: [{ title: "Member Profile - Shri Chhatrapati Shivaji Market Yard Adte Association" }] }),
  component: PublicTraderProfile,
});

type TraderProfile = {
  id: number;
  trader_code: string;
  full_name: string;
  full_name_en?: string | null;
  business_name: string;
  business_name_en?: string | null;
  mobile: string;
  gala_number: string | null;
  section_name: string | null;
  business_category: string | null;
  address_line1: string;
  village_city: string;
  district: string;
};

type Review = {
  rating_value: number;
  review_text: string | null;
  created_at: string;
  reviewer_name: string | null;
  attachments?: Array<{ id: number; attachment_type: "image" | "video"; original_filename: string }>;
};

type RatingSummary = {
  review_count: number;
  average_rating: number | null;
};

function Stars({ value, size = "h-4 w-4" }: { value: number; size?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-saffron">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={`${size} ${star <= Math.round(value) ? "fill-current" : ""}`} />
      ))}
    </span>
  );
}

function PublicTraderProfile() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const traderId = useMemo(() => Number(pathname.split("/").filter(Boolean)[1]), [pathname]);
  const [trader, setTrader] = useState<TraderProfile | null>(null);
  const [summary, setSummary] = useState<RatingSummary>({ review_count: 0, average_rating: null });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useI18n();

  const loadProfile = async () => {
    setLoading(true);
    try {
      const [profileResponse, ratingsResponse] = await Promise.all([
        fetch(`/api/v1/public/traders/${traderId}`),
        fetch(`/api/v1/public/traders/${traderId}/ratings`),
      ]);
      const profileResult = await profileResponse.json();
      const ratingsResult = await ratingsResponse.json();
      if (!profileResponse.ok || !profileResult.ok) throw new Error(profileResult.error || "Member profile not found");
      setTrader(profileResult.trader);
      setSummary(ratingsResult.summary || profileResult.ratingSummary || { review_count: 0, average_rating: null });
      setReviews(ratingsResult.reviews || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Member profile not found");
      setTrader(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (traderId) loadProfile();
  }, [traderId]);

  const displayBusinessName = lang === "en" ? trader?.business_name_en || trader?.business_name : trader?.business_name || trader?.business_name_en;
  const displayMemberName = lang === "en" ? trader?.full_name_en || trader?.full_name : trader?.full_name || trader?.full_name_en;

  return (
    <SiteLayout>
      <section className="bg-leaf py-10 md:py-14">
        <div className="container-page">
          {loading && <div className="rounded-lg border bg-background p-8 text-center text-sm text-muted-foreground">Loading Member profile...</div>}
          {!loading && !trader && (
            <Card className="border-border/60">
              <CardContent className="p-8 text-center">
                <h1 className="font-display text-2xl font-bold text-primary-dark">Member profile not found</h1>
                <p className="mt-2 text-sm text-muted-foreground">Only approved, active Members have public profiles.</p>
                <Button asChild className="mt-5"><Link to="/">Back to public site</Link></Button>
              </CardContent>
            </Card>
          )}
          {trader && (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="space-y-6">
                <Card className="border-border/60">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <Badge className="bg-secondary text-primary-dark">{trader.trader_code}</Badge>
                        <h1 className="mt-3 font-display text-3xl font-bold text-primary-dark">{displayBusinessName}</h1>
                        <p className="mt-1 text-muted-foreground">{displayMemberName}</p>
                      </div>
                      <div className="rounded-lg border bg-background px-4 py-3 text-right">
                        <div className="font-display text-2xl font-bold text-primary-dark">{summary.average_rating ? Number(summary.average_rating).toFixed(1) : "-"}</div>
                        <Stars value={Number(summary.average_rating || 0)} />
                        <div className="mt-1 text-xs text-muted-foreground">{summary.review_count || 0} profile reviews</div>
                      </div>
                    </div>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <div className="flex gap-3 rounded-lg border p-3"><Store className="h-5 w-5 text-primary" /><span>Gala {trader.gala_number || "-"}{trader.section_name ? `, ${trader.section_name}` : ""}</span></div>
                      <div className="flex gap-3 rounded-lg border p-3"><Building2 className="h-5 w-5 text-primary" /><span>{trader.business_category || "Market Member"}</span></div>
                      <div className="flex gap-3 rounded-lg border p-3"><Phone className="h-5 w-5 text-primary" /><span>{trader.mobile}</span></div>
                      <div className="flex gap-3 rounded-lg border p-3"><MapPin className="h-5 w-5 text-primary" /><span>{trader.address_line1}, {trader.village_city}, {trader.district}</span></div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/60">
                  <CardContent className="p-6 sm:p-8">
                    <h2 className="font-display text-xl font-bold text-primary-dark">Reviews</h2>
                    <div className="mt-5 space-y-4">
                      {reviews.map((review, index) => (
                        <div key={`${review.created_at}-${index}`} className="rounded-lg border p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <Stars value={review.rating_value} />
                            <span className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                          </div>
                          {review.review_text && <p className="mt-3 text-sm text-foreground/80">{review.review_text}</p>}
                          {review.attachments && review.attachments.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {review.attachments.map((file) => (
                                <Button key={file.id} size="sm" variant="outline" onClick={() => window.open(`/api/v1/public/rating-attachments/${file.id}/download`, "_blank", "noopener,noreferrer")}>
                                  <Eye className="mr-1 h-4 w-4" /> {file.attachment_type === "image" ? "View image" : "View video"}
                                </Button>
                              ))}
                            </div>
                          )}
                          <div className="mt-2 text-xs text-muted-foreground">By {review.reviewer_name || "Portal user"}</div>
                        </div>
                      ))}
                      {reviews.length === 0 && <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">No approved reviews yet.</div>}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="h-fit border-border/60">
                <CardContent className="p-6">
                  <h2 className="font-display text-xl font-bold text-primary-dark">Portal Reviews</h2>
                  <div className="mt-5 rounded-lg border bg-secondary/30 p-4 text-sm text-muted-foreground">
                    Members and linked customers submit portal reviews from the Member dashboard. Admin-reshared reviews appear on the main public website.
                  </div>
                  <Button asChild className="mt-5 w-full"><Link to="/login">Open Member Login</Link></Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
