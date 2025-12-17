-- =============================================================
-- FILE: 20_properties_schema.sql
-- Properties + Property Assets (Sahibinden benzeri alanlar)
-- Drizzle schema ile birebir uyumlu (src/modules/properties/schema.ts)
-- =============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =============================================================
-- TABLE: properties
-- =============================================================
CREATE TABLE IF NOT EXISTS `properties` (
  `id`              CHAR(36)       NOT NULL,

  -- Başlık / slug
  `title`           VARCHAR(255)   NOT NULL,
  `slug`            VARCHAR(255)   NOT NULL,

  -- Tip / Durum
  `type`            VARCHAR(255)   NOT NULL,
  `status`          VARCHAR(64)    NOT NULL,

  -- Adres / konum
  `address`         VARCHAR(500)   NOT NULL,
  `district`        VARCHAR(255)   NOT NULL,
  `city`            VARCHAR(255)   NOT NULL,
  `neighborhood`    VARCHAR(255)   DEFAULT NULL,

  -- Koordinatlar
  `lat`             DECIMAL(10,6)  NOT NULL,
  `lng`             DECIMAL(10,6)  NOT NULL,

  -- Metin
  `description`     TEXT           DEFAULT NULL,

  -- =========================================================
  -- Fiyat
  -- =========================================================
  `price`           DECIMAL(12,2)  DEFAULT NULL,
  `currency`        VARCHAR(8)     NOT NULL DEFAULT 'TRY',
  `min_price_admin` DECIMAL(12,2)  DEFAULT NULL,

  -- Kart metası
  `listing_no`      VARCHAR(32)    DEFAULT NULL,
  `badge_text`      VARCHAR(40)    DEFAULT NULL,
  `featured`        TINYINT UNSIGNED NOT NULL DEFAULT 0,

  -- =========================================================
  -- m2
  -- =========================================================
  `gross_m2`        INT UNSIGNED   DEFAULT NULL,
  `net_m2`          INT UNSIGNED   DEFAULT NULL,

  -- =========================================================
  -- Filtrelenecek çekirdek alanlar
  -- =========================================================
  `rooms`           VARCHAR(16)    DEFAULT NULL,
  `bedrooms`        TINYINT UNSIGNED DEFAULT NULL,

  `building_age`    VARCHAR(32)    DEFAULT NULL,

  `floor`           VARCHAR(32)    DEFAULT NULL,
  `floor_no`        INT            DEFAULT NULL,

  `total_floors`    INT UNSIGNED   DEFAULT NULL,

  `heating`         VARCHAR(64)    DEFAULT NULL,

  `usage_status`    VARCHAR(32)    DEFAULT NULL,

  -- =========================================================
  -- Bool filtreler
  -- =========================================================
  `furnished`       TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `in_site`         TINYINT UNSIGNED NOT NULL DEFAULT 0,

  `has_elevator`    TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `has_parking`     TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `has_balcony`     TINYINT UNSIGNED NOT NULL DEFAULT 0,

  `has_garden`      TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `has_terrace`     TINYINT UNSIGNED NOT NULL DEFAULT 0,

  `credit_eligible` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `swap`            TINYINT UNSIGNED NOT NULL DEFAULT 0,

  `has_video`       TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `has_clip`        TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `has_virtual_tour` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `has_map`         TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `accessible`      TINYINT UNSIGNED NOT NULL DEFAULT 0,

  -- =========================================================
  -- Legacy cover (Slider ile aynı pattern)
  -- =========================================================
  `image_url`       TEXT           DEFAULT NULL,
  `image_asset_id`  CHAR(36)       DEFAULT NULL,
  `alt`             VARCHAR(255)   DEFAULT NULL,

  -- Yayın / sıralama
  `is_active`       TINYINT        NOT NULL DEFAULT 1,
  `display_order`   INT            NOT NULL DEFAULT 0,

  `created_at`      DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`      DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),

  UNIQUE KEY `ux_properties_slug` (`slug`),

  KEY `properties_created_idx` (`created_at`),
  KEY `properties_updated_idx` (`updated_at`),
  KEY `properties_is_active_idx` (`is_active`),
  KEY `properties_featured_idx` (`featured`),
  KEY `properties_display_order_idx` (`display_order`),

  KEY `properties_district_idx` (`district`),
  KEY `properties_city_idx` (`city`),
  KEY `properties_type_idx` (`type`),
  KEY `properties_status_idx` (`status`),

  KEY `properties_price_idx` (`price`),
  KEY `properties_rooms_idx` (`rooms`),
  KEY `properties_bedrooms_idx` (`bedrooms`),
  KEY `properties_building_age_idx` (`building_age`),

  KEY `properties_floor_no_idx` (`floor_no`),
  KEY `properties_total_floors_idx` (`total_floors`),

  KEY `properties_heating_idx` (`heating`),
  KEY `properties_usage_status_idx` (`usage_status`),

  KEY `properties_furnished_idx` (`furnished`),
  KEY `properties_in_site_idx` (`in_site`),
  KEY `properties_has_elevator_idx` (`has_elevator`),
  KEY `properties_has_parking_idx` (`has_parking`),

  KEY `properties_credit_eligible_idx` (`credit_eligible`),
  KEY `properties_swap_idx` (`swap`),

  KEY `properties_has_video_idx` (`has_video`),
  KEY `properties_has_virtual_tour_idx` (`has_virtual_tour`),

  KEY `properties_image_asset_idx` (`image_asset_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================
-- TABLE: property_assets (ilan galerisi)
-- =============================================================
CREATE TABLE IF NOT EXISTS `property_assets` (
  `id`            CHAR(36)       NOT NULL,
  `property_id`   CHAR(36)       NOT NULL,

  `asset_id`      CHAR(36)       DEFAULT NULL,
  `url`           TEXT           DEFAULT NULL,
  `alt`           VARCHAR(255)   DEFAULT NULL,

  `kind`          VARCHAR(24)    NOT NULL DEFAULT 'image',
  `mime`          VARCHAR(100)   DEFAULT NULL,

  `is_cover`      TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `display_order` INT            NOT NULL DEFAULT 0,

  `created_at`    DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`    DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),

  KEY `property_assets_property_idx` (`property_id`),
  KEY `property_assets_asset_idx` (`asset_id`),
  KEY `property_assets_cover_idx` (`property_id`, `is_cover`),
  KEY `property_assets_order_idx` (`property_id`, `display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
