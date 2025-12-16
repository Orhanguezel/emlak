// =============================================================
// FILE: src/pages/admin/types.ts
// =============================================================

/**
 * Genel ID tipi — veriler JSON / LocalStorage kaynaklı olduğundan
 * hem string hem number id’leri destekleyelim.
 */
export type ID = string | number;

/** Aktif/Pasif durumlar için ortak union. */
export type Status = "Active" | "Inactive";

/** Sık kullanılan yardımcı tipler */
export type Nullable<T> = T | null;
export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };
export type WithTimestamps<T extends object = {}> = T & {
  createdAt?: string; // ISO
  updatedAt?: string; // ISO
};

/* ------------------------------------------------------------------
 * ÜRÜN ÖZELLİK (BASİT) — Admin ProductDialog’da kullanılan hafif şema
 * ------------------------------------------------------------------ */

export type Spec = {
  /** Örn: "200cm x 100cm x 15cm" */
  dimensions?: string;
  /** Örn: "450 kg" */
  weight?: string;
  /** Örn: "15 cm" */
  thickness?: string;
  /** Örn: "Doğal Mermer Cilalı" */
  surfaceFinish?: string;
  /** Örn: "10 Yıl Garanti" */
  warranty?: string;
  /** Örn: "1-2 Gün" */
  installationTime?: string;
};

/**
 * Admin panelde mevcut komponentlerin kullandığı “hafif” ürün tipi.
 * (TabsProducts, ProductDialog vb. ile uyumlu.)
 */
export type Product = {
  id: ID;
  title: string;
  price: string;
  description: string;
  /** Admin kategorisi (üst seviye) */
  category: string;
  /** Admin alt-kategorisi */
  subCategory: string;
  /** Geriye dönük tek görsel alanı */
  image?: string;
  /** Çoklu görseller */
  images?: string[];
  /** Durum — Büyük harf union (UI tarafında hataları engeller) */
  status: Status;
  /** Basit teknik özellikler */
  specifications?: Spec;
};

/* ------------------------------------------------------------------
 * SLIDE / KEYWORD / CAMPAIGN — Admin’de kullanılan yapılar
 * ------------------------------------------------------------------ */

export type Slide = {
  id: ID;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  order: number;
};

export type KeywordItem = {
  id: ID;
  text: string;
  images: string[];
  status: Status;
};

export type Campaign = {
  id: ID;
  title: string;
  description: string;
  images: string[];
  /** Etiket union’ı + serbest string genişlemesi */
  tag: "Kampanya" | "Hizmet" | "Duyuru" | string;
  /** Örn: "Haziran 2024" veya ISO tarih */
  date: string;
  isActive: boolean;
};

/* ------------------------------------------------------------------
 * KATEGORİ TİPLERİ
 * ------------------------------------------------------------------ */

export type Category = { value: string; label: string };
export type SubCategory = { value: string; label: string };

/* ------------------------------------------------------------------
 * EXPORT / IMPORT DUMP — Admin JSON export şeması
 * (Gelecekte sayfalar/menü/popup’lar eklendi)
 * ------------------------------------------------------------------ */

export type RootDataDump = {
  products: Product[];
  sliders: Slide[];
  keywords: KeywordItem[];
  campaigns: Campaign[];
  categories: Category[];
  subCategoriesByCategory: Record<string, SubCategory[]>;

  /** Opsiyonel modüller — seed/dump içerisinde bulunabilir */
  pages?: Page[];
  menu?: MenuItem[];
  popups?: PopupItem[];
};

/* ------------------------------------------------------------------
 * SİZİN İSTEDİĞİNİZ DETAYLI ÜRÜN ŞEMASI AİLESİ
 * (Admin’deki “Product” tipinden bağımsız isimle eklenmiştir)
 * ------------------------------------------------------------------ */

/** Teknik özelliklerin kategorileri için enum benzeri union */
export type SpecCategory = "physical" | "material" | "service" | "custom";

