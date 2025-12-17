-- =============================================================
-- FILE: 21_properties_seed.sql
-- Seed for properties + property_assets (new schema compatible)
-- Notes:
-- - image_url: Unsplash demo
-- - asset_id: NULL (storage relation yoksa)
-- - lat/lng: Istanbul örnek koordinatlar
-- =============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =============================================================
-- PROPERTIES
-- =============================================================
INSERT INTO `properties`
(
  `id`,
  `title`, `slug`,
  `type`, `status`,
  `address`, `district`, `city`, `neighborhood`,
  `lat`, `lng`,
  `description`,

  `price`, `currency`,
  `min_price_admin`,

  `listing_no`, `badge_text`, `featured`,

  `gross_m2`, `net_m2`,

  `rooms`, `bedrooms`,
  `building_age`,

  `floor`, `floor_no`,
  `total_floors`,

  `heating`,
  `usage_status`,

  `furnished`, `in_site`,
  `has_elevator`, `has_parking`, `has_balcony`,
  `has_garden`, `has_terrace`,

  `credit_eligible`, `swap`,

  `has_video`, `has_clip`, `has_virtual_tour`,
  `has_map`, `accessible`,

  `image_url`, `image_asset_id`, `alt`,

  `display_order`, `is_active`
)
VALUES
-- ================= 1) Kadıköy / Moda =================
(
  '11111111-1111-4111-8111-111111111111',
  'Kadıköy Moda’da Ferah 2+1, Balkonlu', 'kadikoy-moda-ferah-2-1-balkonlu',
  'Daire', 'satilik',
  'Caferağa Mah. Moda Cd. No:12 D:5', 'Kadıköy', 'İstanbul', 'Moda',
  40.987200, 29.026600,
  'Notlar:
- Tapu: Kat mülkiyeti (örnek)
- Ulaşım: İskeleye ~12 dk yürüme (örnek)
- Cephe: Güney / Aydınlık (örnek)
- Aidat: 1.250 TL (örnek)
- Not: Bu kayıt demo amaçlıdır.',

  8950000.00, 'TRY',
  8200000.00,

  'ILN-IST-000001', 'Fırsat', 1,

  110, 92,

  '2+1', 2,
  '5-10',

  '3', 3,
  6,

  'Kombi',
  'bos',

  0, 1,
  1, 0, 1,
  0, 0,

  1, 0,

  0, 0, 1,
  1, 1,

  -- legacy cover (galerinin cover'ı ile aynı)
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=60&w=2400',
  NULL,
  'Kadıköy Moda ferah daire (örnek görsel)',

  0, 1
),

-- ================= 2) Beşiktaş / Levent =================
(
  '22222222-2222-4222-8222-222222222222',
  'Levent’te Site İçi 3+1, Otoparklı, Asansörlü', 'levent-site-ici-3-1-otoparkli-asansorlu',
  'Daire', 'satilik',
  'Levent Mah. Büyükdere Cd. No:88 D:14', 'Beşiktaş', 'İstanbul', 'Levent',
  41.081000, 29.011600,
  'Notlar:
- Güvenlik: 7/24 (örnek)
- Otopark: Kapalı (örnek)
- Sosyal alan: Spor salonu / havuz (örnek)
- Kredi: Uygun (örnek)
- Not: Bu kayıt demo amaçlıdır.',

  24500000.00, 'TRY',
  23000000.00,

  'ILN-IST-000002', 'Lüks', 1,

  185, 160,

  '3+1', 3,
  '0-5',

  '14', 14,
  22,

  'Merkezi',
  'ev_sahibi',

  0, 1,
  1, 1, 1,
  0, 1,

  1, 0,

  1, 0, 1,
  1, 1,

  'https://images.unsplash.com/photo-1501183638710-841dd1904471?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=60&w=2400',
  NULL,
  'Levent site içi modern daire (örnek görsel)',

  1, 1
),

