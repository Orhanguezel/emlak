import { useEffect } from 'react';

interface PreloadManagerProps {
  heroImage?: string;
  criticalImages?: string[];
  fonts?: string[];
}

export function PreloadManager({ 
  heroImage, 
  criticalImages = [], 
  fonts = []
}: PreloadManagerProps) {
  
  useEffect(() => {
    const preloadLinks: HTMLLinkElement[] = [];

    // Preload hero image with high priority
    if (heroImage) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = heroImage;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      preloadLinks.push(link);
    }

    // Preload critical images
    criticalImages.forEach((imageSrc, index) => {
      if (index < 3) { // Limit to first 3 critical images
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = imageSrc;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
        preloadLinks.push(link);
      }
    });

    // Preload fonts
    fonts.forEach(fontUrl => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.href = fontUrl;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      preloadLinks.push(link);
    });

    // DNS prefetch for external domains
    const domains = ['images.unsplash.com', 'fonts.googleapis.com'];
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
      preloadLinks.push(link);
    });

    // Cleanup function
    return () => {
      preloadLinks.forEach(link => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      });
    };
  }, [heroImage, criticalImages, fonts]);

  return null; // This component doesn't render anything
}