/** Ayrıntılı teknik özellik öğesi (sıralanabilir) */
export interface ProductSpecification {
  id: string;
  name: string;
  value: string;
  category: SpecCategory;
  order: number;
}

/**
 * Daha kapsamlı “vitrin / storefront” ürün şeması.
 * (İSTEKTEKİ İSİMLE ÇAKIŞMAMASIN diye CatalogProduct olarak eklendi.)
 * Dilerseniz ileride `export type Product = CatalogProduct;` ile tek tipe geçebilirsiniz.
 */
export interface CatalogProduct {
  id: number;
  productCode: string;
  title: string;
  price: string;

  /** Kapak görseli (zorunlu) */
  image: string;
  /** Ek görseller */
  images?: string[];

  /** Kısa açıklama (opsiyonel) */
  description?: string;

  /**
   * DEPRECATED: serbest metin specs — yerine structured `technicalSpecs` kullanın.
   * Örn: "Boyutlar: ..., Ağırlık: ..., vb."
   */
  specifications?: string;

  /** Yapılandırılmış teknik özellikler listesi */
  technicalSpecs?: ProductSpecification[];

  /** Uzun açıklama / SEO açısından zengin içerik */
  detailedDescription?: string;

  /** Kategori/alt-kategori — vitrin mantığıyla (slug/ID olabilir) */
  category: string;
  subCategory?: string;

  /** Durum — storefront akışında opsiyonel olabilir */
  status?: Status;

  /** SEO/filtreleme için etiketler */
  tags?: string[];
}

/* ------------------------------------------------------------------
 * MEZARLIK VERİSİ (CemeteryData) — saha verisi şeması
 * ------------------------------------------------------------------ */

export interface CemeteryData {
  id: string;
  name: string;
  /** Örn: "Belediye Mezarlığı", "Aile Mezarlığı" vb. */
  type: string;
  address: string;
  district: string;
  phone: string;
  fax?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  /** Sunulan hizmetler listesi (örn: "Bakım", "Temizlik", "Çiçeklendirme") */
  services: string[];
  /** Örn: "Hafta içi 09:00-17:00" */
  workingHours: string;
  description: string;
  /** Erişilebilirlik bilgisi (örn: "Engelli erişimine uygun") */
  accessibility?: string;
  /** Ulaşım bilgisi (örn: "Otobüs 34A ile ...") */
  transportation?: string;
}

/* ------------------------------------------------------------------
 * ADMIN ODAKLI ÜRÜN ŞEMASI (zaman damgaları, featured, isActive, vs.)
 * ------------------------------------------------------------------ */

export interface AdminProduct extends WithTimestamps {
  id: number;
  productCode: string;
  title: string;
  price: string;
  image: string;
  images?: string[];
  description?: string;

  /** Admin kategori akışı */
  category: string;

  /** Yayında/pasif */
  isActive: boolean;

  /** Öne çıkarılmış içerik */
  featured?: boolean;

  // Teknik Özellikler — basit alanlar (admin form’ları için pratik)
  specifications?: {
    dimensions?: string;
    weight?: string;
    thickness?: string;
    surfaceFinish?: string;
    warranty?: string;
    installationTime?: string;
  };
}

/* ------------------------------------------------------------------
 * HAKKIMIZDA SAYFASI VERİ ŞEMASI (AboutPageData)
 * ------------------------------------------------------------------ */

export interface AboutPageData {
  id: string;
  title: string;
  heroTitle: string;
  breadcrumb: string;

  mainContent: {
    title: string;
    paragraphs: string[]; // çok paragraflı zengin içerik
  };

  popularServices: {
    title: string;
    items: Array<{
      icon: string; // ikon adı ya da URL
      text: string;
      link: string; // dahili rota ya da URL
    }>;
  };

  sidebarServices: {
    title: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };

  contactInfo: {
    title: string;
    message: string;
    phone: string;
    whatsappMessage: string;
  };

