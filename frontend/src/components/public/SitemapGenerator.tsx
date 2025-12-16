interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

interface SitemapGeneratorProps {
  baseUrl?: string;
}

export function SitemapGenerator({ baseUrl = 'https://mezarisim.com' }: SitemapGeneratorProps) {
  
  const generateSitemapUrls = (): SitemapUrl[] => {
    const currentDate = new Date().toISOString();
    
    return [
      // Ana sayfa - En yüksek öncelik
      {
        loc: baseUrl,
        lastmod: currentDate,
        changefreq: 'daily',
        priority: 1.0
      },
      
      // Ana hizmet sayfaları - Yüksek öncelik
      {
        loc: `${baseUrl}/models`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: 0.9
      },
      {
        loc: `${baseUrl}/accessories`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: 0.8
      },
      {
        loc: `${baseUrl}/gardening`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: 0.8
      },
      {
        loc: `${baseUrl}/soilfilling`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: 0.8
      },
      {
        loc: `${baseUrl}/pricing`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.7
      },
      
      // Kurumsal sayfalar - Orta öncelik
      {
        loc: `${baseUrl}/about`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.6
      },
      {
        loc: `${baseUrl}/contact`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.7
      },
      {
        loc: `${baseUrl}/mission`,
        lastmod: currentDate,
        changefreq: 'yearly',
        priority: 0.5
      },
      {
        loc: `${baseUrl}/quality`,
        lastmod: currentDate,
        changefreq: 'yearly',
        priority: 0.5
      },
      {
        loc: `${baseUrl}/faq`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.6
      },
      
      // Galeri ve projeler
      {
        loc: `${baseUrl}/recentWorks`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: 0.7
      },
      {
        loc: `${baseUrl}/cemeteries`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.6
      },
      
      // Kampanya ve özel sayfalar
      {
        loc: `${baseUrl}/ramadanCampaign`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.6
      },
      {
        loc: `${baseUrl}/marbleCollection`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.6
      },
      {
        loc: `${baseUrl}/freeInspection`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.6
      },
      {
        loc: `${baseUrl}/summerCare`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.6
      },
      {
        loc: `${baseUrl}/graniteDiscount`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.6
      }
    ];
  };

  const generateXmlSitemap = (): string => {
    const urls = generateSitemapUrls();
    
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;
    
    return xmlContent;
  };

  const downloadSitemap = () => {
    const xmlContent = generateXmlSitemap();
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copySitemapToClipboard = async () => {
    const xmlContent = generateXmlSitemap();
    try {
      await navigator.clipboard.writeText(xmlContent);
      alert('Sitemap XML kopyalandı! Web sunucunuzun root dizinine sitemap.xml olarak kaydedin.');
    } catch (error) {
      console.error('Clipboard hatası:', error);
      // Fallback: textarea ile manuel kopyalama
      const textarea = document.createElement('textarea');
      textarea.value = xmlContent;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('Sitemap XML kopyalandı! Web sunucunuzun root dizinine sitemap.xml olarak kaydedin.');
    }
  };

  // Bu component genellikle development'ta kullanılır, production'da render edilmez
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="text-sm font-medium text-gray-800 mb-2">
        SEO Sitemap Generator
      </div>
      <div className="text-xs text-gray-600 mb-3">
        {generateSitemapUrls().length} sayfa bulundu
      </div>
      <div className="flex gap-2">
        <button
          onClick={copySitemapToClipboard}
          className="px-3 py-1 bg-teal-500 text-white text-xs rounded hover:bg-teal-600 transition-colors"
        >
          XML Kopyala
        </button>
        <button
          onClick={downloadSitemap}
          className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
        >
          İndir
        </button>
      </div>
    </div>
  );
}