-- ================= 3) Şişli / Mecidiyeköy (kiralık) =================
(
  '33333333-3333-4333-8333-333333333333',
  'Mecidiyeköy’de Eşyalı 1+1, Metroya Yakın', 'mecidiyekoy-esyali-1-1-metroya-yakin',
  'Daire', 'kiralik',
  'Fulya Mah. Büyükdere Cd. No:45 D:7', 'Şişli', 'İstanbul', 'Mecidiyeköy',
  41.065900, 28.998600,
  'Notlar:
- Kiracı profili: Beyaz yaka / öğrenci (örnek)
- Depozito: 2 kira (örnek)
- Eşya: Tam (örnek)
- Not: Bu kayıt demo amaçlıdır.',

  55000.00, 'TRY',
  45000.00,

  'ILN-IST-000003', 'Yeni', 0,

  65, 55,

  '1+1', 1,
  '10+',

  '7', 7,
  12,

  'Kombi',
  'bos',

  1, 1,
  1, 0, 0,
  0, 0,

  0, 0,

  1, 1, 0,
  1, 1,

  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=60&w=2400',
  NULL,
  'Mecidiyeköy eşyalı 1+1 (örnek görsel)',

  2, 1
),

-- ================= 4) Üsküdar / Kuzguncuk =================
(
  '44444444-4444-4444-8444-444444444444',
  'Kuzguncuk’ta Boğaz Havası, 2+1, Sessiz Sokak', 'kuzguncuk-bogaz-havasi-2-1-sessiz-sokak',
  'Daire', 'satilik',
  'Kuzguncuk Mah. İcadiye Cd. No:19 D:2', 'Üsküdar', 'İstanbul', 'Kuzguncuk',
  41.036900, 29.034500,
  'Notlar:
- Manzara: Kısmi boğaz (örnek)
- Cephe: Kuzey-doğu (örnek)
- Otopark: Sokak (örnek)
- Not: Bu kayıt demo amaçlıdır.',

  13250000.00, 'TRY',
  12500000.00,

  'ILN-IST-000004', 'Manzara', 1,

  105, 90,

  '2+1', 2,
  '10+',

  '2', 2,
  4,

  'Kombi',
  'kiracili',

  0, 0,
  0, 0, 1,
  1, 0,

  1, 1,

  0, 0, 1,
  1, 0,

  'https://images.unsplash.com/photo-1460317442991-0ec209397118?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=60&w=2400',
  NULL,
  'Kuzguncuk sokak ve ev atmosferi (örnek görsel)',

  3, 1
),

-- ================= 5) Ataşehir / Finans Merkezi =================
(
  '55555555-5555-4555-8555-555555555555',
  'Ataşehir Finans Merkezine Yakın 4+1, Aileye Uygun', 'atasehir-finans-merkezine-yakin-4-1-aileye-uygun',
  'Daire', 'satilik',
  'Barbaros Mah. Mor Sümbül Sk. No:7 D:18', 'Ataşehir', 'İstanbul', 'Barbaros',
  40.992300, 29.124600,
  'Notlar:
- Site içi: Çocuk parkı / sosyal alan (örnek)
- Asansör: Var
- Otopark: Var
- Aidat: 2.100 TL (örnek)
- Not: Bu kayıt demo amaçlıdır.',

  17990000.00, 'TRY',
  16800000.00,

  'ILN-IST-000005', NULL, 0,

  210, 185,

  '4+1', 4,
  '0-5',

  '18', 18,
  24,

  'Merkezi',
  'bos',

  0, 1,
  1, 1, 1,
  0, 1,

  1, 0,

  1, 0, 1,
  1, 1,

  'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=60&w=2400',
  NULL,
  'Ataşehir aileye uygun geniş daire (örnek görsel)',

  4, 1
),

