// src/seo/applySeo.ts
type SeoDefaults = {
  canonicalBase?: string;
  siteName?: string;
  ogLocale?: string;
  author?: string;
  themeColor?: string;
  twitterCard?: string;
  robots?: string;
  googlebot?: string;
};

type SeoPage = {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  titleTemplate?: string;
  descriptionTemplate?: string;
  keywordsTemplate?: string;
};

export function absUrl(base: string, pathOrUrl: string | undefined): string | undefined {
  const s = (pathOrUrl || "").trim();
  if (!s) return undefined;
  if (/^https?:\/\//i.test(s)) return s;
  return base.replace(/\/+$/, "") + "/" + s.replace(/^\/+/, "");
}

export function buildPageSeo(args: {
  defaults: SeoDefaults;
  page: SeoPage;
  pathname: string;
  data?: Record<string, string | number | null | undefined>; // detail template vars
}) {
  const base = (args.defaults.canonicalBase || "").trim() || "https://xemlak.com";
  const canonical = absUrl(base, args.pathname) || base;

  const applyTpl = (tpl?: string) => {
    const s = (tpl || "").trim();
    if (!s) return "";
    const data = args.data || {};
    return s.replace(/\{\{(\w+)\}\}/g, (_, k) => String(data[k] ?? ""));
  };

  const title =
    (args.page.title && args.page.title.trim()) ||
    applyTpl(args.page.titleTemplate) ||
    (args.defaults.siteName || "X Emlak");

  const description =
    (args.page.description && args.page.description.trim()) ||
    applyTpl(args.page.descriptionTemplate) ||
    "";

  const keywords =
    (args.page.keywords && args.page.keywords.trim()) ||
    applyTpl(args.page.keywordsTemplate) ||
    "";

  const ogImage = absUrl(base, args.page.ogImage);

  return { base, canonical, title, description, keywords, ogImage };
}
