-- 20_properties_schema.sql
-- Properties (Emlaklar) table (Sahibinden benzeri alanlar + cover image + admin-only min_price_admin)

CREATE TABLE IF NOT EXISTS `properties` (
  `id`            CHAR(36)      NOT NULL,

  `title`         VARCHAR(255)  NOT NULL,
  `slug`          VARCHAR(255)  NOT NULL,

  `type`          VARCHAR(255)  NOT NULL,  -- Daire, Arsa, Villa...
  `status`        VARCHAR(64)   NOT NULL,  -- satilik, kiralik, sold...

  `address`       VARCHAR(500)  NOT NULL,
  `district`      VARCHAR(255)  NOT NULL,
  `city`          VARCHAR(255)  NOT NULL,
  `neighborhood`  VARCHAR(255)  DEFAULT NULL,  -- ops

  `lat`           DECIMAL(10,6) NOT NULL,
  `lng`           DECIMAL(10,6) NOT NULL,

  `description`   TEXT          DEFAULT NULL,

  -- ================= Sahibinden benzeri detaylar =================

  `price`         DECIMAL(12,2) DEFAULT NULL,
  `currency`      VARCHAR(8)    NOT NULL DEFAULT 'TRY',

  -- ✅ Admin-only
  `min_price_admin` DECIMAL(12,2) DEFAULT NULL,

  -- Kart metası
  `listing_no`    VARCHAR(32)   DEFAULT NULL,
  `badge_text`    VARCHAR(40)   DEFAULT NULL,
  `featured`      TINYINT(1)    NOT NULL DEFAULT 0,

  -- Emlak detayları
  `gross_m2`      INT(10) UNSIGNED DEFAULT NULL,
  `net_m2`        INT(10) UNSIGNED DEFAULT NULL,
  `rooms`         VARCHAR(16)   DEFAULT NULL,
  `building_age`  VARCHAR(32)   DEFAULT NULL,
  `floor`         VARCHAR(32)   DEFAULT NULL,
  `total_floors`  INT(10) UNSIGNED DEFAULT NULL,

  -- Isınma / eşya / site vb.
  `heating`       VARCHAR(64)   DEFAULT NULL,
  `furnished`     TINYINT(1)    NOT NULL DEFAULT 0,
  `in_site`       TINYINT(1)    NOT NULL DEFAULT 0,
  `has_balcony`   TINYINT(1)    NOT NULL DEFAULT 0,
  `has_parking`   TINYINT(1)    NOT NULL DEFAULT 0,
  `has_elevator`  TINYINT(1)    NOT NULL DEFAULT 0,

  -- ================= Görsel (Slider ile aynı pattern) =================
  `image_url`      TEXT         DEFAULT NULL,
  `image_asset_id` CHAR(36)     DEFAULT NULL,
  `alt`            VARCHAR(255) DEFAULT NULL,

  -- ================= Yayın / sıralama =================
  `display_order` INT(11)       NOT NULL DEFAULT 0,
  `is_active`     TINYINT(1)    NOT NULL DEFAULT 1,

  `created_at`    DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`    DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),

  UNIQUE KEY `ux_properties_slug` (`slug`),

  KEY `properties_active_idx`        (`is_active`),
  KEY `properties_featured_idx`      (`featured`),
  KEY `properties_display_order_idx` (`display_order`),
  KEY `properties_district_idx`      (`district`),
  KEY `properties_city_idx`          (`city`),
  KEY `properties_type_idx`          (`type`),
  KEY `properties_status_idx`        (`status`),
  KEY `properties_neighborhood_idx`  (`neighborhood`),

  KEY `properties_price_idx`         (`price`),
  KEY `properties_image_asset_idx`   (`image_asset_id`),

  KEY `properties_created_idx`       (`created_at`),
  KEY `properties_updated_idx`       (`updated_at`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
