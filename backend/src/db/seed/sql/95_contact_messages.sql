-- 95_contact_messages.sql
DROP TABLE IF EXISTS `contact_messages`;
CREATE TABLE `contact_messages` (
  `id`           CHAR(36)     NOT NULL,
  `name`         VARCHAR(255) NOT NULL,
  `email`        VARCHAR(255) NOT NULL,
  `phone`        VARCHAR(64)  NOT NULL,
  `subject`      VARCHAR(255) NOT NULL,
  `message`      LONGTEXT     NOT NULL,

  `status`       VARCHAR(32)  NOT NULL DEFAULT 'new', -- 'new' | 'in_progress' | 'closed'
  `is_resolved`  TINYINT(1)   NOT NULL DEFAULT 0,

  `admin_note`   VARCHAR(2000) DEFAULT NULL,

  `ip`           VARCHAR(64)   DEFAULT NULL,
  `user_agent`   VARCHAR(512)  DEFAULT NULL,
  `website`      VARCHAR(255)  DEFAULT NULL,

  `created_at`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  KEY `contact_created_idx` (`created_at`),
  KEY `contact_updated_idx` (`updated_at`),
  KEY `contact_status_idx` (`status`),
  KEY `contact_resolved_idx` (`is_resolved`),
  KEY `contact_status_resolved_created_idx` (`status`, `is_resolved`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `contact_messages`
(`id`,`name`,`email`,`phone`,`subject`,`message`,`status`,`is_resolved`,`admin_note`,`ip`,`user_agent`,`website`,`created_at`,`updated_at`)
VALUES
(UUID(),
 'Ahmet Yılmaz','ahmet@example.com','+90 532 000 00 01','Mezar taşı teklifi',
 'Merhaba, tek kişilik mermer mezar için fiyat ve teslim süresi alabilir miyim?',
 'new',0,NULL,'203.0.113.11','Mozilla/5.0','', '2024-01-02 10:00:00.000','2024-01-02 10:00:00.000'),

(UUID(),
 'Ayşe Demir','ayse@example.com','+90 555 111 11 22','Aile mezarı hakkında',
 'Aile mezarı ölçü ve granit seçenekleri hakkında bilgi rica ederim.',
 'in_progress',0,'Teklif hazırla ve ölçü istedi.','198.51.100.5','Mozilla/5.0',NULL,'2024-01-03 12:30:00.000','2024-01-03 12:45:00.000'),

(UUID(),
 'Mehmet Kara','mehmet@example.com','+90 542 222 22 33','Bakım hizmeti',
 'Mevcut mezarın temizlik ve bakım ücretleri nedir?',
 'closed',1,'Bilgi verildi, kapanış yapıldı.','192.0.2.44','Mozilla/5.0',NULL,'2024-01-04 09:15:00.000','2024-01-04 10:00:00.000'),

(UUID(),
 'Elif Koç','elif@example.com','+90 530 333 33 44','Özel tasarım mezar',
 'Modern tasarım granit mezar için görsel ve fiyat bilgisi rica ediyorum.',
 'new',0,NULL,NULL,NULL,NULL,'2024-01-05 14:20:00.000','2024-01-05 14:20:00.000')
ON DUPLICATE KEY UPDATE
 `name`=VALUES(`name`),
 `email`=VALUES(`email`),
 `phone`=VALUES(`phone`),
 `subject`=VALUES(`subject`),
 `message`=VALUES(`message`),
 `status`=VALUES(`status`),
 `is_resolved`=VALUES(`is_resolved`),
 `admin_note`=VALUES(`admin_note`),
 `ip`=VALUES(`ip`),
 `user_agent`=VALUES(`user_agent`),
 `website`=VALUES(`website`),
 `updated_at`=VALUES(`updated_at`);
