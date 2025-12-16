// Mezarlık verileri - İstanbul İl genelindeki mezarlıklar
export interface CemeteryData {
  id: string;
  name: string;
  type: string;
  address: string;
  district: string;
  phone: string;
  fax?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  services: string[];
  workingHours: string;
  description: string;
  accessibility?: string;
  transportation?: string;
}

export const cemeteriesData: CemeteryData[] = [
  {
    id: "mezarliklar-daire-baskanligi",
    name: "Mezarlıklar Daire Başkanlığı",
    type: "Daire Başkanlığı",
    address: "Esentepe Mah. Büyükdere Cad. No:169 Zincirlikuyu Mezarlık alanı girişi Şişli-İSTANBUL",
    district: "Şişli",
    phone: "0212 312 65 85",
    fax: "0212 211 51 31",
    coordinates: {
      lat: 41.0731,
      lng: 29.0096
    },
    services: ["Mezar Yapımı", "Mezar Bakımı", "İdari İşlemler", "Genel Koordinasyon"],
    workingHours: "08:00 - 17:00 (Hafta içi)",
    description: "İstanbul Büyükşehir Belediyesi Mezarlıklar Daire Başkanlığı ana merkezi",
    accessibility: "Engelli erişimi mevcut",
    transportation: "Metro, otobüs ulaşımı"
  },
  {
    id: "avrupa-yakasi-mudurlugu",
    name: "Avrupa Yakası Mezarlıklar Müdürlüğü",
    type: "Bölge Müdürlüğü",
    address: "Esentepe Mah. Büyükdere Cad. No:169 Zincirlikuyu Mezarlık alanı girişi Şişli-İSTANBUL",
    district: "Şişli",
    phone: "0212 312 65 86",
    fax: "0212 211 51 31",
    coordinates: {
      lat: 41.0731,
      lng: 29.0096
    },
    services: ["Mezar Tahsisi", "Defin İşlemleri", "Bakım Onarım"],
    workingHours: "08:00 - 17:00",
    description: "Avrupa yakası mezarlıklarının yönetiminden sorumlu müdürlük",
    accessibility: "Engelli erişimi mevcut",
    transportation: "Metro, otobüs ve özel araç"
  },
  {
    id: "beyoglu-bolge-yardimciligi",
    name: "Beyoğlu Bölge Müdür Yardımcılığı",
    type: "Bölge Müdür Yardımcılığı",
    address: "Esentepe Mah. Büyükdere Cad. No:169 Zincirlikuyu Mezarlık alanı girişi Şişli-İSTANBUL",
    district: "Şişli",
    phone: "0212 312 65 85",
    fax: "0212 211 51 31",
    coordinates: {
      lat: 41.0731,
      lng: 29.0096
    },
    services: ["Mezar Yapımı", "Çiçeklendirme", "Temizlik"],
    workingHours: "08:00 - 17:00",
    description: "Beyoğlu, Kağıthane, Beşiktaş, Sarıyer ve Şişli ilçelerine hizmet vermektedir.",
    accessibility: "Tam erişim",
    transportation: "Toplu taşıma ve özel araç"
  },
  {
    id: "istanbul-1-bolge-yardimciligi",
    name: "İstanbul 1. Bölge M��dür Yardımcılığı",
    type: "Bölge Müdür Yardımcılığı",
    address: "Beylerbeyi Cad. Edirnekapı İETT Garajı Yanı Edirnekapı- Fatih",
    district: "Fatih",
    phone: "0212 449 93 94",
    fax: "0212 531 18 05",
    coordinates: {
      lat: 41.0297,
      lng: 28.9436
    },
    services: ["Defin İşlemleri", "Mezar Bakımı", "İdari Hizmetler"],
    workingHours: "08:00 - 17:00",
    description: "Gaziosmanpaşa, Sultangazi, Güngören, Fatih, Bayrampaşa, Zeytinburnu, Bakırköy, Esenler ve Eyüp ilçelerine hizmet vermektedir.",
    accessibility: "Kısmi erişim",
    transportation: "Otobüs ve metro"
  },
  {
    id: "500-evler-cenaze-sefliği",
    name: "500 Evler Cenaze İşleri Şefliği",
    type: "Cenaze İşleri Şefliği",
    address: "Cevat paşa Mah. Eski Edirne Asfaltı 500 Evler Mezarlığı Girişi Bayrampaşa/ İSTANBUL",
    district: "Bayrampaşa",
    phone: "0212 538 13 46",
    fax: "0212 537 59 52",
    coordinates: {
      lat: 41.0450,
      lng: 28.8983
    },
    services: ["Cenaze İşlemleri", "Mezar Tahsisi", "Bakım"],
    workingHours: "24 Saat",
    description: "500 Evler Mezarlığı cenaze ve defin işlemleri",
    accessibility: "Tam erişim",
    transportation: "Otobüs ve özel araç"
  },
  {
    id: "anadolu-yakasi-mudurlugu",
    name: "Anadolu Yakası Mezarlıklar Müdürlüğü",
    type: "Bölge Müdürlüğü",
    address: "Nurtepe Cad. No:2 K Ahmet Mezarlığı Şakirin Camii girişi Zeynep Kamil - Üsküdar/İSTANBUL",
    district: "Üsküdar",
    phone: "0216 586 55 11",
    fax: "0216 586 56 31",
    coordinates: {
      lat: 41.0082,
      lng: 29.0359
    },
    services: ["Mezar Yapımı", "Mezar Bakımı", "İdari İşlemler", "Defin İşlemleri"],
    workingHours: "08:00 - 17:00 (Hafta içi)",
    description: "Anadolu yakası mezarlıklarının ana müdürlüğü",
    accessibility: "Engelli erişimi mevcut",
    transportation: "Metro, otobüs ulaşımı"
  },
  {
    id: "anadolu-1-bolge",
    name: "Anadolu 1. Bölge Müdür Yardımcılığı",
    type: "Bölge Müdür Yardımcılığı",
    address: "Nurtepe Cad. No:2 K Ahmet Mezarlığı Şakirin Camii girişi Zeynep Kamil - Üsküdar/İSTANBUL",
    district: "Üsküdar",
    phone: "0216 586 55 11",
    fax: "0216 586 56 31",
    coordinates: {
      lat: 41.0082,
      lng: 29.0359
    },
    services: ["Mezar Tahsisi", "Defin İşlemleri", "Bakım Onarım"],
    workingHours: "08:00 - 17:00",
    description: "Kadıköy, Üsküdar, Ümraniye ve Ataşehir İlçelerine hizmet vermektedir.",
    accessibility: "Engelli erişimi mevcut",
    transportation: "Metro, otobüs ve özel araç"
  },
  {
    id: "anadolu-2-bolge",
    name: "Anadolu 2. Bölge Müdür Yardımcılığı",
    type: "Bölge Müdür Yardımcılığı",
    address: "Gümüşpınar Mah. Atatürk Cad. No: 171/173 Soğanlık Mezarlığı karşısı Soğanlık Kartal/İSTANBUL",
    district: "Kartal",
    phone: "0216 309 90 62 – 0216 309 90 63",
    fax: "0216 452 13 65",
    coordinates: {
      lat: 40.9144,
      lng: 29.1833
    },
    services: ["Mezar Yapımı", "Çiçeklendirme", "Temizlik"],
    workingHours: "08:00 - 17:00",
    description: "Kartal, Maltepe, Pendik, Tuzla, Adalar ve Sultanbeyli İlçelerine hizmet vermektedir.",
    accessibility: "Tam erişim",
    transportation: "Toplu taşıma ve özel araç"
  },
  {
    id: "sultanbeyli-cenaze",
    name: "Sultanbeyli Cenaze İşleri Şefliği",
    type: "Cenaze İşleri Şefliği",
    address: "Abdurrahmangazi Mh. Fatih Bulvarı No:92 (F.S.M Mezarlığı içi) Sultanbeyli/İSTANBUL",
    district: "Sultanbeyli",
    phone: "0216 398 26 54 - 0216 398 26 55",
    fax: "0216 398 26 06",
    coordinates: {
      lat: 40.9642,
      lng: 29.2717
    },
    services: ["Cenaze İşlemleri", "Defin İşlemleri", "Mezar Bakımı"],
    workingHours: "24 Saat",
    description: "Sultanbeyli ilçesi cenaze ve defin işlemleri",
    accessibility: "Tam erişim",
    transportation: "Otobüs ve özel araç"
  },
  {
    id: "anadolu-3-bolge",
    name: "Anadolu 3. Bölge Müdür Yardımcılığı",
    type: "Bölge Müdür Yardımcılığı",
    address: "Merkez Mah. Köroğlu Cad. Karatağ Sok. Yeni Çekmeköy Mezarlığı Girişi Çekmeköy/İSTANBUL",
    district: "Çekmeköy",
    phone: "0216 642 84 18 - 0216 642 84 19 - 0216 642 84 20",
    fax: "0216 642 89 76",
    coordinates: {
      lat: 41.0275,
      lng: 29.2017
    },
    services: ["Defin İşlemleri", "Mezar Bakımı", "İdari Hizmetler"],
    workingHours: "08:00 - 17:00",
    description: "Çekmeköy, Sancaktepe Beykoz ve Şile İlçelerine hizmet vermektedir.",
    accessibility: "Kısmi erişim",
    transportation: "Otobüs ve metro"
  },
  {
    id: "beykoz-cenaze",
    name: "Beykoz Cenaze İşleri Şefliği",
    type: "Cenaze İşleri Şefliği",
    address: "Gümüşsuyu Cad. İSKİ Binaları 3. Kat Beykoz/İSTANBUL",
    district: "Beykoz",
    phone: "0216 331 30 25",
    fax: "0216 425 86 14",
    coordinates: {
      lat: 41.1378,
      lng: 29.0833
    },
    services: ["Cenaze İşlemleri", "Mezar Tahsisi", "Bakım"],
    workingHours: "08:00 - 17:00",
    description: "Beykoz ilçesi cenaze ve defin işlemleri",
    accessibility: "Tam erişim",
    transportation: "Otobüs ve özel araç"
  },
  {
    id: "sile-cenaze",
    name: "Şile Cenaze İşleri Şefliği",
    type: "Cenaze İşleri Şefliği",
    address: "Balibey Mahallesi Ağayankaya Cad. Esen Sk Balibey Camii Altı Balibey Mezarlığı yanı Şile / İSTANBUL",
    district: "Şile",
    phone: "0216 711 05 35",
    coordinates: {
      lat: 41.1783,
      lng: 29.6092
    },
    services: ["Cenaze İşlemleri", "Mezar Tahsisi", "Bakım"],
    workingHours: "08:00 - 17:00",
    description: "Şile ilçesi cenaze ve defin işlemleri",
    accessibility: "Kısmi erişim",
    transportation: "Otobüs ve özel araç"
  },
  {
    id: "mezarliklar-destek",
    name: "Mezarlıklar Destek Hizmetleri Müdürlüğü",
    type: "Destek Hizmetleri Müdürlüğü",
    address: "Esentepe Mah. Büy��kdere Cad. No:169 Zincirlikuyu Mezarlık Alanı Girişi -Şişli-İSTANBUL",
    district: "Şişli",
    phone: "0 212 312 65 70",
    fax: "0 212 455 43 48",
    coordinates: {
      lat: 41.0731,
      lng: 29.0096
    },
    services: ["Destek Hizmetleri", "Koordinasyon", "Lojistik"],
    workingHours: "08:00 - 17:00",
    description: "Mezarlıklar için genel destek hizmetleri koordinasyonu",
    accessibility: "Tam erişim",
    transportation: "Metro, otobüs ulaşımı"
  },
  {
    id: "arac-isletme",
    name: "Araç İşletme ve Şehirlerarası Nakil Şefliği",
    type: "Araç İşletme Şefliği",
    address: "Atatürk Cad.No:114/116 A Alibeykoy – Eyüp/İSTANBUL",
    district: "Eyüp",
    phone: "0212 449 91 46",
    coordinates: {
      lat: 41.0578,
      lng: 28.9486
    },
    services: ["Araç Tahsisi", "Nakliye", "Lojistik"],
    workingHours: "24 Saat",
    description: "Mezarlık araç filosu işletme ve şehirlerarası nakil hizmetleri",
    accessibility: "Tam erişim",
    transportation: "Otobüs ve özel araç"
  },
  {
    id: "istanbul-2-bolge",
    name: "İstanbul 2. Bölge Müdür Yardımcılığı",
    type: "Bölge Müdür Yardımcılığı",
    address: "E-5 Karayolu Küçükçekmece Stadyumu Arkası Shell Benzin İstasyonu Yanı Küçükçekmece / İSTANBUL",
    district: "Küçükçekmece",
    phone: "0212 624 41 57, 0212 449 91 11",
    fax: "0212 426 37 40",
    coordinates: {
      lat: 41.0064,
      lng: 28.7861
    },
    services: ["Mezar Yapımı", "Bakım", "İdari İşlemler"],
    workingHours: "08:00 - 17:00",
    description: "Küçükçekmece, Avcılar, Bahçelievler, Beylikdüzü, Bağcılar, Başakşehir, Esenyurt ve Büyükçekmece İlçelerine hizmet vermektedir.",
    accessibility: "Engelli erişimi mevcut",
    transportation: "Metro, otobüs ve özel araç"
  },
  {
    id: "buyukcekmece-cenaze",
    name: "Büyükçekmece Cenaze İşleri Şefliği",
    type: "Cenaze İşleri Şefliği",
    address: "Mevlana Mah. Celebi Mehmet 1 Cad. No: 2 Esenyurt / İstanbul",
    district: "Esenyurt",
    phone: "0212 886 49 32",
    fax: "0212 886 61 04",
    coordinates: {
      lat: 41.0264,
      lng: 28.6742
    },
    services: ["Cenaze İşlemleri", "Defin İşlemleri", "Mezar Bakımı"],
    workingHours: "24 Saat",
    description: "Büyükçekmece cenaze ve defin işlemleri",
    accessibility: "Tam erişim",
    transportation: "Otobüs ve özel araç"
  },
  {
    id: "istanbul-3-bolge",
    name: "İstanbul 3. Bölge Müdür Yardımcılığı",
    type: "Bölge Müdür Yardımcılığı",
    address: "Anadolu Mah. Dirlik Sk. Arnavutköy Asri Mezarlığı Girişi No: 5 Arnavutköy / İstanbul",
    district: "Arnavutköy",
    phone: "0212 449 91 04",
    fax: "0212 597 23 08",
    coordinates: {
      lat: 41.1850,
      lng: 28.7342
    },
    services: ["Mezar Tahsisi", "Defin İşlemleri", "Bakım"],
    workingHours: "08:00 - 17:00",
    description: "Arnavutköy ilçesi mezarlık hizmetleri",
    accessibility: "Tam erişim",
    transportation: "Otobüs ve özel araç"
  },
  {
    id: "istanbul-4-bolge",
    name: "İstanbul 4. Bölge Müdür Yardımcılığı",
    type: "Bölge Müdür Yardımcılığı",
    address: "Alipaşa Mh. Kültür Sk. Silivri Yeni Mezarlığı Girişi No: 95 Silivri/İSTANBUL",
    district: "Silivri",
    phone: "0212 449 91 51",
    fax: "0212 728 64 06",
    coordinates: {
      lat: 41.0747,
      lng: 28.2531
    },
    services: ["Mezar Yapımı", "Bakım", "İdari İşlemler"],
    workingHours: "08:00 - 17:00",
    description: "Silivri ve Çatalca İlçelerine hizmet vermektedir.",
    accessibility: "Tam erişim",
    transportation: "Otobüs ve özel araç"
  },
  {
    id: "catalca-cenaze",
    name: "Çatalca Cenaze İşleri Şefliği",
    type: "Cenaze İşleri Şefliği",
    address: "Kaleici Mh. Şair Necmettin Halil Onan Bulvarı, Mezlum Saylan Sk. No:30 Çatalca/İSTANBUL",
    district: "Çatalca",
    phone: "0212 789 54 95",
    fax: "0212 789 46 18",
    coordinates: {
      lat: 41.1414,
      lng: 28.4664
    },
    services: ["Cenaze İşlemleri", "Mezar Tahsisi", "Bakım"],
    workingHours: "08:00 - 17:00",
    description: "Çatalca ilçesi cenaze ve defin işlemleri",
    accessibility: "Kısmi erişim",
    transportation: "Otobüs ve özel araç"
  }
];

export const getCemeteryById = (id: string): CemeteryData | undefined => {
  return cemeteriesData.find(cemetery => cemetery.id === id);
};

export const getCemeteriesByDistrict = (district: string): CemeteryData[] => {
  return cemeteriesData.filter(cemetery => 
    cemetery.district.toLowerCase().includes(district.toLowerCase())
  );
};

export const getAllDistricts = (): string[] => {
  return [...new Set(cemeteriesData.map(cemetery => cemetery.district))];
};