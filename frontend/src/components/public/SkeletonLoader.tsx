interface SkeletonLoaderProps {
  type?: "card" | "text" | "image" | "hero" | "grid" | "page" | "services" | "footer";
  count?: number;
  className?: string;
}

export function SkeletonLoader({
  type = "card",
  count = 1,
  className = "",
}: SkeletonLoaderProps) {
  // ortak skeleton blok rengi (dark theme)
  const sk = "bg-white/10";
  const sk2 = "bg-white/5";
  const border = "border border-white/10";

  const SkeletonCard = () => (
    <div className={`rounded-2xl overflow-hidden mobile-skeleton mobile-contain ${border} bg-white/5`}>
      <div className={`aspect-[4/3] ${sk}`} />
      <div className="p-4 space-y-3">
        <div className={`h-4 ${sk} rounded w-1/3`} />
        <div className={`h-6 ${sk} rounded w-full`} />
        <div className={`h-6 ${sk} rounded w-2/3`} />
      </div>
    </div>
  );

  const SkeletonText = () => (
    <div className="animate-pulse space-y-2">
      <div className={`h-4 ${sk} rounded w-full`} />
      <div className={`h-4 ${sk} rounded w-3/4`} />
      <div className={`h-4 ${sk} rounded w-1/2`} />
    </div>
  );

  const SkeletonImage = () => (
    <div className="animate-pulse">
      <div className={`aspect-[4/3] ${sk} rounded-2xl ${border}`} />
    </div>
  );

  // ✅ YEŞİL GRADIENT KALDIRILDI — slate-950 skeleton
  const SkeletonHero = () => (
    <div className="mobile-skeleton mobile-critical">
      <div className="h-[300px] md:h-[500px] bg-slate-950 relative overflow-hidden">
        {/* hafif parıltı/pulse katmanı */}
        <div className="absolute inset-0 animate-pulse">
          <div className={`absolute inset-0 ${sk2}`} />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/10 to-slate-950/60" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="space-y-6 max-w-2xl">
            <div className={`h-8 md:h-12 ${sk} rounded w-3/4`} />
            <div className={`h-6 md:h-8 ${sk} rounded w-full`} />
            <div className={`h-6 md:h-8 ${sk} rounded w-5/6`} />
            <div className="flex gap-4">
              <div className={`h-10 md:h-12 ${sk} rounded-xl w-24 md:w-32`} />
              <div className={`h-10 md:h-12 ${sk} rounded-xl w-24 md:w-32`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SkeletonGrid = () => (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );

  const SkeletonPage = () => (
    <div className="space-y-6 p-6 mobile-contain">
      <div className="space-y-3">
        <div className={`h-8 ${sk} rounded w-1/2 mobile-skeleton`} />
        <div className={`h-4 ${sk} rounded w-3/4 mobile-skeleton`} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-32 ${sk} rounded-2xl mobile-skeleton ${border}`} />
        ))}
      </div>
    </div>
  );

  const SkeletonServices = () => (
    <div className="space-y-8 p-6 mobile-contain">
      <div className={`h-8 ${sk} rounded w-1/3 mx-auto mobile-skeleton`} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-48 ${sk} rounded-2xl mobile-skeleton ${border}`} />
        ))}
      </div>
    </div>
  );

  const SkeletonFooter = () => (
    <div className="bg-slate-950 p-6 mobile-contain">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-3">
            <div className={`h-6 ${sk} rounded w-3/4 mobile-skeleton`} />
            <div className={`h-4 ${sk} rounded w-full mobile-skeleton`} />
            <div className={`h-4 ${sk} rounded w-2/3 mobile-skeleton`} />
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case "text":
        return <SkeletonText />;
      case "image":
        return <SkeletonImage />;
      case "hero":
        return <SkeletonHero />;
      case "grid":
        return <SkeletonGrid />;
      case "page":
        return <SkeletonPage />;
      case "services":
        return <SkeletonServices />;
      case "footer":
        return <SkeletonFooter />;
      case "card":
      default:
        return (
          <div className={`space-y-4 ${className}`}>
            {Array.from({ length: count }, (_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        );
    }
  };

  return <div className={className}>{renderSkeleton()}</div>;
}
