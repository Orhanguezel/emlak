// src/data/pageSlugs.ts
export const PAGE_SLUGS = {
  about: "hakkimizda",
  missionVision: "misyon-vizyon",
  qualityPolicy: "kalite-politikamiz",
} as const;

export type KnownPageSlug = typeof PAGE_SLUGS[keyof typeof PAGE_SLUGS];
