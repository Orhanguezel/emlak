"use client";

import * as React from "react";

import type {
  PropertyUpsertBody,
  PropertyPatchBody,
} from "@/integrations/rtk/endpoints/admin/properties_admin.endpoints";
import type {
  AdminProperty,
  PropertyAssetPublic,
} from "@/integrations/rtk/types/properties";

import { slugifyTr, toNum, toFloatOrNull, toIntOrNull } from "./helpers";

/** client-side stable id (DB id yoksa) */
const makeTmpId = (): string =>
  globalThis.crypto?.randomUUID?.() ??
  `tmp_${Date.now()}_${Math.random().toString(16).slice(2)}`;

export type GalleryAsset = {
  id: string; // ✅ her zaman zorunlu

  asset_id?: string | null;
  url?: string | null;
  alt?: string | null;

  kind: "image" | "video" | "plan"; // ✅ zorunlu
  mime?: string | null;

  is_cover: boolean; // ✅ zorunlu
  display_order: number; // ✅ zorunlu
};

type UploadedInput = {
  asset_id?: string | null;
  url?: string | null;
  fileName?: string; // null yok
  mime?: string | null;
};

// ------------------------------
// Helpers (TS-safe)
// ------------------------------
const normalizeKind = (v: unknown): GalleryAsset["kind"] => {
  if (v === "video" || v === "plan" || v === "image") return v;
  return "image";
};

const ensureCoverExists = (arr: GalleryAsset[]): GalleryAsset[] => {
  if (!arr.length) return arr;
  if (arr.some((x) => x.is_cover)) return arr;

  // ✅ spread yerine explicit mapping
  return arr.map((x, i) => (i === 0 ? { ...x, is_cover: true } : x));
};

const reindex = (arr: GalleryAsset[]): GalleryAsset[] =>
  arr.map((x, i) => ({ ...x, display_order: i }));

const ensureSingleCover = (arr: GalleryAsset[], coverIndex: number): GalleryAsset[] =>
  arr.map((x, i) => ({ ...x, is_cover: i === coverIndex }));

function normalizeAssets(input?: PropertyAssetPublic[] | null): GalleryAsset[] {
  const arr = Array.isArray(input) ? input : [];

  let mapped: GalleryAsset[] = arr.map((a, i) => {
    const id =
      typeof a.id === "string" && a.id.trim() ? a.id : makeTmpId();

    return {
      id,
      asset_id: (a as any).asset_id ?? null,
      url: (a as any).url ?? null,
      alt: (a as any).alt ?? null,
      kind: normalizeKind((a as any).kind),
      mime: (a as any).mime ?? null,
      is_cover: !!(a as any).is_cover,
      display_order:
        typeof (a as any).display_order === "number"
          ? (a as any).display_order
          : i,
    };
  });

  mapped = ensureCoverExists(mapped);

  // cover öne, sonra display_order
  mapped = mapped
    .slice()
    .sort((a, b) =>
      a.is_cover === b.is_cover
        ? a.display_order - b.display_order
        : a.is_cover
          ? -1
          : 1,
    );

  return reindex(mapped);
}

