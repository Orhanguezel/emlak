"use client";

import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Save, ArrowLeft, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/admin/AdminPanel/form/sections/shared/Section";
import { CoverImageSection } from "@/components/admin/AdminPanel/form/sections/CoverImageSection";
import { PropertyGallerySection } from "@/components/admin/AdminPanel/form/properties/PropertyGallerySection";

import { useUploadToBucketMutation } from "@/integrations/rtk/endpoints/storage_public.endpoints";
import {
  useGetPropertyAdminQuery,
  useCreatePropertyAdminMutation,
  useUpdatePropertyAdminMutation,
} from "@/integrations/rtk/endpoints/admin/properties_admin.endpoints";

import { extractUploadResult } from "@/components/admin/AdminPanel/form/properties/helpers";
import { usePropertyForm } from "@/components/admin/AdminPanel/form/properties/usePropertyForm";

import { PropertyBasicSection } from "./properties/PropertyBasicSection";
import { PropertyPriceSection } from "./properties/PropertyPriceSection";
import { PropertyMetaSection } from "./properties/PropertyMetaSection";
import { PropertyDetailsSection } from "./properties/PropertyDetailsSection";
import { PropertyMapSection } from "./properties/PropertyMapSection";
import { PropertyDescriptionSection } from "./properties/PropertyDescriptionSection";
import { PropertyPublishSection } from "./properties/PropertyPublishSection";

type UploadedLike = {
  asset_id: string | null;
  url: string | null;
  fileName?: string;
  mime?: string | null;
};

