-- 044_faqs_emlak.sql
DROP TABLE IF EXISTS `faqs`;
CREATE TABLE `faqs` (
  `id`            CHAR(36)     NOT NULL,
  `question`      VARCHAR(500) NOT NULL,
  `answer`        LONGTEXT     NOT NULL,
  `slug`          VARCHAR(255) NOT NULL,
  `category`      VARCHAR(255) DEFAULT NULL,
  `is_active`     TINYINT(1)   NOT NULL DEFAULT 1,
  `display_order` INT          NOT NULL DEFAULT 0,
  `created_at`    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_faqs_slug` (`slug`),
  KEY `faqs_active_idx`(`is_active`),
  KEY `faqs_order_idx`(`display_order`),
  KEY `faqs_created_idx`(`created_at`),
  KEY `faqs_updated_idx`(`updated_at`),
  KEY `faqs_category_idx`(`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `faqs`
(`id`,`question`,`answer`,`slug`,`category`,`is_active`,`display_order`,`created_at`,`updated_at`)
VALUES
(UUID(),
 'Emlak alım-satım sürecinde bize güvenebilir misiniz?',
 'Sürecin her adımında şeffaf ve yazılı ilerleriz: portföy doğrulama, tapu/imar kontrolü, fiyat analizi, pazarlık, sözleşme ve tapu işlemleri. Amacımız alıcı ve satıcı için riskleri azaltarak işlemi sorunsuz tamamlamaktır.',
 'emlak-alim-satim-surecinde-bize-guvenebilir-misiniz','Genel',1,1,'2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),
 'Konut fiyatları hangi faktörlere göre değişir?',
 'Fiyatı en çok etkileyen unsurlar: lokasyon, m², oda sayısı, bina yaşı, kat/cephe, ulaşım ve sosyal imkanlar, tapu niteliği (kat mülkiyeti/irtifakı), imar durumu, site aidatı, manzara ve bölgedeki arz-talep. Ayrıca doğru pazarlama ve ilan kalitesi de satış hızını doğrudan etkiler.',
 'konut-fiyatlari-hangi-faktorlere-gore-degisir','Genel',1,2,'2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),
 'Satılık veya kiralık ev ilanı vermek için hangi bilgilere ihtiyaç var?',
 'İlan için temel bilgiler: adres/lokasyon, net/brüt m², oda sayısı, bina yaşı, kat bilgisi, ısınma tipi, aidat, tapu durumu, varsa site özellikleri ve doğru fotoğraflar. Satılıkta ayrıca tapu fotokopisi ve varsa iskan/ruhsat bilgileri süreci hızlandırır.',
 'satilik-veya-kiralik-ev-ilani-vermek-icin-hangi-bilgilere-ihtiyac-var','Ilan',1,3,'2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),
 'Evi satmak istediğimde nasıl bir yol izlemeliyim?',
 'Önce doğru fiyat analizi yapılır ve satış stratejisi belirlenir. Ardından taşınmazın tapu/imar kontrolleri yapılır, profesyonel fotoğraf ve ilan metni hazırlanır, hedef kitleye göre platformlarda yayınlanır. Görüşmeler sonrası kapora/sözleşme düzenlenir ve tapu randevusu ile devir tamamlanır.',
 'evi-satmak-istedigimde-nasil-bir-yol-izlemeliyim','Satis',1,4,'2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),
 'Kiralama sürecinde ev sahibi ve kiracı için en önemli noktalar nelerdir?',
 'Kira sözleşmesinin doğru düzenlenmesi, depozito ve ödeme planının net olması, demirbaş listesinin tutanakla kayıt altına alınması ve teslim tutanağı hazırlanması kritik konulardır. Kiracı tarafında gelir/kimlik doğrulama, ev sahibi tarafında taşınmazın hukuki durumu ve aidat/borç kontrolleri yapılmalıdır.',
 'kiralama-surecinde-ev-sahibi-ve-kiraci-icin-en-onemli-noktalar-nelerdir','Kiralama',1,5,'2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),
 'Tapu işlemleri ne kadar sürer ve hangi belgeler gerekir?',
 'Süre; tapu müdürlüğünün yoğunluğuna ve evrakların eksiksiz olmasına göre değişir. Genellikle randevu günü devir tamamlanır. Kimlik, tapu bilgileri, belediye rayiç bedel yazısı, DASK poliçesi ve gerekli harç/masraf ödemeleri temel kalemlerdir. Detaylar taşınmazın niteliğine göre farklılaşabilir.',
 'tapu-islemleri-ne-kadar-surer-ve-hangi-belgeler-gerekir','Tapu',1,6,'2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),
 'Konut kredisi ile ev almak mümkün mü? Süreç nasıl işler?',
 'Evet. Banka ön onay sonrası taşınmaz için ekspertiz yapılır ve kredi limiti belirlenir. Uygun bulunursa kredi sözleşmesi imzalanır, ipotek tesisi yapılır ve ödeme planına göre satış tapuda tamamlanır. Kredi sürecinde taşınmazın tapu/imar uygunluğu önemlidir.',
 'konut-kredisi-ile-ev-almak-mumkun-mu-surec-nasil-isler','Kredi',1,7,'2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),
 'Ekspertiz raporu nedir, neden önemlidir?',
 'Ekspertiz raporu, taşınmazın piyasa değerini ve fiziksel/hukuki durumunu inceleyen değerlendirmedir. Kredi kullanımında banka için zorunlu olabilir. Alıcı açısından ise aşırı fiyatlandırma riskini azaltır ve satın alma kararını daha sağlıklı hale getirir.',
 'ekspertiz-raporu-nedir-neden-onemlidir','Kredi',1,8,'2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),
 'Emlak komisyonu nasıl hesaplanır ve ne zaman ödenir?',
 'Komisyon oranı ve ödeme koşulları, yapılan hizmet sözleşmesine göre belirlenir. Genellikle işlem sonuçlandığında (satışta tapu devrinde, kiralamada sözleşme imzalanınca) tahsil edilir. Hizmet kapsamı (pazarlama, portföy yönetimi, evrak takibi, gösterim, pazarlık vb.) net biçimde yazılı olmalıdır.',
 'emlak-komisyonu-nasil-hesaplanir-ve-ne-zaman-odenir','Ucretlendirme',1,9,'2024-01-01 00:00:00.000','2024-01-01 00:00:00.000')
ON DUPLICATE KEY UPDATE
 `question`=VALUES(`question`),
 `answer`=VALUES(`answer`),
 `category`=VALUES(`category`),
 `is_active`=VALUES(`is_active`),
 `display_order`=VALUES(`display_order`),
 `updated_at`=VALUES(`updated_at`);
