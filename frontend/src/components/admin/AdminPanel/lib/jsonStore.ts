// Runtime'da dosya yazamayız. Bu helper:
// - İlk yükte JSON seed dosyalarını okur (import)
// - Değişiklikleri localStorage'a yazar
// - Export/Import için ham verileri döner

type JsonValue = unknown;

const KEY = {
  products: "mezarisim_products",
  sliders: "mezarisim_sliders",
  keywords: "mezarisim_keywords",
  campaigns: "mezarisim_campaigns",
} as const;

const readLS = <T>(k: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(k);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeLS = (k: string, v: JsonValue) => {
  localStorage.setItem(k, JSON.stringify(v));
};

export const jsonStore = {
  load<T>(key: keyof typeof KEY, seed: T): T {
    return readLS<T>(KEY[key], seed);
  },
  save<T>(key: keyof typeof KEY, value: T): void {
    writeLS(KEY[key], value);
  },
  dumpAll<T extends Record<string, JsonValue>>(obj: T): T {
    // sadece geri döner, exportImport.ts indirir
    return obj;
  }
};
