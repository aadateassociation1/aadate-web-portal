import { createFileRoute } from "@/lib/simple-router";
import { DashLayout } from "@/components/dashboard/DashLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, Download, Star, ThumbsDown } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/reviews")({
  head: () => ({ meta: [{ title: "Rating Reviews - Shri Chhatrapati Shivaji Market Yard Adte Association" }] }),
  component: AdminReviews,
});

type RatingReview = {
  id: number;
  rating_value: number;
  review_text: string | null;
  moderation_status: "pending" | "approved" | "rejected";
  created_at: string;
  reviewer_name: string | null;
  reviewer_mobile: string | null;
  customer_code: string | null;
  reviewer_type: "trader" | "customer";
  trader_name: string;
  trader_code: string;
  business_name: string;
  gala_number: string | null;
  attachments?: Array<{ id: number; attachment_type: "image" | "video"; original_filename: string }>;
};

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-saffron" aria-label={`${value} star rating`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={`h-4 w-4 ${star <= value ? "fill-current" : ""}`} />
      ))}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const classes = status === "approved"
    ? "bg-success/15 text-success"
    : status === "rejected"
      ? "bg-destructive/15 text-destructive"
      : "bg-warning/15 text-warning";
  return <Badge className={`inline-flex min-w-[82px] justify-center whitespace-nowrap capitalize ${classes}`}>{status}</Badge>;
}

function AdminReviews() {
  const [status, setStatus] = useState("pending");
  const [reviews, setReviews] = useState<RatingReview[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/admin/ratings?status=${status}`, { credentials: "include" });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not load reviews");
      setReviews(result.ratings || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [status]);

  const decide = async (review: RatingReview, decision: "approve" | "reject") => {
    try {
      const response = await fetch(`/api/v1/admin/ratings/${review.id}/decision`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, remarks: `${decision === "approve" ? "Approved" : "Rejected"} by admin` }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Decision failed");
      toast.success(`Review ${decision === "approve" ? "approved and visible to submitter" : "rejected"}`);
      loadReviews();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Decision failed");
    }
  };

  return (
    <DashLayout kind="admin">
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-primary-dark">Portal Reviews</h1>
            <p className="mt-1 text-sm text-muted-foreground">Approve and reshare Member or customer feedback on the main public website.</p>
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="all">All reviews</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="border-border/60">
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rating</TableHead>
                  <TableHead>Submitted from</TableHead>
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Media</TableHead>
                  <TableHead className="w-[110px] min-w-[110px] whitespace-nowrap">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell><Stars value={review.rating_value} /></TableCell>
                    <TableCell>
                      <div className="font-medium">{review.business_name}</div>
                      <div className="text-xs text-muted-foreground">{review.trader_name} - {review.trader_code} - Gala {review.gala_number || "-"}</div>
                    </TableCell>
                    <TableCell>
                      <div>{review.reviewer_name || "Portal user"}</div>
                      <Badge variant="outline" className="mt-1 capitalize">{review.reviewer_type}</Badge>
                      {review.customer_code && <div className="text-xs text-muted-foreground">{review.customer_code}</div>}
                      {review.reviewer_mobile && <div className="text-xs text-muted-foreground">{review.reviewer_mobile}</div>}
                    </TableCell>
                    <TableCell className="max-w-sm text-sm text-muted-foreground">{review.review_text || "No text review"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {(review.attachments || []).length > 0 ? review.attachments!.map((file) => (
                          <Button key={file.id} size="sm" variant="outline" onClick={() => window.open(`/api/v1/admin/rating-attachments/${file.id}/download`, "_blank", "noopener,noreferrer")}>
                            <Download className="mr-1 h-4 w-4" /> {file.attachment_type === "image" ? "Image" : "Video"}
                          </Button>
                        )) : <span className="text-xs text-muted-foreground">No media</span>}
                      </div>
                    </TableCell>
                    <TableCell className="w-[110px] min-w-[110px] whitespace-nowrap"><StatusBadge status={review.moderation_status} /></TableCell>
                    <TableCell className="text-right">
                      {review.moderation_status === "pending" && (
                        <div className="inline-flex gap-1">
                          <Button size="sm" className="bg-success text-white" onClick={() => decide(review, "approve")}><CheckCircle2 className="mr-1 h-4 w-4" />Reshare</Button>
                          <Button size="sm" variant="outline" onClick={() => decide(review, "reject")}><ThumbsDown className="mr-1 h-4 w-4" />Reject</Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {!loading && reviews.length === 0 && <div className="py-8 text-center text-sm text-muted-foreground">No reviews found for this status.</div>}
            {loading && <div className="py-8 text-center text-sm text-muted-foreground">Loading reviews...</div>}
          </CardContent>
        </Card>
      </div>
    </DashLayout>
  );
}
