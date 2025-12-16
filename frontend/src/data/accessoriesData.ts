// FILE: src/data/accessoriesData.ts
export type AccessoryKey = "suluk" | "sutun" | "vazo" | "aksesuar";

export interface AccessoryModel {
  id: number;
  name: string;
  category: AccessoryKey;
  material: string;
  price: string;
  image: string;
  description: string;
  featured?: boolean;
  dimensions?: string;
  weight?: string;
  thickness?: string;
  finish?: string;
  warranty?: string;
  installationTime?: string;
}

export const ACCESSORY_MODELS: AccessoryModel[] = [
  {
    id: 1,
    name: "Klasik Granit Şuluk Modeli",
    category: "suluk",
    material: "Siyah Granit",
    price: "Fiyat İçin Arayınız",
    image: "https://images.unsplash.com/photo-1589894403421-1c4b0c6b3b6e?w=400&h=300&fit=crop",
    description: "Geleneksel tasarım granit şuluk modeli, dayanıklı ve estetik",
    featured: true,
    dimensions: "30cm x 15cm x 40cm",
    weight: "25 kg",
    thickness: "4 cm",
    finish: "Parlak Granit Cilalı",
    warranty: "5 Yıl Garanti",
    installationTime: "1 Gün",
  },
  {
    id: 2,
    name: "Mermer Şuluk Modeli",
    category: "suluk",
    material: "Beyaz Mermer",
    price: "Fiyat İçin Arayınız",
    image: "https://images.unsplash.com/photo-1578948856697-db91d246b7b8?w=400&h=300&fit=crop",
    description: "Beyaz mermer malzemeden üretilen zarif şuluk modeli",
    dimensions: "32cm x 16cm x 42cm",
    weight: "28 kg",
    thickness: "5 cm",
    finish: "Doğal Mermer Cilalı",
    warranty: "8 Yıl Garanti",
    installationTime: "1 Gün",
  },
  {
    id: 3,
    name: "Özel Tasarım Şuluk",
    category: "suluk",
    material: "Granit + Süsleme",
    price: "Fiyat İçin Arayınız",
    image: "https://images.unsplash.com/photo-1589894403421-1c4b0c6b3b6e?w=400&h=300&fit=crop",
    description: "Özel desenli ve süslemeli şuluk modeli",
    dimensions: "35cm x 18cm x 45cm",
    weight: "32 kg",
    thickness: "6 cm",
    finish: "Özel İşçilik Süsleme",
    warranty: "10 Yıl Garanti",
    installationTime: "2 Gün",
  },
  {
    id: 4,
    name: "Doruk Sütun Modeli",
    category: "sutun",
    material: "Beyaz Mermer",
    price: "Fiyat İçin Arayınız",
    image: "https://images.unsplash.com/photo-1578948854345-1b9b2e5f3b9c?w=400&h=300&fit=crop",
    description: "Klasik sütun tasarımı, mermer malzemeden üretilmiş",
    featured: true,
    dimensions: "20cm x 20cm x 120cm",
    weight: "85 kg",
    thickness: "20 cm",
    finish: "Klasik Mermer Cilalı",
    warranty: "15 Yıl Garanti",
    installationTime: "1-2 Gün",
  },
  {
    id: 5,
    name: "Modern Granit Sütun",
    category: "sutun",
    material: "Siyah Granit",
    price: "Fiyat İçin Arayınız",
    image: "https://images.unsplash.com/photo-1578948856894-9f5f2e5c8b2a?w=400&h=300&fit=crop",
    description: "Modern tasarım granit sütun modeli",
    dimensions: "25cm x 25cm x 140cm",
    weight: "95 kg",
    thickness: "25 cm",
    finish: "Modern Granit İşçilik",
    warranty: "12 Yıl Garanti",
    installationTime: "2 Gün",
  },
  {
    id: 6,
    name: "Süslü Sütun Modeli",
    category: "sutun",
    material: "Mermer + Süsleme",
    price: "Fiyat İçin Arayınız",
    image: "https://images.unsplash.com/photo-1578948856893-2f3e2c5b8a1b?w=400&h=300&fit=crop",
    description: "Oymalı ve süslemeli sütun modeli",
    dimensions: "22cm x 22cm x 130cm",
    weight: "90 kg",
    thickness: "22 cm",
    finish: "El İşçiliği Süsleme",
    warranty: "20 Yıl Garanti",
    installationTime: "2-3 Gün",
  },
  {
    id: 7,
    name: "Çiçek Vazo Modeli",
    category: "vazo",
    material: "Granit",
    price: "Fiyat İçin Arayınız",
    image: "https://images.unsplash.com/photo-1589894403421-1c4b0c6b3b6e?w=400&h=300&fit=crop",
    description: "Mezar için özel tasarım çiçek vazosu",
    featured: true,
    dimensions: "25cm x 25cm x 35cm",
    weight: "15 kg",
    thickness: "3 cm",
    finish: "Mat Granit Yüzey",
    warranty: "5 Yıl Garanti",
    installationTime: "1 Gün",
  },
  {
    id: 8,
    name: "Mermer Vazo Modeli",
    category: "vazo",
    material: "Beyaz Mermer",
    price: "Fiyat İçin Arayınız",
    image: "https://images.unsplash.com/photo-1578948856697-db91d246b7b8?w=400&h=300&fit=crop",
    description: "Zarif mermer vazo modeli",
    dimensions: "28cm x 28cm x 40cm",
    weight: "18 kg",
    thickness: "4 cm",
    finish: "Parlak Mermer Cilalı",
    warranty: "8 Yıl Garanti",
    installationTime: "1 Gün",
  },
  {
    id: 9,
    name: "Süslü Vazo Modeli",
    category: "vazo",
    material: "Granit + Oyma",
    price: "Fiyat İçin Arayınız",
    image: "https://images.unsplash.com/photo-1578948854345-1b9b2e5f3b9c?w=400&h=300&fit=crop",
    description: "El oyması süslemeli vazo modeli",
    dimensions: "30cm x 30cm x 45cm",
    weight: "22 kg",
    thickness: "5 cm",
    finish: "Oymalı Sanat İşçiliği",
    warranty: "10 Yıl Garanti",
    installationTime: "1-2 Gün",
  },
];

export const getAccessoryCategories = () => {
  const cats: Record<AccessoryKey, number> = { suluk: 0, sutun: 0, vazo: 0, aksesuar: 0 };
  for (const m of ACCESSORY_MODELS) cats[m.category] += 1;
  return cats;
};
