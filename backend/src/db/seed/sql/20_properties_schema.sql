-- 20_properties_schema.sql
-- Properties (Emlaklar) table (location-aware + basic filters)

CREATE TABLE IF NOT EXISTS `properties` (
  `id`            CHAR(36)      NOT NULL,

  `title`         VARCHAR(255)  NOT NULL,
  `slug`          VARCHAR(255)  NOT NULL,

  `type`          VARCHAR(255)  NOT NULL,  -- Daire, Arsa, Villa...
  `status`        VARCHAR(64)   NOT NULL,  -- new, in_progress, sold...

  `address`       VARCHAR(500)  NOT NULL,
  `district`      VARCHAR(255)  NOT NULL,
  `city`          VARCHAR(255)  NOT NULL,

  `lat`           DECIMAL(10,6) NOT NULL,
  `lng`           DECIMAL(10,6) NOT NULL,

  `description`   TEXT          DEFAULT NULL,

  `display_order` INT(11)       NOT NULL DEFAULT 0,
  `is_active`     TINYINT(1)    NOT NULL DEFAULT 1,

  `created_at`    DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`    DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),

  -- Uniques
  UNIQUE KEY `ux_properties_slug` (`slug`),

  -- Common filters
  KEY `properties_active_idx`        (`is_active`),
  KEY `properties_display_order_idx` (`display_order`),
  KEY `properties_district_idx`      (`district`),
  KEY `properties_city_idx`          (`city`),
  KEY `properties_type_idx`          (`type`),
  KEY `properties_status_idx`        (`status`),

  -- Frequently used sort keys
  KEY `properties_created_idx`       (`created_at`),
  KEY `properties_updated_idx`       (`updated_at`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
