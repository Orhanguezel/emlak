// =============================================================
// FILE: src/components/admin/AdminPanel/form/PropertyFormPage.tsx
// FIX: Storage cover görünmüyor -> image_asset_id set edilmiyordu.
// CoverImageSection dosyasına dokunmadan çözüldü.
// =============================================================
"use client";

import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Save, ArrowLeft, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import { Section } from "@/components/admin/AdminPanel/form/sections/shared/Section";
import { CoverImageSection } from "@/components/admin/AdminPanel/form/sections/CoverImageSection";

import { useUploadToBucketMutation } from "@/integrations/rtk/endpoints/storage_public.endpoints";

import type { PropertyUpsertBody } from "@/integrations/rtk/endpoints/admin/properties_admin.endpoints";
import {
  useGetPropertyAdminQuery,
  useCreatePropertyAdminMutation,
  useUpdatePropertyAdminMutation,
} from "@/integrations/rtk/endpoints/admin/properties_admin.endpoints";

const slugifyTr = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .substring(0, 120);

const RequiredMark = () => (
  <span className="ml-0.5 text-red-500" aria-hidden="true">
    *
  </span>
);

const toNum = (v: string): number => {
  const x = Number(String(v).trim().replace(",", "."));
  return Number.isFinite(x) ? x : 0;
};

const toInt = (v: string): number | null => {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = Number(s.replace(",", "."));
  if (!Number.isFinite(n)) return null;
  return Math.trunc(n);
};

type UploadExtract = { id: string | null; url: string | null };

const extractUploadResult = (res: any): UploadExtract => {
  // En sık görülen şekiller:
  // { items:[{ id, url }] }
  // { items:[{ asset_id, public_url }] }
  // { data:{ items:[...] } }
  const item =
    res?.items?.[0] ??
    res?.data?.items?.[0] ??
    res?.result?.items?.[0] ??
    res?.[0] ??
    null;

  const id =
    item?.id ??
    item?.asset_id ??
    item?.assetId ??
    item?.file_id ??
    res?.id ??
    res?.asset_id ??
    null;

  const url =
    item?.url ??
    item?.publicUrl ??
    item?.public_url ??
    item?.cdn_url ??
    res?.url ??
    res?.publicUrl ??
    null;

  return {
    id: typeof id === "string" && id.trim() ? id : null,
    url: typeof url === "string" && url.trim() ? url : null,
  };
};

