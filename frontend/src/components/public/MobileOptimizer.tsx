import { useEffect } from 'react';

interface MobileOptimizerProps {
  children: React.ReactNode;
}

export function MobileOptimizer({ children }: MobileOptimizerProps) {
  
  useEffect(() => {
    // Mobile viewport optimization
    const setMobileViewport = () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        );
      } else {
        const newViewport = document.createElement('meta');
        newViewport.name = 'viewport';
        newViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
        document.head.appendChild(newViewport);
      }
    };

    // Critical resource preconnections for mobile
    const addPreconnections = () => {
      const preconnections = [
        'https://images.unsplash.com',
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
      ];

      preconnections.forEach(url => {
        if (!document.querySelector(`link[rel="preconnect"][href="${url}"]`)) {
          const link = document.createElement('link');
          link.rel = 'preconnect';
          link.href = url;
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        }
      });
    };

    // DNS prefetch for additional resources
    const addDnsPrefetch = () => {
      const dnsPrefetchUrls = [
        'https://api.whatsapp.com',
        'https://wa.me'
      ];

      dnsPrefetchUrls.forEach(url => {
        if (!document.querySelector(`link[rel="dns-prefetch"][href="${url}"]`)) {
          const link = document.createElement('link');
          link.rel = 'dns-prefetch';
          link.href = url;
          document.head.appendChild(link);
        }
      });
    };

    // Inline critical CSS for above-the-fold content
    const injectCriticalCSS = () => {
      const criticalCSS = `
        /* Critical mobile styles */
        .hero-section { 
          contain: layout style paint;
          transform: translateZ(0);
          will-change: scroll-position;
        }
        
        .product-grid { 
          contain: layout;
          content-visibility: auto;
          contain-intrinsic-size: 0 300px;
        }
        
        /* Mobile touch optimization */
        button, a, .clickable {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
        }
        
        /* Mobile font optimization */
        body { 
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
        
        /* Mobile scroll optimization */
        * {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
        
        /* Mobile image optimization */
        img {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: optimizequality;
          content-visibility: auto;
        }
        
        /* Mobile layout containment */
        .page-section {
          contain: layout style;
        }
        
        /* Reduce mobile repaints */
        .mobile-optimized {
          backface-visibility: hidden;
          transform: translateZ(0);
          will-change: transform, opacity;
        }
        
        /* Mobile skeleton loading */
        .mobile-skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: mobile-loading 1.5s infinite;
        }
        
        @keyframes mobile-loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        /* Mobile performance classes */
        .mobile-lazy {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        .mobile-lazy.loaded {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Mobile safe areas */
        @supports (padding: max(0px)) {
          .mobile-safe {
            padding-left: max(16px, env(safe-area-inset-left));
            padding-right: max(16px, env(safe-area-inset-right));
            padding-top: max(16px, env(safe-area-inset-top));
            padding-bottom: max(16px, env(safe-area-inset-bottom));
          }
        }
      `;

      if (!document.querySelector('#critical-mobile-css')) {
        const style = document.createElement('style');
        style.id = 'critical-mobile-css';
        style.innerHTML = criticalCSS;
        document.head.appendChild(style);
      }
    };

    // Mobile-specific performance monitoring
    const setupPerformanceMonitoring = () => {
      if ('PerformanceObserver' in window) {
        // Monitor LCP for mobile
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

        // Monitor FCP for mobile
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            console.log('Mobile FCP:', fcpEntry.startTime);
          }
        });
        fcpObserver.observe({ type: 'paint', buffered: true });
      }
    };

    // Mobile battery and connection optimization
    const optimizeForMobile = () => {
      // Reduce animations on low battery
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          if (battery.level < 0.2) {
            document.documentElement.style.setProperty('--animation-duration', '0s');
          }
        });
      }

      // Adapt to connection speed
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection && connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          // Disable non-critical animations and effects
          document.documentElement.classList.add('slow-connection');
        }
      }
    };

    // Initialize all mobile optimizations
    setMobileViewport();
    addPreconnections();
    addDnsPrefetch();
    injectCriticalCSS();
    setupPerformanceMonitoring();
    optimizeForMobile();

    // Mobile-specific event optimizations
    const passiveSupported = (() => {
      let passiveSupported = false;
      try {
        const options = {
          get passive() {
            passiveSupported = true;
            return false;
          }
        };
        window.addEventListener('test', () => {}, options);
      } catch (err) {
        passiveSupported = false;
      }
      return passiveSupported;
    })();

    // Add passive listeners for better scroll performance
    if (passiveSupported) {
      document.addEventListener('touchstart', () => {}, { passive: true });
      document.addEventListener('touchmove', () => {}, { passive: true });
      document.addEventListener('scroll', () => {}, { passive: true });
    }

  }, []);

  return <div className="mobile-optimized">{children}</div>;
}