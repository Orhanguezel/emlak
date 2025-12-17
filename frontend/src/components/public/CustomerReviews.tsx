"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";

import {
  useListReviewsQuery,
  useCreateReviewMutation,
} from "@/integrations/rtk/endpoints/reviews.endpoints";
import type {
  ReviewCreateInput,
  ReviewView,
} from "@/integrations/rtk/types/reviews";

export function CustomerReviews() {
  // --- Remote data (public list) ---
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

  // --- Local UI state ---
  const [reviewData, setReviewData] = useState<ReviewCreateInput>({
    name: "",
    email: "",
    rating: 5,
    comment: "",
  });

  // collapse kontrol
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // collapse yükseklik ölçümü (kapalıyken yer kaplamasın)
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxH, setMaxH] = useState(0);
  useEffect(() => {
    // içerik değişince gerçek yüksekliği ölç
    if (showForm) {
      const h = contentRef.current?.scrollHeight ?? 0;
      setMaxH(h);
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

  // Ortalama puan
  const avg = useMemo(() => {
    if (!reviews.length) return 0;
    const s = reviews.reduce((acc: number, r: ReviewView) => acc + (r.rating ?? 0), 0);
    return Math.round((s / reviews.length) * 10) / 10;
  }, [reviews]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <h2 className="text-3xl mb-12 text-teal-600">GÖRÜŞLERİNİZ BİZİM İÇİN DEĞERLİDİR</h2>

        <div className="bg-white p-8 rounded-lg mb-8 text-left">
          {/* görsel ve başlık */}
          <div className="text-center">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.1.0&w=400&h=300&fit=crop&crop=center&q=80"
              alt="Müşteri Görüşleri"
              className="w-full max-w-md mx-auto rounded-lg mb-6"
            />

            <div className="bg-teal-600 text-white p-4 rounded-lg mb-6 inline-flex items-center space-x-3">
              <div className="bg-white text-teal-600 px-3 py-1 rounded">
                <span className="font-semibold">xemlak.com</span>
              </div>
              <span>Yaptığımız hizmetleri değerlendirmek için</span>
            </div>

            {/* Özet bilgi */}
            <div className="mb-6 flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-teal-700">{avg || "—"}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i <= Math.round(avg) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-sm text-gray-500">({reviews.length} yorum)</span>
            </div>
          </div>

          {/* Liste */}
          <div className="grid grid-cols-1 gap-4">
            {isLoading && <div className="text-gray-500 text-sm">Yükleniyor...</div>}
            {isError && (
              <div className="text-red-600 text-sm">
                Yorumlar yüklenemedi.{" "}
                <button onClick={() => refetch()} className="underline">
                  Tekrar dene
                </button>
              </div>
            )}
            {!isLoading && !isError && reviews.length === 0 && (
              <div className="text-gray-500 text-sm">Henüz yorum bulunmuyor.</div>
            )}
            {reviews.map((r) => (
              <div key={r.id} className="rounded-lg border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-slate-800">{r.name}</div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= (r.rating ?? 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {new Date(r.created_at).toLocaleDateString()}
                </div>
                <p className="text-slate-700 mt-2 whitespace-pre-wrap">{r.comment}</p>
              </div>
            ))}
          </div>

          {/* Aç/Kapa butonu */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-6 leading-relaxed">
              Memnuniyetiniz bizim önceliğimizdir. Hizmetlerimiz hakkındaki görüş ve
              önerilerinizi bizimle paylaşın. Sizin değerli yorumlarınız, hizmet kalitemizi
              artırmamıza yardımcı oluyor.
            </p>

            <Button
              onClick={() => setShowForm((v) => !v)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 h-12"
              aria-expanded={showForm}
              aria-controls="review-form"
            >
              {showForm ? "Formu Kapat" : "Yorum Gönder"}
            </Button>
          </div>

          {/* COLLAPSE: Kapalıyken 0px, açılınca içerik yüksekliğine genişler */}
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
                <div className="bg-teal-50 border border-teal-100 rounded-lg p-8 text-center">
                  <div className="text-teal-600 text-6xl mb-6">✓</div>
                  <h3 className="text-2xl mb-4 text-teal-600">Teşekkür Ederiz!</h3>
                  <p className="text-gray-600">
                    Görüşünüz başarıyla alındı. Değerli yorumunuz için teşekkür ederiz.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      type="text"
                      value={reviewData.name}
                      onChange={(e) =>
                        setReviewData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Adınız Soyadınız"
                      required
                      className="h-12"
                    />
                    <Input
                      type="email"
                      value={reviewData.email}
                      onChange={(e) =>
                        setReviewData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="E-posta Adresiniz"
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingClick(star)}
                        className={`text-3xl transition-colors ${star <= reviewData.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                          }`}
                        aria-label={`${star} yıldız`}
                      >
                        <Star className="w-8 h-8 fill-current" />
                      </button>
                    ))}
                  </div>

                  <Textarea
                    value={reviewData.comment}
                    onChange={(e) =>
                      setReviewData((prev) => ({ ...prev, comment: e.target.value }))
                    }
                    placeholder="Hizmetlerimiz hakkındaki görüşlerinizi paylaşın..."
                    rows={6}
                    required
                  />

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white h-12"
                      disabled={sending}
                    >
                      {sending ? "Gönderiliyor..." : "Gönder"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="flex-1 h-12"
                      disabled={sending}
                    >
                      İptal
                    </Button>
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
