export interface RecentWork {
  id: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  images: string[];
  date: string;
  location: string;
  material: string;
  price?: string;
  details: {
    dimensions: string;
    workTime: string;
    specialFeatures: string[];
    customerReview?: string;
  };
}

export const recentWorksData: RecentWork[] = [
  {
    id: "rw-001",
    title: "Şile Mezar Yapım İşleri / Ağva mezar yapımı",
    description: "Şile Mezar Yapım / Şile Mermer Mezar Fiyatları Şile Mezar Yapım işleri / Ağva mezar yapımı / şile mezar modelleri",
    category: "Şile Mezar Yapım",
    keywords: ["şile mezar yapım", "şile mezar modelleri", "şile mezar fiyatları", "şile köy mezarlığı", "şile mermer mezar yapım", "şile-ağva mezar yapımı"],
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&h=600&fit=crop"
    ],
    date: "2024",
    location: "Şile, İstanbul",
    material: "Granit ve Mermer",
    details: {
      dimensions: "200x100 cm",
      workTime: "3 gün",
      specialFeatures: ["Özel gravür işleme", "Dayanıklı malzeme", "Profesyonel montaj"],
      customerReview: "Çok memnun kaldık, titiz çalışma için teşekkürler."
    }
  },
  {
    id: "rw-002", 
    title: "şile mezar yapım / şile mezar modelleri / şile mezar fiyatları",
    description: "şile mezar yapım / şile mezar modelleri / şile mezar fiyatları / şile köy mezarlığı / şile mermer mezar yapım / şile mermer mezar fiyatları / şile mezar modelleri",
    category: "Şile Mezar Modelleri",
    keywords: ["şile mezar yapım", "şile mezar modelleri", "şile mezar fiyatları", "şile köy mezarlığı", "şile mermer mezar yapım", "şile mermer mezar fiyatları", "şile mezar modelleri"],
    images: [
      "https://images.unsplash.com/photo-1620121684840-17e4edc4a24c?w=800&h=600&fit=crop"
    ],
    date: "2024",
    location: "Şile, İstanbul", 
    material: "Mermer",
    details: {
      dimensions: "180x90 cm",
      workTime: "2 gün",
      specialFeatures: ["Klasik tasarım", "El işçiliği", "Özel yazıt"],
    }
  },
  {
    id: "rw-003",
    title: "ucuz mezar modelleri / mezar fiyatları / İstanbul Mezar Yapım İşleri",
    description: "ucuz mezar modelleri / mezar fiyatları / İstanbul Mezar Yapım İşleri",
    category: "Uygun Fiyatlı Modeller",
    keywords: ["ucuz mezar modelleri", "mezar fiyatları", "İstanbul Mezar Yapım İşleri"],
    images: [
      "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800&h=600&fit=crop"
    ],
    date: "2024",
    location: "İstanbul",
    material: "Granit",
    price: "Uygun fiyat seçenekleri",
    details: {
      dimensions: "160x80 cm",
      workTime: "1-2 gün",
      specialFeatures: ["Ekonomik çözüm", "Kaliteli malzeme", "Hızlı teslimat"],
    }
  },
  {
    id: "rw-004",
    title: "Mezar Yapımı Fiyatları mezarisi.com'da!",
    description: "Mezar Yapımı Fiyatları mezarisi.com'da!",
    category: "Özel Tasarım",
    keywords: ["Mezar Yapımı Fiyatları", "mezarisi.com"],
    images: [
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop"
    ],
    date: "2024",
    location: "İstanbul",
    material: "Doğal Taş",
    details: {
      dimensions: "220x120 cm",
      workTime: "4-5 gün",
      specialFeatures: ["Özel tasarım", "İtalyan mermeri", "Profesyonel işçilik"],
    }
  },
  {
    id: "rw-005",
    title: "Mermer, granit, mozaik mezar modelleri ve mezar baş taşı çeşitleri",
    description: "Mermer, granit, mozaik mezar modelleri ve mezar baş taşı çeşitleri",
    category: "Karma Modeller",
    keywords: ["Mermer", "granit", "mozaik mezar modelleri", "mezar baş taşı çeşitleri"],
    images: [
      "https://images.unsplash.com/photo-1578847585232-7d95065b2df3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop"
    ],
    date: "2024",
    location: "İstanbul",
    material: "Mermer, Granit, Mozaik",
    details: {
      dimensions: "Çeşitli boyutlar",
      workTime: "3-7 gün",
      specialFeatures: ["Çok materyal seçeneği", "Mozaik süsleme", "Özel baş taşı tasarımları"],
    }
  }
];

export const getRecentWorkById = (id: string): RecentWork | undefined => {
  return recentWorksData.find(work => work.id === id);
};

export const searchRecentWorks = (keyword: string): RecentWork[] => {
  if (!keyword.trim()) return recentWorksData;
  
  const searchTerm = keyword.toLowerCase();
  return recentWorksData.filter(work => 
    work.title.toLowerCase().includes(searchTerm) ||
    work.description.toLowerCase().includes(searchTerm) ||
    work.keywords.some(k => k.toLowerCase().includes(searchTerm)) ||
    work.category.toLowerCase().includes(searchTerm)
  );
};