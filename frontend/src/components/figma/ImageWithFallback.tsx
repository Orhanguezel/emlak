// src/components/figma/ImageWithFallback.tsx
"use client";

import React, { useEffect, useState } from "react";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  /** opsiyonel: fallback görseli override etmek istersen */
  fallbackSrc?: string;
};

export function ImageWithFallback(props: Props) {
  const [didError, setDidError] = useState(false);

  const {
    src,
    alt,
    style,
    className,
    onError,
    fallbackSrc,
    ...rest
  } = props;

  // ✅ src değişince hata durumunu sıfırla (route değişimi / remount / strict mode)
  useEffect(() => {
    setDidError(false);
  }, [src]);

  const handleError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    // önce consumer onError çalışsın
    onError?.(e);
    // sonra fallback'e geç
    setDidError(true);
  };

  if (!src) {
    // src yoksa direkt fallback
    return (
      <div
        className={`inline-flex items-center justify-center bg-white/5 border border-white/10 text-center align-middle ${className ?? ""}`}
        style={style}
      >
        <img
          src={fallbackSrc ?? ERROR_IMG_SRC}
          alt="Error loading image"
          className="w-full h-full object-contain"
          data-original-url=""
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  return didError ? (
    <div
      className={`inline-flex items-center justify-center bg-white/5 border border-white/10 text-center align-middle ${className ?? ""}`}
      style={style}
    >
      {/* ✅ rest'i buraya taşımıyoruz: onError/srcSet/sizes gibi şeyler fallback'i bozmasın */}
      <img
        src={fallbackSrc ?? ERROR_IMG_SRC}
        alt="Error loading image"
        className="w-full h-full object-contain"
        data-original-url={src}
        loading="lazy"
        decoding="async"
      />
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={handleError}
    />
  );
}
