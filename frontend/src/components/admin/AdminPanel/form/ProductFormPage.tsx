// =============================================================
// FILE: src/pages/admin/products/ProductFormPage.tsx
// =============================================================
"use client";

import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft } from "lucide-react";

/* RTK hooks */
import {
  useAdminCreateProductMutation,
  useAdminGetProductQuery,
  useAdminUpdateProductMutation,
  useAdminSetProductImagesMutation,
  useAdminListCategoriesQuery,
  useAdminListSubcategoriesQuery,
} from "@/integrations/rtk/endpoints/admin/products_admin.endpoints";
import {
  useCreateAssetAdminMutation,
  useBulkCreateAssetsAdminMutation,
} from "@/integrations/rtk/endpoints/admin/storage_admin.endpoints";
import {
  useListProductFaqsQuery,
  useListProductSpecsQuery,
  useListProductReviewsQuery,
} from "@/integrations/rtk/endpoints/products.endpoints";

import type { ProductRow } from "@/integrations/rtk/types/products.rows";

/* Sections */
import { BasicsSection } from "./sections/BasicsSection";
import { ImagesSection } from "./sections/ImagesSection";
import { SEOSection } from "./sections/SEOSection";
import { SpecsSection } from "./sections/SpecsSection";
import { FaqsSection } from "./sections/FaqsSection";
import { ReviewsSection } from "./sections/ReviewsSection";

/* Utils */
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

const currencyInput = (v: string) => v.replace(/[^\d.,]/g, "").replace(",", ".");