  seo: {
    metaTitle: string;
    metaDescription: string;
  };
}

/* ------------------------------------------------------------------
 * SON ÇALIŞMALAR (RecentWork) — blog/portföy benzeri veri
 * ------------------------------------------------------------------ */

export interface RecentWork {
  id: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  images: string[];
  /** ISO tarih veya display string */
  date: string;
  /** Örn: "Şile / İstanbul" */
  location: string;
  /** Örn: "Afyon Mermer", "Granit" */
  material: string;
  price?: string;
  details: {
    dimensions: string;
    /** Örn: "2 gün" */
    workTime: string;
    /** Örn: ["Cilalı yüzey", "Sütun başlıkları"] */
    specialFeatures: string[];
    /** Müşteri yorumu (opsiyonel) */
    customerReview?: string;
  };
}

/* ------------------------------------------------------------------
 * SLIDE DATA (vitrin odaklı genişletilmiş)
 * ------------------------------------------------------------------ */

export type SlidePriority = "low" | "medium" | "high";

export interface SlideData {
  id: string;
  title: string;
  description: string;
  image: string;
  /** Geriye dönük uyum için alt (alt text) */
  alt?: string;

  buttonText: string;
  buttonLink: string;

  isActive: boolean;
  order: number;

  /** Öncelik — rotasyon / A/B gösterim için ipucu */
  priority?: SlidePriority;

  /** Cihaz hedefleme */
  showOnMobile?: boolean;
  showOnDesktop?: boolean;
}

/* ------------------------------------------------------------------
 * ADMİN DATA INTERFACES — İstenen ek ara yüzler
 * (Admin’de kullanılan hafif tiplerle uyumlu olacak şekilde)
 * ------------------------------------------------------------------ */

export interface SliderData {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  order: number;
}

export interface KeywordData {
  id: number;
  text: string;
  images: string[];
  status: string; // serbest bırakıldı; UI’de Status'e normalize edin
}

export interface CampaignData {
  id: string;
  title: string;
  description: string;
  images: string[];
  tag: string;
  date: string;
  isActive: boolean;
}

/* ------------------------------------------------------------------
 * SAYFA / MENÜ / POPUP ŞEMALARI — admin export’unda kullanılabilir
 * ------------------------------------------------------------------ */

/** Basit içerik sayfası (SEO destekli) */
export interface Page {
  id: ID;
  slug: string;           // "hakkimizda", "iletisim", ...
  title: string;
  content?: string;       // HTML/Markdown/RichText JSON (UI kararınız)
  sections?: any[];       // bölüm bazlı bloklar (gelecek genişleme için any)
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonical?: string;
    ogImage?: string;
  };
  isPublished?: boolean;
  publishedAt?: string;   // ISO
}

/** Çok seviyeli menü yapısı */
export interface MenuItem {
  id: ID;
  label: string;
  href?: string;
  external?: boolean;
  icon?: string;
  order?: number;
  target?: "_self" | "_blank";
  children?: MenuItem[];
  /** Görünürlük / aktiflik */
  isActive?: boolean;
}

/** Basit popup bildirimi */
export interface PopupItem {
  id: ID;
  title: string;
  body?: string;
  /** "modal" | "banner" | "toast" gibi kendi enum’unuzu tanımlayabilirsiniz */
  type?: string;
  isEnabled: boolean;
  /** Gösterim koşulları/schedule */
  schedule?: {
    startAt?: string; // ISO
    endAt?: string;   // ISO
    /** Örn: "home", "all", "product/*" gibi pattern’ler */
    routes?: string[];
  };
}

/* ------------------------------------------------------------------
 * ALIAS / DÖNÜŞÜM NOTLARI
 * ------------------------------------------------------------------ */

// İsterseniz ileride admin’deki Product yerine vitrin tarafındaki kapsamlı yapıyı
// kullanmak için şu alias’ı açabilirsiniz:
// export type Product = CatalogProduct;
