"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import ImageSlider3D from "../imageSlider/ImageSlider3D";
import { FoodItem } from "@/types/types";
import { renderStars } from "../helpers/renderStars";
import { User } from "@supabase/supabase-js";

export default function FoodCard({ item }: { item: FoodItem }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isReviewsDialogOpen, setIsReviewsDialogOpen] = useState(false);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [authSent, setAuthSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState(item.reviews);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  async function handleAuth() {
    if (!email) return;
    await supabase.auth.signInWithOtp({ email });
    setAuthSent(true);
  }

  async function handleSubmitReview() {
    setSubmitting(true);
    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          food_item_id: item.id,
          rating: review.rating,
          comment: review.comment,
          user_email: user?.email,
        },
      ])
      .select("*");
    if (!error && data) {
      setReviews([...reviews, { ...review, user_email: user?.email }]);
      setIsDialogOpen(false);
      setReview({ rating: 5, comment: "" });
    }
    setSubmitting(false);
  }

  return (
    <Card className="w-full max-w-[320px] mx-auto my-4 shadow-lg" dir="rtl">
      <CardHeader>
        <div
          className="relative w-full aspect-[4/3] rounded-lg overflow-hidden cursor-pointer"
          onClick={() => {
            setSliderIndex(0);
            setIsSliderOpen(true);
          }}
        >
          <img
            src={item.image_urls[0]}
            alt={item.name}
            className="w-full h-full object-cover"
            sizes="320px"
          />
        </div>
        <CardTitle className="mt-2 text-right">{item.name}</CardTitle>
        <div className="flex flex-col gap-1 mt-1 text-right">
          <p className="text-sm text-gray-700">{item.desc}</p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">{item.price.toFixed(2)} ج</span>
            <span className="text-sm text-yellow-600 flex items-center gap-1">
              {renderStars(averageRating)}
              <span className="text-xs text-muted-foreground">
                {averageRating.toFixed(1)} / 5 ({Math.round((averageRating / 5) * 100)}%)
              </span>
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-2 justify-end">
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            أضف تقييم
          </Button>
          <Button variant="secondary" onClick={() => setIsReviewsDialogOpen(true)}>
            عرض التقييمات
          </Button>
        </div>
      </CardContent>

      {/* Add Review Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>أضف تقييمك</DialogTitle>
          </DialogHeader>
          {!user ? (
            <div>
              <Input
                placeholder="بريدك الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={authSent}
              />
              <Button
                className="mt-2"
                onClick={handleAuth}
                disabled={authSent || !email}
              >
                {authSent ? "تحقق من بريدك" : "أرسل رابط الدخول"}
              </Button>
              <div className="text-xs text-muted-foreground mt-2">
                سيتم إرسال رابط تسجيل الدخول إلى بريدك الإلكتروني.
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitReview();
              }}
              className="space-y-2"
            >
              <Input
                type="number"
                min={1}
                max={5}
                value={review.rating}
                onChange={(e) =>
                  setReview({ ...review, rating: Number(e.target.value) })
                }
                placeholder="التقييم من 1 إلى 5"
                required
              />
              <Textarea
                value={review.comment}
                onChange={(e) =>
                  setReview({ ...review, comment: e.target.value })
                }
                placeholder="اكتب تقييمك هنا"
                required
              />
              <Button type="submit" disabled={submitting}>
                {submitting ? "جاري الإرسال..." : "إرسال التقييم"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* View Reviews Dialog */}
      <Dialog open={isReviewsDialogOpen} onOpenChange={setIsReviewsDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>التقييمات</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-64 overflow-y-auto text-right">
            {reviews.map((r, i) => (
              <div key={i} className="border-b pb-1">
                <div className="text-sm">{r.comment}</div>
                <div className="text-xs text-yellow-500">
                  {renderStars(r.rating)} {r.rating} / 5
                </div>
              </div>
            ))}
            {reviews.length === 0 && (
              <div className="text-sm text-muted-foreground">
                لا توجد تقييمات بعد.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Slider */}
      <ImageSlider3D
        open={isSliderOpen}
        onOpenChange={setIsSliderOpen}
        images={item.image_urls}
        initialIndex={sliderIndex}
        title={item.name}
        dir="rtl"
      />
    </Card>
  );
}
