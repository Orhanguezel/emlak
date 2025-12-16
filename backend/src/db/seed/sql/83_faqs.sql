-- 044_faqs.sql
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
 'Mezar yapımında bize dair bir şüpheniz bulunmasın',
 '25 yılı aşkın tecrübemiz ve binlerce başarılı projemizle İstanbul''da mezar yapımı konusunda güvenilir bir firmayız. Kaliteli malzeme, profesyonel işçilik ve müşteri memnuniyeti garantisi ile hizmet veriyoruz. Tüm işlerimizde İstanbul Büyükşehir Belediyesi standartlarına uygun olarak çalışmaktayız.',
 'mezar-yapiminda-bize-dair-bir-supheniz-bulunmasin','Genel',1,1,'2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),
 'Mezar fiyatları mezar modeline göre değişir mi? Hangi mezar modellerinde fiyat artışı olur?',
 'Evet, mezar fiyatları kullanılan malzeme ve mezar modeline göre değişiklik gösterir. Tek kişilik mermer mezar modelleri daha uygun fiyatlıdır. Granit mezar taşı, özel tasarım mezarlar ve büyük boy aile mezarları fiyat artışına neden olur. Detaylı fiyat bilgisi için bizimle iletişime geçebilirsiniz.',
 'mezar-fiyatlari-mezar-modeline-gore-degisir-mi-hangi-mezar-modellerinde-fiyat-artisi-olur','Genel',1,2,'2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),
 'Mezar yapımı fiyatları hangi durumlarda değişir?',
 'Mezar fiyatları; mezar boyutuna (tek kişilik, çift kişilik), kullanılan malzemeye (mermer, granit, traverten), mezar modelinin karmaşıklığına, özel tasarım isteklerine ve mezarlık lokasyonuna göre değişiklik gösterir. Ayrıca mezar aksesuarları ve özel işlemler de fiyatı etkiler.',
 'mezar-yapimi-fiyatlari-hangi-durumlarda-degisir','Genel',1,3,'2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),
 'Mezar yapılmak istediğim zaman ne gibi yollara başvurmalıyım?',
 'Öncelikle mezar yapım konusunda araştırma yapmalı, güvenilir firmaları karşılaştırmalısınız. Bizimle iletişime geçerek ücretsiz keşif hizmeti alabilir, mezar modelleri hakkında bilgi edinebilir ve fiyat teklifi talep edebilirsiniz. Sonrasında İstanbul Büyükşehir Belediyesi''nden gerekli izinleri alarak işleme başlayabiliriz.',
 'mezar-yapilmak-istedigim-zaman-ne-gibi-yollara-basvurmaliyim','Genel',1,4,'2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),
 'Mezar yapımında tercih edilen mezar modelleri nelerdir?',
 'Mezar yapımında en çok tercih edilen modeller: Mermer mezar modelleri (ekonomik ve estetik), Granit mezar modelleri (dayanıklı ve uzun ömürlü), Traverten mezar modelleri (doğal görünüm), Lahit tipi mezarlar (klasik ve ihtişamlı), Modern tasarım mezarlar ve özel yapım mezar modelleridir. Her birinin kendine özgü avantajları bulunmaktadır.',
 'mezar-yapiminda-tercih-edilen-mezar-modelleri-nelerdir','Genel',1,5,'2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),
 'Mezar yapımı ve mezar işlerinde mezar yerinin inşaat ruhsatını ne zaman çıkartabilirim?',
 'Mezar yapımı için inşaat ruhsatını, cenaze defin işleminden 3 ay sonra İstanbul Büyükşehir Belediyesi''nden çıkartabilirsiniz. Bu süre zorunlu bekleme süresidir. Ruhsat başvurusu sırasında mezar planı, malzeme bilgileri ve teknik çizimler gereklidir. Tüm evrak işlemlerinde size yardımcı olabiliriz.',
 'mezar-yapimi-ve-mezar-islerinde-mezar-yerinin-insaat-ruhsatini-ne-zaman-cikartabilirim','Genel',1,6,'2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),
 'Mezar yapımında genellikle hangi mezar modelini tercih edilmektedir?',
 'Mezar yapımında en çok tercih edilen model mermer mezar modelleridir çünkü hem estetik hem de ekonomiktir. Ancak dayanıklılık açısından granit mezar modelleri daha uzun ömürlüdür ve hava koşullarına karşı daha dirençlidir. Son yıllarda modern tasarım mezarlar da oldukça popülerdir. Tercih tamamen bütçe ve kişisel beğeniye bağlıdır.',
 'mezar-yapiminda-genellikle-hangi-mezar-modelini-tercih-edilmektedir','Genel',1,7,'2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),
 'Mezar yapımında mezarı lahit mezar olarak yaptırmam uygun olur mu?',
 'Lahit tipi mezar modeli klasik ve ihtişamlı bir görünüm sunar. Ancak lahit mezar yapımı için İstanbul Büyükşehir Belediyesi''nden özel izin almanız ve ruhsat başvurusu sırasında bu tercihinizi belirtmeniz gerekmektedir. Lahit mezarlar daha fazla alan kaplar ve maliyeti yüksektir, ancak çok estetik ve dayanıklıdır.',
 'mezar-yapiminda-mezari-lahit-mezar-olarak-yaptirmam-uygun-olur-mu','Genel',1,8,'2024-01-01 00:00:00.000','2024-01-01 00:00:00.000'),

(UUID(),
 'Mezar yapımında mermer mezar modellerinden tercih etsem dayanıklı olur mu?',
 'Mermer mezar modelleri doğru işçilik ve kaliteli malzeme ile yapıldığında oldukça dayanıklıdır. Mezarisi.com güvencesi ile yapılan mermer mezarlar 10 yıl garanti ile teslim edilir. Düzenli bakım ile mermer mezarlar uzun yıllar kullanılabilir. Ancak en yüksek dayanıklılık için granit mezar modellerini öneririz.',
 'mezar-yapiminda-mermer-mezar-modellerinden-tercih-etsem-dayanikli-olur-mu','Genel',1,9,'2024-01-01 00:00:00.000','2024-01-01 00:00:00.000')
ON DUPLICATE KEY UPDATE
 `question`=VALUES(`question`),
 `answer`=VALUES(`answer`),
 `category`=VALUES(`category`),
 `is_active`=VALUES(`is_active`),
 `display_order`=VALUES(`display_order`),
 `updated_at`=VALUES(`updated_at`);
