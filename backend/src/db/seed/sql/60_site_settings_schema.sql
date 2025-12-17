/* site_settings_schema.sql  (X Emlak) */

SET NAMES utf8mb4;
SET time_zone = '+00:00';

DROP TABLE IF EXISTS `site_settings`;

CREATE TABLE `site_settings` (
  `id` CHAR(36) NOT NULL,
  `key` VARCHAR(100) NOT NULL,
  `value` MEDIUMTEXT NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `site_settings_key_uq` (`key`),
  KEY `site_settings_key_idx` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- BRAND / UI / ROUTES
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`value`,`created_at`,`updated_at`) VALUES
(UUID(), 'brand_name',             '"X Emlak"', NOW(3), NOW(3)),
(UUID(), 'brand_tagline',          '"güvenilir gayrimenkul danışmanlığı"', NOW(3), NOW(3)),
(UUID(), 'ui_theme',               '{"color":"slate","primaryHex":"#1e293b","darkMode":false,"navbarHeight":96}', NOW(3), NOW(3)),
(UUID(), 'site_version',           '"1.0.0"', NOW(3), NOW(3)),
(UUID(), 'admin_path',             '"/adminkontrol"', NOW(3), NOW(3));

-- =============================================================
-- CONTACT
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`value`,`created_at`,`updated_at`) VALUES
(UUID(), 'contact_phone_display',  '"+49 000 000000"', NOW(3), NOW(3)),
(UUID(), 'contact_phone_tel',      '"+49000000000"', NOW(3), NOW(3)),
(UUID(), 'contact_email',          '"info@xemlak.com"', NOW(3), NOW(3)),
(UUID(), 'contact_to_email',       '"info@xemlak.com"', NOW(3), NOW(3)),
(UUID(), 'contact_address',        '"Örnek Mah. Örnek Cad. No:1, 41460 Grevenbroich, Almanya"', NOW(3), NOW(3)),
(UUID(), 'contact_whatsapp_link',  '"https://wa.me/49000000000"', NOW(3), NOW(3));

-- =============================================================
-- STORAGE / UPLOAD CONFIG
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`value`,`created_at`,`updated_at`) VALUES
(UUID(), 'storage_driver',             '"local"', NOW(3), NOW(3)),
(UUID(), 'storage_local_root',         '"/www/wwwroot/xemlak/uploads"', NOW(3), NOW(3)),
(UUID(), 'storage_local_base_url',     '"http://localhost:8085/uploads"', NOW(3), NOW(3)),
(UUID(), 'storage_cdn_public_base',    '"https://cdn.xemlak.com"', NOW(3), NOW(3)),
(UUID(), 'storage_public_api_base',    '"https://xemlak.com/api"', NOW(3), NOW(3)),
(UUID(), 'cloudinary_cloud_name',      '""', NOW(3), NOW(3)),
(UUID(), 'cloudinary_api_key',         '""', NOW(3), NOW(3)),
(UUID(), 'cloudinary_api_secret',      '"__SET_IN_ENV__"', NOW(3), NOW(3)),
(UUID(), 'cloudinary_folder',          '"uploads"', NOW(3), NOW(3)),
(UUID(), 'cloudinary_unsigned_preset', '""', NOW(3), NOW(3));

-- =============================================================
-- SMTP / MAIL CONFIG
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`value`,`created_at`,`updated_at`) VALUES
(UUID(), 'smtp_host',        '"smtp.example.com"', NOW(3), NOW(3)),
(UUID(), 'smtp_port',        '587', NOW(3), NOW(3)),
(UUID(), 'smtp_username',    '"info@xemlak.com"', NOW(3), NOW(3)),
(UUID(), 'smtp_password',    '"__SET_IN_ENV__"', NOW(3), NOW(3)),
(UUID(), 'smtp_from_email',  '"info@xemlak.com"', NOW(3), NOW(3)),
(UUID(), 'smtp_from_name',   '"X Emlak"', NOW(3), NOW(3)),
(UUID(), 'smtp_ssl',         'false', NOW(3), NOW(3));

-- =============================================================
-- HEADER METİNLER
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`value`,`created_at`,`updated_at`) VALUES
(UUID(), 'header_info_text',       '"Portföy ve danışmanlık için"', NOW(3), NOW(3)),
(UUID(), 'header_cta_label',       '"İLETİŞİME GEÇ"', NOW(3), NOW(3));

-- =============================================================
-- HEADER MENU (site_settings tabanlı)
-- (Hizmetler yok, ücretsiz değerleme yok)
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`value`,`created_at`,`updated_at`) VALUES
(
  UUID(),
  'header_menu',
  '[
    {"title":"ANASAYFA","path":"/","pageKey":"home","type":"link"},
    {"title":"EMLAKLAR","path":"/emlaklar","pageKey":"properties","type":"link"},
    {"title":"KURUMSAL","path":"#","pageKey":"kurumsal","type":"dropdown","itemsKey":"menu_kurumsal"},
    {"title":"İLETİŞİM","path":"/iletisim","pageKey":"contact","type":"link"}
  ]',
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = CURRENT_TIMESTAMP(3);

-- =============================================================
-- FOOTER
-- (Services içinden "Ücretsiz Ön Değerleme" kaldırıldı)
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`value`,`created_at`,`updated_at`) VALUES
(UUID(), 'footer_keywords',    '["Gayrimenkul Danışmanlığı","Satılık Daire","Kiralık Daire","Satılık Arsa","Ticari Gayrimenkul","Emsal Analizi","Güvenli Alım Satım"]', NOW(3), NOW(3)),
(UUID(), 'footer_services',    '["Satış Danışmanlığı","Kiralama Danışmanlığı","Pazarlama ve İlan Yönetimi"]', NOW(3), NOW(3)),
(UUID(), 'footer_quick_links', '[{"title":"Anasayfa","path":"/","pageKey":"home"},{"title":"Emlaklar","path":"/emlaklar","pageKey":"properties"},{"title":"Hakkımızda","path":"/hakkimizda","pageKey":"about"},{"title":"İletişim","path":"/iletisim","pageKey":"contact"}]', NOW(3), NOW(3));

