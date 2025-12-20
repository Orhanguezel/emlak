// =============================================================
// FILE: src/modules/properties/geocode.ts
// Simple geocoding via Nominatim (OpenStreetMap)
//
// - Fail-safe: hata fırlatmaz, null döner
// - Rate limit: Nominatim istekleri kısıtlıdır; prod’da cache önerilir
// =============================================================
export type GeocodePoint = { lat: number; lng: number };

function toNum(v: unknown): number | null {
  const n = typeof v === "string" ? Number(v) : (v as number);
  return Number.isFinite(n) ? n : null;
}

export async function geocodeAddressNominatim(q: string): Promise<GeocodePoint | null> {
  const query = (q || "").trim();
  if (!query) return null;

  try {
    const url =
      "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" + encodeURIComponent(query);

    const res = await fetch(url, {
      headers: {
        // Nominatim kuralı: geçerli bir User-Agent/Referer kullanın
        "User-Agent": "properties-module/1.0 (admin-geocode)",
        Accept: "application/json",
      },
    });

    if (!res.ok) return null;

    const data = (await res.json()) as any[];
    const first = Array.isArray(data) ? data[0] : null;
    if (!first) return null;

    const lat = toNum(first.lat);
    const lng = toNum(first.lon);

    if (lat == null || lng == null) return null;
    return { lat, lng };
  } catch {
    return null;
  }
}