export default function ProductFormPage() {
  const { id } = useParams() as { id?: string };
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  // Kategoriler
  const { data: categories } = useAdminListCategoriesQuery();
  const [categoryId, setCategoryId] = React.useState<string | undefined>(undefined);
  const { data: subcats } = useAdminListSubcategoriesQuery(
    categoryId ? { category_id: categoryId } : undefined
  );

  // Mevcut ürün (edit modu)
  const { data: existing } = useAdminGetProductQuery(id!, { skip: isNew });
  const base: Partial<ProductRow> | undefined = existing;

  /* ---------- form state ---------- */
  const [title, setTitle] = React.useState(base?.title ?? "");
  const [slug, setSlug] = React.useState(base?.slug ?? "");
  const [autoSlug, setAutoSlug] = React.useState(true);

  const [price, setPrice] = React.useState(base?.price?.toString() ?? "0");
  const [description, setDescription] = React.useState(base?.description ?? "");

  const [selectedCategory, setSelectedCategory] = React.useState<string | undefined>(
    base?.category_id
  );
  const [selectedSubCategory, setSelectedSubCategory] = React.useState<string | undefined>(
    base?.sub_category_id ?? undefined
  );

  // dış kapak URL + alt
  const [imageUrl, setImageUrl] = React.useState<string>(base?.image_url ?? "");
  const [alt, setAlt] = React.useState<string>(base?.alt ?? "");

  // renkli switch’ler
  const [isActive, setIsActive] = React.useState<boolean>(
    base?.is_active !== undefined ? !!base.is_active : true
  );
  const [isFeatured, setIsFeatured] = React.useState<boolean>(
    base?.is_featured !== undefined ? !!base.is_featured : false
  );

  const [tagsStr, setTagsStr] = React.useState<string>((base?.tags ?? []).join(", ") || "");
  const [metaTitle, setMetaTitle] = React.useState<string>(base?.meta_title ?? "");
  const [metaDesc, setMetaDesc] = React.useState<string>(base?.meta_description ?? "");

  // 🔹 ÜRÜN KODU (NO:1 vs)
  const [productCode, setProductCode] = React.useState<string>(base?.product_code ?? "");

  // storage: kapak + galeri
  const [coverId, setCoverId] = React.useState<string | undefined>(
    base?.storage_asset_id ?? undefined
  );
  const [galleryIds, setGalleryIds] = React.useState<string[]>(
    Array.isArray(base?.storage_image_ids) ? (base?.storage_image_ids as string[]) : []
  );

  // create akışında yüklenip henüz ilişkilendirilmemişler
  const [stagedIds, setStagedIds] = React.useState<string[]>([]);
  const [stagedCoverId, setStagedCoverId] = React.useState<string | undefined>(undefined);

  // specs / faqs / reviews (okuma)
  const productId = base?.id;
  const { data: specs } = useListProductSpecsQuery(
    { product_id: productId! },
    { skip: !productId }
  );
  const { data: faqs } = useListProductFaqsQuery(
    { product_id: productId!, only_active: false },
    { skip: !productId }
  );
  const { data: reviews } = useListProductReviewsQuery(
    { product_id: productId!, only_active: false },
    { skip: !productId }
  );

  React.useEffect(() => {
    if (!isNew && existing) {
      setTitle(existing.title);
      setSlug(existing.slug);
      setPrice(String(existing.price ?? "0"));
      setDescription(existing.description ?? "");
      setSelectedCategory(existing.category_id);
      setSelectedSubCategory(existing.sub_category_id ?? undefined);
      setImageUrl(existing.image_url ?? "");
      setAlt(existing.alt ?? "");
      setIsActive(!!existing.is_active);
      setIsFeatured(!!existing.is_featured);
      setTagsStr((existing.tags ?? []).join(", "));
      setMetaTitle(existing.meta_title ?? "");
      setMetaDesc(existing.meta_description ?? "");

      // 🔹 ÜÜRÜN KODU
      setProductCode(existing.product_code ?? "");

      // 🔽 normalizeProduct alias'ları zaten topladı
      setCoverId(existing.storage_asset_id ?? undefined);
      setGalleryIds(Array.isArray(existing.storage_image_ids) ? existing.storage_image_ids : []);
      setCategoryId(existing.category_id);
    }
  }, [existing, isNew]);

  React.useEffect(() => {
    if (autoSlug) setSlug(slugifyTr(title));
  }, [title, autoSlug]);

  React.useEffect(() => {
    setCategoryId(selectedCategory);
  }, [selectedCategory]);

  /* ---------- mutations ---------- */
  const [createProduct, { isLoading: creating }] = useAdminCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useAdminUpdateProductMutation();
  const [setImages, { isLoading: savingImages }] = useAdminSetProductImagesMutation();
  const [uploadOne] = useCreateAssetAdminMutation();
  const [uploadMany] = useBulkCreateAssetsAdminMutation();

  const saving = creating || updating;

  /* ---------- helpers ---------- */
  const parseTags = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

  const payloadBase = (): Partial<ProductRow> => {
    const p: Partial<ProductRow> = {
      title,
      slug,
      price: Number(currencyInput(price)) || 0,
      description: description || null,
      category_id: selectedCategory!,
      sub_category_id: selectedSubCategory ?? null,
      image_url: imageUrl || null,
      storage_asset_id: coverId ?? null,
      alt: alt || null,
      is_active: isActive ? 1 : 0,
      is_featured: isFeatured ? 1 : 0,
      tags: parseTags(tagsStr),
      meta_title: metaTitle || null,
      meta_description: metaDesc || null,
      // 🔹 BE kolonu
      product_code: productCode || null,
    };
    if (galleryIds.length) p.storage_image_ids = galleryIds;
    return p;
  };

  /* ---------- save handlers ---------- */
  const doCreate = async (): Promise<void> => {
    if (!title || !slug || !selectedCategory) {
      toast.error("Başlık, slug ve kategori zorunlu");
      return;
    }
    try {
      const created = await createProduct(payloadBase()).unwrap();

      // CREATE: sahnede birikenler + kapak
      if (stagedIds.length || stagedCoverId || coverId) {
        try {
          await setImages({
            id: created.id,
            body: {
              cover_id: coverId ?? stagedCoverId ?? null,
              image_ids: Array.from(new Set(stagedIds)),
            },
          }).unwrap();
          toast.success("Görseller ilişkilendirildi", {
            description: "Kapak ve galeri ayarlandı.",
          });
        } catch (e: any) {
          toast.error(e?.data?.message || "Görseller ilişkilendirilemedi");
        }
      }

      toast.success("Ürün oluşturuldu", { description: "Ürün listesine yönlendiriliyorsunuz." });
      navigate("/admin/products");
    } catch (e: any) {
      toast.error(e?.data?.message || "Oluşturma başarısız");
    }
  };

  const doUpdate = async (): Promise<void> => {
    if (!productId) return;
    if (!title || !slug || !selectedCategory) {
      toast.error("Başlık, slug ve kategori zorunlu");
      return;
    }
    try {
      await updateProduct({ id: productId, body: payloadBase() }).unwrap();
      toast.success("Ürün güncellendi", {
        description: "Ürün listesine yönlendiriliyorsunuz.",
      });
      navigate("/admin/products");
    } catch (e: any) {
      toast.error(e?.data?.message || "Güncelleme başarısız");
    }
  };

  /* ---------- image handlers (separate cover + gallery) ---------- */
  const uploadCover = async (file: File): Promise<void> => {
    try {
      const res = await uploadOne({
        file,
        bucket: "products",
        folder: `products/${Date.now()}/cover`,
      }).unwrap();
      const newCoverId = (res as any)?.id as string | undefined;
      if (!newCoverId) {
        toast.error("Kapak yükleme cevabı beklenen formatta değil");
        return;
      }

      // UI state
      setCoverId(newCoverId);
      setStagedCoverId(newCoverId);

      if (productId) {
        await setImages({
          id: productId,
          body: { cover_id: newCoverId, image_ids: galleryIds },
        }).unwrap();
        toast.success("Kapak resmi güncellendi", {
          description: "Değişiklik anında kaydedildi.",
        });
      } else {
        toast.success("Kapak yüklendi", {
          description: "Ürün oluşturulduğunda kapak olarak ayarlanacak.",
        });
      }
    } catch (e: any) {
      toast.error(e?.data?.message || "Kapak yüklenemedi");
    }
  };

  const uploadGallerySingle = async (file: File): Promise<void> => {
    try {
      const res = await uploadOne({
        file,
        bucket: "products",
        folder: `products/${Date.now()}/gallery`,
      }).unwrap();
      const newId = (res as any)?.id as string | undefined;
      if (!newId) {
        toast.error("Yükleme cevabı beklenen formatta değil");
        return;
      }

      if (productId) {
        const next = Array.from(new Set([...galleryIds, newId]));
        await setImages({
          id: productId,
          body: { cover_id: coverId ?? null, image_ids: next },
        }).unwrap();
        setGalleryIds(next);
        toast.success("Galeriye eklendi", { description: "Anında kaydedildi." });
      } else {
        setStagedIds((s) => Array.from(new Set([...s, newId])));
        setGalleryIds((g) => Array.from(new Set([...g, newId])));
        toast.success("Galeriye yüklendi", {
          description: "Ürün oluşturulunca ilişkilendirilecek.",
        });
      }
    } catch (e: any) {
      toast.error(e?.data?.message || "Yüklenemedi");
    }
  };

  const uploadGalleryMultiple = async (files: FileList | null): Promise<void> => {
    if (!files || !files.length) return;
    try {
      const res = await uploadMany({
        files: Array.from(files),
        bucket: "products",
        folder: `products/${Date.now()}/gallery`,
      }).unwrap();

      const createdIds: string[] = (res?.items ?? [])
        .map((x: any) => x?.id)
        .filter(Boolean);
      if (!createdIds.length) return;

      if (productId) {
        const next = Array.from(new Set([...galleryIds, ...createdIds]));
        await setImages({
          id: productId,
          body: { cover_id: coverId ?? null, image_ids: next },
        }).unwrap();
        setGalleryIds(next);
        toast.success(`${createdIds.length} görsel eklendi`, {
          description: "Galeri anında kaydedildi.",
        });
      } else {
        setStagedIds((s) => Array.from(new Set([...s, ...createdIds])));
        setGalleryIds((g) => Array.from(new Set([...g, ...createdIds])));
        toast.success(`${createdIds.length} görsel yüklendi`, {
          description: "Ürün oluşturulunca ilişkilendirilecek.",
        });
      }
    } catch (e: any) {
      toast.error(e?.data?.message || "Toplu yükleme başarısız");
    }
  };

  const removeFromGallery = async (imgId: string): Promise<void> => {
    const next = galleryIds.filter((x) => x !== imgId);
    if (productId) {
      try {
        await setImages({
          id: productId,
          body: { cover_id: coverId ?? null, image_ids: next },
        }).unwrap();
        setGalleryIds(next);
        toast.success("Görsel kaldırıldı", { description: "Galeri anında kaydedildi." });
      } catch (e: any) {
        toast.error(e?.data?.message || "Kaldırma başarısız");
      }
    } else {
      setStagedIds((s) => s.filter((x) => x !== imgId));
      setGalleryIds(next);
      toast.info("Görsel kaldırıldı", {
        description: "Ürün oluşturulana kadar yerel listeden kaldırıldı.",
      });
    }
  };

  // 🔧 void tipini garanti et
  const onBack = (): void => {
    if (window.history.length) {
      window.history.back();
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Geri
        </Button>
        <div className="flex items-center gap-2">
          {isNew ? (
            <Button
              onClick={doCreate}
              disabled={saving}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="h-4 w-4" />
              Oluştur
            </Button>
          ) : (
            <Button
              onClick={doUpdate}
              disabled={saving}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="h-4 w-4" />
              Kaydet
            </Button>
          )}
        </div>
      </div>

      {/* Sections */}
      <BasicsSection
        title={title}
        setTitle={setTitle}
        slug={slug}
        setSlug={setSlug}
        autoSlug={autoSlug}
        setAutoSlug={setAutoSlug}
        categories={categories}
        subcats={subcats}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSubCategory={selectedSubCategory}
        setSelectedSubCategory={setSelectedSubCategory}
        price={price}
        setPrice={(v) => setPrice(currencyInput(v))}
        productCode={productCode}
        setProductCode={setProductCode}
        description={description}
        setDescription={setDescription}
        isActive={isActive}
        setIsActive={setIsActive}
        isFeatured={isFeatured}
        setIsFeatured={setIsFeatured}
      />

      <ImagesSection
        coverId={coverId}
        galleryIds={galleryIds}
        savingImages={savingImages}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        alt={alt}
        setAlt={setAlt}
        onUploadCover={uploadCover}
        onUploadGallerySingle={uploadGallerySingle}
        onUploadGalleryMultiple={uploadGalleryMultiple}
        onRemoveFromGallery={removeFromGallery}
      />

      <SEOSection
        metaTitle={metaTitle}
        setMetaTitle={setMetaTitle}
        metaDesc={metaDesc}
        setMetaDesc={setMetaDesc}
        tagsStr={tagsStr}
        setTagsStr={setTagsStr}
      />

      {/* 🔧 exactOptionalPropertyTypes: productId zorunluysa sadece id varken render et */}
      {productId ? <SpecsSection productId={productId} specs={specs ?? []} /> : null}
      {productId ? <FaqsSection productId={productId} faqs={faqs ?? []} /> : null}
      {productId ? <ReviewsSection productId={productId} reviews={reviews ?? []} /> : null}
    </div>
  );
}
