-- 21_properties_seed.sql
-- Seed for properties (sample records) - new schema compatible
-- Notes:
-- - image_url: Unsplash sample (images.unsplash.com) - demo amaçlı
-- - image_asset_id: NULL (storage relation yoksa)
-- - lat/lng: İstanbul örnek koordinatlar

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
  `gross_m2`, `net_m2`, `rooms`, `building_age`, `floor`, `total_floors`,
  `heating`, `furnished`, `in_site`, `has_balcony`, `has_parking`, `has_elevator`,
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
- Tapu: Kat mülkiyeti
- Ulaşım: İskeleye 12 dk yürüme
- Cephe: Güney / Aydınlık
- Aidat: 1.250 TL (örnek)',

  8950000.00, 'TRY',
  8200000.00,
  'ILN-IST-000001', 'Fırsat', 1,
  110, 92, '2+1', '5-10', '3', 6,
  'Kombi', 0, 1, 1, 0, 1,
  'https://images.unsplash.com/photo-1681856984009-6d56e0a95c2d?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
  NULL,
  'Kadıköy Moda sahil manzaralı konut (örnek görsel)',

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
- Otopark: Kapalı
- Deprem yönetmeliği: Yeni bina (örnek)
- Kredi: Uygun (örnek)',

  24500000.00, 'TRY',
  23000000.00,
  'ILN-IST-000002', 'Lüks', 1,
  185, 160, '3+1', '0-5', '14', 22,
  'Merkezi', 0, 1, 1, 1, 1,
  'https://images.unsplash.com/photo-1670589895824-dededda7f405?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
  NULL,
  'Şehir merkezinde modern bina / sokak (örnek görsel)',

  1, 1
),

-- ================= 3) Şişli / Mecidiyeköy =================
(
  '33333333-3333-4333-8333-333333333333',
  'Mecidiyeköy’de Eşyalı 1+1, Metroya Yakın', 'mecidiyekoy-esyali-1-1-metroya-yakin',
  'Daire', 'kiralik',
  'Fulya Mah. Büyükdere Cd. No:45 D:7', 'Şişli', 'İstanbul', 'Mecidiyeköy',
  41.065900, 28.998600,
  'Notlar:
- Kiracı profili: Beyaz yaka / öğrenci uygun (örnek)
- Depozito: 2 kira (örnek)
- Eşya: Tam (örnek)',

  55000.00, 'TRY',
  45000.00,
  'ILN-IST-000003', 'Yeni', 0,
  65, 55, '1+1', '10+', '7', 12,
  'Kombi', 1, 1, 0, 0, 1,
  'https://images.unsplash.com/photo-1576941089067-2de3c901e126?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
  NULL,
  'Aydınlık iç mekân / oda (örnek görsel)',

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
- Cephe: Kuzey-doğu
- Otopark: Sokak (örnek)',

  13250000.00, 'TRY',
  12500000.00,
  'ILN-IST-000004', 'Manzara', 1,
  105, 90, '2+1', '10+', '2', 4,
  'Kombi', 0, 0, 1, 0, 0,
  'https://images.unsplash.com/photo-1715621446670-ad36ea4814af?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
  NULL,
  'Boğaz hattında konut / sahil atmosferi (örnek görsel)',

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
- Aidat: 2.100 TL (örnek)',

  17990000.00, 'TRY',
  16800000.00,
  'ILN-IST-000005', NULL, 0,
  210, 185, '4+1', '0-5', '18', 24,
  'Merkezi', 0, 1, 1, 1, 1,
  'https://images.unsplash.com/photo-1670589895824-dededda7f405?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
  NULL,
  'Modern şehir içi konut (örnek görsel)',

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
- Evrak arşivlendi (örnek)',

  0.00, 'TRY',
  NULL,
  'ILN-IST-000006', NULL, 0,
  60, 50, '1+1', '5-10', '9', 14,
  'Kombi', 0, 1, 0, 1, 1,
  'https://images.unsplash.com/photo-1576941089067-2de3c901e126?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
  NULL,
  'İç mekân (örnek görsel)',

  5, 0
)

ON DUPLICATE KEY UPDATE
  `title`           = VALUES(`title`),
  `slug`            = VALUES(`slug`),
  `type`            = VALUES(`type`),
  `status`          = VALUES(`status`),

  `address`         = VALUES(`address`),
  `district`        = VALUES(`district`),
  `city`            = VALUES(`city`),
  `neighborhood`    = VALUES(`neighborhood`),

  `lat`             = VALUES(`lat`),
  `lng`             = VALUES(`lng`),
  `description`     = VALUES(`description`),

  `price`           = VALUES(`price`),
  `currency`        = VALUES(`currency`),
  `min_price_admin` = VALUES(`min_price_admin`),

  `listing_no`      = VALUES(`listing_no`),
  `badge_text`      = VALUES(`badge_text`),
  `featured`        = VALUES(`featured`),

  `gross_m2`        = VALUES(`gross_m2`),
  `net_m2`          = VALUES(`net_m2`),
  `rooms`           = VALUES(`rooms`),
  `building_age`    = VALUES(`building_age`),
  `floor`           = VALUES(`floor`),
  `total_floors`    = VALUES(`total_floors`),

  `heating`         = VALUES(`heating`),
  `furnished`       = VALUES(`furnished`),
  `in_site`         = VALUES(`in_site`),
  `has_balcony`     = VALUES(`has_balcony`),
  `has_parking`     = VALUES(`has_parking`),
  `has_elevator`    = VALUES(`has_elevator`),

  `image_url`       = VALUES(`image_url`),
  `image_asset_id`  = VALUES(`image_asset_id`),
  `alt`             = VALUES(`alt`),

  `display_order`   = VALUES(`display_order`),
  `is_active`       = VALUES(`is_active`),
  `updated_at`      = CURRENT_TIMESTAMP(3);