-- ================= 6) Beylikdüzü / Marina (satıldı örneği) =================
(
  '66666666-6666-4666-8666-666666666666',
  'Satıldı: Beylikdüzü Marina Yakını 1+1', 'satildi-beylikduzu-marina-yakini-1-1',
  'Daire', 'sold',
  'Adnan Kahveci Mah. Yavuz Sultan Selim Blv. No:31 D:9', 'Beylikdüzü', 'İstanbul', 'Adnan Kahveci',
  40.982800, 28.639900,
  'Notlar:
- Satış tamamlandı (örnek)
- Evrak arşivlendi (örnek)
- Not: Bu kayıt demo amaçlıdır.',

  0.00, 'TRY',
  NULL,

  'ILN-IST-000006', NULL, 0,

  60, 50,

  '1+1', 1,
  '5-10',

  '9', 9,
  14,

  'Kombi',
  'bos',

  0, 1,
  1, 1, 0,
  0, 0,

  0, 0,

  0, 0, 0,
  1, 0,

  'https://images.unsplash.com/photo-1494526585095-c41746248156?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=60&w=2400',
  NULL,
  'Beylikdüzü 1+1 (satıldı) örnek görsel',

  5, 0
)
ON DUPLICATE KEY UPDATE
  `title`            = VALUES(`title`),
  `slug`             = VALUES(`slug`),
  `type`             = VALUES(`type`),
  `status`           = VALUES(`status`),

  `address`          = VALUES(`address`),
  `district`         = VALUES(`district`),
  `city`             = VALUES(`city`),
  `neighborhood`     = VALUES(`neighborhood`),

  `lat`              = VALUES(`lat`),
  `lng`              = VALUES(`lng`),
  `description`      = VALUES(`description`),

  `price`            = VALUES(`price`),
  `currency`         = VALUES(`currency`),
  `min_price_admin`  = VALUES(`min_price_admin`),

  `listing_no`       = VALUES(`listing_no`),
  `badge_text`       = VALUES(`badge_text`),
  `featured`         = VALUES(`featured`),

  `gross_m2`         = VALUES(`gross_m2`),
  `net_m2`           = VALUES(`net_m2`),

  `rooms`            = VALUES(`rooms`),
  `bedrooms`         = VALUES(`bedrooms`),
  `building_age`     = VALUES(`building_age`),

  `floor`            = VALUES(`floor`),
  `floor_no`         = VALUES(`floor_no`),
  `total_floors`     = VALUES(`total_floors`),

  `heating`          = VALUES(`heating`),
  `usage_status`     = VALUES(`usage_status`),

  `furnished`        = VALUES(`furnished`),
  `in_site`          = VALUES(`in_site`),

  `has_elevator`     = VALUES(`has_elevator`),
  `has_parking`      = VALUES(`has_parking`),
  `has_balcony`      = VALUES(`has_balcony`),
  `has_garden`       = VALUES(`has_garden`),
  `has_terrace`      = VALUES(`has_terrace`),

  `credit_eligible`  = VALUES(`credit_eligible`),
  `swap`             = VALUES(`swap`),

  `has_video`        = VALUES(`has_video`),
  `has_clip`         = VALUES(`has_clip`),
  `has_virtual_tour` = VALUES(`has_virtual_tour`),
  `has_map`          = VALUES(`has_map`),
  `accessible`       = VALUES(`accessible`),

  `image_url`        = VALUES(`image_url`),
  `image_asset_id`   = VALUES(`image_asset_id`),
  `alt`              = VALUES(`alt`),

  `display_order`    = VALUES(`display_order`),
  `is_active`        = VALUES(`is_active`),
  `updated_at`       = CURRENT_TIMESTAMP(3);

-- =============================================================
-- PROPERTY_ASSETS (GALLERY)
-- - asset_id: NULL (storage yok)
-- - url: Unsplash demo
-- - cover: is_cover=1 tekil
-- =============================================================
INSERT INTO `property_assets`
(
  `id`,
  `property_id`,
  `asset_id`,
  `url`,
  `alt`,
  `kind`,
  `mime`,
  `is_cover`,
  `display_order`
)
VALUES
-- ================= Property 1 (Kadıköy / Moda) =================
('a1111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-111111111111', NULL,
 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=60&w=2400',
 'Salon / dış cephe (örnek)', 'image', 'image/jpeg', 1, 0),
('a1111111-1111-4111-8111-111111111112', '11111111-1111-4111-8111-111111111111', NULL,
 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=60&w=2400',
 'Mutfak (örnek)', 'image', 'image/jpeg', 0, 1),
('a1111111-1111-4111-8111-111111111113', '11111111-1111-4111-8111-111111111111', NULL,
 'https://images.unsplash.com/photo-1505693314120-0d443867891c?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=60&w=2400',
 'Yatak odası (örnek)', 'image', 'image/jpeg', 0, 2),
('a1111111-1111-4111-8111-111111111114', '11111111-1111-4111-8111-111111111111', NULL,
 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=60&w=2400',
 'Banyo (örnek)', 'image', 'image/jpeg', 0, 3),

-- ================= Property 2 (Levent) =================
('a2222222-2222-4222-8222-222222222221', '22222222-2222-4222-8222-222222222222', NULL,
 'https://images.unsplash.com/photo-1501183638710-841dd1904471?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=60&w=2400',
 'Dış cephe / site (örnek)', 'image', 'image/jpeg', 1, 0),
