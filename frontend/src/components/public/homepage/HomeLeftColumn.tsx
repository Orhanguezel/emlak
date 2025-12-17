"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { Input } from "../../ui/input";

// RTK
import {
  useListReviewsQuery,
  useCreateReviewMutation,
} from "@/integrations/rtk/endpoints/reviews.endpoints";

import type { ReviewCreateInput } from "@/integrations/rtk/types/reviews";

// shadcn carousel
import { Carousel, CarouselContent, CarouselItem } from "../../ui/carousel";

const COMMENT_IMAGE = "/calluns.avif";
const FALLBACK_IMG = "/placeholder.webp";

export type HomeLeftColumnProps = {
  // exactOptionalPropertyTypes: true => prop gönderildiğinde undefined da gelebilir
  onOpenRecentWorkModal?: ((payload: { id: string; slug?: string }) => void) | undefined;
};

export function HomeLeftColumn(_props: HomeLeftColumnProps) {
  const {
    data: reviews = [],
    isLoading: loadingReviews,
    isError: errorReviews,
    refetch: refetchReviews,
  } = useListReviewsQuery({
    approved: true,
    active: true,
    orderBy: "display_order",
    order: "asc",
    limit: 6,
    offset: 0,
  });

  const [createReview, { isLoading: sending }] = useCreateReviewMutation();

  const [reviewData, setReviewData] = useState<ReviewCreateInput>({
    name: "",
    email: "",
    rating: 5,
    comment: "",
  });

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const [carouselApi, setCarouselApi] = useState<any>(null);

  useEffect(() => {
    if (!carouselApi) return;
    if (!reviews || reviews.length <= 1) return;

    const interval = setInterval(() => {
      carouselApi.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselApi, reviews]);

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!reviewData.name.trim() || !reviewData.email.trim() || !reviewData.comment.trim()) {
      toast.error("Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      await createReview({
        name: reviewData.name.trim(),
        email: reviewData.email.trim(),
        rating: Number(reviewData.rating),
        comment: reviewData.comment.trim(),
      }).unwrap();

      toast.success("Yorumunuz alındı. Onay sonrası listede görünecek.");
      setReviewSubmitted(true);

      setTimeout(() => {
        setReviewSubmitted(false);
        setShowReviewForm(false);
        setReviewData({ name: "", email: "", rating: 5, comment: "" });
        refetchReviews();
      }, 3000);
    } catch {
      toast.error("Gönderim sırasında bir hata oluştu.");
    }
  };

  return (
    <>
      {reviewSubmitted && (
        <div className="bg-slate-50 p-6 rounded-lg text-center border border-slate-200">
          <div className="text-slate-900 text-4xl mb-3">✓</div>
          <h3 className="text-lg mb-2 text-slate-900 font-semibold">Teşekkür Ederiz!</h3>
          <p className="text-gray-600 text-sm">Görüşünüz başarıyla alındı.</p>
        </div>
      )}

      {showReviewForm && !reviewSubmitted && (
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
          <h3 className="text-lg mb-4 text-slate-900 text-center font-semibold">
            Yorumunuzu Paylaşın
          </h3>

          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <Input
              type="text"
              value={reviewData.name}
              onChange={(e) => setReviewData((p) => ({ ...p, name: e.target.value }))}
              placeholder="Adınız Soyadınız"
              required
            />

            <Input
              type="email"
              value={reviewData.email}
              onChange={(e) => setReviewData((p) => ({ ...p, email: e.target.value }))}
              placeholder="E-posta Adresiniz"
              required
            />

            <div className="flex justify-center space-x-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewData((p) => ({ ...p, rating: star }))}
                  className={`text-xl transition-colors ${
                    star <= reviewData.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  aria-label={`${star} yıldız`}
                >
                  <Star className="w-5 h-5 fill-current" />
                </button>
              ))}
            </div>

            <Textarea
              value={reviewData.comment}
              onChange={(e) => setReviewData((p) => ({ ...p, comment: e.target.value }))}
              placeholder="X Emlak hizmetleri hakkındaki görüşlerinizi paylaşın…"
              rows={3}
              required
            />

            <div className="flex space-x-3">
              <Button
                type="submit"
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
                disabled={sending}
              >
                {sending ? "Gönderiliyor..." : "Gönder"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setShowReviewForm(false)}
                className="flex-1"
                disabled={sending}
              >
                İptal
              </Button>
            </div>
          </form>
        </div>
      )}

      {!reviewSubmitted && !showReviewForm && (
        <div className="bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
          <div className="mb-4">
            <img
              src={COMMENT_IMAGE}
              alt="X Emlak hizmetlerini değerlendirmek için yorum gönder"
              className="w-full h-48 md:h-56 object-cover rounded-lg shadow-sm"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
              }}
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="p-6 pt-2">
            <h3 className="text-lg mb-3 text-slate-900 text-center font-semibold">
              GÖRÜŞLERİNİZ BİZİM İÇİN DEĞERLİDİR
            </h3>
            <p className="text-gray-600 text-sm mb-4 text-center">
              X Emlak ile yaşadığınız deneyimi paylaşın. Yorumunuz, hizmet kalitemizi geliştirmemize yardımcı olur.
            </p>

            <div className="text-center">
              <Button
                onClick={() => setShowReviewForm(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white"
              >
                Yorum Gönder
              </Button>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl text-slate-900 font-semibold">MÜŞTERİ GÖRÜŞLERİ</h2>
        </div>

        {loadingReviews && <div className="text-gray-500 text-sm">Yükleniyor…</div>}

        {errorReviews && (
          <div className="text-red-600 text-sm">
            Yorumlar yüklenemedi.{" "}
            <button onClick={() => refetchReviews()} className="underline">
              Tekrar dene
            </button>
          </div>
        )}

        {!loadingReviews && !errorReviews && reviews.length === 0 && (
          <div className="bg-white rounded-lg border p-6 text-sm text-gray-600">Henüz yorum bulunmuyor.</div>
        )}

        {!loadingReviews && !errorReviews && reviews.length > 0 && (
          <Carousel setApi={setCarouselApi} opts={{ loop: true }} className="w-full">
            <CarouselContent>
              {reviews.map((r: any) => (
                <CarouselItem key={r.id} className="basis-full">
                  <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <div className="mb-2 font-semibold text-slate-900">{r.name}</div>

                    <div className="flex items-center mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= (r.rating ?? 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                      "{r.comment}"
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>
    </>
  );
}
