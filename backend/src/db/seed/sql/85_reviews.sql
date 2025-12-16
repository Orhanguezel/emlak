-- 0xx_reviews.sql
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id`            CHAR(36)     NOT NULL,
  `name`          VARCHAR(255) NOT NULL,
  `email`         VARCHAR(255) NOT NULL,
  `rating`        INT          NOT NULL DEFAULT 5,
  `comment`       LONGTEXT     NOT NULL,
  `is_active`     TINYINT(1)   NOT NULL DEFAULT 1,
  `is_approved`   TINYINT(1)   NOT NULL DEFAULT 0,
  `display_order` INT          NOT NULL DEFAULT 0,
  `created_at`    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `reviews_active_idx`(`is_active`),
  KEY `reviews_approved_idx`(`is_approved`),
  KEY `reviews_order_idx`(`display_order`),
  KEY `reviews_created_idx`(`created_at`),
  KEY `reviews_updated_idx`(`updated_at`),
  KEY `reviews_rating_idx`(`rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Opsiyonel seed
INSERT INTO `reviews`
(`id`,`name`,`email`,`rating`,`comment`,`is_active`,`is_approved`,`display_order`,`created_at`,`updated_at`)
VALUES
(UUID(),'Ayşe K.','ayse@example.com',5,'Hizmetten çok memnun kaldık, teşekkürler.',1,1,1,'2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),
(UUID(),'Mehmet D.','mehmet@example.com',4,'Zamanında teslim ve özenli çalışma.',1,1,2,'2024-01-02 00:00:00.000','2024-01-02 00:00:00.000'),
(UUID(),'Zeynep B.','zeynep@example.com',5,'İletişim çok hızlı, kaliteli işçilik.',1,1,3,'2024-01-03 00:00:00.000','2024-01-03 00:00:00.000');
