-- 21_properties_seed.sql
-- Seed for properties (sample records)

INSERT INTO `properties`
(`id`, `title`, `slug`, `type`, `status`, `address`, `district`, `city`, `lat`, `lng`, `description`, `display_order`, `is_active`)
VALUES
-- ================= SAMPLE PROPERTIES =================
('11111111-1111-4111-8111-111111111111',
 'Merkezde 2+1 Daire', 'merkezde-2-1-daire',
 'Daire', 'new',
 'Musteri Mah. Örnek Sk. No:10 D:5', 'Musteri', 'Köln',
 50.937531, 6.960279,
 'Not: Tapu durumu kontrol edilecek. İlk görüşme olumlu.',
 0, 1),

('22222222-2222-4222-8222-222222222222',
 'Bahçeli Müstakil Ev', 'bahceli-mustakil-ev',
 'Müstakil', 'in_progress',
 'Örnek Cad. No:22', 'Grevenbroich', 'Düsseldorf',
 51.091610, 6.582200,
 'Not: Bahçe alanı geniş. Komisyon görüşülecek.',
 1, 1),

('33333333-3333-4333-8333-333333333333',
 'Yatırımlık Arsa', 'yatirimlik-arsa',
 'Arsa', 'new',
 'Parsel 123 Ada 45', 'Neuss', 'Düsseldorf',
 51.204178, 6.687951,
 'Not: İmar durumu belediyeden teyit edilecek.',
 2, 1),

('44444444-4444-4444-8444-444444444444',
 'Satıldı: 1+1 Daire', 'satildi-1-1-daire',
 'Daire', 'sold',
 'Kısa Sk. No:5', 'Musteri', 'Köln',
 50.935173, 6.953101,
 'Not: Satış tamamlandı. Evraklar arşivlendi.',
 3, 0)

ON DUPLICATE KEY UPDATE
  `title`         = VALUES(`title`),
  `slug`          = VALUES(`slug`),
  `type`          = VALUES(`type`),
  `status`        = VALUES(`status`),
  `address`       = VALUES(`address`),
  `district`      = VALUES(`district`),
  `city`          = VALUES(`city`),
  `lat`           = VALUES(`lat`),
  `lng`           = VALUES(`lng`),
  `description`   = VALUES(`description`),
  `display_order` = VALUES(`display_order`),
  `is_active`     = VALUES(`is_active`),
  `updated_at`    = CURRENT_TIMESTAMP(3);
