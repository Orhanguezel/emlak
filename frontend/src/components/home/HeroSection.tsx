// =============================================================
// FILE: src/components/sections/HeroSection.tsx   (X Emlak)
// =============================================================
"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ImageOptimized } from "../public/ImageOptimized";
import { SkeletonLoader } from "../public/SkeletonLoader";

import { useListSlidesPublicQuery } from "@/integrations/rtk/endpoints/slider_public.endpoints";
import type { SliderPublic, SliderListParams } from "@/integrations/rtk/types/slider";

interface HeroSectionProps {
  onNavigate?: (page: string) => void;
}

type SlideLike = {
  id: string; // ✅ string
  image: string;
  title?: string | null;
  alt?: string | null;
  href?: string | null;
  is_active?: boolean;
  display_order?: number | null;
};

const toBool = (v: any, fallback = true): boolean => {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v === 1;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "1" || s === "true" || s === "yes") return true;
    if (s === "0" || s === "false" || s === "no") return false;
  }
  return fallback;
};

const toNum = (v: any, fallback: number): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

// ✅ SliderPublic -> SlideLike normalize (cast yok!)
function toSlideLike(s: SliderPublic, index: number): SlideLike {
  // SliderPublic id: number ise string'e çevir
  const id = String((s as any)?.id ?? index);

  // Alan isimleri sende nasıl ise burada eşleştir
  // Varsayım: SliderPublic { image, title, alt, href, is_active, display_order } gibi.
  // Eğer backend farklı field dönüyorsa burayı 1 defa ayarlarsın.
  const image = String((s as any)?.image ?? "");
  const title = (typeof (s as any)?.title === "string" ? (s as any).title : null) ?? null;
  const alt = (typeof (s as any)?.alt === "string" ? (s as any).alt : null) ?? null;
  const href = (typeof (s as any)?.href === "string" ? (s as any).href : null) ?? null;

  const is_active = toBool((s as any)?.is_active, true);
  const display_order =
    (s as any)?.display_order != null ? toNum((s as any).display_order, index + 1) : index + 1;

  return { id, image, title, alt, href, is_active, display_order };
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  // ✅ slider_public.endpoints.ts buildParams: q/limit/offset/sort/order
  // Sen "active + orderBy + asc" istiyorsun; bunu params’a map ediyoruz.
  const params: SliderListParams = {
    // aktif filtre backend’de yoksa endpoint tarafında eklenebilir;
    // burada hiç göndermeyip FE filtreleyebiliriz:
    limit: 20,
    offset: 0,
    sort: "display_order",
    order: "asc",
  };

  const { data, isFetching } = useListSlidesPublicQuery(params);

  const slides: SlideLike[] = useMemo(() => {
    const arr = Array.isArray(data) ? data : [];
    return arr
      .map((s, i) => toSlideLike(s, i))
      .filter((s) => !!s.image && toBool(s.is_active, true))
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  }, [data]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // index taşmalarını önle
  useEffect(() => {
    if (slides.length > 0 && currentSlide >= slides.length) setCurrentSlide(0);
  }, [slides.length, currentSlide]);

  // ilk görseli preload et
  useEffect(() => {
    setImgLoaded(false);
    let cleanup: (() => void) | undefined;

    if (slides.length > 0) {
      const first = slides[0]?.image;
      if (!first) {
        setImgLoaded(true);
      } else {
        const img = new Image();
        const onload = () => setImgLoaded(true);
        const onerror = () => setImgLoaded(true);
        img.onload = onload;
        img.onerror = onerror;

        img.src = `${first}?w=1200&h=600&fit=crop&fm=webp&q=85`;

        cleanup = () => {
          img.onload = null;
          img.onerror = null;
        };
      }
    } else {
      setImgLoaded(true);
    }

    return cleanup;
  }, [slides]);

  // otomatik geçiş
  useEffect(() => {
    if (slides.length <= 1) return;

    let intervalTime = 5000;
    try {
      const conn = (navigator as any)?.connection;
      const t = conn?.effectiveType;
      if (t === "slow-2g" || t === "2g") intervalTime = 8000;
      else if (t === "3g") intervalTime = 6000;
    } catch {
      /* noop */
    }

    const id = window.setInterval(() => {
      setCurrentSlide((p) => (p + 1) % slides.length);
    }, intervalTime);

    return () => window.clearInterval(id);
  }, [slides.length]);

  const minSwipeDistance = 50;
  const nextSlide = () => setCurrentSlide((p) => (p + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length);

  // Touch handlers
  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    setTouchEnd(null);
    const t = e.targetTouches && e.targetTouches.length > 0 ? e.targetTouches[0] : null;
    if (!t) return;
    setTouchStart(t.clientX);
  };

  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    const t = e.targetTouches && e.targetTouches.length > 0 ? e.targetTouches[0] : null;
    if (!t) return;
    setTouchEnd(t.clientX);
  };

  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance && slides.length > 1) nextSlide();
    if (distance < -minSwipeDistance && slides.length > 1) prevSlide();
  };

  // boş durum (fetch bitti, slide yok)
  if (!isFetching && slides.length === 0) {
    return (
      <section
        className="
          relative
          h-[280px]
          md:h-[50vh] md:max-h-[640px]
          lg:h-[60vh] lg:max-h-[750px]
          overflow-hidden
          bg-slate-950
        "
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white/70 rounded-full animate-spin mx-auto mb-3" />
            <div className="text-sm text-white/70">Görsel bulunamadı</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[280px] md:h-[380px] lg:h-[450px] overflow-hidden bg-slate-950">
      {(isFetching || !imgLoaded) && (
        <div className="absolute inset-0 z-20">
          <SkeletonLoader type="hero" />
        </div>
      )}

      <div
        className="relative w-full h-full mobile-optimized"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {slides.map((slide, index) => {
          const clickable = !!slide.href && typeof slide.href === "string";
          const alt = slide.alt || slide.title || `Slide ${index + 1}`;

          const handleClick = () => {
            if (!clickable) return;
            if (onNavigate) onNavigate(slide.href as string);
            else window.location.href = slide.href as string;
          };

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
              style={{ backfaceVisibility: "hidden" }}
              onClick={clickable ? handleClick : undefined}
              role={clickable ? "button" : undefined}
              tabIndex={clickable ? 0 : undefined}
            >
              <ImageOptimized
                src={slide.image}
                alt={alt}
                className={`w-full h-full object-cover ${clickable ? "cursor-pointer" : ""}`}
                priority={index === 0}
                sizes="100vw"
                quality={index === 0 ? 90 : 75}
              />

              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/15 via-slate-950/10 to-slate-950/40" />
            </div>
          );
        })}
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-slate-950/55 hover:bg-slate-950/75 text-white p-2 rounded-full transition-colors z-30 backdrop-blur-sm border border-white/10"
            aria-label="Önceki slide"
            style={{ minWidth: 40, minHeight: 40 }}
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-slate-950/55 hover:bg-slate-950/75 text-white p-2 rounded-full transition-colors z-30 backdrop-blur-sm border border-white/10"
            aria-label="Sonraki slide"
            style={{ minWidth: 40, minHeight: 40 }}
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex space-x-1.5 z-30">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(i)}
                className={`rounded-full transition-all ${
                  i === currentSlide
                    ? "bg-white/90 w-7 h-1.5"
                    : "bg-white/35 hover:bg-white/55 w-1.5 h-1.5"
                }`}
                style={{ minWidth: 6, minHeight: 6 }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
