import { useState, useRef, useEffect } from 'react';

interface ImageOptimizedProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  onLoad?: () => void;
  onError?: () => void;
}

export function ImageOptimized({
  src,
  alt,
  className = '',
  priority = false,
  sizes,
  quality = 80,
  placeholder = 'blur',
  onLoad,
  onError
}: ImageOptimizedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);

  // Container'ı gözlemle (tip doğru)
  const containerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (priority) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
            break;
          }
        }
      },
      { rootMargin: '50px', threshold: 0.1 }
    );

    const el = containerRef.current;
    if (el) observerRef.current.observe(el);

    return () => observerRef.current?.disconnect();
  }, [priority]);

  const getOptimizedUrl = (url: string, q: number) => {
    if (url.includes('unsplash.com')) {
      const baseUrl = url.split('?')[0];
      const params = new URLSearchParams();

      const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
      const targetWidth = isMobile ? 400 : 800;
      const targetHeight = isMobile ? 300 : 600;

      params.set('w', String(targetWidth));
      params.set('h', String(targetHeight));
      params.set('fit', 'crop');
      params.set('fm', 'webp');
      params.set('q', String(q));
      params.set('auto', 'format');
      if (priority) params.set('dpr', '2');

      return `${baseUrl}?${params.toString()}`;
    }
    return url;
  };

  const generateSrcSet = (url: string) => {
    if (!url.includes('unsplash.com')) return undefined;
    const baseUrl = url.split('?')[0];
    const widths = [320, 480, 640, 800, 1024];

    return widths
      .map((w) => {
        const params = new URLSearchParams();
        params.set('w', String(w));
        params.set('h', String(Math.round(w * 0.75)));
        params.set('fit', 'crop');
        params.set('fm', 'webp');
        params.set('q', String(quality));
        params.set('auto', 'format');
        return `${baseUrl}?${params.toString()} ${w}w`;
      })
      .join(', ');
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const optimizedSrc = getOptimizedUrl(src, quality);
  const srcSet = generateSrcSet(src);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        background: placeholder === 'blur' ? '#f3f4f6' : 'transparent',
        minHeight: placeholder === 'blur' ? '200px' : 'auto'
      }}
    >
      {/* Placeholder/Skeleton */}
      {!isLoaded && placeholder === 'blur' && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-gray-300 opacity-20"></div>
        </div>
      )}

      {/* Ana görsel */}
      {(isInView || priority) && (
        <img
  src={optimizedSrc}
  srcSet={srcSet}
  alt={alt}
  className={`w-full h-full object-cover transition-opacity duration-300 ${
    isLoaded ? 'opacity-100' : 'opacity-0'
  } ${priority ? 'lcp-image mobile-critical' : 'mobile-image-optimize'}`}
  sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'}
  loading={priority ? 'eager' : 'lazy'}
  decoding={priority ? 'sync' : 'async'}
  {...({ fetchpriority: (priority ? 'high' : 'auto') } as Record<string, string>)}
  onLoad={handleLoad}
  onError={handleError}
  style={{
    contentVisibility: priority ? 'visible' : ('auto' as any),
  }}
/>


      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm">Görsel yüklenemedi</p>
          </div>
        </div>
      )}

      {/* Priority loading indicator */}
      {priority && !isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        </div>
      )}
    </div>
  );
}