export default function PropertyFormPage() {
  const nav = useNavigate();
  const { id } = useParams() as { id?: string };
  const isNew = !id || id === "new";

  const { data: existing, isFetching: loadingExisting } = useGetPropertyAdminQuery(
    String(id ?? ""),
    { skip: isNew },
  );

  const form = usePropertyForm(existing ?? null, isNew);

  const [createOne, { isLoading: creating }] = useCreatePropertyAdminMutation();
  const [updateOne, { isLoading: updating }] = useUpdatePropertyAdminMutation();
  const [uploadToBucket, { isLoading: uploading }] = useUploadToBucketMutation();

  const saving = creating || updating;
  const savingImg = uploading;

  const onBack = () =>
    window.history.length ? window.history.back() : nav("/admin/properties");

  const doCreate = async (): Promise<void> => {
    const err = form.validateRequired();
    if (err) {
      toast.error(err);
      return;
    }

    try {
      const created = await createOne(form.buildUpsertBody()).unwrap();
      toast.success("Emlak oluşturuldu. Galeri/kapak ekleyebilirsiniz.");
      nav(`/admin/properties/${created.id}`);
    } catch (e: any) {
      toast.error(e?.data?.error?.message || e?.data?.message || "Oluşturma başarısız");
    }
  };

  const doUpdate = async (): Promise<void> => {
    if (isNew || !id) return;

    const err = form.validateRequired();
    if (err) {
      toast.error(err);
      return;
    }

    try {
      await updateOne({ id: String(id), patch: form.buildPatchBody() }).unwrap();
      toast.success("Emlak güncellendi");
      nav("/admin/properties");
    } catch (e: any) {
      toast.error(e?.data?.error?.message || e?.data?.message || "Güncelleme başarısız");
    }
  };

  // Cover upload
  const uploadCover = async (file: File): Promise<void> => {
    if (isNew || !id) {
      toast.error("Önce kaydı oluşturun, sonra kapak görseli ekleyin.");
      return;
    }

    try {
      const res = await uploadToBucket({
        bucket: "properties",
        files: [file],
        path: `properties/${id}/cover/${file.name}`,
        upsert: true,
      }).unwrap();

      const { id: assetId, url } = extractUploadResult(res as any);

      const fallbackAlt =
        form.alt.trim() || form.title.trim() || file.name.replace(/\.[^.]+$/, "");

      const nextAssets = form.upsertCoverFromUpload(assetId, url, fallbackAlt);

      await updateOne({
        id: String(id),
        patch: {
          image_asset_id: assetId ?? null,
          image_url: url ?? null,
          alt: fallbackAlt || null,
          assets: nextAssets as any,
        },
      }).unwrap();

      toast.success("Kapak resmi güncellendi");
    } catch (e: any) {
      toast.error(e?.data?.error?.message || e?.data?.message || "Kapak yüklenemedi");
    }
  };

  const saveAltOnly = async (): Promise<void> => {
    if (isNew || !id) return;

    if (!form.imageUrl.trim() && !form.imageAssetId) {
      toast.error("Önce bir görsel ekleyin.");
      return;
    }

    try {
      await updateOne({ id: String(id), patch: { alt: form.alt.trim() || null } }).unwrap();
      toast.success("Alt metin güncellendi");
    } catch (e: any) {
      toast.error(e?.data?.message || "Alt metin güncellenemedi");
    }
  };

  const removeCover = async (): Promise<void> => {
    if (isNew) {
      form.setImageUrl("");
      form.setImageAssetId(undefined);
      form.setAlt("");
      toast.info("Görsel yerelden kaldırıldı (kayıt yok).");
      return;
    }
    if (!id) return;

    try {
      await updateOne({
        id: String(id),
        patch: { image_url: null, alt: null, image_asset_id: null },
      }).unwrap();

      form.setImageUrl("");
      form.setImageAssetId(undefined);
      form.setAlt("");
      toast.success("Görsel kaldırıldı");
    } catch (e: any) {
      toast.error(e?.data?.message || "Görsel kaldırılamadı");
    }
  };

  // Gallery multi upload
  const uploadGalleryFiles = async (files: FileList): Promise<void> => {
    if (isNew || !id) {
      toast.error("Önce kaydı oluşturun, sonra galeri ekleyin.");
      return;
    }

    const list = Array.from(files ?? []);
    if (!list.length) return;

    try {
      const res = await uploadToBucket({
        bucket: "properties",
        files: list,
        path: `properties/${id}/gallery/`,
        upsert: true,
      }).unwrap();

      const anyRes = res as any;
      const rawItems = anyRes?.items ?? anyRes?.data?.items ?? anyRes?.result?.items ?? [];
      const normalized = (Array.isArray(rawItems) ? rawItems : [rawItems])
        .flat()
        .filter(Boolean);

      const mapped: UploadedLike[] = normalized.map((it: any) => {
        const asset_id = (it?.id ?? it?.asset_id ?? it?.assetId ?? null) as string | null;

        const url =
          (it?.url ?? it?.public_url ?? it?.publicUrl ?? it?.cdn_url ?? null) as string | null;

        const fileNameRaw = it?.name ?? it?.filename;
        const fileName =
          typeof fileNameRaw === "string" && fileNameRaw.trim() ? fileNameRaw : undefined;

        const mime = (it?.mime ?? null) as string | null;

        const base: UploadedLike = { asset_id, url, mime };
        return fileName ? { ...base, fileName } : base;
      });

      const nextAssets = form.addUploadedAssets(mapped);

      await updateOne({
        id: String(id),
        patch: { assets: nextAssets as any },
      }).unwrap();

      toast.success("Galeri güncellendi");
    } catch (e: any) {
      toast.error(e?.data?.error?.message || e?.data?.message || "Galeri yüklenemedi");
    }
  };

  const setCoverIndexAndSave = async (idx: number): Promise<void> => {
    if (isNew || !id) return;

    try {
      const nextAssets = form.setCoverIndex(idx);

      await updateOne({
        id: String(id),
        patch: { assets: nextAssets as any },
      }).unwrap();

      toast.success("Kapak (galeriden) güncellendi");
    } catch (e: any) {
      toast.error(e?.data?.message || "Kapak güncellenemedi");
    }
  };

  const removeAssetAndSave = async (idx: number): Promise<void> => {
    if (isNew || !id) return;

    try {
      const nextAssets = form.removeAssetAt(idx);

      await updateOne({
        id: String(id),
        patch: { assets: nextAssets as any },
      }).unwrap();

      toast.success("Medya kaldırıldı");
    } catch (e: any) {
      toast.error(e?.data?.message || "Medya kaldırılamadı");
    }
  };

  if (!isNew && loadingExisting) {
    return <div className="p-4 text-sm text-gray-500">Yükleniyor…</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
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

      <PropertyBasicSection
        title={form.title}
        setTitle={form.setTitle}
        slug={form.slug}
        setSlug={form.setSlug}
        autoSlug={form.autoSlug}
        setAutoSlug={form.setAutoSlug}
        type={form.type}
        setType={form.setType}
        status={form.status}
        setStatus={form.setStatus}
        address={form.address}
        setAddress={form.setAddress}
        city={form.city}
        setCity={form.setCity}
        district={form.district}
        setDistrict={form.setDistrict}
        neighborhood={form.neighborhood}
        setNeighborhood={form.setNeighborhood}
        listedAt={(existing as any)?.created_at ?? (existing as any)?.listed_at ?? null}
      />

      <PropertyPriceSection
        price={form.price}
        setPrice={form.setPrice}
        currency={form.currency}
        setCurrency={form.setCurrency}
        minPriceAdmin={form.minPriceAdmin}
        setMinPriceAdmin={form.setMinPriceAdmin}
      />

      <PropertyMetaSection
        listingNo={form.listingNo}
        setListingNo={form.setListingNo}
        badgeText={form.badgeText}
        setBadgeText={form.setBadgeText}
        featured={form.featured}
        setFeatured={form.setFeatured}
      />

      <PropertyDetailsSection
        grossM2={form.grossM2}
        setGrossM2={form.setGrossM2}
        netM2={form.netM2}
        setNetM2={form.setNetM2}
        rooms={form.rooms}
        setRooms={form.setRooms}
        buildingAge={form.buildingAge}
        setBuildingAge={form.setBuildingAge}
        floor={form.floor}
        setFloor={form.setFloor}
        totalFloors={form.totalFloors}
        setTotalFloors={form.setTotalFloors}
        heating={form.heating}
        setHeating={form.setHeating}
        furnished={form.furnished}
        setFurnished={form.setFurnished}
        inSite={form.inSite}
        setInSite={form.setInSite}
        hasBalcony={form.hasBalcony}
        setHasBalcony={form.setHasBalcony}
        hasParking={form.hasParking}
        setHasParking={form.setHasParking}
        hasElevator={form.hasElevator}
        setHasElevator={form.setHasElevator}
      />

      <PropertyMapSection lat={form.lat} setLat={form.setLat} lng={form.lng} setLng={form.setLng} />

      <PropertyDescriptionSection
        description={form.description}
        setDescription={form.setDescription}
      />

      {!isNew ? (
        <PropertyGallerySection
          assets={form.assets}
          saving={savingImg}
          onPickFiles={uploadGalleryFiles}
          onSetCoverIndex={setCoverIndexAndSave}
          onRemoveAt={removeAssetAndSave}
        />
      ) : (
        <Section title="Galeri (Çoklu Görsel)">
          <div className="flex items-start gap-3 rounded-md border p-3 bg-amber-50 text-amber-800">
            <Info className="mt-0.5 h-4 w-4" />
            <div className="text-sm">
              Önce kaydı oluşturun. Sonra galeriye çoklu görsel ekleyebilirsiniz.
            </div>
          </div>
        </Section>
      )}

      {!isNew ? (
        <CoverImageSection
          title="Kapak Görseli"
          coverId={form.imageAssetId}
          stagedCoverId={undefined}
          imageUrl={form.imageUrl}
          alt={form.alt}
          saving={savingImg}
          onPickFile={uploadCover}
          onRemove={removeCover}
          onUrlChange={(v: string) => form.setImageUrl(v)}
          onAltChange={form.setAlt}
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

      <PropertyPublishSection
        isActive={form.isActive}
        setIsActive={form.setIsActive}
        displayOrder={form.displayOrder}
        setDisplayOrder={form.setDisplayOrder}
      />
    </div>
  );
}