('a2222222-2222-4222-8222-222222222222', '22222222-2222-4222-8222-222222222222', NULL,
 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=60&w=2400',
 'Salon (örnek)', 'image', 'image/jpeg', 0, 1),
('a2222222-2222-4222-8222-222222222223', '22222222-2222-4222-8222-222222222222', NULL,
 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=60&w=2400',
 'Mutfak (örnek)', 'image', 'image/jpeg', 0, 2),
('a2222222-2222-4222-8222-222222222224', '22222222-2222-4222-8222-222222222222', NULL,
 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=60&w=2400',
 'Balkon / manzara (örnek)', 'image', 'image/jpeg', 0, 3),

-- ================= Property 3 (Mecidiyeköy) =================
('a3333333-3333-4333-8333-333333333331', '33333333-3333-4333-8333-333333333333', NULL,
 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=60&w=2400',
 'Stüdyo yaşam alanı (örnek)', 'image', 'image/jpeg', 1, 0),
('a3333333-3333-4333-8333-333333333332', '33333333-3333-4333-8333-333333333333', NULL,
 'https://images.unsplash.com/photo-1505691723518-36a5ac3b2b57?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=60&w=2400',
 'Yatak alanı (örnek)', 'image', 'image/jpeg', 0, 1),
('a3333333-3333-4333-8333-333333333333', '33333333-3333-4333-8333-333333333333', NULL,
 'https://images.unsplash.com/photo-1554995207-c18c203602cb?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=60&w=2400',
 'Çalışma köşesi (örnek)', 'image', 'image/jpeg', 0, 2),

-- ================= Property 4 (Kuzguncuk) =================
('a4444444-4444-4444-8444-444444444441', '44444444-4444-4444-8444-444444444444', NULL,
 'https://images.unsplash.com/photo-1460317442991-0ec209397118?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=60&w=2400',
 'Sokak / mahalle dokusu (örnek)', 'image', 'image/jpeg', 1, 0),
('a4444444-4444-4444-8444-444444444442', '44444444-4444-4444-8444-444444444444', NULL,
 'https://images.unsplash.com/photo-1449844908441-8829872d2607?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=60&w=2400',
 'Dış cephe (örnek)', 'image', 'image/jpeg', 0, 1),
('a4444444-4444-4444-8444-444444444443', '44444444-4444-4444-8444-444444444444', NULL,
 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=60&w=2400',
 'Salon (örnek)', 'image', 'image/jpeg', 0, 2),

-- ================= Property 5 (Ataşehir) =================
('a5555555-5555-4555-8555-555555555551', '55555555-5555-4555-8555-555555555555', NULL,
 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=60&w=2400',
 'Geniş salon (örnek)', 'image', 'image/jpeg', 1, 0),
('a5555555-5555-4555-8555-555555555552', '55555555-5555-4555-8555-555555555555', NULL,
 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=60&w=2400',
 'Mutfak (örnek)', 'image', 'image/jpeg', 0, 1),
('a5555555-5555-4555-8555-555555555553', '55555555-5555-4555-8555-555555555555', NULL,
 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=60&w=2400',
 'Yatak odası (örnek)', 'image', 'image/jpeg', 0, 2),
('a5555555-5555-4555-8555-555555555554', '55555555-5555-4555-8555-555555555555', NULL,
 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=60&w=2400',
 'Balkon (örnek)', 'image', 'image/jpeg', 0, 3),

-- ================= Property 6 (Beylikdüzü - sold) =================
('a6666666-6666-4666-8666-666666666661', '66666666-6666-4666-8666-666666666666', NULL,
 'https://images.unsplash.com/photo-1494526585095-c41746248156?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=60&w=2400',
 'Dış görünüm (örnek)', 'image', 'image/jpeg', 1, 0),
('a6666666-6666-4666-8666-666666666662', '66666666-6666-4666-8666-666666666666', NULL,
 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=60&w=2400',
 'İç mekân (örnek)', 'image', 'image/jpeg', 0, 1)
ON DUPLICATE KEY UPDATE
  `property_id`   = VALUES(`property_id`),
  `asset_id`      = VALUES(`asset_id`),
  `url`           = VALUES(`url`),
  `alt`           = VALUES(`alt`),
  `kind`          = VALUES(`kind`),
  `mime`          = VALUES(`mime`),
  `is_cover`      = VALUES(`is_cover`),
  `display_order` = VALUES(`display_order`),
  `updated_at`    = CURRENT_TIMESTAMP(3);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
