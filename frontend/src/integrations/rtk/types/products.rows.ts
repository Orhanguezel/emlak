// =============================================================
// FILE: src/integrations/metahub/db/types/products.rows.ts
// =============================================================

export type DbBool = 0 | 1 | boolean;

export type ProductSpecifications = {
  dimensions?: string;
  weight?: string;
  thickness?: string;
  surfaceFinish?: string;
  warranty?: string;
  installationTime?: string;
};

/** DB: products (Drizzle şemasıyla birebir) */
/** DB: products (Drizzle şemasıyla birebir) */
export type ProductRow = {
  id: string;
  title: string;
  slug: string;

  price: number;
  description?: string | null;

  category_id: string;
  sub_category_id?: string | null;

  /** Tekil kapak görsel alanları */
  image_url?: string | null;
  storage_asset_id?: string | null;
  alt?: string | null;

  /** Galeri */
  images: string[];
  storage_image_ids: string[];

  is_active: DbBool;
  is_featured: DbBool;

  tags: string[];
  specifications?: ProductSpecifications | null; // JSON object

  product_code?: string | null;
  stock_quantity: number;

  rating: number;
  review_count: number;

  meta_title?: string | null;
  meta_description?: string | null;

  created_at: string;
  updated_at: string;
};


/** DB: product_specs */
export type ProductSpecRow = {
  id: string;
  product_id: string;
  name: string;
  value: string;
  category: "physical" | "material" | "service" | "custom";
  order_num: number;
  created_at: string;
  updated_at: string;
};

/** DB: product_faqs */
export type ProductFaqRow = {
  id: string;
  product_id: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: DbBool;
  created_at: string;
  updated_at: string;
};

/** DB: product_options */
export type ProductOptionRow = {
  id: string;
  product_id: string;
  option_name: string;
  option_values: string[]; // JSON
  created_at: string;
  updated_at: string;
};

/** DB: product_stock */
export type ProductStockRow = {
  id: string;
  product_id: string;
  stock_content: string;
  is_used: DbBool;
  used_at?: string | null;
  created_at: string;
  order_item_id?: string | null;
};

/** DB: product_reviews */
export type ProductReviewRow = {
  id: string;
  product_id: string;
  user_id?: string | null;
  rating: number;
  comment?: string | null;
  is_active: DbBool;
  customer_name?: string | null;
  review_date: string;
  created_at: string;
  updated_at: string;
};

// Uyum kolaylığı (alias)
export type Product = ProductRow;
export type Faq = ProductFaqRow;
export type Review = ProductReviewRow;
export type ProductOption = ProductOptionRow;
export type Stock = ProductStockRow;
export type Spec = ProductSpecRow;
