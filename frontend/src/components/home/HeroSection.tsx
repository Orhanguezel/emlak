// src/components/sections/HeroSection.tsx
import { useState, useEffect } from "react";
import { ImageOptimized } from "../public/ImageOptimized";
import { SkeletonLoader } from "../public/SkeletonLoader";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useActiveSlidesRtk } from "@/data/sliderData";

interface HeroSectionProps {
  onNavigate?: (page: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const { slides, isFetching } = useActiveSlidesRtk();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // index taşmalarını önle
  useEffect(() => {
    if (slides.length > 0 && currentSlide >= slides.length) setCurrentSlide(0);
  }, [slides.length, currentSlide]);

  // ilk görseli preload et (her yoldan dönüş)
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
    }
    return cleanup;
  }, [slides]);

  // otomatik geçiş (her yoldan dönüş)
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (slides.length > 1) {
      let intervalTime = 5000;
      try {
        const conn = (navigator as any)?.connection;
        const t = conn?.effectiveType;
        if (t === "slow-2g" || t === "2g") intervalTime = 8000;
        else if (t === "3g") intervalTime = 6000;
      } catch { /* noop */ }

      const id = setInterval(() => {
        setCurrentSlide((p) => (p + 1) % slides.length);
      }, intervalTime);

      cleanup = () => clearInterval(id);
    }
    return cleanup;
  }, [slides.length]);

  const minSwipeDistance = 50;
  const nextSlide = () => setCurrentSlide((p) => (p + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length);

  // Touch handlers (güvenli erişim)
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

  // boş durum
  if (!isFetching && slides.length === 0) {
    return (
      <section
        className="
    relative
    h-[280px]               /* mobile aynı kalsın */
    md:h-[50vh] md:max-h-[640px]   /* tablet: ekranın %60’ı, max 640px */
    lg:h-[60vh] lg:max-h-[750px]   /* desktop: ekranın %70’i, max 750px */
    overflow-hidden
    hero-section
  "
      >

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[280px] md:h-[380px] lg:h-[450px] overflow-hidden hero-section">
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
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
            style={{ backfaceVisibility: "hidden" }}
          >
            <ImageOptimized
              src={slide.image}
              alt={slide.alt || slide.title}
              className="w-full h-full object-cover"
              priority={index === 0}
              sizes="100vw"

              quality={index === 0 ? 90 : 75}
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 md:p-2 rounded-full transition-colors z-20 backdrop-blur-sm"
            aria-label="Önceki slide"
            style={{ minWidth: 40, minHeight: 40 }}
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 md:p-2 rounded-full transition-colors z-20 backdrop-blur-sm"
            aria-label="Sonraki slide"
            style={{ minWidth: 40, minHeight: 40 }}
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex space-x-1.5 z-20">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(i)}
                className={`rounded-full transition-all ${i === currentSlide ? "bg-white/90 w-6 h-1.5" : "bg-white/40 hover:bg-white/60 w-1.5 h-1.5"}`}
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