-- =============================================================
-- MENU (Header dropdown içerikleri)
-- (Diğer hizmetler menüsü kaldırıldı)
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`value`,`created_at`,`updated_at`) VALUES
(
  UUID(),
  'menu_kurumsal',
  '[{"title":"HAKKIMIZDA","path":"/hakkimizda","pageKey":"about"},{"title":"MİSYONUMUZ - VİZYONUMUZ","path":"/misyon-vizyon","pageKey":"mission"},{"title":"KALİTE POLİTİKAMIZ","path":"/kalite-politikamiz","pageKey":"quality"},{"title":"S.S.S.","path":"/sss","pageKey":"faq"}]',
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = CURRENT_TIMESTAMP(3);

-- =============================================================
-- SEO GLOBAL / DEFAULTS
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`value`,`created_at`,`updated_at`) VALUES
(UUID(), 'seo_defaults',       '{"canonicalBase":"https://xemlak.com","siteName":"X Emlak | Gayrimenkul Danışmanlığı","ogLocale":"tr_TR","author":"X Emlak","themeColor":"#1e293b","twitterCard":"summary_large_image","robots":"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1","googlebot":"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}', NOW(3), NOW(3)),
(UUID(), 'seo_social_same_as', '["https://www.instagram.com/xemlak","https://www.facebook.com/xemlak"]', NOW(3), NOW(3)),
(UUID(), 'seo_app_icons',      '{"appleTouchIcon":"/apple-touch-icon.png","favicon32":"/favicon-32x32.png","favicon16":"/favicon-16x16.png"}', NOW(3), NOW(3)),
(UUID(), 'seo_amp_google_client_id_api', '"googleanalytics"', NOW(3), NOW(3));

-- =============================================================
-- SEO SAYFA BAZLI (X Emlak)
-- (Ücretsiz değerleme referansları kaldırıldı)
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`value`,`created_at`,`updated_at`) VALUES
(UUID(), 'seo_pages_home',       '{"title":"X Emlak | Satılık & Kiralık Gayrimenkuller","description":"X Emlak ile satılık/kiralık konut, arsa ve ticari gayrimenkulleri inceleyin. Şeffaf süreç, doğru fiyatlama ve profesyonel danışmanlık.","keywords":"x emlak, satılık daire, kiralık daire, satılık arsa, ticari gayrimenkul, gayrimenkul danışmanlığı","ogImage":"/og/home.jpg"}', NOW(3), NOW(3)),
(UUID(), 'seo_pages_properties', '{"title":"Emlaklar | X Emlak Portföy","description":"Konut, arsa ve ticari portföyümüzü keşfedin. Detaylı bilgiler, konum ve filtreleme ile size uygun gayrimenkulü bulun.","keywords":"emlaklar, portföy, satılık, kiralık, konut, arsa, ticari","ogImage":"/og/properties.jpg"}', NOW(3), NOW(3)),
(UUID(), 'seo_pages_contact',    '{"title":"İletişim | X Emlak","description":"X Emlak ile iletişime geçin. Satış ve kiralama için hızlı geri dönüş.","keywords":"x emlak iletişim, gayrimenkul danışmanlığı","ogImage":"/og/contact.jpg"}', NOW(3), NOW(3)),
(UUID(), 'seo_pages_about',      '{"title":"Hakkımızda | X Emlak","description":"X Emlak: şeffaf süreç yönetimi, doğru fiyatlama ve profesyonel pazarlama ile güvenilir gayrimenkul danışmanlığı.","keywords":"x emlak hakkında, emlak danışmanlığı, şeffaf süreç, doğru fiyatlama","ogImage":"/og/about.jpg"}', NOW(3), NOW(3)),
(UUID(), 'seo_pages_property_detail', '{"titleTemplate":"{{title}} | X Emlak","descriptionTemplate":"{{title}} ilan detayı. X Emlak portföyünde satılık/kiralık gayrimenkulleri inceleyin.","keywordsTemplate":"x emlak, ilan detayı, {{title}}, satılık, kiralık, gayrimenkul","ogImage":"/og/property.jpg"}', NOW(3), NOW(3));

-- =============================================================
-- JSON-LD (RealEstateAgent / LocalBusiness)
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`value`,`created_at`,`updated_at`) VALUES
(UUID(), 'seo_local_business', '{"@context":"https://schema.org","@type":"RealEstateAgent","name":"X Emlak","description":"Satış ve kiralamada şeffaf süreç ve profesyonel gayrimenkul danışmanlığı","url":"https://xemlak.com","telephone":"+49-000-000000","address":{"@type":"PostalAddress","addressLocality":"Grevenbroich","addressCountry":"DE"},"geo":{"@type":"GeoCoordinates","latitude":51.090,"longitude":6.582},"sameAs":["https://www.instagram.com/xemlak","https://www.facebook.com/xemlak"],"priceRange":"$$","serviceArea":{"@type":"GeoCircle","geoMidpoint":{"@type":"GeoCoordinates","latitude":51.090,"longitude":6.582},"geoRadius":50000}}', NOW(3), NOW(3));

-- =============================================================
-- SEO (örnek ekstra)
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`value`,`created_at`,`updated_at`) VALUES
(UUID(), 'seo_contact_title', '"İletişim - X Emlak"', NOW(3), NOW(3));
