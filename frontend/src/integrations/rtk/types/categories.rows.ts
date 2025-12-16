// =============================================================
// FILE: src/integrations/metahub/db/types/categories.rows.ts
// =============================================================

export type DbBool = 0 | 1 | boolean;

export type Category = {
  id: string;
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

/** Admin form’da kullanılacak sade tip (tamamen FE state’i) */
export type CategoryForm = {
  id?: string;                 // edit’te set edilir
  name: string;
  slug: string;
  description?: string;
  image_url?: string | null;
  alt?: string | null;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
};
