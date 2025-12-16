interface SkeletonLoaderProps {
  type?: 'card' | 'text' | 'image' | 'hero' | 'grid' | 'page' | 'services' | 'footer';
  count?: number;
  className?: string;
}

export function SkeletonLoader({ 
  type = 'card', 
  count = 1, 
  className = '' 
}: SkeletonLoaderProps) {
  
  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mobile-skeleton mobile-contain">
      <div className="aspect-[4/3] bg-gray-300"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        <div className="h-6 bg-gray-300 rounded w-full"></div>
        <div className="h-6 bg-gray-300 rounded w-2/3"></div>
      </div>
    </div>
  );

  const SkeletonText = () => (
    <div className="animate-pulse space-y-2">
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  );

  const SkeletonImage = () => (
    <div className="animate-pulse">
      <div className="aspect-[4/3] bg-gray-300 rounded"></div>
    </div>
  );

  const SkeletonHero = () => (
    <div className="mobile-skeleton mobile-critical">
      <div className="h-[300px] md:h-[500px] bg-gradient-to-r from-teal-100 via-teal-200 to-teal-100">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="space-y-6 max-w-2xl">
            <div className="h-8 md:h-12 bg-gray-300 rounded w-3/4"></div>
            <div className="h-6 md:h-8 bg-gray-300 rounded w-full"></div>
            <div className="h-6 md:h-8 bg-gray-300 rounded w-5/6"></div>
            <div className="flex gap-4">
              <div className="h-10 md:h-12 bg-gray-300 rounded w-24 md:w-32"></div>
              <div className="h-10 md:h-12 bg-gray-300 rounded w-24 md:w-32"></div>
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
        <div className="h-8 bg-gray-300 rounded w-1/2 mobile-skeleton"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mobile-skeleton"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-gray-300 rounded mobile-skeleton"></div>
        ))}
      </div>
    </div>
  );

  const SkeletonServices = () => (
    <div className="space-y-8 p-6 mobile-contain">
      <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mobile-skeleton"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-gray-300 rounded mobile-skeleton"></div>
        ))}
      </div>
    </div>
  );

  const SkeletonFooter = () => (
    <div className="bg-gray-100 p-6 mobile-contain">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="space-y-3">
            <div className="h-6 bg-gray-300 rounded w-3/4 mobile-skeleton"></div>
            <div className="h-4 bg-gray-300 rounded w-full mobile-skeleton"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mobile-skeleton"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return <SkeletonText />;
      case 'image':
        return <SkeletonImage />;
      case 'hero':
        return <SkeletonHero />;
      case 'grid':
        return <SkeletonGrid />;
      case 'page':
        return <SkeletonPage />;
      case 'services':
        return <SkeletonServices />;
      case 'footer':
        return <SkeletonFooter />;
      case 'card':
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