export default function PropertyFormPage() {
  const nav = useNavigate();
  const { id } = useParams() as { id?: string };
  const isNew = !id || id === "new";

  const { data: existing, isFetching: loadingExisting } = useGetPropertyAdminQuery(String(id ?? ""), {
    skip: isNew,
  });

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

  // cover (legacy url + storage id)
  const [imageUrl, setImageUrl] = React.useState<string>(""); // properties.image_url
  const [imageAssetId, setImageAssetId] = React.useState<string | undefined>(undefined); // properties.image_asset_id
  const [alt, setAlt] = React.useState<string>("");

  const [createOne, { isLoading: creating }] = useCreatePropertyAdminMutation();
  const [updateOne, { isLoading: updating }] = useUpdatePropertyAdminMutation();
  const [uploadToBucket, { isLoading: uploading }] = useUploadToBucketMutation();

  const saving = creating || updating;
  const savingImg = uploading;

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

      // ✅ kritik: storage id + legacy url
      setImageAssetId((existing as any).image_asset_id ?? undefined);
      setImageUrl(existing.image_url ?? "");
      setAlt(existing.alt ?? "");
    }
  }, [existing, isNew]);

  React.useEffect(() => {
    if (autoSlug) setSlug(slugifyTr(title));
  }, [title, autoSlug]);

  const onBack = () => (window.history.length ? window.history.back() : nav("/admin/properties"));

  const buildPayload = (): PropertyUpsertBody => {
    const body: PropertyUpsertBody = {
      title,
      slug,
      type,
      status,
      address,
      district,
      city,
      coordinates: { lat: toNum(lat), lng: toNum(lng) },
      description: description ? description : null,

      is_active: isActive,
      display_order: Number(displayOrder) || 0,
    };

    const nbh = neighborhood.trim();
    if (nbh) body.neighborhood = nbh;

    const pr = price.trim();
    if (pr) body.price = pr;

    const cur = currency.trim();
    if (cur) body.currency = cur;

    const mp = minPriceAdmin.trim();
    if (mp) body.min_price_admin = mp;

    const ln = listingNo.trim();
    if (ln) body.listing_no = ln;

    const bt = badgeText.trim();
    if (bt) body.badge_text = bt;

    if (featured) body.featured = true;

    const g = toInt(grossM2);
    if (g != null) body.gross_m2 = g;

    const n = toInt(netM2);
    if (n != null) body.net_m2 = n;

    const rm = rooms.trim();
    if (rm) body.rooms = rm;

    const ba = buildingAge.trim();
    if (ba) body.building_age = ba;

    const fl = floor.trim();
    if (fl) body.floor = fl;

    const tf = toInt(totalFloors);
    if (tf != null) body.total_floors = tf;

    const ht = heating.trim();
    if (ht) body.heating = ht;

    if (furnished) body.furnished = true;
    if (inSite) body.in_site = true;
    if (hasBalcony) body.has_balcony = true;
    if (hasParking) body.has_parking = true;
    if (hasElevator) body.has_elevator = true;

    // cover (legacy url)
    const iu = imageUrl.trim();
    if (iu) body.image_url = iu;

    // storage relation (id) - optional
    if (imageAssetId) body.image_asset_id = imageAssetId;

    const a = alt.trim();
    if (a) body.alt = a;

    return body;
  };

  const validateRequired = () => {
    if (!title.trim() || !slug.trim()) return "Başlık ve slug zorunlu";
    if (!type.trim() || !status.trim()) return "Tip ve durum zorunlu";
    if (!address.trim() || !city.trim() || !district.trim()) return "Adres/Şehir/İlçe zorunlu";
    return null;
  };

  const doCreate = async () => {
    const err = validateRequired();
    if (err) return toast.error(err);

    try {
      const created = await createOne(buildPayload()).unwrap();
      toast.success("Emlak oluşturuldu. Şimdi kapak görseli ekleyebilirsiniz.");
      nav(`/admin/properties/${created.id}`);
    } catch (e: any) {
      toast.error(e?.data?.error?.message || e?.data?.message || "Oluşturma başarısız");
    }
  };

  const doUpdate = async () => {
    if (isNew || !id) return;

    const err = validateRequired();
    if (err) return toast.error(err);

    try {
      await updateOne({ id: String(id), patch: buildPayload() }).unwrap();
      toast.success("Emlak güncellendi");
      nav("/admin/properties");
    } catch (e: any) {
      toast.error(e?.data?.error?.message || e?.data?.message || "Güncelleme başarısız");
    }
  };

  const uploadCover = async (file: File) => {
    if (isNew || !id) {
      toast.error("Önce kaydı oluşturun, sonra kapak görseli ekleyin.");
      return;
    }

    try {
      const res = await uploadToBucket({
        bucket: "properties",
        files: [file], // ✅ çoğu endpoint array bekler
        path: `properties/${id}/cover/${file.name}`,
        upsert: true,
      }).unwrap();

      const { id: assetId, url } = extractUploadResult(res);

      // ✅ Sağ tarafın çalışması için image_asset_id şart
      if (assetId) setImageAssetId(assetId);
      if (url) setImageUrl(url);

      const nextAlt = alt.trim() || title.trim() || file.name.replace(/\.[^.]+$/, "");
      if (!alt.trim()) setAlt(nextAlt);

      // DB’ye yaz (asset id varsa onu esas al)
      await updateOne({
        id: String(id),
        patch: {
          image_asset_id: assetId ?? null,
          image_url: url ?? null, // legacy URL’yi de yaz, bozmuyor
          alt: nextAlt || null,
        },
      }).unwrap();

      toast.success("Kapak resmi güncellendi");
    } catch (e: any) {
      toast.error(e?.data?.error?.message || e?.data?.message || "Kapak yüklenemedi");
    }
  };

  const saveAltOnly = async () => {
    if (isNew || !id) return;
    if (!imageUrl.trim() && !imageAssetId) return toast.error("Önce bir görsel ekleyin.");

    try {
      await updateOne({ id: String(id), patch: { alt: alt.trim() || null } }).unwrap();
      toast.success("Alt metin güncellendi");
    } catch (e: any) {
      toast.error(e?.data?.message || "Alt metin güncellenemedi");
    }
  };

  const removeCover = async () => {
    if (isNew) {
      setImageUrl("");
      setImageAssetId(undefined);
      setAlt("");
      toast.info("Görsel yerelden kaldırıldı (kayıt yok).");
      return;
    }
    if (!id) return;

    try {
      await updateOne({
        id: String(id),
        patch: { image_url: null, alt: null, image_asset_id: null },
      }).unwrap();

      setImageUrl("");
      setImageAssetId(undefined);
      setAlt("");
      toast.success("Görsel kaldırıldı");
    } catch (e: any) {
      toast.error(e?.data?.message || "Görsel kaldırılamadı");
    }
  };

  if (!isNew && loadingExisting) {
    return <div className="p-4 text-sm text-gray-500">Yükleniyor…</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <Button type="button" variant="secondary" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Geri
        </Button>

        {isNew ? (
          <Button
            type="button"
            onClick={doCreate}
            disabled={saving}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="h-4 w-4" /> Oluştur
          </Button>
        ) : (
          <Button
            type="button"
            onClick={doUpdate}
            disabled={saving}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="h-4 w-4" /> Kaydet
          </Button>
        )}
      </div>

      <Section title="Temel Bilgiler">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>
              Başlık<RequiredMark />
            </Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Emlak başlığı" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label>
                Slug<RequiredMark />
              </Label>
              <label className="flex items-center gap-2 text-xs text-gray-500">
                <Switch checked={autoSlug} onCheckedChange={setAutoSlug} className="data-[state=checked]:bg-indigo-600" />
                otomatik
              </label>
            </div>
            <Input
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setAutoSlug(false);
              }}
              placeholder="emlak-slug"
            />
          </div>

          <div className="space-y-2">
            <Label>
              Tip<RequiredMark />
            </Label>
            <Input value={type} onChange={(e) => setType(e.target.value)} placeholder="örn: Daire" />
          </div>

          <div className="space-y-2">
            <Label>
              Durum<RequiredMark />
            </Label>
            <Input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="örn: satilik" />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>
              Adres<RequiredMark />
            </Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Açık adres" />
          </div>

          <div className="space-y-2">
            <Label>
              Şehir<RequiredMark />
            </Label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="örn: Köln" />
          </div>

          <div className="space-y-2">
            <Label>
              İlçe<RequiredMark />
            </Label>
            <Input value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="örn: Musteri" />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>Mahalle (ops.)</Label>
            <Input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="örn: Zentrum" />
          </div>
        </div>
      </Section>

      <Section title="Fiyat">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2 sm:col-span-2">
            <Label>Fiyat (ops.)</Label>
            <Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="örn: 2500000" />
          </div>
          <div className="space-y-2">
            <Label>Para Birimi</Label>
            <Input value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="TRY" />
          </div>

          <div className="space-y-2 sm:col-span-3">
            <Label>Min Fiyat (Admin) (ops.)</Label>
            <Input value={minPriceAdmin} onChange={(e) => setMinPriceAdmin(e.target.value)} placeholder="örn: 2100000" />
            <div className="text-xs text-gray-500">Bu alan sadece admin tarafında görünür.</div>
          </div>
        </div>
      </Section>

      <Section title="İlan Meta">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>İlan No (ops.)</Label>
            <Input value={listingNo} onChange={(e) => setListingNo(e.target.value)} placeholder="örn: 2025-00012" />
          </div>
          <div className="space-y-2">
            <Label>Badge (ops.)</Label>
            <Input value={badgeText} onChange={(e) => setBadgeText(e.target.value)} placeholder="örn: Fırsat" />
          </div>
          <div className="space-y-2">
            <Label>Öne Çıkan</Label>
            <div className="flex h-10 items-center">
              <Switch checked={featured} onCheckedChange={setFeatured} className="data-[state=checked]:bg-amber-500" />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Detaylar">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Brüt m² (ops.)</Label>
            <Input value={grossM2} onChange={(e) => setGrossM2(e.target.value)} placeholder="örn: 120" />
          </div>
          <div className="space-y-2">
            <Label>Net m² (ops.)</Label>
            <Input value={netM2} onChange={(e) => setNetM2(e.target.value)} placeholder="örn: 95" />
          </div>
          <div className="space-y-2">
            <Label>Oda (ops.)</Label>
            <Input value={rooms} onChange={(e) => setRooms(e.target.value)} placeholder='örn: "2+1"' />
          </div>

          <div className="space-y-2">
            <Label>Bina Yaşı (ops.)</Label>
            <Input value={buildingAge} onChange={(e) => setBuildingAge(e.target.value)} placeholder='örn: "5-10"' />
          </div>
          <div className="space-y-2">
            <Label>Kat (ops.)</Label>
            <Input value={floor} onChange={(e) => setFloor(e.target.value)} placeholder='örn: "3" / "Zemin"' />
          </div>
          <div className="space-y-2">
            <Label>Toplam Kat (ops.)</Label>
            <Input value={totalFloors} onChange={(e) => setTotalFloors(e.target.value)} placeholder="örn: 8" />
          </div>

          <div className="space-y-2 sm:col-span-3">
            <Label>Isınma (ops.)</Label>
            <Input value={heating} onChange={(e) => setHeating(e.target.value)} placeholder="örn: Kombi" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:col-span-3">
            <div className="space-y-2">
              <Label>Eşyalı</Label>
              <div className="flex h-10 items-center">
                <Switch checked={furnished} onCheckedChange={setFurnished} className="data-[state=checked]:bg-emerald-600" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Site İçinde</Label>
              <div className="flex h-10 items-center">
                <Switch checked={inSite} onCheckedChange={setInSite} className="data-[state=checked]:bg-emerald-600" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Balkon</Label>
              <div className="flex h-10 items-center">
                <Switch checked={hasBalcony} onCheckedChange={setHasBalcony} className="data-[state=checked]:bg-emerald-600" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Otopark</Label>
              <div className="flex h-10 items-center">
                <Switch checked={hasParking} onCheckedChange={setHasParking} className="data-[state=checked]:bg-emerald-600" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Asansör</Label>
              <div className="flex h-10 items-center">
                <Switch checked={hasElevator} onCheckedChange={setHasElevator} className="data-[state=checked]:bg-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Harita">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Latitude</Label>
            <Input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="41.008238" />
          </div>
          <div className="space-y-2">
            <Label>Longitude</Label>
            <Input value={lng} onChange={(e) => setLng(e.target.value)} placeholder="28.978359" />
          </div>
          <div className="sm:col-span-2 text-xs text-gray-500">
            Boş bırakırsan backend dec6 bekliyor; 0/0 göndermemek için bu alanları doldur.
          </div>
        </div>
      </Section>

      <Section title="Açıklama">
        <Textarea rows={8} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detay açıklama…" />
      </Section>

      {/* Kapak görseli */}
      {!isNew ? (
        <CoverImageSection
          title="Kapak Görseli"
          coverId={imageAssetId}
          stagedCoverId={undefined}
          imageUrl={imageUrl}
          alt={alt}
          saving={savingImg}
          onPickFile={uploadCover}
          onRemove={removeCover}
          onUrlChange={(v: string) => setImageUrl(v)}
          onAltChange={setAlt}
          onSaveAlt={!isNew && !!id ? saveAltOnly : undefined}
          accept="image/*"
        />
      ) : (
        <Section title="Kapak Görseli">
          <div className="flex items-start gap-3 rounded-md border p-3 bg-amber-50 text-amber-800">
            <Info className="mt-0.5 h-4 w-4" />
            <div className="text-sm">
              Önce <b>Temel Bilgileri</b> kaydedin. Kayıt oluşturulduktan sonra kapak görselini ekleyebilirsiniz.
            </div>
          </div>
        </Section>
      )}

      <Section title="Yayın / Sıralama">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Aktif</Label>
            <div className="flex h-10 items-center">
              <Switch checked={isActive} onCheckedChange={setIsActive} className="data-[state=checked]:bg-emerald-600" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Display Order</Label>
            <Input
              type="number"
              value={String(displayOrder)}
              onChange={(e) => setDisplayOrder(Number(e.target.value || 0))}
              placeholder="0"
            />
          </div>
        </div>
      </Section>
    </div>
  );
}
