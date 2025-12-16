-- 097_slider.sql  (X Emlak • Drizzle şemasıyla birebir uyumlu)

DROP TABLE IF EXISTS `slider`;
CREATE TABLE `slider` (
  `id`                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid`              CHAR(36)     NOT NULL,
  `name`              VARCHAR(255) NOT NULL,
  `slug`              VARCHAR(255) NOT NULL,
  `description`       TEXT,

  `image_url`         TEXT,
  `image_asset_id`    CHAR(36),
  `alt`               VARCHAR(255),
  `button_text`       VARCHAR(100),
  `button_link`       VARCHAR(255),

  `featured`          TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
  `is_active`         TINYINT(1) UNSIGNED NOT NULL DEFAULT 1,

  `display_order`     INT UNSIGNED NOT NULL DEFAULT 0,

  `created_at`        DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`        DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_slider_slug` (`slug`),
  UNIQUE KEY `uniq_slider_uuid` (`uuid`),
  KEY `idx_slider_active` (`is_active`),
  KEY `idx_slider_order`  (`display_order`),
  KEY `idx_slider_image_asset`(`image_asset_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `slider`
(`id`,`uuid`,`name`,`slug`,`description`,`image_url`,`image_asset_id`,`alt`,`button_text`,`button_link`,
 `featured`,`is_active`,`display_order`,`created_at`,`updated_at`)
VALUES
-- slide-1
(1, UUID(),
 'X Emlak ile Güvenli Alım-Satım ve Kiralama',
 'x-emlak-ile-guvenli-alim-satim-kiralama',
 'Şeffaf süreç yönetimi, doğru fiyatlama ve hızlı iletişim ile gayrimenkul danışmanlığı',
 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=600&fit=crop',
 NULL,
 'X Emlak - güvenli alım satım ve kiralama danışmanlığı',
 'Portföyü Gör',
 '/emlaklar',
 1, 1, 1,
 '2026-01-10 00:00:00.000','2026-01-10 00:00:00.000'),

-- slide-2
(2, UUID(),
 'Konut, Arsa ve Ticari Portföy',
 'konut-arsa-ticari-portfoy',
 'Bölgenize uygun seçenekler: konut, arsa ve ticari gayrimenkul portföyü',
 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&h=600&fit=crop',
 NULL,
 'Konut arsa ticari portföy - X Emlak',
 'Emlakları İncele',
 '/emlaklar',
 0, 1, 2,
 '2026-01-11 00:00:00.000','2026-01-11 00:00:00.000'),

-- slide-3
(3, UUID(),
 'Ücretsiz Ön Değerlendirme ve Fiyat Analizi',
 'ucretsiz-on-degerlendirme-ve-fiyat-analizi',
 'Emsal analizi ve piyasa verileriyle mülkünüz için doğru fiyat aralığını birlikte belirleyelim',
 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=600&fit=crop',
 NULL,
 'Ücretsiz fiyat analizi - X Emlak',
 'Değerleme Talep Et',
 '/iletisim',
 0, 1, 3,
 '2026-01-12 00:00:00.000','2026-01-12 00:00:00.000'),

-- slide-4
(4, UUID(),
 'Hızlı İletişim, Güçlü Takip',
 'hizli-iletisim-guclu-takip',
 'Aday yönetimi, randevu planlama, teklif ve sözleşme sürecinde uçtan uca takip',
 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=600&fit=crop',
 NULL,
 'Hızlı iletişim ve süreç takibi - X Emlak',
 'Bize Ulaşın',
 '/iletisim',
 0, 1, 4,
 '2026-01-13 00:00:00.000','2026-01-13 00:00:00.000'),

-- slide-5
(5, UUID(),
 'Yeni Yıl Ev Sahibi Kampanyası',
 'yeni-yil-ev-sahibi-kampanyasi',
 'Seçili portföylerde özel danışmanlık ve hedefli pazarlama desteği (detaylar sayfada)',
 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200&h=600&fit=crop',
 NULL,
 'Yeni yıl kampanyası - X Emlak',
 'Detayları Gör',
 '/yeni-yil-kampanyasi',
 0, 1, 5,
 '2026-01-14 00:00:00.000','2026-01-14 00:00:00.000');
