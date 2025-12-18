"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";

import {
  useListReviewsQuery,
  useCreateReviewMutation,
} from "@/integrations/rtk/endpoints/reviews.endpoints";
import type { ReviewCreateInput, ReviewView } from "@/integrations/rtk/types/reviews";

/** ✅ Flicker-free image (no loop, fixed height) */
function StableImage({
  src,
  alt,
  className,
  fallbackSrc,
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const didFallback = useRef(false);

  useEffect(() => {
    setCurrentSrc(src);
    didFallback.current = false;
  }, [src]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading="eager"
      decoding="async"
      onError={() => {
        if (didFallback.current) return;
        didFallback.current = true;
        if (fallbackSrc) setCurrentSrc(fallbackSrc);
      }}
    />
  );
}

export function CustomerReviews() {
  const {
    data: reviews = [],
    isLoading,
    isError,
    refetch,
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

  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const [maxH, setMaxH] = useState(0);

  useEffect(() => {
    if (showForm) {
      setMaxH(contentRef.current?.scrollHeight ?? 0);
    } else {
      setMaxH(0);
    }
  }, [showForm, submitted, sending, reviewData]);

  const handleRatingClick = (rating: number) => {
    setReviewData((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setShowForm(false);
        setReviewData({ name: "", email: "", rating: 5, comment: "" });
        refetch();
      }, 3000);
    } catch {
      toast.error("Gönderim sırasında bir hata oluştu.");
    }
  };

  const avg = useMemo(() => {
    if (!reviews.length) return 0;
    const s = reviews.reduce((acc: number, r: ReviewView) => acc + (r.rating ?? 0), 0);
    return Math.round((s / reviews.length) * 10) / 10;
  }, [reviews]);

  const avgRounded = Math.round(avg);

  return (
    <section className="py-16 bg-slate-950">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Müşteri Yorumları
          </h2>
          <p className="mt-2 text-sm md:text-base text-white/70">
            Deneyimlerinizi paylaşın; daha iyi hizmet sunmamıza yardımcı olun.
          </p>
        </div>

        <div className="bg-slate-900/40 border border-white/10 p-6 md:p-8 rounded-2xl text-left shadow-sm">
          <div className="text-center">
            {/* ✅ yükseklik sabit: object-cover gerçekten çalışır, flicker azalır */}
            <div className="w-full max-w-md mx-auto rounded-2xl mb-6 border border-white/10 overflow-hidden bg-white/5">
              <StableImage
                src="/emlak.png"
                alt="Emlak müşteri yorumları"
                className="w-full h-64 object-cover"
                // fallbackSrc="/placeholder.jpg"
              />
            </div>

            <div className="inline-flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 mb-6">
              <div className="bg-white text-slate-950 px-3 py-1 rounded-xl">
                <span className="font-semibold">xemlak.com</span>
              </div>
              <span className="text-sm text-white/80">
                Hizmetimizi değerlendirmek için yorum bırakın
              </span>
            </div>

            <div className="mb-6 flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold text-white">
                  {avg ? avg.toFixed(1) : "—"}
                </span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i <= avgRounded ? "text-yellow-400 fill-current" : "text-white/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-sm text-white/60">({reviews.length} yorum)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {isLoading && <div className="text-white/60 text-sm">Yükleniyor...</div>}

            {isError && (
              <div className="text-amber-200 text-sm">
                Yorumlar yüklenemedi.{" "}
                <button onClick={() => refetch()} className="underline underline-offset-4">
                  Tekrar dene
                </button>
              </div>
            )}

            {!isLoading && !isError && reviews.length === 0 && (
              <div className="text-white/60 text-sm">Henüz yorum bulunmuyor.</div>
            )}

            {reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-white">{r.name}</div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= (r.rating ?? 0) ? "text-yellow-400 fill-current" : "text-white/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-xs text-white/50 mt-1">
                  {new Date(r.created_at).toLocaleDateString()}
                </div>

                <p className="text-white/80 mt-2 whitespace-pre-wrap">{r.comment}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/70 mb-6 leading-relaxed text-sm md:text-base">
              Memnuniyetiniz önceliğimizdir. Görüşleriniz, hizmet kalitemizi geliştirmemize yardımcı olur.
            </p>

            <Button
              onClick={() => setShowForm((v) => !v)}
              className="bg-white text-slate-950 hover:bg-white/90 px-8 py-3 h-12 rounded-xl font-semibold"
              aria-expanded={showForm}
              aria-controls="review-form"
            >
              {showForm ? "Formu Kapat" : "Yorum Gönder"}
            </Button>
          </div>

          <div
            id="review-form"
            className="transition-all duration-300 overflow-hidden"
            style={{
              maxHeight: maxH,
              opacity: showForm ? 1 : 0,
              marginTop: showForm ? 24 : 0,
            }}
          >
            <div ref={contentRef}>
              {submitted ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                  <div className="text-white text-6xl mb-6">✓</div>
                  <h3 className="text-2xl font-extrabold mb-3 text-white">Teşekkür Ederiz!</h3>
                  <p className="text-white/70">
                    Görüşünüz başarıyla alındı. Değerli yorumunuz için teşekkür ederiz.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      type="text"
                      value={reviewData.name}
                      onChange={(e) => setReviewData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Adınız Soyadınız"
                      required
                      className="h-12 bg-white text-slate-950 placeholder:text-slate-400"
                    />
                    <Input
                      type="email"
                      value={reviewData.email}
                      onChange={(e) => setReviewData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="E-posta Adresiniz"
                      required
                      className="h-12 bg-white text-slate-950 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingClick(star)}
                        className={`transition-colors ${
                          star <= reviewData.rating ? "text-yellow-400" : "text-white/30"
                        }`}
                        aria-label={`${star} yıldız`}
                      >
                        <Star className="w-8 h-8 fill-current" />
                      </button>
                    ))}
                  </div>

                  <Textarea
                    value={reviewData.comment}
                    onChange={(e) => setReviewData((prev) => ({ ...prev, comment: e.target.value }))}
                    placeholder="Hizmetimiz hakkındaki görüşlerinizi paylaşın..."
                    rows={6}
                    required
                    className="bg-white text-slate-950 placeholder:text-slate-400"
                  />

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-white text-slate-950 hover:bg-white/90 h-12 rounded-xl font-semibold"
                      disabled={sending}
                    >
                      {sending ? "Gönderiliyor..." : "Gönder"}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="flex-1 h-12 rounded-xl border-white/20 text-white hover:bg-white/5"
                      disabled={sending}
                    >
                      İptal
                    </Button>
                  </div>

                  <div className="text-[11px] text-white/50 text-center pt-2">
                    Not: Yorumlar admin onayından sonra yayınlanır.
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
