// src/integrations/metahub/db/types/infoCards.ts
export type InfoCardRow = {
  id: string;
  title: string;
  description: string;
  icon: string;
  icon_type: "emoji" | "lucide";
  lucide_icon?: string | null;
  link: string;
  bg_color: string;
  hover_color: string;
  icon_color: string;
  text_color: string;
  border_color: string;
  is_active: 0 | 1 | boolean | "0" | "1" | "true" | "false";
  display_order: number;
  created_at?: string;
  updated_at?: string;
};

export type InfoCardView = InfoCardRow & { is_active: boolean };
