// Sayfa içeriklerini yönetmek için merkezi veri dosyası

export interface AboutPageData {
  id: string;
  title: string;
  heroTitle: string;
  breadcrumb: string;
  mainContent: {
    title: string;
    paragraphs: string[];
  };
  popularServices: {
    title: string;
    items: Array<{
      icon: string;
      text: string;
      link: string;
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

// Default About Page Content
export let aboutPageData: AboutPageData = {
  id: "about",
  title: "Hakkımızda",
  heroTitle: "HAKKIMIZDA",
  breadcrumb: "Anasayfa > Hakkımızda",
  mainContent: {
    title: "HAKKIMIZDA",
    paragraphs: [
      "<strong>İstanbul'un en deneyimli mezar yapım firması</strong> olarak <strong>25 yılı aşkın süredir mezar inşaatı, mezar taşı yapımı, mermer mezar modelleri ve mezar bakım hizmetleri</strong> sunmaktayız. <em>Kaliteli malzeme, uygun fiyat</em> ve <em>profesyonel işçilik</em> garantisi ile sektörde güvenilir bir isim haline geldik.",
      "<strong>Mezar yapım�� konusunda uzman ekibimiz</strong>, tek kişilik mezar, iki kişilik mezar, aile mezarı ve özel tasarım mezar modelleri olmak üzere <em>her türlü mezar yapım işlerini</em> gerçekleştirmektedir. <strong>Granit mezar taşı, mermer mezar taşı, traverten mezar</strong> ve modern mezar tasarımları ile sevdiklerinizin anısını en güzel şekilde yaşatıyoruz.",
      "<strong>İstanbul'daki tüm mezarlıklarda hizmet veren firmamız</strong> - Karaca Ahmet, Zincirlikuyu, Eyüp Sultan, Edirnekapı, Kilyos, Şile mezarlıkları başta olmak üzere - <em>İstanbul Büyükşehir Belediyesi standartlarına uygun</em> mezar yapımı yapmaktadır. <strong>Mezar fiyatları</strong> konusunda şeffaf ve uygun fiyat politikamız ile müşteri memnuniyetini önceliğimiz haline getirdik.",
      "<strong>Mezar onarımı, mezar restorasyonu, mezar çiçeklendirme</strong> ve <strong>mezar toprak doldurumu</strong> hizmetlerimizle kapsamlı çözümler sunuyoruz. Modern teknoloji ve geleneksel el işçiliğini birleştirerek <em>dayanıklı ve estetik mezar yapımı</em> garantisi veriyoruz. <strong>Ücretsiz keşif, proje çizimi ve fiyat teklifi</strong> ile müşterilerimize en iyi hizmeti sunmaya devam ediyoruz.",
      "<strong>7/24 mezar yapım hizmeti</strong> veren firmamız, acil durumlarda bile <em>hızlı ve kaliteli çözümler</em> üretmektedir. <strong>Garantili mezar yapımı, uygun taksit imkânları</strong> ve <strong>ücretsiz nakliye hizmeti</strong> ile İstanbul'da mezar yapımı konusunda en güvenilir adres olmayı sürdürüyoruz."
    ]
  },
  popularServices: {
    title: "Popüler Mezar Yapım Hizmetlerimiz",
    items: [
      { icon: "🏛️", text: "Mermer Mezar Modelleri", link: "models" },
      { icon: "💰", text: "İstanbul Mezar Fiyatları", link: "pricing" },
      { icon: "🏗️", text: "Granit Mezar Taşı", link: "models" },
      { icon: "👫", text: "İki Kişilik Mezar Yapımı", link: "pricing" },
      { icon: "👤", text: "Tek Kişilik Mezar Fiyatı", link: "pricing" },
      { icon: "🎨", text: "Modern Mezar Tasarımı", link: "models" },
      { icon: "🌸", text: "Mezar Çiçeklendirme", link: "gardening" },
      { icon: "🚚", text: "Mezar Toprak Doldurumu", link: "soilfilling" },
      { icon: "🏺", text: "Mezar Aksesuarları", link: "accessories" }
    ]
  },
  sidebarServices: {
    title: "Uzman Mezar Yapım Hizmetlerimiz",
    items: [
      { title: "Mezar İnşaatı", description: "Kaliteli malzeme garantisi" },
      { title: "Mermer & Granit Mezar Taşı", description: "Özel tasarım" },
      { title: "Mezar Onarımı", description: "Restorasyon hizmeti" },
      { title: "Mezar Bakımı", description: "Düzenli temizlik" },
      { title: "Mezar Çiçeklendirme", description: "Peyzaj düzenleme" },
      { title: "Toprak Doldurumu", description: "Çöküntü tamiri" }
    ]
  },
  contactInfo: {
    title: "İletişim Bilgileri",
    message: "📞 İstanbul mezar yapımı için hemen arayın!",
    phone: "0533 483 89 71",
    whatsappMessage: "Merhaba, mezar yapımı hakkında bilgi almak istiyorum."
  },
  seo: {
    metaTitle: "Hakkımızda - Mezarisim.com | İstanbul'un En Deneyimli Mezar Yapım Firması",
    metaDescription: "25 yıllık deneyimimizle İstanbul'da mezar yapımı, mezar taşı, mermer ve granit mezar modelleri. Kaliteli malzeme, uygun fiyat, profesyonel işçilik garantisi."
  }
};

// About page content'i güncelleme fonksiyonu
export function updateAboutPageData(newData: Partial<AboutPageData>) {
  aboutPageData = { ...aboutPageData, ...newData };
}

// About page data'sını getirme fonksiyonu  
export function getAboutPageData(): AboutPageData {
  return aboutPageData;
}

// Belirli bir bölümü güncelleme fonksiyonları
export function updateMainContent(title: string, paragraphs: string[]) {
  aboutPageData.mainContent = { title, paragraphs };
}

export function updatePopularServices(title: string, items: AboutPageData['popularServices']['items']) {
  aboutPageData.popularServices = { title, items };
}

export function updateSidebarServices(title: string, items: AboutPageData['sidebarServices']['items']) {
  aboutPageData.sidebarServices = { title, items };
}

export function updateContactInfo(contactData: AboutPageData['contactInfo']) {
  aboutPageData.contactInfo = contactData;
}

export function updateSeoInfo(seo: AboutPageData['seo']) {
  aboutPageData.seo = seo;
}

export function updateHeroSection(heroTitle: string, breadcrumb: string) {
  aboutPageData.heroTitle = heroTitle;
  aboutPageData.breadcrumb = breadcrumb;
}

// Mission Vision Page Data Structure
export interface MissionVisionPageData {
  id: string;
  title: string;
  heroTitle: string;
  breadcrumb: string;
  subtitle: string;
  mission: {
    title: string;
    icon: string;
    backgroundColor: string;
    textColor: string;
    paragraphs: string[];
  };
  vision: {
    title: string;
    icon: string;
    backgroundColor: string;
    textColor: string;
    paragraphs: string[];
  };
  valueCards: Array<{
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    backgroundColor: string;
    textColor: string;
  }>;
  coreValues: {
    title: string;
    icon: string;
    items: Array<{
      title: string;
      description: string;
      color: string;
    }>;
  };
  expertiseBoxes: Array<{
    title: string;
    icon: string;
    borderColor: string;
    textColor: string;
    items: Array<{
      text: string;
      highlight: string;
    }>;
  }>;
  contactCTA: {
    title: string;
    subtitle: string;
    icon: string;
    backgroundColor: string;
    phone: string;
    whatsappMessage: string;
    buttons: Array<{
      text: string;
      icon: string;
      backgroundColor: string;
      textColor: string;
      link: string;
    }>;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
}

// Default Mission Vision Page Content
export let missionVisionPageData: MissionVisionPageData = {
  id: "mission-vision",
  title: "Misyonumuz - Vizyonumuz",
  heroTitle: "MİSYONUMUZ - VİZYONUMUZ",
  breadcrumb: "Anasayfa > Misyonumuz - Vizyonumuz",
  subtitle: "İstanbul'da mezar yapımı konusunda 25 yıllık deneyimimizle, sevdiklerinizin anısını ebedileştirme misyonu taşıyoruz",
  mission: {
    title: "Misyonumuz",
    icon: "🎯",
    backgroundColor: "from-teal-50 to-teal-100",
    textColor: "text-teal-700",
    paragraphs: [
      "<strong>İstanbul'da mezar yapımı sektöründe</strong> müşteri memnuniyetini en üst seviyede tutarak, <em>kaliteli mezar inşaatı, mezar taşı yapımı ve mezar bakım hizmetleri</em> sunmak temel misyonumuzdur. <strong>Mermer mezar, granit mezar taşı, traverten mezar</strong> ve modern mezar tasarımları ile sevdiklerinizin anısını en değerli şekilde yaşatıyoruz.",
      "<strong>Uygun fiyat, yüksek kalite ve profesyonel işçilik</strong> ilkeleriyle hareket ederek, <em>tek kişilik mezar, iki kişilik mezar, aile mezarı</em> ve özel tasarım mezar projelerinde <strong>İstanbul Büyükşehir Belediyesi standartlarına uygun</strong> çalışmalar gerçekleştiriyoruz. Her mezar yapımında <em>dayanıklılık, estetik ve mükemmellik</em> hedefliyoruz.",
      "<strong>7/24 mezar yapım hizmeti, ücretsiz keşif, garantili işçilik</strong> ve müşteri odaklı yaklaşımımızla İstanbul'daki tüm mezarlıklarda - <em>Karaca Ahmet, Zincirlikuyu, Eyüp Sultan, Edirnekapı</em> - güvenilir çözümler üretmek amacımızdır."
    ]
  },
  vision: {
    title: "Vizyonumuz",
    icon: "🌟",
    backgroundColor: "from-blue-50 to-blue-100",
    textColor: "text-blue-700",
    paragraphs: [
      "<strong>2030 yılına kadar İstanbul'da mezar yapımı konusunda lider firma</strong> olmak ve <em>Türkiye genelinde en güvenilir mezar inşaat şirketi</em> unvanını kazanmak vizyonumuzdur. <strong>Modern teknoloji, geleneksel el işçiliği ve yenilikçi tasarım</strong> anlayışını birleştirerek sektörde çığır açan projeler hayata geçirmeyi hedefliyoruz.",
      "<strong>Çevre dostu mezar yapımı, sürdürülebilir malzeme kullanımı</strong> ve <em>dijital mezar takip sistemi</em> ile gelecek nesillere örnek olacak bir hizmet modeli oluşturmayı amaçlıyoruz. <strong>Mezar fiyatlarında şeffaflık, ödeme kolaylığı</strong> ve <em>müşteri memnuniyet garantisi</em> ile sektörde yeni standartlar belirlemeyi hedefliyoruz.",
      "<strong>Mezar onarımı, mezar restorasyonu, mezar çiçeklendirme</strong> ve <strong>mezar toprak doldurumu</strong> alanlarında da uzmanlaşarak, <em>komple mezar hizmet çözümleri</em> sunan tek adres olmayı vizyonumuz olarak benimsedik. <strong>Kalite, güven ve mükemmellik</strong> değerlerimizle İstanbul'da mezar yapımının vazgeçilmez markası olmayı sürdüreceğiz."
    ]
  },
  valueCards: [
    {
      id: "quality",
      title: "KALİTELİ",
      subtitle: "A+ Malzeme",
      icon: "🏆",
      backgroundColor: "from-red-500 to-red-600",
      textColor: "text-white"
    },
    {
      id: "safe",
      title: "GÜVENLİ",
      subtitle: "5 Yıl Garanti",
      icon: "🛡️",
      backgroundColor: "from-orange-400 to-orange-500",
      textColor: "text-white"
    },
    {
      id: "fast",
      title: "HIZLI",
      subtitle: "7/24 Hizmet",
      icon: "⚡",
      backgroundColor: "from-blue-500 to-blue-600",
      textColor: "text-white"
    },
    {
      id: "affordable",
      title: "UYGUN",
      subtitle: "En İyi Fiyat",
      icon: "💰",
      backgroundColor: "from-green-500 to-green-600",
      textColor: "text-white"
    }
  ],
  coreValues: {
    title: "Temel Değerlerimiz",
    icon: "✨",
    items: [
      {
        title: "Kaliteli malzeme",
        description: "ve profesyonel işçilik",
        color: "from-red-500 to-red-600"
      },
      {
        title: "Güvenilir hizmet",
        description: "ve zamanında teslimat",
        color: "from-orange-400 to-orange-500"
      },
      {
        title: "7/24 destek",
        description: "ve acil çözümler",
        color: "from-blue-500 to-blue-600"
      },
      {
        title: "Uygun fiyat",
        description: "ve şeffaf fiyat politikası",
        color: "from-green-500 to-green-600"
      },
      {
        title: "Müşteri memnuniyeti",
        description: "ve güven",
        color: "from-purple-500 to-purple-600"
      }
    ]
  },
  expertiseBoxes: [
    {
      title: "🏗️ Mezar Yapım Uzmanlığımız",
      icon: "🏗️",
      borderColor: "border-teal-500",
      textColor: "text-teal-600",
      items: [
        { text: "mezar inşaat deneyimi", highlight: "25+ yıl" },
        { text: "mezar projesi", highlight: "1000+ başarılı" },
        { text: "tüm mezarlıklarda hizmet", highlight: "İBB onaylı" },
        { text: "mezar yapım hizmeti", highlight: "7/24 acil" }
      ]
    },
    {
      title: "💎 Kalite Garantilerimiz",
      icon: "💎",
      borderColor: "border-blue-500",
      textColor: "text-blue-600",
      items: [
        { text: "mermer ve granit", highlight: "A+ kalite" },
        { text: "tüm işçilik", highlight: "5 yıl garanti" },
        { text: "ve proje çizimi", highlight: "Ücretsiz keşif" },
        { text: "imkânları", highlight: "Uygun taksit" }
      ]
    }
  ],
  contactCTA: {
    title: "Ücretsiz Keşif Hizmeti",
    subtitle: "Mezar projeleriniz için profesyonel keşif ve fiyat teklifi alın",
    icon: "📞",
    backgroundColor: "from-teal-500 to-teal-600",
    phone: "0533 483 89 71",
    whatsappMessage: "Merhaba, mezar yapımı konusunda ücretsiz keşif hizmeti almak istiyorum.",
    buttons: [
      {
        text: "0533 483 89 71",
        icon: "📞",
        backgroundColor: "bg-white",
        textColor: "text-teal-600",
        link: "tel"
      },
      {
        text: "WhatsApp'tan Yazın",
        icon: "💬",
        backgroundColor: "bg-green-500 hover:bg-green-600",
        textColor: "text-white",
        link: "whatsapp"
      },
      {
        text: "Detaylı İletişim",
        icon: "📧",
        backgroundColor: "bg-blue-500 hover:bg-blue-600",
        textColor: "text-white",
        link: "contact"
      }
    ]
  },
  seo: {
    metaTitle: "Misyonumuz ve Vizyonumuz - Mezarisim.com | İstanbul Mezar Yapımı",
    metaDescription: "25 yıllık deneyimimizle İstanbul'da mezar yapımı misyonumuz ve 2030 lider firma olma vizyonumuz. Kaliteli malzeme, profesyonel işçilik, 7/24 hizmet."
  }
};

// Mission Vision page content'i güncelleme fonksiyonları
export function updateMissionVisionPageData(newData: Partial<MissionVisionPageData>) {
  missionVisionPageData = { ...missionVisionPageData, ...newData };
}

export function getMissionVisionPageData(): MissionVisionPageData {
  return missionVisionPageData;
}

// Info Cards Data Structure
export interface InfoCardData {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconType: 'emoji' | 'lucide';
  lucideIcon?: string;
  link: string;
  bgColor: string;
  hoverColor: string;
  iconColor: string;
  textColor: string;
  borderColor: string;
  isActive: boolean;
  order: number;
}

// Default Info Cards Content
export let infoCardsData: InfoCardData[] = [
  {
    id: "faq-questions",
    title: "Mezar Yapımı Konusunda Sıkça Sorulan Sorular",
    description: "Mezar inşaatı, fiyatlar, malzemeler ve süreçler hakkında sık sorulan sorular",
    icon: "❓",
    iconType: "emoji",
    link: "faq",
    bgColor: "bg-teal-50",
    hoverColor: "hover:bg-teal-100",
    iconColor: "text-teal-600",
    textColor: "text-teal-700",
    borderColor: "border-teal-200",
    isActive: true,
    order: 1
  },
  {
    id: "istanbul-cemeteries",
    title: "İstanbul İl Genelinde Bulunan Mezarlıklar",
    description: "İstanbul'daki tüm mezarlıkların listesi ve bölge bilgileri",
    icon: "🗂️",
    iconType: "emoji", 
    link: "cemeteries",
    bgColor: "bg-teal-50",
    hoverColor: "hover:bg-teal-100",
    iconColor: "text-teal-600",
    textColor: "text-teal-700",
    borderColor: "border-teal-200",
    isActive: true,
    order: 2
  },
  {
    id: "cemetery-contacts",
    title: "Mezarlık Müdürlükleri Adres ve Telefon Bilgileri",
    description: "14 mezarlık müdürlüğünün detaylı adres ve iletişim bilgileri",
    icon: "📞",
    iconType: "emoji",
    link: "cemeteries",
    bgColor: "bg-teal-50",
    hoverColor: "hover:bg-teal-100", 
    iconColor: "text-teal-600",
    textColor: "text-teal-700",
    borderColor: "border-teal-200",
    isActive: true,
    order: 3
  }
];

// Info Cards yönetim fonksiyonları
export function updateInfoCardsData(newData: InfoCardData[]) {
  infoCardsData = newData.sort((a, b) => a.order - b.order);
}

export function getInfoCardsData(): InfoCardData[] {
  return infoCardsData.filter(card => card.isActive).sort((a, b) => a.order - b.order);
}

export function getAllInfoCardsData(): InfoCardData[] {
  return infoCardsData.sort((a, b) => a.order - b.order);
}

export function updateInfoCard(id: string, updatedCard: Partial<InfoCardData>) {
  const index = infoCardsData.findIndex(card => card.id === id);
  if (index !== -1) {
    infoCardsData[index] = { ...infoCardsData[index], ...updatedCard };
  }
}

export function addInfoCard(cardData: Omit<InfoCardData, 'id' | 'order'>) {
  const newCard: InfoCardData = {
    ...cardData,
    id: `card-${Date.now()}`,
    order: Math.max(...infoCardsData.map(c => c.order), 0) + 1
  };
  infoCardsData.push(newCard);
  return newCard;
}

export function deleteInfoCard(id: string) {
  infoCardsData = infoCardsData.filter(card => card.id !== id);
}

export function reorderInfoCards(cardIds: string[]) {
  cardIds.forEach((id, index) => {
    const card = infoCardsData.find(c => c.id === id);
    if (card) {
      card.order = index + 1;
    }
  });
}

// Announcement/Campaign Data Structure
export interface AnnouncementData {
  id: string;
  title: string;
  description: string;
  content: string;
  icon: string;
  iconType: 'emoji' | 'lucide';
  lucideIcon?: string;
  link: string;
  bgColor: string;
  hoverColor: string;
  iconColor: string;
  textColor: string;
  borderColor: string;
  badgeText: string;
  badgeColor: string;
  buttonText: string;
  buttonColor: string;
  isActive: boolean;
  isPublished: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  expiresAt?: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
}

// Default Announcements/Campaigns Content
export let announcementsData: AnnouncementData[] = [
  {
    id: "ramazan-campaign",
    title: "Ramazan Kampanyası",
    description: "Ramazan ayına özel mezar yapımı ve işçilik kampanyası",
    content: `<h2>Ramazan Ayına Özel Mezar Yapımı Kampanyası</h2>
    
    <p><strong>Bu mübarek ayda</strong>, sevdiklerinizin anısını ebedileştirmek için özel fırsatlar sunuyoruz.</p>
    
    <h3>Kampanya Detayları:</h3>
    <ul>
      <li><strong>%20 indirim</strong> tüm mezar yapımı işlerinde</li>
      <li><strong>Ücretsiz keşif</strong> ve proje çizimi</li>
      <li><strong>12 aya varan taksit</strong> imkânları</li>
      <li><strong>Ücretsiz nakliye</strong> İstanbul genelinde</li>
    </ul>
    
    <h3>Kapsam:</h3>
    <ul>
      <li>Tek kişilik mezar yapımı</li>
      <li>İki kişilik mezar yapımı</li>
      <li>Aile mezarı düzenlemesi</li>
      <li>Mezar onarımı ve restorasyonu</li>
      <li>Mezar çiçeklendirme hizmetleri</li>
    </ul>
    
    <p><em>Kampanya geçerlilik tarihi: Ramazan ayı boyunca</em></p>
    
    <div class="contact-info mt-6 p-4 bg-teal-50 rounded-lg">
      <h4 class="text-teal-800 font-semibold mb-2">📞 Hemen İletişime Geçin</h4>
      <p class="text-teal-700">Telefon: <strong>0533 483 89 71</strong></p>
      <p class="text-teal-700">WhatsApp: Ramazan kampanyası hakkında bilgi almak istiyorum.</p>
    </div>`,
    icon: "🌙",
    iconType: "emoji",
    link: "ramadanCampaign",
    bgColor: "bg-amber-50",
    hoverColor: "hover:bg-amber-100",
    iconColor: "text-amber-600",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    badgeText: "Kampanya",
    badgeColor: "bg-amber-500",
    buttonText: "Kampanya Detayları",
    buttonColor: "bg-amber-600 hover:bg-amber-700",
    isActive: true,
    isPublished: true,
    order: 1,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    publishedAt: "2024-01-15",
    expiresAt: "2024-05-15",
    seo: {
      metaTitle: "Ramazan Kampanyası - %20 İndirim | Mezarisim.com",
      metaDescription: "Ramazan ayına özel mezar yapımı kampanyası. %20 indirim, ücretsiz keşif, 12 ay taksit imkânı. İstanbul mezar yapımı kampanya fırsatları."
    }
  },
  {
    id: "marble-collection",
    title: "Mermer Koleksiyonu",
    description: "Premium mermer mezar taşı koleksiyonu ve özel tasarımlar",
    content: `<h2>Premium Mermer Mezar Taşı Koleksiyonu</h2>
    
    <p><strong>Yeni koleksiyonumuz</strong> ile sevdiklerinizin anısını en değerli malzemelerle yaşatın.</p>
    
    <h3>Koleksiyon Özellikleri:</h3>
    <ul>
      <li><strong>Afyon beyaz mermeri</strong> - Birinci sınıf doğal taş</li>
      <li><strong>Carrara mermeri</strong> - İtalyan premium kalite</li>
      <li><strong>Thassos mermeri</strong> - Yunan beyaz mermeri</li>
      <li><strong>Özel tasarım</strong> mezar modelleri</li>
    </ul>
    
    <h3>Teknik Özellikler:</h3>
    <ul>
      <li>Yüksek dayanıklılık - 50+ yıl ömür</li>
      <li>Don ve hava koşullarına dirençli</li>
      <li>Profesyonel cilalama işlemi</li>
      <li>Özel oyma ve yazı işleri</li>
    </ul>
    
    <h3>Hizmet Garantileri:</h3>
    <ul>
      <li><strong>10 yıl</strong> işçilik garantisi</li>
      <li><strong>Ücretsiz</strong> keşif ve proje</li>
      <li><strong>Profesyonel</strong> montaj hizmeti</li>
      <li><strong>Satış sonrası</strong> bakım desteği</li>
    </ul>
    
    <div class="contact-info mt-6 p-4 bg-blue-50 rounded-lg">
      <h4 class="text-blue-800 font-semibold mb-2">💎 Koleksiyonu İnceleyin</h4>
      <p class="text-blue-700">Showroom ziyareti için randevu alın</p>
      <p class="text-blue-700">Telefon: <strong>0533 483 89 71</strong></p>
    </div>`,
    icon: "🏛️",
    iconType: "emoji",
    link: "marbleCollection",
    bgColor: "bg-blue-50",
    hoverColor: "hover:bg-blue-100",
    iconColor: "text-blue-600",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    badgeText: "Koleksiyon",
    badgeColor: "bg-blue-500",
    buttonText: "Koleksiyonu İncele",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    isActive: true,
    isPublished: true,
    order: 2,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-20",
    publishedAt: "2024-01-10",
    seo: {
      metaTitle: "Premium Mermer Koleksiyonu | Afyon, Carrara, Thassos Mermer",
      metaDescription: "Premium mermer mezar taşı koleksiyonu. Afyon beyaz, Carrara, Thassos mermeri. 10 yıl garanti, özel tasarım, profesyonel montaj hizmeti."
    }
  },
  {
    id: "free-inspection",
    title: "Ücretsiz Keşif",
    description: "Ücretsiz mezar keşif hizmeti ve fiyat teklifi almak",
    content: `<h2>Ücretsiz Mezar Keşif Hizmeti</h2>
    
    <p><strong>Mezar yapımı</strong> öncesinde profesyonel keşif hizmeti ile doğru planlama yapın.</p>
    
    <h3>Keşif Hizmeti Kapsamı:</h3>
    <ul>
      <li><strong>Mezarlık alanı</strong> ölçüm ve değerlendirme</li>
      <li><strong>Zemin analizi</strong> ve uygunluk tespiti</li>
      <li><strong>3D tasarım</strong> ve görselleştirme</li>
      <li><strong>Detaylı proje</strong> çizimi</li>
    </ul>
    
    <h3>Fiyat Teklifi İçeriği:</h3>
    <ul>
      <li>Malzeme maliyetleri detayı</li>
      <li>İşçilik ücretleri</li>
      <li>Nakliye ve montaj masrafları</li>
      <li>Toplam proje bedeli</li>
    </ul>
    
    <h3>Avantajlar:</h3>
    <ul>
      <li><strong>%100 ücretsiz</strong> keşif hizmeti</li>
      <li><strong>Bağlayıcı olmayan</strong> fiyat teklifi</li>
      <li><strong>24 saat içinde</strong> sonuç</li>
      <li><strong>Profesyonel</strong> değerlendirme</li>
    </ul>
    
    <h3>Randevu Alma:</h3>
    <p>Keşif randevusu için aşağıdaki bilgileri belirtin:</p>
    <ul>
      <li>Mezarlık adı ve bölümü</li>
      <li>Mezar numarası (varsa)</li>
      <li>İletişim bilgileriniz</li>
      <li>Uygun randevu saatleri</li>
    </ul>
    
    <div class="contact-info mt-6 p-4 bg-green-50 rounded-lg">
      <h4 class="text-green-800 font-semibold mb-2">🔍 Ücretsiz Keşif Randevusu</h4>
      <p class="text-green-700">Hemen arayın, randevunuzu alın</p>
      <p class="text-green-700">Telefon: <strong>0533 483 89 71</strong></p>
      <p class="text-green-700">WhatsApp: Ücretsiz keşif randevusu almak istiyorum.</p>
    </div>`,
    icon: "🔍",
    iconType: "emoji",
    link: "freeInspection",
    bgColor: "bg-green-50",
    hoverColor: "hover:bg-green-100",
    iconColor: "text-green-600",
    textColor: "text-green-700",
    borderColor: "border-green-200",
    badgeText: "Hizmet",
    badgeColor: "bg-green-500",
    buttonText: "Keşif Talep Et",
    buttonColor: "bg-green-600 hover:bg-green-700",
    isActive: true,
    isPublished: true,
    order: 3,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-25",
    publishedAt: "2024-01-05",
    seo: {
      metaTitle: "Ücretsiz Mezar Keşif Hizmeti | İstanbul Mezar Yapımı",
      metaDescription: "Ücretsiz mezar keşif hizmeti. Ölçüm, zemin analizi, 3D tasarım, detaylı proje çizimi. 24 saat içinde sonuç, bağlayıcı olmayan fiyat teklifi."
    }
  }
];

// Announcements/Campaigns yönetim fonksiyonları
export function updateAnnouncementsData(newData: AnnouncementData[]) {
  announcementsData = newData.sort((a, b) => a.order - b.order);
}

export function getAnnouncementsData(): AnnouncementData[] {
  return announcementsData.filter(announcement => announcement.isActive && announcement.isPublished).sort((a, b) => a.order - b.order);
}

export function getAllAnnouncementsData(): AnnouncementData[] {
  return announcementsData.sort((a, b) => a.order - b.order);
}

export function getAnnouncementById(id: string): AnnouncementData | undefined {
  return announcementsData.find(announcement => announcement.id === id);
}

export function updateAnnouncement(id: string, updatedAnnouncement: Partial<AnnouncementData>) {
  const index = announcementsData.findIndex(announcement => announcement.id === id);
  if (index !== -1) {
    announcementsData[index] = { 
      ...announcementsData[index], 
      ...updatedAnnouncement,
      updatedAt: new Date().toISOString().split('T')[0]
    };
  }
}

export function addAnnouncement(announcementData: Omit<AnnouncementData, 'id' | 'order' | 'createdAt' | 'updatedAt'>) {
  const newAnnouncement: AnnouncementData = {
    ...announcementData,
    id: `announcement-${Date.now()}`,
    order: Math.max(...announcementsData.map(a => a.order), 0) + 1,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  };
  announcementsData.push(newAnnouncement);
  return newAnnouncement;
}

export function deleteAnnouncement(id: string) {
  announcementsData = announcementsData.filter(announcement => announcement.id !== id);
}

export function reorderAnnouncements(announcementIds: string[]) {
  announcementIds.forEach((id, index) => {
    const announcement = announcementsData.find(a => a.id === id);
    if (announcement) {
      announcement.order = index + 1;
    }
  });
}

// Simple Campaign Data Structure  
export interface SimpleCampaignData {
  id: string;
  title: string;
  description: string;
  images: string[];
  seoKeywords: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
}

// Default Simple Campaigns Content
export let simpleCampaignsData: SimpleCampaignData[] = [
  {
    id: "summer-maintenance",
    title: "Yazlık Mezar Bakım Kampanyası",
    description: "Yaz aylarında mezarlarınızın bakımı için özel indirimli paketlerimizden faydalanın!",
    images: [
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=200&h=200&fit=crop", 
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1606761503207-8b1ff1e11610?w=200&h=200&fit=crop"
    ],
    seoKeywords: [
      "yazlık mezar bakımı",
      "mezar temizlik hizmeti", 
      "yaz bakım kampanyası",
      "mezar onarımı",
      "istanbul mezar bakımı",
      "mezar restorasyon",
      "mezar çiçeklendirme",
      "mezar toprak doldurumu",
      "profesyonel mezar bakımı"
    ],
    isActive: true,
    createdAt: "2024-06-01",
    updatedAt: "2024-06-01",
    seo: {
      metaTitle: "Yazlık Mezar Bakım Kampanyası - Mezarisim.com",
      metaDescription: "Yaz aylarında mezarlarınızın bakımı için özel indirimli paketler. Mezar temizlik, onarım, çiçeklendirme hizmetleri."
    }
  },
  {
    id: "marble-discount",
    title: "Mermer Mezar Taşları %25 İndirim",
    description: "Kaliteli mermer mezar taşlarında özel indirim fırsatı! Sınırlı süreyle geçerli.",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=200&h=200&fit=crop"
    ],
    seoKeywords: [
      "mermer mezar taşı",
      "mermer indirim",
      "doğal mermer mezar",
      "kaliteli mermer taşı",
      "mermer mezar modelleri",
      "istanbul mermer mezar",
      "mermer taş işçiliği",
      "özel mermer tasarım",
      "mermer mezar fiyatları"
    ],
    isActive: true,
    createdAt: "2024-05-01",
    updatedAt: "2024-05-01",
    seo: {
      metaTitle: "Mermer Mezar Taşları %25 İndirim - Mezarisim.com",
      metaDescription: "Kaliteli mermer mezar taşlarında özel indirim fırsatı. Doğal mermer, profesyonel işçilik, sınırlı süreyle geçerli."
    }
  },
  {
    id: "family-tomb-package",
    title: "Aile Mezarı Özel Paket Kampanyası",
    description: "Aile mezarları için komplet çözüm paketi! İnşaat, taş işçiliği ve peyzaj dahil.",
    images: [
      "https://images.unsplash.com/photo-1606761503207-8b1ff1e11610?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=200&h=200&fit=crop"
    ],
    seoKeywords: [
      "aile mezarı",
      "büyük mezar yapımı",
      "çoklu mezar inşaatı", 
      "aile mezar modelleri",
      "geniş mezar tasarımı",
      "istanbul aile mezarı",
      "mezar kompleksi",
      "büyük mezar taşı",
      "aile mezar fiyatları"
    ],
    isActive: true,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
    seo: {
      metaTitle: "Aile Mezarı Özel Paket Kampanyası - Mezarisim.com",
      metaDescription: "Aile mezarları için komplet çözüm paketi. İnşaat, taş işçiliği ve peyzaj hizmetleri dahil. Özel paket fırsatı."
    }
  }
];

// Simple Campaigns yönetim fonksiyonları
export function getAllSimpleCampaignsData(): SimpleCampaignData[] {
  return simpleCampaignsData.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getSimpleCampaignById(id: string): SimpleCampaignData | undefined {
  return simpleCampaignsData.find(campaign => campaign.id === id);
}

export function updateSimpleCampaign(id: string, updatedCampaign: Partial<SimpleCampaignData>) {
  const index = simpleCampaignsData.findIndex(campaign => campaign.id === id);
  if (index !== -1) {
    simpleCampaignsData[index] = { 
      ...simpleCampaignsData[index], 
      ...updatedCampaign,
      updatedAt: new Date().toISOString().split('T')[0]
    };
  }
}

export function addSimpleCampaign(campaignData: Omit<SimpleCampaignData, 'id' | 'createdAt' | 'updatedAt'>) {
  const newCampaign: SimpleCampaignData = {
    ...campaignData,
    id: `campaign-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  };
  simpleCampaignsData.push(newCampaign);
  return newCampaign;
}

export function deleteSimpleCampaign(id: string) {
  simpleCampaignsData = simpleCampaignsData.filter(campaign => campaign.id !== id);
}