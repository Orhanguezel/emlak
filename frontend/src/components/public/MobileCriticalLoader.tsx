import { useEffect } from 'react';

interface MobileCriticalLoaderProps {
  heroImage?: string;
  criticalImages: string[];
  criticalFonts?: string[];
}

export function MobileCriticalLoader({ 
  heroImage, 
  criticalImages, 
  criticalFonts = [] 
}: MobileCriticalLoaderProps) {

  useEffect(() => {
    // Mobile-optimized resource loading strategy
    const loadCriticalResources = async () => {
      
      // 1. Ultra-aggressive hero image preloading for LCP optimization
      if (heroImage) {
        // Multiple preload strategies for maximum speed
        const heroLink = document.createElement('link');
        heroLink.rel = 'preload';
        heroLink.as = 'image';
        heroLink.href = heroImage + '?w=800&h=600&fit=crop&fm=webp&q=85';
        (heroLink as any).fetchPriority = 'high';
        heroLink.crossOrigin = 'anonymous';
        document.head.appendChild(heroLink);
        
        // Also create image object for immediate browser cache
        const heroImg = new Image();
        (heroImg as any).fetchPriority = 'high';
        heroImg.loading = 'eager';
        heroImg.decoding = 'sync';
        heroImg.src = heroImage + '?w=800&h=600&fit=crop&fm=webp&q=85';
        
        // Preload multiple formats for better browser support
        const heroWebP = document.createElement('link');
        heroWebP.rel = 'preload';
        heroWebP.as = 'image';
        heroWebP.href = heroImage + '?w=800&h=600&fit=crop&fm=webp&q=85';
        heroWebP.type = 'image/webp';
        heroWebP.crossOrigin = 'anonymous';
        document.head.appendChild(heroWebP);
        
        const heroJPEG = document.createElement('link');
        heroJPEG.rel = 'preload';
        heroJPEG.as = 'image';
        heroJPEG.href = heroImage + '?w=800&h=600&fit=crop&fm=jpg&q=80';
        heroJPEG.type = 'image/jpeg';
        heroJPEG.crossOrigin = 'anonymous';
        document.head.appendChild(heroJPEG);
      }

      // 2. Optimized critical images for mobile - reduced size for faster LCP
      criticalImages.slice(0, 6).forEach((image, index) => {
        // Use smaller dimensions for mobile-first approach
        const mobileWidth = index < 3 ? 400 : 300;
        const mobileHeight = index < 3 ? 300 : 225;
        const quality = index < 3 ? 80 : 70;
        
        const link = document.createElement('link');
        link.rel = index < 3 ? 'preload' : 'prefetch';
        link.as = 'image';
        link.href = image + `?w=${mobileWidth}&h=${mobileHeight}&fit=crop&fm=webp&q=${quality}`;
        (link as any).fetchPriority = index < 2 ? 'high' : 'low';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
        
        // Immediate loading for first 3 critical images
        if (index < 3) {
          const img = new Image();
          img.src = image + `?w=${mobileWidth}&h=${mobileHeight}&fit=crop&fm=webp&q=${quality}`;
          img.loading = 'eager';
          img.decoding = 'sync';
        }
      });

      // 3. Preload critical fonts
      criticalFonts.forEach(font => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = 'font/woff2';
        link.href = font;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });

      // 4. Mobile-specific preloading for next likely resources
      setTimeout(() => {
        // Preload remaining images with lower priority
        criticalImages.slice(4, 8).forEach(image => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = image + '?w=400&h=300&fit=crop&fm=webp&q=70';
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        });
      }, 1000);
    };

    // Mobile connection-aware loading
    const loadWithConnectionAwareness = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        
        if (connection) {
          // Adjust loading strategy based on connection
          switch (connection.effectiveType) {
            case 'slow-2g':
            case '2g':
              // Load only hero image
              if (heroImage) {
                const heroLink = document.createElement('link');
                heroLink.rel = 'preload';
                heroLink.as = 'image';
                heroLink.href = heroImage + '?w=400&h=300&fit=crop&fm=webp&q=60';
                heroLink.crossOrigin = 'anonymous';
                document.head.appendChild(heroLink);
              }
              break;
            
            case '3g':
              // Load hero + first 2 critical images
              loadCriticalResources();
              break;
            
            case '4g':
            default:
              // Full loading strategy
              loadCriticalResources();
              break;
          }
        } else {
          loadCriticalResources();
        }
      } else {
        loadCriticalResources();
      }
    };

    // Service Worker registration for mobile caching
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          // Create inline service worker for caching
          const swCode = `
            const CACHE_NAME = 'mezarisim-mobile-v1';
            const urlsToCache = [
              '/',
              '/styles/globals.css',
              ${heroImage ? `'${heroImage}?w=800&h=600&fit=crop&fm=webp&q=80',` : ''}
              ${criticalImages.slice(0, 4).map(img => 
                `'${img}?w=400&h=300&fit=crop&fm=webp&q=75'`
              ).join(',')}
            ];

            self.addEventListener('install', (event) => {
              event.waitUntil(
                caches.open(CACHE_NAME)
                  .then((cache) => cache.addAll(urlsToCache))
              );
            });

            self.addEventListener('fetch', (event) => {
              if (event.request.destination === 'image') {
                event.respondWith(
                  caches.match(event.request)
                    .then((response) => {
                      if (response) {
                        return response;
                      }
                      return fetch(event.request);
                    })
                );
              }
            });
          `;

          const blob = new Blob([swCode], { type: 'application/javascript' });
          const swUrl = URL.createObjectURL(blob);
          await navigator.serviceWorker.register(swUrl);
          console.log('Mobile Service Worker registered');
        } catch (error) {
          console.log('Service Worker registration failed:', error);
        }
      }
    };

    // Mobile resource hints
    const addMobileResourceHints = () => {
      // Preconnect to critical domains
      const preconnects = [
        'https://images.unsplash.com',
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
      ];

      preconnects.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = url;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });

      // DNS prefetch for additional domains
      const dnsPrefetch = [
        'https://api.whatsapp.com',
        'https://wa.me',
        'https://www.google-analytics.com'
      ];

      dnsPrefetch.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = url;
        document.head.appendChild(link);
      });
    };

    // Critical CSS injection for immediate rendering
    const injectCriticalCSS = () => {
      const criticalStyle = document.createElement('style');
      criticalStyle.textContent = `
        /* Critical above-the-fold styles for LCP optimization */
        .hero-section {
          contain: layout style paint;
          content-visibility: visible;
          min-height: 60vh;
          background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
        }
        
        .product-grid {
          contain: layout;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 0.75rem;
        }
        
        .mobile-critical {
          content-visibility: visible;
          contain: layout style paint;
        }
        
        .lcp-image {
          width: 100%;
          height: auto;
          object-fit: cover;
          content-visibility: visible;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: optimizequality;
        }
        
        /* Mobile-optimized skeleton loading */
        .mobile-skeleton {
          background: linear-gradient(90deg, #f0f9ff 25%, #e0f2fe 50%, #f0f9ff 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
        
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        /* Immediate layout styles */
        .mobile-container {
          max-width: 100%;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        /* Performance optimizations */
        .gpu-accelerate {
          transform: translateZ(0);
          backface-visibility: hidden;
          will-change: transform;
        }
        
        /* Reduce motion for better performance */
        @media (prefers-reduced-motion: reduce) {
          .mobile-skeleton { animation: none; background: #f0f9ff; }
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
        
        /* Mobile viewport optimization */
        @media (max-width: 768px) {
          .hero-section { min-height: 50vh; min-height: 50dvh; }
          .product-grid { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
          .mobile-container { padding: 0 0.75rem; }
        }
      `;
      document.head.appendChild(criticalStyle);
    };

    // Initialize mobile optimizations - order matters for performance
    injectCriticalCSS(); // First: critical styles
    addMobileResourceHints(); // Second: DNS/preconnect
    loadWithConnectionAwareness(); // Third: images based on connection
    registerServiceWorker(); // Fourth: caching strategy

    // Mobile image lazy loading enhancement
    const setupMobileLazyLoading = () => {
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
              }
            }
          });
        }, {
          rootMargin: '50px', // Start loading before image comes into view
          threshold: 0.1
        });

        // Observe all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
          imageObserver.observe(img);
        });
      }
    };

    setTimeout(setupMobileLazyLoading, 100);

  }, [heroImage, criticalImages, criticalFonts]);

  return null; // This component doesn't render anything
}