# Mezarisim.com Project Guidelines

## Google SEO and Image Optimization

### Image Standards
* All product images must be exactly 800x600 pixels for optimal Google indexing
* Use Unsplash URLs with parameters: `?w=800&h=600&fit=crop`
* Maintain aspect ratio consistency across all product images
* Always include descriptive alt text for accessibility and SEO

### Image Optimization Rules
* Main product images: 800x600 (w=800&h=600&fit=crop&crop=center)
* Gallery images: 800x600 (w=800&h=600&fit=crop)
* Thumbnail images: Use same dimensions scaled down via CSS/Tailwind classes
* All images should be optimized for fast loading and Google Core Web Vitals

## Performance Optimization

### Core Web Vitals Standards
* **First Contentful Paint (FCP)**: Target < 1.8s (currently 3.8s - needs improvement)
* **Largest Contentful Paint (LCP)**: Target < 2.5s (currently 6.0s - needs improvement)
* **Total Blocking Time (TBT)**: ✅ 0ms (excellent)
* **Cumulative Layout Shift (CLS)**: ✅ 0 (excellent)
* **Speed Index**: Target < 3.4s (currently 4.5s - needs improvement)

### Performance Implementation Rules
* **Image Loading**: Use ImageOptimized component with lazy loading
* **Critical Resources**: Preload hero images and first 6 product images
* **Code Splitting**: Use dynamic imports for non-critical components
* **Resource Hints**: DNS prefetch for external domains (Unsplash, Google Fonts)
* **Progressive Loading**: Show skeleton loaders during content loading
* **Memory Management**: Use useMemo for expensive calculations

### Mobile Performance Rules
* **Touch Optimization**: Minimum 44px touch targets, touch-action: manipulation
* **Connection Awareness**: Adapt loading strategy based on connection speed
* **Critical Path**: Hero image preload with highest priority (fetchPriority="high")
* **Mobile Viewport**: Proper viewport meta tag with user-scalable=no
* **Service Worker**: Cache critical resources for offline performance
* **Battery Optimization**: Reduce animations on low battery devices
* **Safe Areas**: Handle iPhone notch and safe areas properly
* **Font Loading**: Use font-display: swap, prevent zoom with 16px minimum
* **Haptic Feedback**: Add vibration for touch interactions where appropriate

### Component Performance Guidelines
* **Hero Section**: Priority loading for first slide image
* **Product Gallery**: Lazy load images below fold, preload first 6 items
* **Skeleton States**: Show loading placeholders instead of blank screens
* **Intersection Observer**: Use for lazy loading implementation
* **Content Visibility**: Apply to off-screen content sections

### CSS Performance
* **Critical CSS**: Inline above-the-fold styles
* **GPU Acceleration**: Use transform3d for animations
* **Font Loading**: Use font-display: swap for better FCP
* **Container Queries**: Use for responsive components when possible

## SEO and Search Engine Optimization

### Robots.txt Requirements
* **Allow All Major Content**: Main pages and product pages must be crawlable
* **Block Development Files**: Prevent crawling of .tsx, .ts, .css source files
* **Block Admin/Internal Files**: Prevent crawling of guidelines, README files
* **Sitemap Reference**: Include sitemap location when available
* **Crawl Delay**: Set reasonable crawl delay (1 second) for server protection
* **Multi-Bot Support**: Include directives for Google, Bing, Facebook, Twitter bots

### Sitemap Strategy
* **Dynamic Generation**: Use SitemapGenerator component for development
* **Page Priorities**: Homepage (1.0) > Services (0.8-0.9) > Corporate (0.5-0.6)
* **Update Frequency**: Daily for homepage, weekly for services, monthly for corporate
* **All Important Pages**: Include all service pages, campaigns, and corporate pages
* **XML Format**: Valid XML sitemap with proper namespaces and structure

### Meta Information
* **Page Titles**: Unique, descriptive titles for each page (55-60 characters)
* **Meta Descriptions**: Compelling descriptions for each page (150-160 characters)
* **Keywords**: Focus on mezar taşı, mezar modeli, mermer, granit keywords
* **Local SEO**: Include location-based keywords for regional targeting
* **Schema Markup**: Implement structured data for business information

### Technical SEO
* **URL Structure**: Clean, descriptive URLs without special characters
* **Mobile Optimization**: Responsive design for mobile-first indexing
* **Page Speed**: Maintain Google Core Web Vitals standards
* **SSL/HTTPS**: Ensure secure connections for all pages
* **Canonical URLs**: Prevent duplicate content issues

## Mezarisim-Specific Guidelines

### Brand Colors
* **Primary Teal**: #14b8a6 (teal-500)
* **Teal Variations**: teal-600 (#0d9488), teal-700 (#0f766e)
* **Background**: #ffffff (white)
* **Text**: #1a202c (gray-900)

### Typography
* **Base Font Size**: 14px (as defined in globals.css)
* **Font Family**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI)
* **Font Weights**: 400 (normal), 500 (medium), 600 (semibold)

### Mobile Optimization
* **Safe Areas**: Handle iPhone notch with mobile-safe utilities
* **Touch Targets**: Minimum 44px for all interactive elements
* **Performance**: Use mobile-optimized CSS classes from globals.css

### Admin Panel
* **Access Methods**: Ctrl+Shift+A or direct URL (#admin)
* **Security**: URL routing with secret access modal
* **File Upload**: Advanced file management system
* **Content Management**: Full CMS capabilities

### Address Information
* **Standard Format**: "Merkez Mahallesi, Ana Cadde No:41, İstanbul"
* **Consistency**: All address references use "No:41" format

### Product Codes
* **Format**: "NO:1", "NO:2", etc. (as defined in products.ts)
* **Consistency**: All product references use this numbering system