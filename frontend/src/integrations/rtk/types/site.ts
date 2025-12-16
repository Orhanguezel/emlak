// =============================================================
// FILE: src/integrations/metahub/db/types/site.ts
// =============================================================

export type ValueType = "string" | "number" | "boolean" | "json";

/** FE/BE arasında ayakta kalacak JSON-benzeri tip */
export type SettingValue =
  | string
  | number
  | boolean
  | null
  | { [k: string]: SettingValue }
  | SettingValue[];

export type SiteSettingRow = {
  id?: string;
  key: string;
  value: unknown;              // normalize edilip SettingValue'a dönüştürülecek
  value_type?: ValueType | null;
  group?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
};
