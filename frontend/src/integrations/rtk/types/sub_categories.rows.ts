// =============================================================
// FILE: src/integrations/metahub/db/types/sub_categories.rows.ts
// =============================================================
export type DbBool = 0 | 1 | boolean;

export type SubCategory = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  alt: string | null;
  icon: string | null;
  is_active: DbBool;
  is_featured: DbBool;
  display_order: number;
  created_at: string;
  updated_at: string;
};