export function usePropertyForm(existing?: AdminProperty | null, isNew?: boolean) {
  // core
  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [autoSlug, setAutoSlug] = React.useState(true);

  const [type, setType] = React.useState("");
  const [status, setStatus] = React.useState("");

  const [address, setAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [district, setDistrict] = React.useState("");
  const [neighborhood, setNeighborhood] = React.useState("");

  const [lat, setLat] = React.useState("");
  const [lng, setLng] = React.useState("");

  const [description, setDescription] = React.useState("");

  // pricing
  const [price, setPrice] = React.useState("");
  const [currency, setCurrency] = React.useState("TRY");
  const [minPriceAdmin, setMinPriceAdmin] = React.useState("");

  // meta
  const [listingNo, setListingNo] = React.useState("");
  const [badgeText, setBadgeText] = React.useState("");
  const [featured, setFeatured] = React.useState(false);

  // details
  const [grossM2, setGrossM2] = React.useState("");
  const [netM2, setNetM2] = React.useState("");
  const [rooms, setRooms] = React.useState("");
  const [buildingAge, setBuildingAge] = React.useState("");
  const [floor, setFloor] = React.useState("");
  const [totalFloors, setTotalFloors] = React.useState("");

  // booleans
  const [heating, setHeating] = React.useState("");
  const [furnished, setFurnished] = React.useState(false);
  const [inSite, setInSite] = React.useState(false);
  const [hasBalcony, setHasBalcony] = React.useState(false);
  const [hasParking, setHasParking] = React.useState(false);
  const [hasElevator, setHasElevator] = React.useState(false);

  // publish/sort
  const [isActive, setIsActive] = React.useState(true);
  const [displayOrder, setDisplayOrder] = React.useState<number>(0);

  // cover (legacy)
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [imageAssetId, setImageAssetId] = React.useState<string | undefined>(undefined);
  const [alt, setAlt] = React.useState<string>("");

  // gallery
  const [assets, setAssets] = React.useState<GalleryAsset[]>([]);

  // hydrate
  React.useEffect(() => {
    if (!isNew && existing) {
      setTitle(existing.title ?? "");
      setSlug(existing.slug ?? "");

      setType(existing.type ?? "");
      setStatus(existing.status ?? "");

      setAddress(existing.address ?? "");
      setCity(existing.city ?? "");
      setDistrict(existing.district ?? "");
      setNeighborhood(existing.neighborhood ?? "");

      setLat(existing.coordinates?.lat != null ? String(existing.coordinates.lat) : "");
      setLng(existing.coordinates?.lng != null ? String(existing.coordinates.lng) : "");

      setDescription(existing.description ?? "");

      setPrice(existing.price ?? "");
      setCurrency(existing.currency ?? "TRY");
      setMinPriceAdmin((existing as any).min_price_admin ?? "");

      setListingNo(existing.listing_no ?? "");
      setBadgeText(existing.badge_text ?? "");
      setFeatured(!!existing.featured);

      setGrossM2(existing.gross_m2 != null ? String(existing.gross_m2) : "");
      setNetM2(existing.net_m2 != null ? String(existing.net_m2) : "");
      setRooms(existing.rooms ?? "");
      setBuildingAge(existing.building_age ?? "");
      setFloor(existing.floor ?? "");
      setTotalFloors(existing.total_floors != null ? String(existing.total_floors) : "");

      setHeating(existing.heating ?? "");
      setFurnished(!!existing.furnished);
      setInSite(!!existing.in_site);
      setHasBalcony(!!existing.has_balcony);
      setHasParking(!!existing.has_parking);
      setHasElevator(!!existing.has_elevator);

      setIsActive(!!existing.is_active);
      setDisplayOrder(Number(existing.display_order ?? 0));

      setImageAssetId((existing as any).image_asset_id ?? undefined);
      setImageUrl(existing.image_url ?? "");
      setAlt(existing.alt ?? "");

      setAssets(normalizeAssets((existing as any).assets));
    }
  }, [existing, isNew]);

  // auto slug
  React.useEffect(() => {
    if (autoSlug) setSlug(slugifyTr(title));
  }, [title, autoSlug]);

  const validateRequired = (): string | null => {
    if (!title.trim() || !slug.trim()) return "Başlık ve slug zorunlu";
    if (!type.trim() || !status.trim()) return "Tip ve durum zorunlu";
    if (!address.trim() || !city.trim() || !district.trim()) return "Adres/Şehir/İlçe zorunlu";
    if (!lat.trim() || !lng.trim()) return "Latitude/Longitude zorunlu";
    return null;
  };

  const buildUpsertBody = (): PropertyUpsertBody => {
    const body: PropertyUpsertBody = {
      title: title.trim(),
      slug: slug.trim(),
      type: type.trim(),
      status: status.trim(),
      address: address.trim(),
      district: district.trim(),
      city: city.trim(),
      coordinates: { lat: toNum(lat), lng: toNum(lng) },
      description: description ? description : null,
      is_active: isActive,
      display_order: Number(displayOrder) || 0,
    };

    const nbh = neighborhood.trim();
    if (nbh) body.neighborhood = nbh;

    const pr = toFloatOrNull(price);
    if (pr !== null) body.price = pr;
    else if (price.trim() === "") body.price = null;

    const cur = currency.trim();
    if (cur) body.currency = cur;

    const mp = toFloatOrNull(minPriceAdmin);
    if (mp !== null) body.min_price_admin = mp;
    else if (minPriceAdmin.trim() === "") body.min_price_admin = null;

    body.listing_no = listingNo.trim() ? listingNo.trim() : null;
    body.badge_text = badgeText.trim() ? badgeText.trim() : null;

    body.featured = featured;

    body.gross_m2 = toIntOrNull(grossM2);
    body.net_m2 = toIntOrNull(netM2);

    body.rooms = rooms.trim() ? rooms.trim() : null;
    body.building_age = buildingAge.trim() ? buildingAge.trim() : null;

    body.floor = floor.trim() ? floor.trim() : null;
    body.total_floors = toIntOrNull(totalFloors);

    body.heating = heating.trim() ? heating.trim() : null;

    body.furnished = furnished;
    body.in_site = inSite;
    body.has_balcony = hasBalcony;
    body.has_parking = hasParking;
    body.has_elevator = hasElevator;

    body.image_url = imageUrl.trim() ? imageUrl.trim() : null;
    body.image_asset_id = imageAssetId ? imageAssetId : null;
    body.alt = alt.trim() ? alt.trim() : null;

    body.assets = assets.map((x, i) => ({
      id: x.id,
      asset_id: x.asset_id ?? null,
      url: x.url ?? null,
      alt: x.alt ?? null,
      kind: x.kind,
      mime: x.mime ?? null,
      is_cover: x.is_cover,
      display_order: i,
    })) as any;

    return body;
  };

  const buildPatchBody = (): PropertyPatchBody => buildUpsertBody() as any;

  // ------------------------------
  // Gallery ops
  // ------------------------------
  const setCoverIndex = (idx: number) => {
    setAssets((p) => reindex(ensureSingleCover(p, idx)));
  };

  const removeAssetAt = (idx: number) => {
    setAssets((p) => {
      let next = p.filter((_, i) => i !== idx);
      next = ensureCoverExists(next);
      return reindex(next);
    });
  };

  const addUploadedAssets = (items: UploadedInput[]) => {
    setAssets((p) => {
      const start = p.length;

      const appended: GalleryAsset[] = items.map((it, i) => {
        const altFromName = it.fileName ? it.fileName.replace(/\.[^.]+$/, "") : null;

        return {
          id: makeTmpId(),
          asset_id: typeof it.asset_id === "undefined" ? null : it.asset_id,
          url: typeof it.url === "undefined" ? null : it.url,
          alt: altFromName,
          kind: "image",
          mime: it.mime ?? null,
          is_cover: false,
          display_order: start + i,
        };
      });

      let next = [...p, ...appended];
      next = ensureCoverExists(next);
      return reindex(next);
    });
  };

  // cover upload sonrası: cover'a set et + gerekirse assets'e ekle
  const upsertCoverFromUpload = (
    assetId: string | null,
    url: string | null,
    fallbackAlt?: string,
  ) => {
    if (assetId) setImageAssetId(assetId);
    if (url) setImageUrl(url);

    const nextAlt = (alt.trim() || fallbackAlt || title.trim() || "").trim();
    if (!alt.trim() && nextAlt) setAlt(nextAlt);

    setAssets((p) => {
      const idx = assetId ? p.findIndex((x) => x.asset_id === assetId) : -1;

      if (idx >= 0) {
        // cover yap + alt güncelle
        const withCover = ensureSingleCover(p, idx);

        const current = withCover[idx];
        if (!current) return reindex(ensureCoverExists(withCover));

        const newAlt = (nextAlt || current.alt || null); // ✅ || ve ?? karışmasın
        const updated: GalleryAsset = { ...current, alt: newAlt };

        const next = withCover.slice();
        next[idx] = updated;

        return reindex(ensureCoverExists(next));
      }

      // yoksa başa ekle
      const newItem: GalleryAsset = {
        id: makeTmpId(),
        asset_id: assetId ?? null,
        url: url ?? null,
        alt: nextAlt ? nextAlt : null,
        kind: "image",
        mime: "image/*",
        is_cover: true,
        display_order: 0,
      };

      const next = [newItem, ...p];
      return reindex(ensureCoverExists(next));
    });
  };

  return {
    // state
    title, setTitle,
    slug, setSlug,
    autoSlug, setAutoSlug,
    type, setType,
    status, setStatus,
    address, setAddress,
    city, setCity,
    district, setDistrict,
    neighborhood, setNeighborhood,
    lat, setLat,
    lng, setLng,
    description, setDescription,
    price, setPrice,
    currency, setCurrency,
    minPriceAdmin, setMinPriceAdmin,
    listingNo, setListingNo,
    badgeText, setBadgeText,
    featured, setFeatured,
    grossM2, setGrossM2,
    netM2, setNetM2,
    rooms, setRooms,
    buildingAge, setBuildingAge,
    floor, setFloor,
    totalFloors, setTotalFloors,
    heating, setHeating,
    furnished, setFurnished,
    inSite, setInSite,
    hasBalcony, setHasBalcony,
    hasParking, setHasParking,
    hasElevator, setHasElevator,
    isActive, setIsActive,
    displayOrder, setDisplayOrder,
    imageUrl, setImageUrl,
    imageAssetId, setImageAssetId,
    alt, setAlt,
    assets, setAssets,

    // actions
    validateRequired,
    buildUpsertBody,
    buildPatchBody,
    setCoverIndex,
    removeAssetAt,
    addUploadedAssets,
    upsertCoverFromUpload,
  };
}
