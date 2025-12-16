-- Simple SQL dump generated at 2025-11-21T15:39:50.067Z

CREATE DATABASE IF NOT EXISTS `mezartasi` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `mezartasi`;



-- ----------------------------
-- Table structure for `custom_pages`
-- ----------------------------
DROP TABLE IF EXISTS `custom_pages`;
CREATE TABLE `custom_pages` (
  `id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`content`)),
  `image_url` varchar(500) DEFAULT NULL,
  `storage_asset_id` char(36) DEFAULT NULL,
  `alt` varchar(255) DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` varchar(500) DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_custom_pages_slug` (`slug`),
  KEY `custom_pages_created_idx` (`created_at`),
  KEY `custom_pages_updated_idx` (`updated_at`),
  KEY `custom_pages_is_published_idx` (`is_published`),
  KEY `custom_pages_asset_idx` (`storage_asset_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of `custom_pages`
-- ----------------------------
INSERT INTO `custom_pages` (`id`, `title`, `slug`, `content`, `image_url`, `storage_asset_id`, `alt`, `meta_title`, `meta_description`, `is_published`, `created_at`, `updated_at`) VALUES 
('6dbc3dfd-c6e6-11f0-955b-ea727f233291', 'Hakkımızda', 'hakkimizda', '{\"html\": \"<p><strong>İstanbul\'un en deneyimli mezar yapım firması</strong> olarak <strong>25 yılı aşkın süredir mezar inşaatı, mezar taşı yapımı, mermer mezar modelleri ve mezar bakım hizmetleri</strong> sunmaktayız. <em>Kaliteli malzeme, uygun fiyat</em> ve <em>profesyonel işçilik</em> garantisi ile sektörde güvenilir bir isim haline geldik.</p><p><strong>Mezar yapımı konusunda uzman ekibimiz</strong>, tek kişilik mezar, iki kişilik mezar, aile mezarı ve özel tasarım mezar modelleri olmak üzere <em>her türlü mezar yapım işlerini</em> gerçekleştirmektedir. <strong>Granit mezar taşı, mermer mezar taşı, traverten mezar</strong> ve modern mezar tasarımları ile sevdiklerinizin anısını en güzel şekilde yaşatıyoruz.</p><p><strong>İstanbul\'daki tüm mezarlıklarda hizmet veren firmamız</strong> - Karaca Ahmet, Zincirlikuyu, Eyüp Sultan, Edirnekapı, Kilyos, Şile mezarlıkları başta olmak üzere - <em>İstanbul Büyükşehir Belediyesi standartlarına uygun</em> mezar yapımı yapmaktadır. <strong>Mezar fiyatları</strong> konusunda şeffaf ve uygun fiyat politikamız ile müşteri memnuniyetini önceliğimiz haline getirdik.</p><p><strong>Mezar onarımı, mezar restorasyonu, mezar çiçeklendirme</strong> ve <strong>mezar toprak doldurumu</strong> hizmetlerimizle kapsamlı çözümler sunuyoruz. Modern teknoloji ve geleneksel el işçiliğini birleştirerek <em>dayanıklı ve estetik mezar yapımı</em> garantisi veriyoruz. <strong>Ücretsiz keşif, proje çizimi ve fiyat teklifi</strong> ile müşterilerimize en iyi hizmeti sunmaya devam ediyoruz.</p><p><strong>7/24 mezar yapım hizmeti</strong> veren firmamız, acil durumlarda bile <em>hızlı ve kaliteli çözümler</em> üretmektedir. <strong>Garantili mezar yapımı, uygun taksit imkânları</strong> ve <strong>ücretsiz nakliye hizmeti</strong> ile İstanbul\'da mezar yapımı konusunda en güvenilir adres olmayı sürdürüyoruz.</p>\"}', 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1762878680/custom_pages/609da17f-bee8-11f0-947f-e7685059cf04/cover/mezartasi.png', NULL, NULL, 'Hakkımızda - Mezarisim.com | İstanbul\'un En Deneyimli Mezar Yapım Firması', '25 yıllık deneyimimizle İstanbul\'da mezar yapımı, mezar taşı, mermer ve granit mezar modelleri. Kaliteli malzeme, uygun fiyat, profesyonel işçilik garantisi.', 1, '2025-11-21 14:29:03.424', '2025-11-21 14:29:03.424'),
('6dbc578d-c6e6-11f0-955b-ea727f233291', 'Misyonumuz - Vizyonumuz', 'misyon-vizyon', '{\"html\": \"<section class=\\\"container mx-auto px-4 py-8\\\"><h1 class=\\\"text-3xl md:text-4xl font-bold text-teal-600 mb-4\\\">MİSYONUMUZ - VİZYONUMUZ</h1><p class=\\\"text-gray-700 mb-8\\\">İstanbul\'da mezar yapımı konusunda 25 yıllık deneyimimizle, sevdiklerinizin anısını ebedileştirme misyonu taşıyoruz.</p><div class=\\\"grid grid-cols-1 gap-8\\\"><div class=\\\"bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl shadow\\\"><div class=\\\"flex items-center mb-4\\\"><div class=\\\"w-10 h-10 bg-teal-500 rounded-full text-white flex items-center justify-center mr-3\\\">🎯</div><h2 class=\\\"text-2xl text-teal-700 m-0\\\">Misyonumuz</h2></div><div class=\\\"space-y-4 text-gray-700\\\"><p><strong>İstanbul\'da mezar yapımı sektöründe</strong> müşteri memnuniyetini en üst seviyede tutarak, <em>kaliteli mezar inşaatı, mezar taşı yapımı ve mezar bakım hizmetleri</em> sunmak temel misyonumuzdur. <strong>Mermer mezar, granit mezar taşı, traverten mezar</strong> ve modern mezar tasarımları ile sevdiklerinizin anısını en değerli şekilde yaşatıyoruz.</p><p><strong>Uygun fiyat, yüksek kalite ve profesyonel işçilik</strong> ilkeleriyle hareket ederek, <em>tek kişilik mezar, iki kişilik mezar, aile mezarı</em> ve özel tasarım mezar projelerinde <strong>İstanbul Büyükşehir Belediyesi standartlarına uygun</strong> çalışmalar gerçekleştiriyoruz. Her mezar yapımında <em>dayanıklılık, estetik ve mükemmellik</em> hedefliyoruz.</p><p><strong>7/24 mezar yapım hizmeti, ücretsiz keşif, garantili işçilik</strong> ve müşteri odaklı yaklaşımımızla İstanbul\'daki tüm mezarlıklarda - <em>Karaca Ahmet, Zincirlikuyu, Eyüp Sultan, Edirnekapı</em> - güvenilir çözümler üretmek amacımızdır.</p></div></div><div class=\\\"bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow\\\"><div class=\\\"flex items-center mb-4\\\"><div class=\\\"w-10 h-10 bg-blue-500 rounded-full text-white flex items-center justify-center mr-3\\\">🌟</div><h2 class=\\\"text-2xl text-blue-700 m-0\\\">Vizyonumuz</h2></div><div class=\\\"space-y-4 text-gray-700\\\"><p><strong>2030 yılına kadar İstanbul\'da mezar yapımı konusunda lider firma</strong> olmak ve <em>Türkiye genelinde en güvenilir mezar inşaat şirketi</em> unvanını kazanmak vizyonumuzdur. <strong>Modern teknoloji, geleneksel el işçiliği ve yenilikçi tasarım</strong> anlayışını birleştirerek sektörde çığır açan projeler hayata geçirmeyi hedefliyoruz.</p><p><strong>Çevre dostu mezar yapımı, sürdürülebilir malzeme kullanımı</strong> ve <em>dijital mezar takip sistemi</em> ile gelecek nesillere örnek olacak bir hizmet modeli oluşturmayı amaçlıyoruz. <strong>Mezar fiyatlarında şeffaflık, ödeme kolaylığı</strong> ve <em>müşteri memnuniyet garantisi</em> ile sektörde yeni standartlar belirlemeyi hedefliyoruz.</p><p><strong>Mezar onarımı, mezar restorasyonu, mezar çiçeklendirme</strong> ve <strong>mezar toprak doldurumu</strong> alanlarında da uzmanlaşarak, <em>komple mezar hizmet çözümleri</em> sunan tek adres olmayı vizyonumuz olarak benimsedik. <strong>Kalite, güven ve mükemmellik</strong> değerlerimizle İstanbul\'da mezar yapımının vazgeçilmez markası olmayı sürdüreceğiz.</p></div></div><div class=\\\"grid sm:grid-cols-2 gap-4\\\"><div class=\\\"bg-white border-l-4 border-teal-500 p-4 rounded-r-lg shadow\\\"><h3 class=\\\"text-teal-600 font-semibold mb-2\\\">🏗️ Mezar Yapım Uzmanlığımız</h3><ul class=\\\"text-sm text-gray-700 space-y-1\\\"><li>• <strong>25+ yıl</strong> mezar inşaat deneyimi</li><li>• <strong>1000+ başarılı</strong> mezar projesi</li><li>• <strong>İBB onaylı</strong> tüm mezarlıklarda hizmet</li><li>• <strong>7/24</strong> acil mezar yapım hizmeti</li></ul></div><div class=\\\"bg-white border-l-4 border-blue-500 p-4 rounded-r-lg shadow\\\"><h3 class=\\\"text-blue-600 font-semibold mb-2\\\">💎 Kalite Garantilerimiz</h3><ul class=\\\"text-sm text-gray-700 space-y-1\\\"><li>• <strong>A+ kalite</strong> mermer ve granit</li><li>• <strong>5 yıl garanti</strong> tüm işçilik</li><li>• <strong>Ücretsiz keşif</strong> ve proje çizimi</li><li>• <strong>Uygun taksit</strong> imkânları</li></ul></div></div></div></section>\"}', 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1762878680/custom_pages/609da17f-bee8-11f0-947f-e7685059cf04/cover/mezartasi.png', NULL, NULL, 'Misyonumuz ve Vizyonumuz - Mezarisim.com | İstanbul Mezar Yapımı', '25 yıllık deneyimimizle misyonumuz ve 2030 vizyonumuz: kalite, güven, sürdürülebilirlik ve 7/24 hizmet.', 1, '2025-11-21 14:29:03.424', '2025-11-21 14:29:03.424'),
('6dbc6505-c6e6-11f0-955b-ea727f233291', 'Kalite Politikamız', 'kalite-politikamiz', '{\"html\": \"<section class=\\\"container mx-auto px-4 py-8\\\"><h1 class=\\\"text-3xl md:text-4xl font-bold text-teal-600 mb-4\\\">KALİTE POLİTİKAMIZ</h1><p class=\\\"text-gray-700 mb-8\\\"><strong>İstanbul\'da mezar yapımı sektöründe kalite lideri</strong> olarak, <em>25 yıllık deneyimimizle</em> müşterilerimize <strong>A+ kalite garantisi</strong> sunuyoruz.</p><div class=\\\"bg-gradient-to-br from-teal-50 to-blue-50 p-8 rounded-xl border-l-4 border-teal-500 shadow-lg mb-8\\\"><h2 class=\\\"text-2xl text-teal-600 mb-6 flex items-center\\\"><span class=\\\"w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center mr-4 text-white\\\">🏆</span>Mezar Yapımında Kalite Anlayışımız</h2><div class=\\\"space-y-5 text-gray-700\\\"><p><strong>İstanbul\'da mezar yapımı konusunda sektörün en güvenilir firması</strong> olarak, <em>kaliteli mezar inşaatı, mermer mezar taşı yapımı, granit mezar taşı üretimi</em> ve <strong>mezar bakım hizmetlerinde</strong> asla taviz vermediğimiz standartlarımız bulunmaktadır. <strong>Tek kişilik mezar, iki kişilik mezar, aile mezarı</strong> projelerinde <em>İstanbul Büyükşehir Belediyesi normlarına uygun</em> kaliteli işçilik garantisi veriyoruz.</p><p><strong>Mezar yapım kalitemiz</strong>, kullandığımız <em>A+ sınıf mermer, granit, traverten</em> malzemelerden başlayarak, <strong>profesyonel mezar ustalarımızın</strong> deneyimi ile devam eder. <em>Mezar onarımı, mezar restorasyonu, mezar çiçeklendirme</em> ve <strong>mezar toprak doldurumu</strong> hizmetlerimizde de aynı kalite standardını koruyoruz.</p><p><strong>Uygun fiyat mezar yapımı</strong> sunarken kaliteden asla ödün vermeyiz. <em>Karaca Ahmet, Zincirlikuyu, Eyüp Sultan, Edirnekapı</em> mezarlıklarında gerçekleştirdiğimiz tüm projelerimiz <strong>5 yıl işçilik garantisi</strong> ile teslim edilir. <em>Modern mezar tasarımı, klasik mezar modelleri</em> ve özel tasarım projelerimizde <strong>mükemmellik standardı</strong> hedefliyoruz.</p></div></div><div class=\\\"bg-white border border-gray-200 p-8 rounded-xl shadow-lg mb-8\\\"><h2 class=\\\"text-xl text-blue-600 mb-6 flex itemsarker\\\"><span class=\\\"w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-white text-sm\\\">🔍</span>Mezar Yapım Kalite Kontrol Sürecimiz</h2><div class=\\\"grid md:grid-cols-2 gap-6\\\"><div class=\\\"space-y-4\\\"><div class=\\\"flex items-start\\\"><span class=\\\"w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 text-white text-xs mt-1\\\">1</span><div><h3 class=\\\"text-sm text-gray-900 mb-1\\\">Malzeme Kalite Kontrolü</h3><p class=\\\"text-xs text-gray-600\\\"><strong>A+ sınıf mermer ve granit</strong> seçimi, dayanıklılık testleri</p></div></div><div class=\\\"flex items-start\\\"><span class=\\\"w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 text-white text-xs mt-1\\\">2</span><div><h3 class=\\\"text-sm text-gray-900 mb-1\\\">Ölçüm ve Planlama</h3><p class=\\\"text-xs text-gray-600\\\"><strong>Ücretsiz keşif</strong>, teknik çizim ve <em>İBB standartları</em> kontrolü</p></div></div><div class=\\\"flex items-start\\\"><span class=\\\"w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 text-white text-xs mt-1\\\">3</span><div><h3 class=\\\"text-sm text-gray-900 mb-1\\\">İşçilik Kalitesi</h3><p class=\\\"text-xs text-gray-600\\\"><strong>25+ yıl deneyimli ustalar</strong>, profesyonel araç-gereç kullanımı</p></div></div></div><div class=\\\"space-y-4\\\"><div class=\\\"flex items-start\\\"><span class=\\\"w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-white text-xs mt-1\\\">4</span><div><h3 class=\\\"text-sm text-gray-900 mb-1\\\">Montaj ve Uygulama</h3><p class=\\\"text-xs text-gray-600\\\"><strong>Hassas montaj</strong>, estetik detaylar ve <em>dayanıklılık</em> odaklı kurulum</p></div></div><div class=\\\"flex items-start\\\"><span class=\\\"w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-white text-xs mt-1\\\">5</span><div><h3 class=\\\"text-sm text-gray-900 mb-1\\\">Final Kontrolü</h3><p class=\\\"text-xs text-gray-600\\\"><strong>Teslim öncesi kalite</strong> kontrolü, <em>müşteri memnuniyet</em> onayı</p></div></div><div class=\\\"flex items-start\\\"><span class=\\\"w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3 text-white text-xs mt-1\\\">6</span><div><h3 class=\\\"text-sm text-gray-900 mb-1\\\">Garanti ve Takip</h3><p class=\\\"text-xs text-gray-600\\\"><strong>5 yıl garanti</strong>, ücretsiz bakım kontrolü ve <em>7/24 destek</em></p></div></div></div></div></div><div class=\\\"bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl shadow-lg mb-8\\\"><h2 class=\\\"text-xl text-teal-600 mb-6 flex items-center\\\"><span class=\\\"w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center mr-3 text-white text-sm\\\">📋</span>İstanbul Mezar Yapımında Kalite İlkelerimiz</h2><div class=\\\"grid md:grid-cols-2 gap-4\\\"><div class=\\\"space-y-4\\\"><div class=\\\"flex items-start bg-white p-4 rounded-lg shadow-sm\\\"><span class=\\\"w-4 h-4 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full mt-1 mr-3 flex-shrink-0\\\"></span><div><h3 class=\\\"text-sm text-gray-900 mb-1\\\">Müşteri Memnuniyeti Garantisi</h3><p class=\\\"text-xs text-gray-600\\\"><strong>%98 müşteri memnuniyeti</strong> oranı ile <em>mezar yapımında</em> güvenilir hizmet</p></div></div><div class=\\\"flex items-start bg-white p-4 rounded-lg shadow-sm\\\"><span class=\\\"w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mt-1 mr-3 flex-shrink-0\\\"></span><div><h3 class=\\\"text-sm text-gray-900 mb-1\\\">A+ Kalite Malzeme Kullanımı</h3><p class=\\\"text-xs text-gray-600\\\"><strong>Mermer, granit, traverten</strong> seçiminde <em>kaliteden taviz yok</em></p></div></div><div class=\\\"flex items-start bg-white p-4 rounded-lg shadow-sm\\\"><span class=\\\"w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full mt-1 mr-3 flex-shrink-0\\\"></span><div><h3 class=\\\"text-sm text-gray-900 mb-1\\\">Zamanında Teslimat Garantisi</h3><p class=\\\"text-xs text-gray-600\\\"><strong>%95 zamanında teslimat</strong> oranı, <em>söz verdiğimiz tarihte</em> teslim</p></div></div></div><div class=\\\"space-y-4\\\"><div class=\\\"flex items-start bg-white p-4 rounded-lg shadow-sm\\\"><span class=\\\"w-4 h-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mt-1 mr-3 flex-shrink-0\\\"></span><div><h3 class=\\\"text-sm text-gray-900 mb-1\\\">Sürekli Gelişim ve İnovasyon</h3><p class=\\\"text-xs text-gray-600\\\"><strong>Modern mezar tasarımları</strong> ve <em>teknolojik yenilikler</em> takibi</p></div></div><div class=\\\"flex items-start bg-white p-4 rounded-lg shadow-sm\\\"><span class=\\\"w-4 h-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mt-1 mr-3 flex-shrink-0\\\"></span><div><h3 class=\\\"text-sm text-gray-900 mb-1\\\">Çevre Dostu Mezar Yapımı</h3><p class=\\\"text-xs text-gray-600\\\"><strong>Sürdürülebilir malzeme</strong> kullanımı ve <em>doğa dostu</em> üretim</p></div></div><div class=\\\"flex items-start bg-white p-4 rounded-lg shadow-sm\\\"><span class=\\\"w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full mt-1 mr-3 flex-shrink-0\\\"></span><div><h3 class=\\\"text-sm text-gray-900 mb-1\\\">Profesyonel Ekip Çalışması</h3><p class=\\\"text-xs text-gray-600\\\"><strong>25+ yıl deneyimli ustalar</strong>, <em>takım halinde</em> mükemmel sonuç</p></div></div></div></div></div><div class=\\\"bg-gradient-to-r from-teal-500 to-blue-500 text-white p-8 rounded-xl shadow-lg\\\"><div class=\\\"flex items-center mb-4\\\"><span class=\\\"w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4 text-2xl\\\">🤝</span><h2 class=\\\"text-xl m-0\\\">Kalite Taahhüdümüz</h2></div><div class=\\\"space-y-4 text-white/95\\\"><p><strong>İstanbul\'da mezar yapımı konusunda sektör lideri</strong> olarak, <em>kalite standartlarımızı sürekli yükseltmeyi</em>, müşterilerimizin beklentilerini karşılamayı ve aşmayı taahhüt ediyoruz. <strong>Her mezar projemizde mükemmellik</strong> arayışımız devam etmektedir.</p><p><em>Tek kişilik mezar, iki kişilik mezar, aile mezarı</em> ve özel tasarım projelerimizde <strong>5 yıl işçilik garantisi</strong> veriyor, <em>ücretsiz bakım kontrolü</em> ile hizmetimizi sürdürüyoruz. <strong>Mezarlarınızın kalitesi bizim gururumuzdur</strong>.</p></div><div class=\\\"grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/30\\\"><div class=\\\"text-center\\\"><div class=\\\"text-2xl mb-1\\\">98%</div><div class=\\\"text-xs opacity-90\\\">Müşteri Memnuniyeti</div></div><div class=\\\"text-center\\\"><div class=\\\"text-2xl mb-1\\\">5 Yıl</div><div class=\\\"text-xs opacity-90\\\">İşçilik Garantisi</div></div><div class=\\\"text-center\\\"><div class=\\\"text-2xl mb-1\\\">25+</div><div class=\\\"text-xs opacity-90\\\">Yıl Deneyim</div></div></div></div></section>\"}', 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1762878680/custom_pages/609da17f-bee8-11f0-947f-e7685059cf04/cover/mezartasi.png', NULL, NULL, 'Kalite Politikamız - Mezarisim.com | İstanbul Mezar Yapımı', 'A+ malzeme, 5 yıl işçilik garantisi ve %98 müşteri memnuniyeti ile İstanbul mezar yapımı kalite politikamız.', 1, '2025-11-21 14:29:03.424', '2025-11-21 14:29:03.424'),
('6dbe8385-c6e6-11f0-955b-ea727f233291', 'Ramazan Ayı Özel İndirim Kampanyası', 'ramazan-kampanyasi', '{\"html\": \"<div class=\\\"min-h-screen bg-gray-50 py-8\\\">  <div class=\\\"container mx-auto px-4 max-w-4xl\\\">    <a href=\\\"/\\\" class=\\\"inline-flex items-center gap-2 mb-6 border border-teal-500 text-teal-600 rounded-md px-3 py-2 hover:bg-teal-50 transition\\\">&#8592; Ana Sayfaya Dön</a>    <article class=\\\"bg-white rounded-lg shadow-lg overflow-hidden\\\">      <div class=\\\"relative h-64 md:h-80\\\">        <img src=\\\"https://images.unsplash.com/photo-1594968973184-9040a5a79963?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNjb3VudCUyMHNhbGUlMjBwZXJjZW50YWdlfGVufDF8fHx8MTc1NjA3MTEzNnww&amp;ixlib=rb-4.1.0&amp;q=80&amp;w=800&amp;h=400&amp;fit=crop&amp;crop=center\\\" alt=\\\"Ramazan Ayı Özel İndirim Kampanyası\\\" class=\\\"w-full h-full object-cover\\\" />        <div class=\\\"absolute inset-0 bg-gradient-to-t from-black/50 to-transparent\\\"></div>        <div class=\\\"absolute bottom-4 left-4 text-white\\\"><span class=\\\"bg-teal-500 px-3 py-1 rounded-full text-sm font-semibold\\\">Kampanya</span></div>      </div>      <div class=\\\"p-6 md:p-8\\\">        <div class=\\\"flex items-center gap-4 mb-6 text-sm text-gray-600\\\">          <div class=\\\"flex items-center gap-2\\\"><span>📅</span><span>Mart 2024</span></div>          <div class=\\\"flex items-center gap-2\\\"><span>🏷️</span><span>Kampanya</span></div>        </div>        <h1 class=\\\"text-3xl md:text-4xl font-bold text-gray-800 mb-6\\\">Ramazan Ayı Özel İndirim Kampanyası</h1>        <div class=\\\"prose max-w-none space-y-6\\\">          <div class=\\\"bg-teal-50 border-l-4 border-teal-500 p-6 rounded\\\">            <h2 class=\\\"text-xl font-semibold text-teal-700 mb-3\\\">🌙 Ramazan Ayı Boyunca %20 İndirim Fırsatı!</h2>            <p class=\\\"text-gray-700 leading-relaxed\\\">Bu mübarek Ramazan ayında, tüm mezar yapım hizmetlerimizde özel indirim kampanyamız başladı. Mermer ve granit mezar modelleri, mezar baş taşları ve tüm yapım hizmetlerinde geçerli olan bu kampanya sınırlı sürelidir.</p>          </div>          <div class=\\\"grid md:grid-cols-2 gap-6\\\">            <div class=\\\"bg-white border border-gray-200 p-6 rounded-lg\\\">              <h3 class=\\\"text-lg font-semibold text-gray-800 mb-4\\\">Kampanya Kapsamı</h3>              <ul class=\\\"space-y-2 text-gray-700\\\">                <li class=\\\"flex items-center gap-2\\\"><span class=\\\"w-2 h-2 bg-teal-500 rounded-full\\\"></span>Tek kişilik mermer mezar modelleri</li>                <li class=\\\"flex items-center gap-2\\\"><span class=\\\"w-2 h-2 bg-teal-500 rounded-full\\\"></span>İki kişilik mermer mezar modelleri</li>                <li class=\\\"flex items-center gap-2\\\"><span class=\\\"w-2 h-2 bg-teal-500 rounded-full\\\"></span>Granit mezar modelleri</li>                <li class=\\\"flex items-center gap-2\\\"><span class=\\\"w-2 h-2 bg-teal-500 rounded-full\\\"></span>Mezar baş taşları</li>                <li class=\\\"flex items-center gap-2\\\"><span class=\\\"w-2 h-2 bg-teal-500 rounded-full\\\"></span>İşçilik ve montaj hizmetleri</li>              </ul>            </div>            <div class=\\\"bg-white border border-gray-200 p-6 rounded-lg\\\">              <h3 class=\\\"text-lg font-semibold text-gray-800 mb-4\\\">Kampanya Şartları</h3>              <ul class=\\\"space-y-2 text-gray-700\\\">                <li class=\\\"flex items-center gap-2\\\"><span class=\\\"w-2 h-2 bg-orange-500 rounded-full\\\"></span>Kampanya Ramazan ayı boyunca geçerlidir</li>                <li class=\\\"flex items-center gap-2\\\"><span class=\\\"w-2 h-2 bg-orange-500 rounded-full\\\"></span>Peşin ödemede geçerlidir</li>                <li class=\\\"flex items-center gap-2\\\"><span class=\\\"w-2 h-2 bg-orange-500 rounded-full\\\"></span>Diğer kampanyalarla birleştirilemez</li>                <li class=\\\"flex items-center gap-2\\\"><span class=\\\"w-2 h-2 bg-orange-500 rounded-full\\\"></span>Minimum 5.000 TL tutarında siparişlerde geçerli</li>                <li class=\\\"flex items-center gap-2\\\"><span class=\\\"w-2 h-2 bg-orange-500 rounded-full\\\"></span>Sözleşme imzalanması gerekir</li>              </ul>            </div>          </div>          <div class=\\\"bg-gray-100 p-6 rounded-lg\\\">            <h3 class=\\\"text-xl font-semibold text-gray-800 mb-4\\\">🕐 Kampanya Süresi</h3>            <p class=\\\"text-gray-700 leading-relaxed mb-4\\\">Bu özel kampanya <strong>Ramazan ayı başlangıcından itibaren ay sonuna kadar</strong> geçerlidir. Bu fırsatı kaçırmamak için hemen bizimle iletişime geçin ve ücretsiz keşif hizmetinden yararlanın.</p>            <div class=\\\"flex flex-col sm:flex-row gap-3\\\">              <a href=\\\"tel:+905334838971\\\" class=\\\"inline-flex items-center justify-center bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md\\\">Hemen Ara: 0533 483 89 71</a>              <a href=\\\"https://wa.me/905334838971?text=Ramazan%20kampanyası%20hakkında%20bilgi%20almak%20istiyorum\\\" class=\\\"inline-flex items-center justify-center border border-teal-500 text-teal-600 hover:bg-teal-50 px-4 py-2 rounded-md\\\">WhatsApp ile İletişim</a>            </div>          </div>          <div class=\\\"bg-yellow-50 border border-yellow-200 p-6 rounded-lg\\\">            <h3 class=\\\"text-lg font-semibold text-yellow-800 mb-3\\\">⚠️ Önemli Uyarı</h3>            <p class=\\\"text-yellow-700 leading-relaxed\\\">Kampanya kapsamında verilen indirimler sadece Ramazan ayı boyunca geçerlidir. Ay sonundan sonra yapılacak başvurular normal fiyatlandırma ile değerlendirilecektir. Detaylı bilgi ve fiyat teklifi için lütfen bizimle iletişime geçin.</p>          </div>        </div>      </div>    </article>    <div class=\\\"mt-8 grid md:grid-cols-3 gap-4\\\">      <a href=\\\"/models\\\" class=\\\"block h-auto p-4 border border-teal-500 text-teal-600 rounded-md hover:bg-teal-50\\\"><h4 class=\\\"font-semibold mb-1\\\">Mezar Modelleri</h4><p class=\\\"text-sm text-gray-600\\\">Tüm mezar modellerimizi inceleyin</p></a>      <a href=\\\"/pricing\\\" class=\\\"block h-auto p-4 border border-teal-500 text-teal-600 rounded-md hover:bg-teal-50\\\"><h4 class=\\\"font-semibold mb-1\\\">Fiyat Listesi</h4><p class=\\\"text-sm text-gray-600\\\">Güncel fiyatları görüntüleyin</p></a>      <a href=\\\"/contact\\\" class=\\\"block h-auto p-4 border border-teal-500 text-teal-600 rounded-md hover:bg-teal-50\\\"><h4 class=\\\"font-semibold mb-1\\\">İletişim</h4><p class=\\\"text-sm text-gray-600\\\">Bizimle iletişime geçin</p></a>    </div>  </div></div>\"}', 'https://images.unsplash.com/photo-1594968973184-9040a5a79963?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNjb3VudCUyMHNhbGUlMjBwZXJjZW50YWdlfGVufDF8fHx8MTc1NjA3MTEzNnww&ixlib=rb-4.1.0&q=80&w=800&h=400&fit=crop&crop=center', NULL, NULL, 'Ramazan Ayı Özel İndirim Kampanyası', 'Ramazan boyunca mezar yapım hizmetlerinde %20 indirim. Mermer/granit mezar, baş taşı, işçilik ve montajda fırsatlar. İstanbul geneli ücretsiz keşif.', 1, '2025-11-21 14:29:03.424', '2025-11-21 14:29:03.424');


-- ----------------------------
-- Table structure for `accessories`
-- ----------------------------
DROP TABLE IF EXISTS `accessories`;
CREATE TABLE `accessories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `category` varchar(16) NOT NULL,
  `material` varchar(127) NOT NULL,
  `price` varchar(127) NOT NULL,
  `description` longtext DEFAULT NULL,
  `image_url` longtext DEFAULT NULL,
  `storage_asset_id` char(36) DEFAULT NULL,
  `alt` varchar(255) DEFAULT NULL,
  `featured` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  `dimensions` varchar(127) DEFAULT NULL,
  `weight` varchar(127) DEFAULT NULL,
  `thickness` varchar(127) DEFAULT NULL,
  `finish` varchar(127) DEFAULT NULL,
  `warranty` varchar(127) DEFAULT NULL,
  `installation_time` varchar(127) DEFAULT NULL,
  `display_order` int(10) unsigned NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_accessories_slug` (`slug`),
  UNIQUE KEY `uniq_accessories_uuid` (`uuid`),
  KEY `idx_accessories_category` (`category`),
  KEY `idx_accessories_active` (`is_active`),
  KEY `idx_accessories_order` (`display_order`),
  KEY `idx_accessories_storage` (`storage_asset_id`),
  KEY `idx_accessories_created` (`created_at`),
  KEY `idx_accessories_updated` (`updated_at`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of `accessories`
-- ----------------------------
INSERT INTO `accessories` (`id`, `uuid`, `name`, `slug`, `category`, `material`, `price`, `description`, `image_url`, `storage_asset_id`, `alt`, `featured`, `is_active`, `dimensions`, `weight`, `thickness`, `finish`, `warranty`, `installation_time`, `display_order`, `created_at`, `updated_at`) VALUES 
(1, '6e406a26-c6e6-11f0-955b-ea727f233291', 'Klasik Granit Şuluk Modeli', 'klasik-granit-suluk-modeli', 'suluk', 'Siyah Granit', 'Fiyat İçin Arayınız', 'Geleneksel tasarım granit şuluk modeli, dayanıklı ve estetik', 'https://images.unsplash.com/photo-1589894403421-1c4b0c6b3b6e?w=400&h=300&fit=crop', NULL, NULL, 1, 1, '30cm x 15cm x 40cm', '25 kg', '4 cm', 'Parlak Granit Cilalı', '5 Yıl Garanti', '1 Gün', 1, '2024-01-10 00:00:00.000', '2024-01-10 00:00:00.000'),
(2, '6e406d29-c6e6-11f0-955b-ea727f233291', 'Mermer Şuluk Modeli', 'mermer-suluk-modeli', 'suluk', 'Beyaz Mermer', 'Fiyat İçin Arayınız', 'Beyaz mermer malzemeden üretilen zarif şuluk modeli', 'https://images.unsplash.com/photo-1578948856697-db91d246b7b8?w=400&h=300&fit=crop', NULL, NULL, 0, 1, '32cm x 16cm x 42cm', '28 kg', '5 cm', 'Doğal Mermer Cilalı', '8 Yıl Garanti', '1 Gün', 2, '2024-01-11 00:00:00.000', '2024-01-11 00:00:00.000'),
(3, '6e406e67-c6e6-11f0-955b-ea727f233291', 'Özel Tasarım Şuluk', 'ozel-tasarim-suluk', 'suluk', 'Granit + Süsleme', 'Fiyat İçin Arayınız', 'Özel desenli ve süslemeli şuluk modeli', 'https://images.unsplash.com/photo-1589894403421-1c4b0c6b3b6e?w=400&h=300&fit=crop', NULL, NULL, 0, 1, '35cm x 18cm x 45cm', '32 kg', '6 cm', 'Özel İşçilik Süsleme', '10 Yıl Garanti', '2 Gün', 3, '2024-01-12 00:00:00.000', '2024-01-12 00:00:00.000'),
(4, '6e406fa5-c6e6-11f0-955b-ea727f233291', 'Doruk Sütun Modeli', 'doruk-sutun-modeli', 'sutun', 'Beyaz Mermer', 'Fiyat İçin Arayınız', 'Klasik sütun tasarımı, mermer malzemeden üretilmiş', 'https://images.unsplash.com/photo-1578948854345-1b9b2e5f3b9c?w=400&h=300&fit=crop', NULL, NULL, 1, 1, '20cm x 20cm x 120cm', '85 kg', '20 cm', 'Klasik Mermer Cilalı', '15 Yıl Garanti', '1-2 Gün', 4, '2024-01-13 00:00:00.000', '2024-01-13 00:00:00.000'),
(5, '6e407094-c6e6-11f0-955b-ea727f233291', 'Modern Granit Sütun', 'modern-granit-sutun', 'sutun', 'Siyah Granit', 'Fiyat İçin Arayınız', 'Modern tasarım granit sütun modeli', 'https://images.unsplash.com/photo-1578948856894-9f5f2e5c8b2a?w=400&h=300&fit=crop', NULL, NULL, 0, 1, '25cm x 25cm x 140cm', '95 kg', '25 cm', 'Modern Granit İşçilik', '12 Yıl Garanti', '2 Gün', 5, '2024-01-14 00:00:00.000', '2024-01-14 00:00:00.000'),
(6, '6e40717f-c6e6-11f0-955b-ea727f233291', 'Süslü Sütun Modeli', 'suslu-sutun-modeli', 'sutun', 'Mermer + Süsleme', 'Fiyat İçin Arayınız', 'Oymalı ve süslemeli sütun modeli', 'https://images.unsplash.com/photo-1578948856893-2f3e2c5b8a1b?w=400&h=300&fit=crop', NULL, NULL, 0, 1, '22cm x 22cm x 130cm', '90 kg', '22 cm', 'El İşçiliği Süsleme', '20 Yıl Garanti', '2-3 Gün', 6, '2024-01-15 00:00:00.000', '2024-01-15 00:00:00.000'),
(7, '6e407254-c6e6-11f0-955b-ea727f233291', 'Çiçek Vazo Modeli', 'cicek-vazo-modeli', 'vazo', 'Granit', 'Fiyat İçin Arayınız', 'Mezar için özel tasarım çiçek vazosu', 'https://images.unsplash.com/photo-1589894403421-1c4b0c6b3b6e?w=400&h=300&fit=crop', NULL, NULL, 1, 1, '25cm x 25cm x 35cm', '15 kg', '3 cm', 'Mat Granit Yüzey', '5 Yıl Garanti', '1 Gün', 7, '2024-01-16 00:00:00.000', '2024-01-16 00:00:00.000'),
(8, '6e4073b8-c6e6-11f0-955b-ea727f233291', 'Mermer Vazo Modeli', 'mermer-vazo-modeli', 'vazo', 'Beyaz Mermer', 'Fiyat İçin Arayınız', 'Zarif mermer vazo modeli', 'https://images.unsplash.com/photo-1578948856697-db91d246b7b8?w=400&h=300&fit=crop', NULL, NULL, 0, 1, '28cm x 28cm x 40cm', '18 kg', '4 cm', 'Parlak Mermer Cilalı', '8 Yıl Garanti', '1 Gün', 8, '2024-01-17 00:00:00.000', '2024-01-17 00:00:00.000'),
(9, '6e4074f9-c6e6-11f0-955b-ea727f233291', 'Süslü Vazo Modeli', 'suslu-vazo-modeli', 'vazo', 'Granit + Oyma', 'Fiyat İçin Arayınız', 'El oyması süslemeli vazo modeli', 'https://images.unsplash.com/photo-1578948854345-1b9b2e5f3b9c?w=400&h=300&fit=crop', NULL, NULL, 0, 1, '30cm x 30cm x 45cm', '22 kg', '5 cm', 'Oymalı Sanat İşçiliği', '10 Yıl Garanti', '1-2 Gün', 9, '2024-01-18 00:00:00.000', '2024-01-18 00:00:00.000');


-- ----------------------------
-- Table structure for `site_settings`
-- ----------------------------
DROP TABLE IF EXISTS `site_settings`;
CREATE TABLE `site_settings` (
  `id` char(36) NOT NULL,
  `key` varchar(100) NOT NULL,
  `value` mediumtext NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `site_settings_key_uq` (`key`),
  KEY `site_settings_key_idx` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of `site_settings`
-- ----------------------------
INSERT INTO `site_settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES 
('6d84546f-c6e6-11f0-955b-ea727f233291', 'brand_name', '\"mezarisim.com\"', '2025-11-21 14:29:03.064', '2025-11-21 14:29:03.064'),
('6d845601-c6e6-11f0-955b-ea727f233291', 'brand_tagline', '\"online mezar yapımı\"', '2025-11-21 14:29:03.064', '2025-11-21 14:29:03.064'),
('6d8456a3-c6e6-11f0-955b-ea727f233291', 'ui_theme', '{\"color\":\"teal\",\"primaryHex\":\"#009688\",\"darkMode\":false,\"navbarHeight\":96}', '2025-11-21 14:29:03.064', '2025-11-21 14:29:03.064'),
('6d845718-c6e6-11f0-955b-ea727f233291', 'site_version', '\"1.0.0\"', '2025-11-21 14:29:03.064', '2025-11-21 14:29:03.064'),
('6d845780-c6e6-11f0-955b-ea727f233291', 'admin_path', '\"/adminkotrol\"', '2025-11-21 14:29:03.064', '2025-11-21 14:29:03.064'),
('6d854d99-c6e6-11f0-955b-ea727f233291', 'contact_phone_display', '\"0533 483 89 71\"', '2025-11-21 14:29:03.065', '2025-11-21 14:29:03.065'),
('6d8550e4-c6e6-11f0-955b-ea727f233291', 'contact_phone_tel', '\"05334838971\"', '2025-11-21 14:29:03.065', '2025-11-21 14:29:03.065'),
('6d855138-c6e6-11f0-955b-ea727f233291', 'contact_email', '\"mezarisim.com@gmail.com\"', '2025-11-21 14:29:03.065', '2025-11-21 14:29:03.065'),
('6d855177-c6e6-11f0-955b-ea727f233291', 'contact_to_email', '\"mezarisim.com@gmail.com\"', '2025-11-21 14:29:03.065', '2025-11-21 14:29:03.065'),
('6d8551b9-c6e6-11f0-955b-ea727f233291', 'contact_address', '\"Hekimbaşı Mah. Yıldıztepe Cad. No:41 Ümraniye/İstanbul\"', '2025-11-21 14:29:03.065', '2025-11-21 14:29:03.065'),
('6d8551ec-c6e6-11f0-955b-ea727f233291', 'contact_whatsapp_link', '\"https://wa.me/905334838971\"', '2025-11-21 14:29:03.065', '2025-11-21 14:29:03.065'),
('6d864b44-c6e6-11f0-955b-ea727f233291', 'free_inspection_hero_image', '\"https://images.unsplash.com/photo-1672684089414-7174386a1fd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJibGUlMjBzdG9uZSUyMGNlbWV0ZXJ5fGVufDF8fHx8MTc1NjA3MTEzNnww&ixlib=rb-4.1.0&q=80&w=800&h=400&fit=crop&crop=center\"', '2025-11-21 14:29:03.077', '2025-11-21 14:29:03.077'),
('6d864d04-c6e6-11f0-955b-ea727f233291', 'free_inspection_meta_date', '\"Şubat 2024\"', '2025-11-21 14:29:03.077', '2025-11-21 14:29:03.077'),
('6d864d54-c6e6-11f0-955b-ea727f233291', 'free_inspection_meta_tag', '\"Hizmet\"', '2025-11-21 14:29:03.077', '2025-11-21 14:29:03.077'),
('6d864d8e-c6e6-11f0-955b-ea727f233291', 'free_inspection_title', '\"İstanbul Anadolu Yakası Ücretsiz Keşif Hizmeti\"', '2025-11-21 14:29:03.077', '2025-11-21 14:29:03.077'),
('6d864dc3-c6e6-11f0-955b-ea727f233291', 'free_inspection_lead_title', '\"🆓 Tamamen Ücretsiz Keşif ve Ölçüm\"', '2025-11-21 14:29:03.077', '2025-11-21 14:29:03.077'),
('6d864dfa-c6e6-11f0-955b-ea727f233291', 'free_inspection_lead_body', '\"İstanbul Anadolu yakası tüm mezarlıklarında profesyonel keşif ve ölçüm hizmeti sunuyoruz. Uzman ekibimiz, mezarlığa gelerek zemin analizi, ölçüm işlemleri ve teknik değerlendirme yapar. Bu hizmet tamamen ücretsizdir ve herhangi bir yükümlülük getirmez.\"', '2025-11-21 14:29:03.077', '2025-11-21 14:29:03.077'),
('6d864e39-c6e6-11f0-955b-ea727f233291', 'free_inspection_steps_title', '\"Keşif Süreci Nasıl İşler?\"', '2025-11-21 14:29:03.077', '2025-11-21 14:29:03.077'),
('6d864e69-c6e6-11f0-955b-ea727f233291', 'free_inspection_steps', '[{\"step\":\"1\",\"title\":\"Randevu Alın\",\"description\":\"Telefon veya WhatsApp ile iletişime geçin, uygun tarihi belirleyin\"},{\"step\":\"2\",\"title\":\"Keşif Ziyareti\",\"description\":\"Uzman ekibimiz mezarlığa gelerek ölçüm ve inceleme yapar\"},{\"step\":\"3\",\"title\":\"Teknik Rapor\",\"description\":\"Zemin durumu, ölçüler ve uygun model önerilerini içeren rapor hazırlanır\"},{\"step\":\"4\",\"title\":\"Fiyat Teklifi\",\"description\":\"Detaylı fiyat teklifi ve çalışma takvimi sunulur\"}]', '2025-11-21 14:29:03.077', '2025-11-21 14:29:03.077'),
('6d864eb1-c6e6-11f0-955b-ea727f233291', 'free_inspection_service_areas_title', '\"Hizmet Verdiğimiz Bölgeler\"', '2025-11-21 14:29:03.077', '2025-11-21 14:29:03.077'),
('6d864ee2-c6e6-11f0-955b-ea727f233291', 'free_inspection_service_areas_intro', '\"İstanbul Anadolu yakasındaki tüm mezarlıklarda hizmet veriyoruz:\"', '2025-11-21 14:29:03.077', '2025-11-21 14:29:03.077'),
('6d864f14-c6e6-11f0-955b-ea727f233291', 'free_inspection_service_areas', '[\"Üsküdar\",\"Kadıköy\",\"Kartal\",\"Maltepe\",\"Pendik\",\"Tuzla\",\"Çekmeköy\",\"Sancaktepe\",\"Sultanbeyli\",\"Şile\",\"Beykoz\",\"Ümraniye\",\"Ataşehir\",\"Samandıra\",\"Kavacık\",\"Aydos\",\"Ağva\"]', '2025-11-21 14:29:03.077', '2025-11-21 14:29:03.077'),
('6d864f4c-c6e6-11f0-955b-ea727f233291', 'free_inspection_scope_title', '\"Keşif Hizmeti Kapsamı\"', '2025-11-21 14:29:03.077', '2025-11-21 14:29:03.077'),
('6d864f79-c6e6-11f0-955b-ea727f233291', 'free_inspection_scope_items', '[\"Mezar yerinin detaylı ölçümü\",\"Zemin yapısının analizi\",\"Mevcut durumun fotoğraflanması\",\"Uygun model önerilerinin sunulması\",\"Teknik rapor hazırlanması\",\"Detaylı fiyat teklifinin verilmesi\"]', '2025-11-21 14:29:03.077', '2025-11-21 14:29:03.077'),
('6d864fb5-c6e6-11f0-955b-ea727f233291', 'free_inspection_speed_title', '\"Hızlı ve Pratik\"', '2025-11-21 14:29:03.077', '2025-11-21 14:29:03.077'),
('6d864fef-c6e6-11f0-955b-ea727f233291', 'free_inspection_speed_items', '[\"24 saat içinde randevu\",\"Keşif işlemi 30-45 dakika\",\"Aynı gün fiyat teklifi\",\"Hafta sonu da hizmet\",\"Uzman ekip ile çalışma\",\"Yükümlülük getirmez\"]', '2025-11-21 14:29:03.077', '2025-11-21 14:29:03.077'),
('6d865029-c6e6-11f0-955b-ea727f233291', 'free_inspection_cta_title', '\"📞 Ücretsiz Keşif İçin Randevu Alın\"', '2025-11-21 14:29:03.077', '2025-11-21 14:29:03.077'),
('6d865058-c6e6-11f0-955b-ea727f233291', 'free_inspection_cta_body', '\"Mezar yapımı konusunda en doğru kararı verebilmeniz için profesyonel keşif hizmetimizden yararlanın. Uzman ekibimiz size en uygun çözümü sunar ve detaylı bilgi verir.\"', '2025-11-21 14:29:03.077', '2025-11-21 14:29:03.077'),
('6d865089-c6e6-11f0-955b-ea727f233291', 'free_inspection_info_title', '\"💡 Önemli Bilgi\"', '2025-11-21 14:29:03.077', '2025-11-21 14:29:03.077'),
('6d8650b9-c6e6-11f0-955b-ea727f233291', 'free_inspection_info_body', '\"Keşif hizmetimiz tamamen ücretsizdir ve herhangi bir yükümlülük getirmez. Teklif aldıktan sonra düşünme süreniz olacak ve istediğiniz zaman bizimle çalışmaya karar verebilirsiniz. Amacımız size en iyi hizmeti sunmaktır.\"', '2025-11-21 14:29:03.077', '2025-11-21 14:29:03.077'),
('6d87530f-c6e6-11f0-955b-ea727f233291', 'storage_driver', '\"local\"', '2025-11-21 14:29:03.084', '2025-11-21 14:29:03.084'),
('6d8757af-c6e6-11f0-955b-ea727f233291', 'storage_local_root', '\"/www/wwwroot/mezartasi/uploads\"', '2025-11-21 14:29:03.084', '2025-11-21 14:29:03.084'),
('6d875854-c6e6-11f0-955b-ea727f233291', 'storage_local_base_url', '\"http://localhost:8083/uploads\"', '2025-11-21 14:29:03.084', '2025-11-21 14:29:03.084'),
('6d87591a-c6e6-11f0-955b-ea727f233291', 'storage_cdn_public_base', '\"https://cdn.mezartasi.com\"', '2025-11-21 14:29:03.084', '2025-11-21 14:29:03.084'),
('6d8759be-c6e6-11f0-955b-ea727f233291', 'storage_public_api_base', '\"https://mezartasi.com/api\"', '2025-11-21 14:29:03.084', '2025-11-21 14:29:03.084'),
('6d875a46-c6e6-11f0-955b-ea727f233291', 'cloudinary_cloud_name', '\"dbozv7wqd\"', '2025-11-21 14:29:03.084', '2025-11-21 14:29:03.084'),
('6d875ab6-c6e6-11f0-955b-ea727f233291', 'cloudinary_api_key', '\"644676135993432\"', '2025-11-21 14:29:03.084', '2025-11-21 14:29:03.084'),
('6d875b12-c6e6-11f0-955b-ea727f233291', 'cloudinary_api_secret', '\"C2VWxsJ5j0jZpcxOhvuTOTKhaMo\"', '2025-11-21 14:29:03.084', '2025-11-21 14:29:03.084'),
('6d875b6c-c6e6-11f0-955b-ea727f233291', 'cloudinary_folder', '\"uploads\"', '2025-11-21 14:29:03.084', '2025-11-21 14:29:03.084'),
('6d875bd3-c6e6-11f0-955b-ea727f233291', 'cloudinary_unsigned_preset', '\"mezartasi_unsigned_preset\"', '2025-11-21 14:29:03.084', '2025-11-21 14:29:03.084'),
('6d885925-c6e6-11f0-955b-ea727f233291', 'smtp_host', 'smtp.hostinger.com', '2025-11-21 14:29:03.091', '2025-11-21 14:29:03.091'),
('6d885bd2-c6e6-11f0-955b-ea727f233291', 'smtp_port', '465', '2025-11-21 14:29:03.091', '2025-11-21 14:29:03.091'),
('6d885c3d-c6e6-11f0-955b-ea727f233291', 'smtp_username', 'info@koenigsmassage.com', '2025-11-21 14:29:03.091', '2025-11-21 14:29:03.091'),
('6d885c93-c6e6-11f0-955b-ea727f233291', 'smtp_password', 'Kaman@12!', '2025-11-21 14:29:03.091', '2025-11-21 14:29:03.091'),
('6d885cf0-c6e6-11f0-955b-ea727f233291', 'smtp_from_email', 'info@koenigsmassage.com', '2025-11-21 14:29:03.091', '2025-11-21 14:29:03.091'),
('6d885d49-c6e6-11f0-955b-ea727f233291', 'smtp_from_name', 'Mezarisim.com', '2025-11-21 14:29:03.091', '2025-11-21 14:29:03.091'),
('6d885d9b-c6e6-11f0-955b-ea727f233291', 'smtp_ssl', 'true', '2025-11-21 14:29:03.091', '2025-11-21 14:29:03.091'),
('6d888354-c6e6-11f0-955b-ea727f233291', 'header_info_text', '\"Ürünlerimiz Hakkında Detaylı Bilgi İçin\"', '2025-11-21 14:29:03.092', '2025-11-21 14:29:03.092'),
('6d8885f7-c6e6-11f0-955b-ea727f233291', 'header_cta_label', '\"HEMEN ARA\"', '2025-11-21 14:29:03.092', '2025-11-21 14:29:03.092'),
('6d88a68d-c6e6-11f0-955b-ea727f233291', 'footer_keywords', '[\"Ucuz Mezar Yapımı\",\"Mezar Yapımı İşleri\",\"Mezar Yapımı Fiyatları\",\"Mezar Baş Taşı Fiyatı\",\"Mezar Taşına Resim\",\"Ucuz Mezar İşleri\",\"İstanbul Mezar Yapım\",\"Mezar Taşı Fiyatları\"]', '2025-11-21 14:29:03.093', '2025-11-21 14:29:03.093'),
('6d88a8fa-c6e6-11f0-955b-ea727f233291', 'footer_services', '[\"Mezar Yapımı\",\"Mezar Onarımı\",\"Mezar Bakımı\",\"Çiçeklendirme\"]', '2025-11-21 14:29:03.093', '2025-11-21 14:29:03.093'),
('6d88a990-c6e6-11f0-955b-ea727f233291', 'footer_quick_links', '[{\"title\":\"Anasayfa\",\"path\":\"/\",\"pageKey\":\"home\"},{\"title\":\"Hakkımızda\",\"path\":\"/about\",\"pageKey\":\"about\"},{\"title\":\"Ürünlerimiz\",\"path\":\"/pricing\",\"pageKey\":\"pricing\"},{\"title\":\"İletişim\",\"path\":\"/contact\",\"pageKey\":\"contact\"}]', '2025-11-21 14:29:03.093', '2025-11-21 14:29:03.093'),
('6d88cf8b-c6e6-11f0-955b-ea727f233291', 'menu_kurumsal', '[{\"title\":\"HAKKIMIZDA\",\"path\":\"/about\",\"pageKey\":\"about\"},{\"title\":\"MİSYONUMUZ - VİZYONUMUZ\",\"path\":\"/mission\",\"pageKey\":\"mission\"},{\"title\":\"KALİTE POLİTİKAMIZ\",\"path\":\"/quality\",\"pageKey\":\"quality\"},{\"title\":\"S.S.S.\",\"path\":\"/faq\",\"pageKey\":\"faq\"}]', '2025-11-21 14:29:03.094', '2025-11-21 14:29:03.094'),
('6d88d1c0-c6e6-11f0-955b-ea727f233291', 'menu_other_services', '[{\"title\":\"MEZAR ÇİÇEKLENDİRME\",\"path\":\"/gardening\",\"pageKey\":\"gardening\"},{\"title\":\"MEZAR TOPRAK DOLDURUMU\",\"path\":\"/soilfilling\",\"pageKey\":\"soilfilling\"}]', '2025-11-21 14:29:03.094', '2025-11-21 14:29:03.094'),
('6d88f075-c6e6-11f0-955b-ea727f233291', 'seo_defaults', '{\"canonicalBase\":\"https://mezarisim.com\",\"siteName\":\"Mezarisim.com - Mezar Taşı Uzmanları\",\"ogLocale\":\"tr_TR\",\"author\":\"Mezarisim.com - Mezar Taşı Uzmanları\",\"themeColor\":\"#14b8a6\",\"twitterCard\":\"summary_large_image\",\"robots\":\"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1\",\"googlebot\":\"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1\"}', '2025-11-21 14:29:03.095', '2025-11-21 14:29:03.095'),
('6d88f2fd-c6e6-11f0-955b-ea727f233291', 'seo_social_same_as', '[\"https://www.facebook.com/mezarisim\",\"https://www.instagram.com/mezarisim\"]', '2025-11-21 14:29:03.095', '2025-11-21 14:29:03.095'),
('6d88f37a-c6e6-11f0-955b-ea727f233291', 'seo_app_icons', '{\"appleTouchIcon\":\"/apple-touch-icon.png\",\"favicon32\":\"/favicon-32x32.png\",\"favicon16\":\"/favicon-16x16.png\"}', '2025-11-21 14:29:03.095', '2025-11-21 14:29:03.095'),
('6d88f3d2-c6e6-11f0-955b-ea727f233291', 'seo_amp_google_client_id_api', '\"googleanalytics\"', '2025-11-21 14:29:03.095', '2025-11-21 14:29:03.095'),
('6d8910e6-c6e6-11f0-955b-ea727f233291', 'seo_pages_home', '{\"title\":\"Mezar Taşı Modelleri & Mezar Yapımı - Mezarisim.com | İstanbul\",\"description\":\"İstanbul\'da kaliteli mezar taşı modelleri ve mezar yapım hizmetleri. Mermer, granit mezar taşları, mezar aksesuarları ve çiçeklendirme hizmetleri. Ücretsiz keşif!\",\"keywords\":\"mezar taşı, mezar modelleri, mermer mezar, granit mezar, mezar yapımı, İstanbul mezar taşı, mezar aksesuarları, mezar çiçeklendirme\",\"ogImage\":\"/og/home.jpg\"}', '2025-11-21 14:29:03.096', '2025-11-21 14:29:03.096'),
('6d89133c-c6e6-11f0-955b-ea727f233291', 'seo_pages_models', '{\"title\":\"Mezar Baş Taşı Modelleri - Mermer & Granit | Mezarisim.com\",\"description\":\"Özel tasarım mezar baş taşı modelleri. Mermer ve granit malzemeden kaliteli mezar taşları. İstanbul geneli hizmet, ücretsiz keşif ve montaj.\",\"keywords\":\"mezar baş taşı, mezar taşı modelleri, mermer mezar taşı, granit mezar taşı, özel tasarım mezar\",\"ogImage\":\"/og/models.jpg\"}', '2025-11-21 14:29:03.096', '2025-11-21 14:29:03.096'),
('6d891390-c6e6-11f0-955b-ea727f233291', 'seo_pages_accessories', '{\"title\":\"Mezar Aksesuarları & Süsleri - Mezarisim.com | İstanbul\",\"description\":\"Mezar aksesuarları, vazo, çiçeklik, mezar süsleri ve dekoratif ürünler. Kaliteli malzeme, uygun fiyat, hızlı teslimat.\",\"keywords\":\"mezar aksesuarları, mezar vazosu, mezar çiçekliği, mezar süsleri, mezar dekorasyonu\",\"ogImage\":\"/og/accessories.jpg\"}', '2025-11-21 14:29:03.096', '2025-11-21 14:29:03.096'),
('6d8913cc-c6e6-11f0-955b-ea727f233291', 'seo_pages_gardening', '{\"title\":\"Mezar Çiçeklendirme Hizmetleri - Peyzaj & Bahçıvanlık | Mezarisim\",\"description\":\"Profesyonel mezar çiçeklendirme ve peyzaj hizmetleri. Mevsimlik çiçek dikimi, bakım ve düzenleme hizmetleri. İstanbul geneli hizmet.\",\"keywords\":\"mezar çiçeklendirme, mezar peyzajı, mezar bahçıvanlığı, çiçek dikimi, mezar bakımı\",\"ogImage\":\"/og/gardening.jpg\"}', '2025-11-21 14:29:03.096', '2025-11-21 14:29:03.096'),
('6d891407-c6e6-11f0-955b-ea727f233291', 'seo_pages_soilfilling', '{\"title\":\"Mezar Toprak Doldurumu Hizmetleri - Mezarisim.com | İstanbul\",\"description\":\"Mezar toprak doldurumu, düzenleme ve bakım hizmetleri. Kaliteli toprak, profesyonel uygulama, uygun fiyatlar.\",\"keywords\":\"mezar toprak doldurumu, mezar düzenleme, mezar bakımı, toprak dolgulu mezar\",\"ogImage\":\"/og/soilfilling.jpg\"}', '2025-11-21 14:29:03.096', '2025-11-21 14:29:03.096'),
('6d891444-c6e6-11f0-955b-ea727f233291', 'seo_pages_contact', '{\"title\":\"İletişim - Mezar Taşı & Mezar Yapımı Hizmetleri | Mezarisim.com\",\"description\":\"Mezar taşı ve mezar yapımı hizmetleri için bizimle iletişime geçin. İstanbul geneli hizmet, ücretsiz keşif ve danışmanlık.\",\"keywords\":\"mezar taşı iletişim, mezar yapımı İstanbul, mezar taşı fiyatları, ücretsiz keşif\",\"ogImage\":\"/og/contact.jpg\"}', '2025-11-21 14:29:03.096', '2025-11-21 14:29:03.096'),
('6d891484-c6e6-11f0-955b-ea727f233291', 'seo_pages_about', '{\"title\":\"Hakkımızda - Mezar Taşı Uzmanları | Mezarisim.com\",\"description\":\"Mezar taşı ve mezar yapımında uzman ekibimiz ile kaliteli hizmet. Yılların deneyimi, güvenilir iş ortaklığı.\",\"keywords\":\"mezar taşı uzmanları, mezar yapımı deneyimi, kaliteli mezar hizmeti\",\"ogImage\":\"/og/about.jpg\"}', '2025-11-21 14:29:03.096', '2025-11-21 14:29:03.096'),
('6d8914bd-c6e6-11f0-955b-ea727f233291', 'seo_pages_pricing', '{\"title\":\"Mezar Taşı Fiyatları & Paketler - Uygun Fiyatlar | Mezarisim.com\",\"description\":\"Mezar taşı fiyatları, mezar yapım paketleri ve hizmet ücretleri. Şeffaf fiyatlandırma, kaliteli hizmet, uygun ödeme seçenekleri.\",\"keywords\":\"mezar taşı fiyatları, mezar yapım ücreti, mezar taşı paketleri, uygun mezar fiyatları\",\"ogImage\":\"/og/pricing.jpg\"}', '2025-11-21 14:29:03.096', '2025-11-21 14:29:03.096'),
('6d89332e-c6e6-11f0-955b-ea727f233291', 'seo_local_business', '{\"@context\":\"https://schema.org\",\"@type\":\"LocalBusiness\",\"name\":\"Mezarisim.com\",\"description\":\"İstanbul\'da kaliteli mezar taşı modelleri ve mezar yapım hizmetleri\",\"url\":\"https://mezarisim.com\",\"telephone\":\"+90-533-483-8971\",\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"İstanbul\",\"addressCountry\":\"TR\"},\"geo\":{\"@type\":\"GeoCoordinates\",\"latitude\":41.0082,\"longitude\":28.9784},\"sameAs\":[\"https://www.facebook.com/mezarisim\",\"https://www.instagram.com/mezarisim\"],\"priceRange\":\"$$\",\"serviceArea\":{\"@type\":\"GeoCircle\",\"geoMidpoint\":{\"@type\":\"GeoCoordinates\",\"latitude\":41.0082,\"longitude\":28.9784},\"geoRadius\":50000}}', '2025-11-21 14:29:03.097', '2025-11-21 14:29:03.097'),
('6d8956bd-c6e6-11f0-955b-ea727f233291', 'seo_contact_title', '\"İletişim - mezarisim.com\"', '2025-11-21 14:29:03.097', '2025-11-21 14:29:03.097');


-- ----------------------------
-- Table structure for `reviews`
-- ----------------------------
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `rating` int(11) NOT NULL DEFAULT 5,
  `comment` longtext NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_approved` tinyint(1) NOT NULL DEFAULT 0,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `reviews_active_idx` (`is_active`),
  KEY `reviews_approved_idx` (`is_approved`),
  KEY `reviews_order_idx` (`display_order`),
  KEY `reviews_created_idx` (`created_at`),
  KEY `reviews_updated_idx` (`updated_at`),
  KEY `reviews_rating_idx` (`rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of `reviews`
-- ----------------------------
INSERT INTO `reviews` (`id`, `name`, `email`, `rating`, `comment`, `is_active`, `is_approved`, `display_order`, `created_at`, `updated_at`) VALUES 
('6e227059-c6e6-11f0-955b-ea727f233291', 'Ayşe K.', 'ayse@example.com', 5, 'Hizmetten çok memnun kaldık, teşekkürler.', 1, 1, 1, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6e2278b4-c6e6-11f0-955b-ea727f233291', 'Mehmet D.', 'mehmet@example.com', 4, 'Zamanında teslim ve özenli çalışma.', 1, 1, 2, '2024-01-02 00:00:00.000', '2024-01-02 00:00:00.000'),
('6e227a9e-c6e6-11f0-955b-ea727f233291', 'Zeynep B.', 'zeynep@example.com', 5, 'İletişim çok hızlı, kaliteli işçilik.', 1, 1, 3, '2024-01-03 00:00:00.000', '2024-01-03 00:00:00.000');


-- ----------------------------
-- Table structure for `storage_assets`
-- ----------------------------
DROP TABLE IF EXISTS `storage_assets`;
CREATE TABLE `storage_assets` (
  `id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `bucket` varchar(64) NOT NULL,
  `path` varchar(512) NOT NULL,
  `folder` varchar(255) DEFAULT NULL,
  `mime` varchar(127) NOT NULL,
  `size` bigint(20) unsigned NOT NULL,
  `width` int(10) unsigned DEFAULT NULL,
  `height` int(10) unsigned DEFAULT NULL,
  `url` text DEFAULT NULL,
  `hash` varchar(64) DEFAULT NULL,
  `provider` varchar(16) NOT NULL DEFAULT 'cloudinary',
  `provider_public_id` varchar(255) DEFAULT NULL,
  `provider_resource_type` varchar(16) DEFAULT NULL,
  `provider_format` varchar(32) DEFAULT NULL,
  `provider_version` int(10) unsigned DEFAULT NULL,
  `etag` varchar(64) DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_bucket_path` (`bucket`,`path`),
  KEY `idx_storage_bucket` (`bucket`),
  KEY `idx_storage_folder` (`folder`),
  KEY `idx_storage_created` (`created_at`),
  KEY `idx_provider_pubid` (`provider_public_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- ----------------------------
-- Table structure for `recent_works`
-- ----------------------------
DROP TABLE IF EXISTS `recent_works`;
CREATE TABLE `recent_works` (
  `id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` varchar(500) NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `storage_asset_id` char(36) DEFAULT NULL,
  `alt` varchar(255) DEFAULT NULL,
  `category` varchar(255) NOT NULL,
  `seo_keywords` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`seo_keywords`)),
  `date` varchar(64) NOT NULL,
  `location` varchar(255) NOT NULL,
  `material` varchar(255) NOT NULL,
  `price` varchar(255) DEFAULT NULL,
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`details`)),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_recent_works_slug` (`slug`),
  KEY `recent_works_category_idx` (`category`),
  KEY `recent_works_active_idx` (`is_active`),
  KEY `recent_works_updated_idx` (`updated_at`),
  KEY `recent_works_display_idx` (`display_order`),
  KEY `recent_works_asset_idx` (`storage_asset_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of `recent_works`
-- ----------------------------
INSERT INTO `recent_works` (`id`, `title`, `slug`, `description`, `image_url`, `storage_asset_id`, `alt`, `category`, `seo_keywords`, `date`, `location`, `material`, `price`, `details`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES 
('6dfb6a06-c6e6-11f0-955b-ea727f233291', 'Şile Mezar Yapım İşleri / Ağva mezar yapımı', 'sile-mezar-yapim-isleri-agva-mezar-yapimi', 'Şile Mezar Yapım / Şile Mermer Mezar Fiyatları Şile Mezar Yapım işleri / Ağva mezar yapımı / şile mezar modelleri', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', NULL, NULL, 'Şile Mezar Yapım', '[\"şile mezar yapım\",\"şile mezar modelleri\",\"şile mezar fiyatları\",\"şile köy mezarlığı\",\"şile mermer mezar yapım\",\"şile-ağva mezar yapımı\"]', '2024', 'Şile, İstanbul', 'Granit ve Mermer', NULL, '{\"dimensions\": \"200x100 cm\", \"workTime\": \"3 gün\", \"specialFeatures\": [\"Özel gravür işleme\", \"Dayanıklı malzeme\", \"Profesyonel montaj\"], \"customerReview\": \"Çok memnun kaldık, titiz çalışma için teşekkürler.\"}', 1, 1, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6dfb78eb-c6e6-11f0-955b-ea727f233291', 'şile mezar yapım / şile mezar modelleri / şile mezar fiyatları', 'sile-mezar-yapim-sile-mezar-modelleri-sile-mezar-fiyatlari', 'şile mezar yapım / şile mezar modelleri / şile mezar fiyatları / şile köy mezarlığı / şile mermer mezar yapım / şile mermer mezar fiyatları / şile mezar modelleri', 'https://images.unsplash.com/photo-1620121684840-17e4edc4a24c?w=800&h=600&fit=crop', NULL, NULL, 'Şile Mezar Modelleri', '[\"şile mezar yapım\",\"şile mezar modelleri\",\"şile mezar fiyatları\",\"şile köy mezarlığı\",\"şile mermer mezar yapım\",\"şile mermer mezar fiyatları\",\"şile mezar modelleri\"]', '2024', 'Şile, İstanbul', 'Mermer', NULL, '{\"dimensions\": \"180x90 cm\", \"workTime\": \"2 gün\", \"specialFeatures\": [\"Klasik tasarım\", \"El işçiliği\", \"Özel yazıt\"]}', 1, 2, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6dfb7f9d-c6e6-11f0-955b-ea727f233291', 'ucuz mezar modelleri / mezar fiyatları / İstanbul Mezar Yapım İşleri', 'ucuz-mezar-modelleri-mezar-fiyatlari-istanbul-mezar-yapim-isleri', 'ucuz mezar modelleri / mezar fiyatları / İstanbul Mezar Yapım İşleri', 'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800&h=600&fit=crop', NULL, NULL, 'Uygun Fiyatlı Modeller', '[\"ucuz mezar modelleri\",\"mezar fiyatları\",\"İstanbul Mezar Yapım İşleri\"]', '2024', 'İstanbul', 'Granit', 'Uygun fiyat seçenekleri', '{\"dimensions\": \"160x80 cm\", \"workTime\": \"1-2 gün\", \"specialFeatures\": [\"Ekonomik çözüm\", \"Kaliteli malzeme\", \"Hızlı teslimat\"]}', 1, 3, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6dfb8576-c6e6-11f0-955b-ea727f233291', 'Mezar Yapımı Fiyatları mezarisi.com\'da!', 'mezar-yapimi-fiyatlari-mezarisi-com-da', 'Mezar Yapımı Fiyatları mezarisi.com\'da!', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop', NULL, NULL, 'Özel Tasarım', '[\"Mezar Yapımı Fiyatları\",\"mezarisi.com\"]', '2024', 'İstanbul', 'Doğal Taş', NULL, '{\"dimensions\": \"220x120 cm\", \"workTime\": \"4-5 gün\", \"specialFeatures\": [\"Özel tasarım\", \"İtalyan mermeri\", \"Profesyonel işçilik\"]}', 1, 4, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6dfb8a50-c6e6-11f0-955b-ea727f233291', 'Mermer, granit, mozaik mezar modelleri ve mezar baş taşı çeşitleri', 'mermer-granit-mozaik-mezar-modelleri-ve-mezar-bas-tasi-cesitleri', 'Mermer, granit, mozaik mezar modelleri ve mezar baş taşı çeşitleri', 'https://images.unsplash.com/photo-1578847585232-7d95065b2df3?w=800&h=600&fit=crop', NULL, NULL, 'Karma Modeller', '[\"Mermer\",\"granit\",\"mozaik mezar modelleri\",\"mezar baş taşı çeşitleri\"]', '2024', 'İstanbul', 'Mermer, Granit, Mozaik', NULL, '{\"dimensions\": \"Çeşitli boyutlar\", \"workTime\": \"3-7 gün\", \"specialFeatures\": [\"Çok materyal seçeneği\", \"Mozaik süsleme\", \"Özel baş taşı tasarımları\"]}', 1, 5, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000');


-- ----------------------------
-- Table structure for `coupons`
-- ----------------------------
DROP TABLE IF EXISTS `coupons`;
CREATE TABLE `coupons` (
  `id` char(36) NOT NULL,
  `code` varchar(50) NOT NULL,
  `discount_type` enum('percentage','fixed') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `min_purchase` decimal(10,2) DEFAULT NULL,
  `max_discount` decimal(10,2) DEFAULT NULL,
  `usage_limit` int(11) DEFAULT NULL,
  `used_count` int(11) NOT NULL DEFAULT 0,
  `valid_from` datetime(3) DEFAULT NULL,
  `valid_until` datetime(3) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `coupons_code_uq` (`code`),
  KEY `coupons_active_idx` (`is_active`),
  KEY `coupons_valid_from_idx` (`valid_from`),
  KEY `coupons_valid_until_idx` (`valid_until`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of `coupons`
-- ----------------------------
INSERT INTO `coupons` (`id`, `code`, `discount_type`, `discount_value`, `min_purchase`, `max_discount`, `usage_limit`, `used_count`, `valid_from`, `valid_until`, `is_active`, `created_at`, `updated_at`) VALUES 
('07e668cd-2f84-4182-a35e-f55cebf893d8', '2025', 'percentage', '25.00', '500.00', NULL, NULL, 3, '2025-10-07 00:00:00.000', NULL, 1, '2025-10-07 13:17:24.000', '2025-10-15 20:33:57.000');


-- ----------------------------
-- Table structure for `faqs`
-- ----------------------------
DROP TABLE IF EXISTS `faqs`;
CREATE TABLE `faqs` (
  `id` char(36) NOT NULL,
  `question` varchar(500) NOT NULL,
  `answer` longtext NOT NULL,
  `slug` varchar(255) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_faqs_slug` (`slug`),
  KEY `faqs_active_idx` (`is_active`),
  KEY `faqs_order_idx` (`display_order`),
  KEY `faqs_created_idx` (`created_at`),
  KEY `faqs_updated_idx` (`updated_at`),
  KEY `faqs_category_idx` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of `faqs`
-- ----------------------------
INSERT INTO `faqs` (`id`, `question`, `answer`, `slug`, `category`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES 
('6e09450a-c6e6-11f0-955b-ea727f233291', 'Mezar yapımında bize dair bir şüpheniz bulunmasın', '25 yılı aşkın tecrübemiz ve binlerce başarılı projemizle İstanbul\'da mezar yapımı konusunda güvenilir bir firmayız. Kaliteli malzeme, profesyonel işçilik ve müşteri memnuniyeti garantisi ile hizmet veriyoruz. Tüm işlerimizde İstanbul Büyükşehir Belediyesi standartlarına uygun olarak çalışmaktayız.', 'mezar-yapiminda-bize-dair-bir-supheniz-bulunmasin', 'Genel', 1, 1, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6e094bc7-c6e6-11f0-955b-ea727f233291', 'Mezar fiyatları mezar modeline göre değişir mi? Hangi mezar modellerinde fiyat artışı olur?', 'Evet, mezar fiyatları kullanılan malzeme ve mezar modeline göre değişiklik gösterir. Tek kişilik mermer mezar modelleri daha uygun fiyatlıdır. Granit mezar taşı, özel tasarım mezarlar ve büyük boy aile mezarları fiyat artışına neden olur. Detaylı fiyat bilgisi için bizimle iletişime geçebilirsiniz.', 'mezar-fiyatlari-mezar-modeline-gore-degisir-mi-hangi-mezar-modellerinde-fiyat-artisi-olur', 'Genel', 1, 2, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6e094fa6-c6e6-11f0-955b-ea727f233291', 'Mezar yapımı fiyatları hangi durumlarda değişir?', 'Mezar fiyatları; mezar boyutuna (tek kişilik, çift kişilik), kullanılan malzemeye (mermer, granit, traverten), mezar modelinin karmaşıklığına, özel tasarım isteklerine ve mezarlık lokasyonuna göre değişiklik gösterir. Ayrıca mezar aksesuarları ve özel işlemler de fiyatı etkiler.', 'mezar-yapimi-fiyatlari-hangi-durumlarda-degisir', 'Genel', 1, 3, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6e095373-c6e6-11f0-955b-ea727f233291', 'Mezar yapılmak istediğim zaman ne gibi yollara başvurmalıyım?', 'Öncelikle mezar yapım konusunda araştırma yapmalı, güvenilir firmaları karşılaştırmalısınız. Bizimle iletişime geçerek ücretsiz keşif hizmeti alabilir, mezar modelleri hakkında bilgi edinebilir ve fiyat teklifi talep edebilirsiniz. Sonrasında İstanbul Büyükşehir Belediyesi\'nden gerekli izinleri alarak işleme başlayabiliriz.', 'mezar-yapilmak-istedigim-zaman-ne-gibi-yollara-basvurmaliyim', 'Genel', 1, 4, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6e0955e8-c6e6-11f0-955b-ea727f233291', 'Mezar yapımında tercih edilen mezar modelleri nelerdir?', 'Mezar yapımında en çok tercih edilen modeller: Mermer mezar modelleri (ekonomik ve estetik), Granit mezar modelleri (dayanıklı ve uzun ömürlü), Traverten mezar modelleri (doğal görünüm), Lahit tipi mezarlar (klasik ve ihtişamlı), Modern tasarım mezarlar ve özel yapım mezar modelleridir. Her birinin kendine özgü avantajları bulunmaktadır.', 'mezar-yapiminda-tercih-edilen-mezar-modelleri-nelerdir', 'Genel', 1, 5, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6e0957a8-c6e6-11f0-955b-ea727f233291', 'Mezar yapımı ve mezar işlerinde mezar yerinin inşaat ruhsatını ne zaman çıkartabilirim?', 'Mezar yapımı için inşaat ruhsatını, cenaze defin işleminden 3 ay sonra İstanbul Büyükşehir Belediyesi\'nden çıkartabilirsiniz. Bu süre zorunlu bekleme süresidir. Ruhsat başvurusu sırasında mezar planı, malzeme bilgileri ve teknik çizimler gereklidir. Tüm evrak işlemlerinde size yardımcı olabiliriz.', 'mezar-yapimi-ve-mezar-islerinde-mezar-yerinin-insaat-ruhsatini-ne-zaman-cikartabilirim', 'Genel', 1, 6, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6e095915-c6e6-11f0-955b-ea727f233291', 'Mezar yapımında genellikle hangi mezar modelini tercih edilmektedir?', 'Mezar yapımında en çok tercih edilen model mermer mezar modelleridir çünkü hem estetik hem de ekonomiktir. Ancak dayanıklılık açısından granit mezar modelleri daha uzun ömürlüdür ve hava koşullarına karşı daha dirençlidir. Son yıllarda modern tasarım mezarlar da oldukça popülerdir. Tercih tamamen bütçe ve kişisel beğeniye bağlıdır.', 'mezar-yapiminda-genellikle-hangi-mezar-modelini-tercih-edilmektedir', 'Genel', 1, 7, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6e095a7e-c6e6-11f0-955b-ea727f233291', 'Mezar yapımında mezarı lahit mezar olarak yaptırmam uygun olur mu?', 'Lahit tipi mezar modeli klasik ve ihtişamlı bir görünüm sunar. Ancak lahit mezar yapımı için İstanbul Büyükşehir Belediyesi\'nden özel izin almanız ve ruhsat başvurusu sırasında bu tercihinizi belirtmeniz gerekmektedir. Lahit mezarlar daha fazla alan kaplar ve maliyeti yüksektir, ancak çok estetik ve dayanıklıdır.', 'mezar-yapiminda-mezari-lahit-mezar-olarak-yaptirmam-uygun-olur-mu', 'Genel', 1, 8, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6e095bee-c6e6-11f0-955b-ea727f233291', 'Mezar yapımında mermer mezar modellerinden tercih etsem dayanıklı olur mu?', 'Mermer mezar modelleri doğru işçilik ve kaliteli malzeme ile yapıldığında oldukça dayanıklıdır. Mezarisi.com güvencesi ile yapılan mermer mezarlar 10 yıl garanti ile teslim edilir. Düzenli bakım ile mermer mezarlar uzun yıllar kullanılabilir. Ancak en yüksek dayanıklılık için granit mezar modellerini öneririz.', 'mezar-yapiminda-mermer-mezar-modellerinden-tercih-etsem-dayanikli-olur-mu', 'Genel', 1, 9, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000');


-- ----------------------------
-- Table structure for `popups`
-- ----------------------------
DROP TABLE IF EXISTS `popups`;
CREATE TABLE `popups` (
  `id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `image_asset_id` char(36) DEFAULT NULL,
  `image_alt` varchar(255) DEFAULT NULL,
  `button_text` varchar(100) DEFAULT NULL,
  `button_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 0,
  `show_once` tinyint(1) NOT NULL DEFAULT 0,
  `delay` int(11) NOT NULL DEFAULT 0,
  `valid_from` datetime(3) DEFAULT NULL,
  `valid_until` datetime(3) DEFAULT NULL,
  `product_id` char(36) DEFAULT NULL,
  `coupon_code` varchar(64) DEFAULT NULL,
  `display_pages` varchar(24) NOT NULL DEFAULT 'all',
  `priority` int(11) DEFAULT NULL,
  `duration_seconds` int(11) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `popups_active_idx` (`is_active`),
  KEY `popups_valid_from_idx` (`valid_from`),
  KEY `popups_valid_until_idx` (`valid_until`),
  KEY `popups_created_idx` (`created_at`),
  KEY `popups_image_asset_idx` (`image_asset_id`),
  KEY `popups_product_idx` (`product_id`),
  KEY `popups_coupon_idx` (`coupon_code`),
  KEY `popups_priority_idx` (`priority`),
  KEY `popups_display_pages_idx` (`display_pages`),
  KEY `popups_active_time_idx` (`is_active`,`valid_from`,`valid_until`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of `popups`
-- ----------------------------
INSERT INTO `popups` (`id`, `title`, `content`, `image_url`, `image_asset_id`, `image_alt`, `button_text`, `button_url`, `is_active`, `show_once`, `delay`, `valid_from`, `valid_until`, `product_id`, `coupon_code`, `display_pages`, `priority`, `duration_seconds`, `created_at`, `updated_at`) VALUES 
('9a7f1a4b-0a56-4c1a-8f41-2f7b0f8d3c9e', 'Windows 11 Pro için Ekim İndirimi', 'Windows 11 Pro Retail anahtarlarında sınırlı süreli kampanya! Sepette kuponu kullanmayı unutmayın.', 'https://placehold.co/800x400?text=Windows+11+Pro', NULL, 'Windows kampanya', 'Şimdi Al', '/urun/windows-11-pro-retail-key', 1, 1, 1, '2025-10-10 00:00:00.000', '2025-11-01 23:59:59.000', '6c76a7b2-54ed-4290-8d83-c118533c5ee0', '2025', 'products', 70, 0, '2025-10-10 12:00:00.000', '2025-10-10 12:00:00.000'),
('b57879a1-bdb0-4ccd-90a6-fae11d42850b', 'Üye Ol İlk Siparişinde %10 İndirim Kap', 'Sitemize üye olarak yapacağınız ilk siparişlerde geçerli indirim kodunuz hazır.', 'https://krbintayhtsfoqpkgsbv.supabase.co/storage/v1/object/public/blog-images/popup-images/gagx81xi1uh-1760559551779.png', NULL, 'Popup kapak görseli', 'Alışverişe Başla', '/kayit', 1, 0, 3, NULL, NULL, NULL, '2025', 'all', 90, 0, '2025-10-09 18:54:42.000', '2025-10-15 20:19:18.000'),
('caa4a1c1-9f39-4a64-8d34-0e2f6b4fbd77', '500 Takipçide Hafta Sonu Fırsatı', 'Sadece bu hafta sonuna özel! 500 Takipçi paketinde sepette ekstra indirim.', 'https://placehold.co/800x400?text=500+Takipci', NULL, 'Kampanya görseli', 'Paketi İncele', '/urun/500-takipci', 1, 0, 2, '2025-10-10 00:00:00.000', '2025-10-13 23:59:59.000', '0132e42e-d46a-444d-9080-a419aec29c9c', NULL, 'home', 80, 12, '2025-10-10 10:00:00.000', '2025-10-10 10:00:00.000');


-- ----------------------------
-- Table structure for `refresh_tokens`
-- ----------------------------
DROP TABLE IF EXISTS `refresh_tokens`;
CREATE TABLE `refresh_tokens` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `expires_at` datetime(3) NOT NULL,
  `revoked_at` datetime(3) DEFAULT NULL,
  `replaced_by` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `refresh_tokens_user_id_idx` (`user_id`),
  KEY `refresh_tokens_expires_at_idx` (`expires_at`),
  CONSTRAINT `fk_refresh_tokens_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of `refresh_tokens`
-- ----------------------------
INSERT INTO `refresh_tokens` (`id`, `user_id`, `token_hash`, `created_at`, `expires_at`, `revoked_at`, `replaced_by`) VALUES 
('05d03712-8084-40a1-9352-82dec8f08dbe', '4f618a8d-6fdb-498c-898a-395d368b2193', '820b668856710c141b00af6886b6fa1df636fd51c09e7eff71c8571a6d5db5f6', '2025-11-21 15:44:28.235', '2025-11-28 14:44:28.234', NULL, NULL),
('6a4725c2-06c4-497a-9648-c7dee12fffff', '4f618a8d-6fdb-498c-898a-395d368b2193', 'f8a943167a866c6dea5aa93b8c92e8ec4102210bef7e15df4f54d69b900a180a', '2025-11-21 16:38:13.867', '2025-11-28 15:38:13.866', NULL, NULL),
('83bd214e-f499-41a1-9700-1dfe0e3eded6', '4f618a8d-6fdb-498c-898a-395d368b2193', '0dbb30fe291364d93e57b087253e6c01131473462f0094af9bb374a89921b9b5', '2025-11-21 15:44:29.227', '2025-11-28 14:44:29.226', NULL, NULL),
('c69449c2-9cca-4b49-ae82-32a76536be54', '4f618a8d-6fdb-498c-898a-395d368b2193', '8dafa8bf3bf20fff4c1ff017ed6284fc9d038c3e0124ca28845a6afa89f7a931', '2025-11-21 16:38:15.272', '2025-11-28 15:38:15.272', NULL, NULL);


-- ----------------------------
-- Table structure for `menu_items`
-- ----------------------------
DROP TABLE IF EXISTS `menu_items`;
CREATE TABLE `menu_items` (
  `id` char(36) NOT NULL,
  `label` varchar(100) NOT NULL,
  `url` varchar(500) NOT NULL,
  `parent_id` char(36) DEFAULT NULL,
  `location` enum('header','footer') NOT NULL DEFAULT 'header',
  `section_id` char(36) DEFAULT NULL,
  `type` enum('page','custom') NOT NULL DEFAULT 'custom',
  `page_id` char(36) DEFAULT NULL,
  `icon` varchar(64) DEFAULT NULL,
  `order_num` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `menu_items_parent_idx` (`parent_id`),
  KEY `menu_items_active_idx` (`is_active`),
  KEY `menu_items_order_idx` (`order_num`),
  KEY `menu_items_created_idx` (`created_at`),
  KEY `menu_items_updated_idx` (`updated_at`),
  KEY `menu_items_location_idx` (`location`),
  KEY `menu_items_section_idx` (`section_id`),
  CONSTRAINT `menu_items_parent_fk` FOREIGN KEY (`parent_id`) REFERENCES `menu_items` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of `menu_items`
-- ----------------------------
INSERT INTO `menu_items` (`id`, `label`, `url`, `parent_id`, `location`, `section_id`, `type`, `page_id`, `icon`, `order_num`, `is_active`, `created_at`, `updated_at`) VALUES 
('24c49639-01d0-4274-8fb9-c31ed64d0726', 'Kullanım Koşulları', '/kullanim-kosullari', NULL, 'footer', 'f942a930-6743-4ecc-b4b3-1fd6b77f9d77', 'custom', NULL, NULL, 7, 1, '2025-11-21 14:29:03.154', '2025-11-21 14:29:03.154'),
('25740da6-c0f2-4c1d-b131-998018699bfd', 'Hakkımızda', '/hakkimizda', NULL, 'header', NULL, 'custom', NULL, NULL, 3, 1, '2025-11-21 14:29:03.154', '2025-11-21 14:29:03.154'),
('2e32b68d-ae71-4d44-8770-95b8dfb03c36', 'Kampanyalar', '/kampanyalar', NULL, 'footer', '59583ef1-0ba1-4c7c-b806-84fd204b52b9', 'custom', NULL, NULL, 1, 1, '2025-11-21 14:29:03.154', '2025-11-21 14:29:03.154'),
('3d325c92-d59e-4730-8301-5c9bcff463bc', 'KVKK', '/kvkk', NULL, 'footer', 'f942a930-6743-4ecc-b4b3-1fd6b77f9d77', 'custom', NULL, NULL, 4, 1, '2025-11-21 14:29:03.154', '2025-11-21 14:29:03.154'),
('455c6ddf-658b-4c0f-8a9e-0b104708dd07', 'İletişim', '/iletisim', NULL, 'header', NULL, 'custom', NULL, NULL, 5, 1, '2025-11-21 14:29:03.154', '2025-11-21 14:29:03.154'),
('6a4f6b37-ed99-4d98-8c54-d658096aacde', 'SSS', '/sss', NULL, 'footer', '59583ef1-0ba1-4c7c-b806-84fd204b52b9', 'custom', NULL, NULL, 0, 1, '2025-11-21 14:29:03.154', '2025-11-21 14:29:03.154'),
('71c28444-7b6e-47ae-92be-f59206a1b820', 'Gizlilik Politikası', '/gizlilik-politikasi', NULL, 'footer', 'f942a930-6743-4ecc-b4b3-1fd6b77f9d77', 'custom', NULL, NULL, 3, 1, '2025-11-21 14:29:03.154', '2025-11-21 14:29:03.154'),
('9fa999a9-9e47-4a3c-9dac-6afba197d79c', 'İade ve Değişim', '/iade-degisim', NULL, 'footer', 'f942a930-6743-4ecc-b4b3-1fd6b77f9d77', 'custom', NULL, NULL, 5, 1, '2025-11-21 14:29:03.154', '2025-11-21 14:29:03.154'),
('c47a1c3f-cea1-4780-9381-77336bc8ac59', 'Kategoriler', '/kategoriler', NULL, 'header', NULL, 'custom', NULL, NULL, 2, 1, '2025-11-21 14:29:03.154', '2025-11-21 14:29:03.154'),
('ceed431a-aafb-4aba-bf1f-6217b3960c01', 'Blog', '/blog', NULL, 'header', NULL, 'custom', NULL, NULL, 4, 1, '2025-11-21 14:29:03.154', '2025-11-21 14:29:03.154'),
('d8ec7f51-384f-400a-9ac6-3a179cb89087', 'Ödeme Yöntemleri', '/odeme-yontemleri', NULL, 'footer', 'f942a930-6743-4ecc-b4b3-1fd6b77f9d77', 'custom', NULL, NULL, 6, 1, '2025-11-21 14:29:03.154', '2025-11-21 14:29:03.154'),
('f1573cc3-5392-448b-89eb-d0e02e947c6d', 'Nasıl Sipariş Verilir?', '/nasil-siparis-verilir', NULL, 'footer', '59583ef1-0ba1-4c7c-b806-84fd204b52b9', 'custom', NULL, NULL, 2, 1, '2025-11-21 14:29:03.154', '2025-11-21 14:29:03.154'),
('f2570596-db46-4028-902c-d6fe2c9a8312', 'Ürünler', '/urunler', NULL, 'header', NULL, 'custom', NULL, NULL, 1, 1, '2025-11-21 14:29:03.154', '2025-11-21 14:29:03.154'),
('fe8120b3-919a-49b8-8035-df6fd2a2433f', 'Anasayfa', '/', NULL, 'header', NULL, 'custom', NULL, NULL, 0, 1, '2025-11-21 14:29:03.154', '2025-11-21 14:29:03.154');


-- ----------------------------
-- Table structure for `product_options`
-- ----------------------------
DROP TABLE IF EXISTS `product_options`;
CREATE TABLE `product_options` (
  `id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `option_name` varchar(100) NOT NULL,
  `option_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`option_values`)),
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `product_options_product_id_idx` (`product_id`),
  CONSTRAINT `fk_product_options_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- ----------------------------
-- Table structure for `cemeteries`
-- ----------------------------
DROP TABLE IF EXISTS `cemeteries`;
CREATE TABLE `cemeteries` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `address` varchar(500) NOT NULL,
  `district` varchar(255) NOT NULL,
  `phone` varchar(64) NOT NULL,
  `fax` varchar(64) DEFAULT NULL,
  `lat` decimal(10,6) NOT NULL,
  `lng` decimal(10,6) NOT NULL,
  `services` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`services`)),
  `working_hours` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `accessibility` varchar(255) DEFAULT NULL,
  `transportation` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_cemeteries_slug` (`slug`),
  KEY `cemeteries_created_idx` (`created_at`),
  KEY `cemeteries_updated_idx` (`updated_at`),
  KEY `cemeteries_is_active_idx` (`is_active`),
  KEY `cemeteries_district_idx` (`district`),
  KEY `cemeteries_type_idx` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of `cemeteries`
-- ----------------------------
INSERT INTO `cemeteries` (`id`, `name`, `slug`, `type`, `address`, `district`, `phone`, `fax`, `lat`, `lng`, `services`, `working_hours`, `description`, `accessibility`, `transportation`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES 
('6deccdea-c6e6-11f0-955b-ea727f233291', 'Mezarlıklar Daire Başkanlığı', 'mezarliklar-daire-baskanligi', 'Daire Başkanlığı', 'Esentepe Mah. Büyükdere Cad. No:169 Zincirlikuyu Mezarlık alanı girişi Şişli-İSTANBUL', 'Şişli', '0212 312 65 85', '0212 211 51 31', '41.073100', '29.009600', '[\"Mezar Yapımı\", \"Mezar Bakımı\", \"İdari İşlemler\", \"Genel Koordinasyon\"]', '08:00 - 17:00 (Hafta içi)', 'İstanbul Büyükşehir Belediyesi Mezarlıklar Daire Başkanlığı ana merkezi', 'Engelli erişimi mevcut', 'Metro, otobüs ulaşımı', 1, 0, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6decd341-c6e6-11f0-955b-ea727f233291', 'Avrupa Yakası Mezarlıklar Müdürlüğü', 'avrupa-yakasi-mudurlugu', 'Bölge Müdürlüğü', 'Esentepe Mah. Büyükdere Cad. No:169 Zincirlikuyu Mezarlık alanı girişi Şişli-İSTANBUL', 'Şişli', '0212 312 65 86', '0212 211 51 31', '41.073100', '29.009600', '[\"Mezar Tahsisi\", \"Defin İşlemleri\", \"Bakım Onarım\"]', '08:00 - 17:00', 'Avrupa yakası mezarlıklarının yönetiminden sorumlu müdürlük', 'Engelli erişimi mevcut', 'Metro, otobüs ve özel araç', 1, 1, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6decd595-c6e6-11f0-955b-ea727f233291', 'Beyoğlu Bölge Müdür Yardımcılığı', 'beyoglu-bolge-yardimciligi', 'Bölge Müdür Yardımcılığı', 'Esentepe Mah. Büyükdere Cad. No:169 Zincirlikuyu Mezarlık alanı girişi Şişli-İSTANBUL', 'Şişli', '0212 312 65 85', '0212 211 51 31', '41.073100', '29.009600', '[\"Mezar Yapımı\", \"Çiçeklendirme\", \"Temizlik\"]', '08:00 - 17:00', 'Beyoğlu, Kağıthane, Beşiktaş, Sarıyer ve Şişli ilçelerine hizmet vermektedir.', 'Tam erişim', 'Toplu taşıma ve özel araç', 1, 2, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6decd864-c6e6-11f0-955b-ea727f233291', 'İstanbul 1. Bölge Müdür Yardımcılığı', 'istanbul-1-bolge-yardimciligi', 'Bölge Müdür Yardımcılığı', 'Beylerbeyi Cad. Edirnekapı İETT Garajı Yanı Edirnekapı- Fatih', 'Fatih', '0212 449 93 94', '0212 531 18 05', '41.029700', '28.943600', '[\"Defin İşlemleri\", \"Mezar Bakımı\", \"İdari Hizmetler\"]', '08:00 - 17:00', 'Gaziosmanpaşa, Sultangazi, Güngören, Fatih, Bayrampaşa, Zeytinburnu, Bakırköy, Esenler ve Eyüp ilçelerine hizmet vermektedir.', 'Kısmi erişim', 'Otobüs ve metro', 1, 3, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6decda6e-c6e6-11f0-955b-ea727f233291', '500 Evler Cenaze İşleri Şefliği', '500-evler-cenaze-sefliği', 'Cenaze İşleri Şefliği', 'Cevat paşa Mah. Eski Edirne Asfaltı 500 Evler Mezarlığı Girişi Bayrampaşa/ İSTANBUL', 'Bayrampaşa', '0212 538 13 46', '0212 537 59 52', '41.045000', '28.898300', '[\"Cenaze İşlemleri\", \"Mezar Tahsisi\", \"Bakım\"]', '24 Saat', '500 Evler Mezarlığı cenaze ve defin işlemleri', 'Tam erişim', 'Otobüs ve özel araç', 1, 4, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6decdbda-c6e6-11f0-955b-ea727f233291', 'Anadolu Yakası Mezarlıklar Müdürlüğü', 'anadolu-yakasi-mudurlugu', 'Bölge Müdürlüğü', 'Nurtepe Cad. No:2 K Ahmet Mezarlığı Şakirin Camii girişi Zeynep Kamil - Üsküdar/İSTANBUL', 'Üsküdar', '0216 586 55 11', '0216 586 56 31', '41.008200', '29.035900', '[\"Mezar Yapımı\", \"Mezar Bakımı\", \"İdari İşlemler\", \"Defin İşlemleri\"]', '08:00 - 17:00 (Hafta içi)', 'Anadolu yakası mezarlıklarının ana müdürlüğü', 'Engelli erişimi mevcut', 'Metro, otobüs ulaşımı', 1, 5, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6decdd7e-c6e6-11f0-955b-ea727f233291', 'Anadolu 1. Bölge Müdür Yardımcılığı', 'anadolu-1-bolge', 'Bölge Müdür Yardımcılığı', 'Nurtepe Cad. No:2 K Ahmet Mezarlığı Şakirin Camii girişi Zeynep Kamil - Üsküdar/İSTANBUL', 'Üsküdar', '0216 586 55 11', '0216 586 56 31', '41.008200', '29.035900', '[\"Mezar Tahsisi\", \"Defin İşlemleri\", \"Bakım Onarım\"]', '08:00 - 17:00', 'Kadıköy, Üsküdar, Ümraniye ve Ataşehir İlçelerine hizmet vermektedir.', 'Engelli erişimi mevcut', 'Metro, otobüs ve özel araç', 1, 6, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6decded7-c6e6-11f0-955b-ea727f233291', 'Anadolu 2. Bölge Müdür Yardımcılığı', 'anadolu-2-bolge', 'Bölge Müdür Yardımcılığı', 'Gümüşpınar Mah. Atatürk Cad. No: 171/173 Soğanlık Mezarlığı karşısı Soğanlık Kartal/İSTANBUL', 'Kartal', '0216 309 90 62 – 0216 309 90 63', '0216 452 13 65', '40.914400', '29.183300', '[\"Mezar Yapımı\", \"Çiçeklendirme\", \"Temizlik\"]', '08:00 - 17:00', 'Kartal, Maltepe, Pendik, Tuzla, Adalar ve Sultanbeyli İlçelerine hizmet vermektedir.', 'Tam erişim', 'Toplu taşıma ve özel araç', 1, 7, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6dece03f-c6e6-11f0-955b-ea727f233291', 'Sultanbeyli Cenaze İşleri Şefliği', 'sultanbeyli-cenaze', 'Cenaze İşleri Şefliği', 'Abdurrahmangazi Mh. Fatih Bulvarı No:92 (F.S.M Mezarlığı içi) Sultanbeyli/İSTANBUL', 'Sultanbeyli', '0216 398 26 54 - 0216 398 26 55', '0216 398 26 06', '40.964200', '29.271700', '[\"Cenaze İşlemleri\", \"Defin İşlemleri\", \"Mezar Bakımı\"]', '24 Saat', 'Sultanbeyli ilçesi cenaze ve defin işlemleri', 'Tam erişim', 'Otobüs ve özel araç', 1, 8, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6dece1e2-c6e6-11f0-955b-ea727f233291', 'Anadolu 3. Bölge Müdür Yardımcılığı', 'anadolu-3-bolge', 'Bölge Müdür Yardımcılığı', 'Merkez Mah. Köroğlu Cad. Karatağ Sok. Yeni Çekmeköy Mezarlığı Girişi Çekmeköy/İSTANBUL', 'Çekmeköy', '0216 642 84 18 - 0216 642 84 19 - 0216 642 84 20', '0216 642 89 76', '41.027500', '29.201700', '[\"Defin İşlemleri\", \"Mezar Bakımı\", \"İdari Hizmetler\"]', '08:00 - 17:00', 'Çekmeköy, Sancaktepe Beykoz ve Şile İlçelerine hizmet vermektedir.', 'Kısmi erişim', 'Otobüs ve metro', 1, 9, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6dece33c-c6e6-11f0-955b-ea727f233291', 'Beykoz Cenaze İşleri Şefliği', 'beykoz-cenaze', 'Cenaze İşleri Şefliği', 'Gümüşsuyu Cad. İSKİ Binaları 3. Kat Beykoz/İSTANBUL', 'Beykoz', '0216 331 30 25', '0216 425 86 14', '41.137800', '29.083300', '[\"Cenaze İşlemleri\", \"Mezar Tahsisi\", \"Bakım\"]', '08:00 - 17:00', 'Beykoz ilçesi cenaze ve defin işlemleri', 'Tam erişim', 'Otobüs ve özel araç', 1, 10, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6dece4be-c6e6-11f0-955b-ea727f233291', 'Şile Cenaze İşleri Şefliği', 'sile-cenaze', 'Cenaze İşleri Şefliği', 'Balibey Mahallesi Ağayankaya Cad. Esen Sk Balibey Camii Altı Balibey Mezarlığı yanı Şile / İSTANBUL', 'Şile', '0216 711 05 35', NULL, '41.178300', '29.609200', '[\"Cenaze İşlemleri\", \"Mezar Tahsisi\", \"Bakım\"]', '08:00 - 17:00', 'Şile ilçesi cenaze ve defin işlemleri', 'Kısmi erişim', 'Otobüs ve özel araç', 1, 11, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6dece623-c6e6-11f0-955b-ea727f233291', 'Mezarlıklar Destek Hizmetleri Müdürlüğü', 'mezarliklar-destek', 'Destek Hizmetleri Müdürlüğü', 'Esentepe Mah. Büyükdere Cad. No:169 Zincirlikuyu Mezarlık Alanı Girişi -Şişli-İSTANBUL', 'Şişli', '0 212 312 65 70', '0 212 455 43 48', '41.073100', '29.009600', '[\"Destek Hizmetleri\", \"Koordinasyon\", \"Lojistik\"]', '08:00 - 17:00', 'Mezarlıklar için genel destek hizmetleri koordinasyonu', 'Tam erişim', 'Metro, otobüs ulaşımı', 1, 12, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6dece775-c6e6-11f0-955b-ea727f233291', 'Araç İşletme ve Şehirlerarası Nakil Şefliği', 'arac-isletme', 'Araç İşletme Şefliği', 'Atatürk Cad.No:114/116 A Alibeykoy – Eyüp/İSTANBUL', 'Eyüp', '0212 449 91 46', NULL, '41.057800', '28.948600', '[\"Araç Tahsisi\", \"Nakliye\", \"Lojistik\"]', '24 Saat', 'Mezarlık araç filosu işletme ve şehirlerarası nakil hizmetleri', 'Tam erişim', 'Otobüs ve özel araç', 1, 13, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6dece8a1-c6e6-11f0-955b-ea727f233291', 'İstanbul 2. Bölge Müdür Yardımcılığı', 'istanbul-2-bolge', 'Bölge Müdür Yardımcılığı', 'E-5 Karayolu Küçükçekmece Stadyumu Arkası Shell Benzin İstasyonu Yanı Küçükçekmece / İSTANBUL', 'Küçükçekmece', '0212 624 41 57, 0212 449 91 11', '0212 426 37 40', '41.006400', '28.786100', '[\"Mezar Yapımı\", \"Bakım\", \"İdari İşlemler\"]', '08:00 - 17:00', 'Küçükçekmece, Avcılar, Bahçelievler, Beylikdüzü, Bağcılar, Başakşehir, Esenyurt ve Büyükçekmece İlçelerine hizmet vermektedir.', 'Engelli erişimi mevcut', 'Metro, otobüs ve özel araç', 1, 14, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6decea68-c6e6-11f0-955b-ea727f233291', 'Büyükçekmece Cenaze İşleri Şefliği', 'buyukcekmece-cenaze', 'Cenaze İşleri Şefliği', 'Mevlana Mah. Celebi Mehmet 1 Cad. No: 2 Esenyurt / İstanbul', 'Esenyurt', '0212 886 49 32', '0212 886 61 04', '41.026400', '28.674200', '[\"Cenaze İşlemleri\", \"Defin İşlemleri\", \"Mezar Bakımı\"]', '24 Saat', 'Büyükçekmece cenaze ve defin işlemleri', 'Tam erişim', 'Otobüs ve özel araç', 1, 15, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6decebc0-c6e6-11f0-955b-ea727f233291', 'İstanbul 3. Bölge Müdür Yardımcılığı', 'istanbul-3-bolge', 'Bölge Müdür Yardımcılığı', 'Anadolu Mah. Dirlik Sk. Arnavutköy Asri Mezarlığı Girişi No: 5 Arnavutköy / İstanbul', 'Arnavutköy', '0212 449 91 04', '0212 597 23 08', '41.185000', '28.734200', '[\"Mezar Tahsisi\", \"Defin İşlemleri\", \"Bakım\"]', '08:00 - 17:00', 'Arnavutköy ilçesi mezarlık hizmetleri', 'Tam erişim', 'Otobüs ve özel araç', 1, 16, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6deced45-c6e6-11f0-955b-ea727f233291', 'İstanbul 4. Bölge Müdür Yardımcılığı', 'istanbul-4-bolge', 'Bölge Müdür Yardımcılığı', 'Alipaşa Mh. Kültür Sk. Silivri Yeni Mezarlığı Girişi No: 95 Silivri/İSTANBUL', 'Silivri', '0212 449 91 51', '0212 728 64 06', '41.074700', '28.253100', '[\"Mezar Yapımı\", \"Bakım\", \"İdari İşlemler\"]', '08:00 - 17:00', 'Silivri ve Çatalca İlçelerine hizmet vermektedir.', 'Tam erişim', 'Otobüs ve özel araç', 1, 17, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6decee9b-c6e6-11f0-955b-ea727f233291', 'Çatalca Cenaze İşleri Şefliği', 'catalca-cenaze', 'Cenaze İşleri Şefliği', 'Kaleici Mh. Şair Necmettin Halil Onan Bulvarı, Mezlum Saylan Sk. No:30 Çatalca/İSTANBUL', 'Çatalca', '0212 789 54 95', '0212 789 46 18', '41.141400', '28.466400', '[\"Cenaze İşlemleri\", \"Mezar Tahsisi\", \"Bakım\"]', '08:00 - 17:00', 'Çatalca ilçesi cenaze ve defin işlemleri', 'Kısmi erişim', 'Otobüs ve özel araç', 1, 18, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000');


-- ----------------------------
-- Table structure for `sub_categories`
-- ----------------------------
DROP TABLE IF EXISTS `sub_categories`;
CREATE TABLE `sub_categories` (
  `id` char(36) NOT NULL,
  `category_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` longtext DEFAULT NULL,
  `storage_asset_id` char(36) DEFAULT NULL,
  `alt` varchar(255) DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `sub_categories_parent_slug_uq` (`category_id`,`slug`),
  KEY `sub_categories_category_id_idx` (`category_id`),
  KEY `sub_categories_active_idx` (`is_active`),
  KEY `sub_categories_order_idx` (`display_order`),
  KEY `sub_categories_storage_asset_idx` (`storage_asset_id`),
  CONSTRAINT `fk_sub_categories_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of `sub_categories`
-- ----------------------------
INSERT INTO `sub_categories` (`id`, `category_id`, `name`, `slug`, `description`, `image_url`, `storage_asset_id`, `alt`, `icon`, `is_active`, `is_featured`, `display_order`, `created_at`, `updated_at`) VALUES 
('bbbb0001-2222-4222-8222-bbbbbbbb0001', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'Tek Kişilik Mermer Mezar', 'tek-kisilik-mermer-mezar', NULL, NULL, NULL, NULL, NULL, 1, 0, 10, '2025-11-21 14:29:02.915', '2025-11-21 14:29:02.915'),
('bbbb0002-2222-4222-8222-bbbbbbbb0002', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'Tek Kişilik Granit Mezar', 'tek-kisilik-granit-mezar', NULL, NULL, NULL, NULL, NULL, 1, 0, 20, '2025-11-21 14:29:02.915', '2025-11-21 14:29:02.915'),
('bbbb0003-2222-4222-8222-bbbbbbbb0003', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'İki Kişilik Mermer Mezar', 'iki-kisilik-mermer-mezar', NULL, NULL, NULL, NULL, NULL, 1, 0, 30, '2025-11-21 14:29:02.915', '2025-11-21 14:29:02.915'),
('bbbb0004-2222-4222-8222-bbbbbbbb0004', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'İki Kişilik Granit Mezar', 'iki-kisilik-granit-mezar', NULL, NULL, NULL, NULL, NULL, 1, 0, 40, '2025-11-21 14:29:02.915', '2025-11-21 14:29:02.915'),
('bbbb0005-2222-4222-8222-bbbbbbbb0005', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'Katlı Lahit Mezar', 'katli-lahit-mezar', NULL, NULL, NULL, NULL, NULL, 1, 0, 50, '2025-11-21 14:29:02.915', '2025-11-21 14:29:02.915'),
('bbbb0006-2222-4222-8222-bbbbbbbb0006', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'Özel Yapım Mezar', 'ozel-yapim-mezar', NULL, NULL, NULL, NULL, NULL, 1, 0, 60, '2025-11-21 14:29:02.915', '2025-11-21 14:29:02.915'),
('bbbb0007-2222-4222-8222-bbbbbbbb0007', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'Sütunlu Mezar', 'sutunlu-mezar', NULL, NULL, NULL, NULL, NULL, 1, 0, 70, '2025-11-21 14:29:02.915', '2025-11-21 14:29:02.915'),
('cccc0001-3333-4333-8333-cccccccc0001', 'aaaa0002-1111-4111-8111-aaaaaaaa0002', 'Mermer Baş Taşı', 'mermer-bas-tasi', NULL, NULL, NULL, NULL, NULL, 1, 0, 10, '2025-11-21 14:29:02.922', '2025-11-21 14:29:02.922'),
('cccc0002-3333-4333-8333-cccccccc0002', 'aaaa0002-1111-4111-8111-aaaaaaaa0002', 'Granit Baş Taşı', 'granit-bas-tasi', NULL, NULL, NULL, NULL, NULL, 1, 0, 20, '2025-11-21 14:29:02.922', '2025-11-21 14:29:02.922'),
('cccc0003-3333-4333-8333-cccccccc0003', 'aaaa0002-1111-4111-8111-aaaaaaaa0002', 'Sütunlu Baş Taşı', 'sutunlu-bas-tasi', NULL, NULL, NULL, NULL, NULL, 1, 0, 30, '2025-11-21 14:29:02.922', '2025-11-21 14:29:02.922'),
('cccc0004-3333-4333-8333-cccccccc0004', 'aaaa0002-1111-4111-8111-aaaaaaaa0002', 'Özel Tasarım Baş Taşları', 'ozel-tasarim-bas-taslari', NULL, NULL, NULL, NULL, NULL, 1, 0, 40, '2025-11-21 14:29:02.922', '2025-11-21 14:29:02.922'),
('dddd0001-4444-4444-8444-dddddddd0001', 'aaaa0003-1111-4111-8111-aaaaaaaa0003', 'Mezar Süsleri', 'mezar-susleri', NULL, NULL, NULL, NULL, NULL, 1, 0, 10, '2025-11-21 14:29:02.929', '2025-11-21 14:29:02.929'),
('dddd0002-4444-4444-8444-dddddddd0002', 'aaaa0003-1111-4111-8111-aaaaaaaa0003', 'Sütun Modelleri', 'sutun-modelleri', NULL, NULL, NULL, NULL, NULL, 1, 0, 20, '2025-11-21 14:29:02.929', '2025-11-21 14:29:02.929'),
('dddd0003-4444-4444-8444-dddddddd0003', 'aaaa0003-1111-4111-8111-aaaaaaaa0003', 'Vazo Modelleri', 'vazo-modelleri', NULL, NULL, NULL, NULL, NULL, 1, 0, 30, '2025-11-21 14:29:02.929', '2025-11-21 14:29:02.929'),
('dddd0004-4444-4444-8444-dddddddd0004', 'aaaa0003-1111-4111-8111-aaaaaaaa0003', 'Diğer Modeller', 'diger-modeller', NULL, NULL, NULL, NULL, NULL, 1, 0, 40, '2025-11-21 14:29:02.929', '2025-11-21 14:29:02.929'),
('eeee0001-5555-4555-8555-eeeeeeee0001', 'aaaa0004-1111-4111-8111-aaaaaaaa0004', 'Mevsimlik Bitki', 'mevsimlik-bitki', NULL, NULL, NULL, NULL, NULL, 1, 0, 10, '2025-11-21 14:29:02.930', '2025-11-21 14:29:02.930'),
('eeee0002-5555-4555-8555-eeeeeeee0002', 'aaaa0004-1111-4111-8111-aaaaaaaa0004', 'Sürekli Bitki', 'surekli-bitki', NULL, NULL, NULL, NULL, NULL, 1, 0, 20, '2025-11-21 14:29:02.930', '2025-11-21 14:29:02.930'),
('eeee0003-5555-4555-8555-eeeeeeee0003', 'aaaa0004-1111-4111-8111-aaaaaaaa0004', 'Topik Peyzaj', 'topik-peyzaj', NULL, NULL, NULL, NULL, NULL, 1, 0, 30, '2025-11-21 14:29:02.930', '2025-11-21 14:29:02.930'),
('ffff0001-6666-4666-8666-ffffffff0001', 'aaaa0005-1111-4111-8111-aaaaaaaa0005', 'Toprak Dolumu', 'toprak-dolumu', NULL, NULL, NULL, NULL, NULL, 1, 0, 10, '2025-11-21 14:29:02.931', '2025-11-21 14:29:02.931'),
('ffff0002-6666-4666-8666-ffffffff0002', 'aaaa0005-1111-4111-8111-aaaaaaaa0005', 'Özel Toprak Karışımı', 'ozel-toprak-karisimi', NULL, NULL, NULL, NULL, NULL, 1, 0, 20, '2025-11-21 14:29:02.931', '2025-11-21 14:29:02.931'),
('ffff0003-6666-4666-8666-ffffffff0003', 'aaaa0005-1111-4111-8111-aaaaaaaa0005', 'Restorasyon', 'restorasyon', NULL, NULL, NULL, NULL, NULL, 1, 0, 30, '2025-11-21 14:29:02.931', '2025-11-21 14:29:02.931');


-- ----------------------------
-- Table structure for `product_faqs`
-- ----------------------------
DROP TABLE IF EXISTS `product_faqs`;
CREATE TABLE `product_faqs` (
  `id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `question` varchar(500) NOT NULL,
  `answer` text NOT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `product_faqs_product_id_idx` (`product_id`),
  KEY `product_faqs_order_idx` (`display_order`),
  CONSTRAINT `fk_product_faqs_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of `product_faqs`
-- ----------------------------
INSERT INTO `product_faqs` (`id`, `product_id`, `question`, `answer`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES 
('6d78cb13-c6e6-11f0-955b-ea727f233291', '00000001-0000-4000-8000-000000000001', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78cc26-c6e6-11f0-955b-ea727f233291', '00000002-0000-4000-8000-000000000002', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78cc2f-c6e6-11f0-955b-ea727f233291', '00000003-0000-4000-8000-000000000003', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78cc37-c6e6-11f0-955b-ea727f233291', '00000004-0000-4000-8000-000000000004', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78cc3e-c6e6-11f0-955b-ea727f233291', '00000005-0000-4000-8000-000000000005', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78cc45-c6e6-11f0-955b-ea727f233291', '00000006-0000-4000-8000-000000000006', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78cc4d-c6e6-11f0-955b-ea727f233291', '00000007-0000-4000-8000-000000000007', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78cc54-c6e6-11f0-955b-ea727f233291', '00000008-0000-4000-8000-000000000008', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78cc5b-c6e6-11f0-955b-ea727f233291', '00000009-0000-4000-8000-000000000009', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78cc62-c6e6-11f0-955b-ea727f233291', '00000010-0000-4000-8000-000000000010', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78cc69-c6e6-11f0-955b-ea727f233291', '00000011-0000-4000-8000-000000000011', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78cc71-c6e6-11f0-955b-ea727f233291', '00000012-0000-4000-8000-000000000012', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78cc78-c6e6-11f0-955b-ea727f233291', '00000013-0000-4000-8000-000000000013', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78cc7f-c6e6-11f0-955b-ea727f233291', '00000014-0000-4000-8000-000000000014', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78cc86-c6e6-11f0-955b-ea727f233291', '00000015-0000-4000-8000-000000000015', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78cc8e-c6e6-11f0-955b-ea727f233291', '00000016-0000-4000-8000-000000000016', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78cc95-c6e6-11f0-955b-ea727f233291', '00000017-0000-4000-8000-000000000017', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78cc9c-c6e6-11f0-955b-ea727f233291', '00000018-0000-4000-8000-000000000018', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78cca3-c6e6-11f0-955b-ea727f233291', '00000019-0000-4000-8000-000000000019', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78ccab-c6e6-11f0-955b-ea727f233291', '00000020-0000-4000-8000-000000000020', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78ccb2-c6e6-11f0-955b-ea727f233291', '00000021-0000-4000-8000-000000000021', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78ccba-c6e6-11f0-955b-ea727f233291', '00000022-0000-4000-8000-000000000022', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78ccc1-c6e6-11f0-955b-ea727f233291', '00000023-0000-4000-8000-000000000023', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78ccc8-c6e6-11f0-955b-ea727f233291', '00000024-0000-4000-8000-000000000024', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78cccf-c6e6-11f0-955b-ea727f233291', '00000025-0000-4000-8000-000000000025', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78ccd6-c6e6-11f0-955b-ea727f233291', '00000026-0000-4000-8000-000000000026', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78ccde-c6e6-11f0-955b-ea727f233291', '00000027-0000-4000-8000-000000000027', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78cce5-c6e6-11f0-955b-ea727f233291', '00000028-0000-4000-8000-000000000028', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78ccec-c6e6-11f0-955b-ea727f233291', '00000029-0000-4000-8000-000000000029', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d78ccf3-c6e6-11f0-955b-ea727f233291', '00000030-0000-4000-8000-000000000030', 'Teslimat süresi nedir?', 'İstanbul içi ortalama 2–3 iş gününde kurulum yapılır. Hava koşulları ve mezarlık izin süreçlerine göre değişebilir.', 10, 1, '2025-11-21 14:29:02.989', '2025-11-21 14:29:02.989'),
('6d790c86-c6e6-11f0-955b-ea727f233291', '00000001-0000-4000-8000-000000000001', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d790f63-c6e6-11f0-955b-ea727f233291', '00000002-0000-4000-8000-000000000002', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d79100b-c6e6-11f0-955b-ea727f233291', '00000003-0000-4000-8000-000000000003', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d79109a-c6e6-11f0-955b-ea727f233291', '00000004-0000-4000-8000-000000000004', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d79112e-c6e6-11f0-955b-ea727f233291', '00000005-0000-4000-8000-000000000005', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d7911bb-c6e6-11f0-955b-ea727f233291', '00000006-0000-4000-8000-000000000006', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d7912eb-c6e6-11f0-955b-ea727f233291', '00000007-0000-4000-8000-000000000007', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d7913b1-c6e6-11f0-955b-ea727f233291', '00000008-0000-4000-8000-000000000008', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d79143a-c6e6-11f0-955b-ea727f233291', '00000009-0000-4000-8000-000000000009', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d7914ea-c6e6-11f0-955b-ea727f233291', '00000010-0000-4000-8000-000000000010', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d791583-c6e6-11f0-955b-ea727f233291', '00000011-0000-4000-8000-000000000011', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d79177c-c6e6-11f0-955b-ea727f233291', '00000012-0000-4000-8000-000000000012', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d791881-c6e6-11f0-955b-ea727f233291', '00000013-0000-4000-8000-000000000013', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d791914-c6e6-11f0-955b-ea727f233291', '00000014-0000-4000-8000-000000000014', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d7919a3-c6e6-11f0-955b-ea727f233291', '00000015-0000-4000-8000-000000000015', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d791a31-c6e6-11f0-955b-ea727f233291', '00000016-0000-4000-8000-000000000016', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d791ac2-c6e6-11f0-955b-ea727f233291', '00000017-0000-4000-8000-000000000017', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d791b56-c6e6-11f0-955b-ea727f233291', '00000018-0000-4000-8000-000000000018', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d791beb-c6e6-11f0-955b-ea727f233291', '00000019-0000-4000-8000-000000000019', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d791c84-c6e6-11f0-955b-ea727f233291', '00000020-0000-4000-8000-000000000020', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d791d22-c6e6-11f0-955b-ea727f233291', '00000021-0000-4000-8000-000000000021', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d791dd5-c6e6-11f0-955b-ea727f233291', '00000022-0000-4000-8000-000000000022', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d791e90-c6e6-11f0-955b-ea727f233291', '00000023-0000-4000-8000-000000000023', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d791f2c-c6e6-11f0-955b-ea727f233291', '00000024-0000-4000-8000-000000000024', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d79202d-c6e6-11f0-955b-ea727f233291', '00000025-0000-4000-8000-000000000025', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d7920e7-c6e6-11f0-955b-ea727f233291', '00000026-0000-4000-8000-000000000026', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d792184-c6e6-11f0-955b-ea727f233291', '00000027-0000-4000-8000-000000000027', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d792229-c6e6-11f0-955b-ea727f233291', '00000028-0000-4000-8000-000000000028', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d7922cb-c6e6-11f0-955b-ea727f233291', '00000029-0000-4000-8000-000000000029', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d792342-c6e6-11f0-955b-ea727f233291', '00000030-0000-4000-8000-000000000030', 'Garanti kapsamı nelerdir?', 'Tüm modeller 10 yıl işçilik garantilidir. Doğal taşın yapısal özelliklerinden kaynaklı renk/ton farklılıkları garanti kapsamı dışındadır.', 20, 1, '2025-11-21 14:29:02.990', '2025-11-21 14:29:02.990'),
('6d79807a-c6e6-11f0-955b-ea727f233291', '00000001-0000-4000-8000-000000000001', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d798129-c6e6-11f0-955b-ea727f233291', '00000002-0000-4000-8000-000000000002', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d7981c0-c6e6-11f0-955b-ea727f233291', '00000003-0000-4000-8000-000000000003', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d798256-c6e6-11f0-955b-ea727f233291', '00000004-0000-4000-8000-000000000004', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d7982e3-c6e6-11f0-955b-ea727f233291', '00000005-0000-4000-8000-000000000005', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d798376-c6e6-11f0-955b-ea727f233291', '00000006-0000-4000-8000-000000000006', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d79840b-c6e6-11f0-955b-ea727f233291', '00000007-0000-4000-8000-000000000007', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d7984a0-c6e6-11f0-955b-ea727f233291', '00000008-0000-4000-8000-000000000008', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d79852d-c6e6-11f0-955b-ea727f233291', '00000009-0000-4000-8000-000000000009', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d7985c1-c6e6-11f0-955b-ea727f233291', '00000010-0000-4000-8000-000000000010', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d79865d-c6e6-11f0-955b-ea727f233291', '00000011-0000-4000-8000-000000000011', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d7986f1-c6e6-11f0-955b-ea727f233291', '00000012-0000-4000-8000-000000000012', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d79877d-c6e6-11f0-955b-ea727f233291', '00000013-0000-4000-8000-000000000013', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d798810-c6e6-11f0-955b-ea727f233291', '00000014-0000-4000-8000-000000000014', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d7988aa-c6e6-11f0-955b-ea727f233291', '00000015-0000-4000-8000-000000000015', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d79893d-c6e6-11f0-955b-ea727f233291', '00000016-0000-4000-8000-000000000016', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d7989c9-c6e6-11f0-955b-ea727f233291', '00000017-0000-4000-8000-000000000017', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d798a5b-c6e6-11f0-955b-ea727f233291', '00000018-0000-4000-8000-000000000018', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d798af2-c6e6-11f0-955b-ea727f233291', '00000019-0000-4000-8000-000000000019', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d798b88-c6e6-11f0-955b-ea727f233291', '00000020-0000-4000-8000-000000000020', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d798c17-c6e6-11f0-955b-ea727f233291', '00000021-0000-4000-8000-000000000021', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d798cab-c6e6-11f0-955b-ea727f233291', '00000022-0000-4000-8000-000000000022', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d798d46-c6e6-11f0-955b-ea727f233291', '00000023-0000-4000-8000-000000000023', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d798dd9-c6e6-11f0-955b-ea727f233291', '00000024-0000-4000-8000-000000000024', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d798e6a-c6e6-11f0-955b-ea727f233291', '00000025-0000-4000-8000-000000000025', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d798efd-c6e6-11f0-955b-ea727f233291', '00000026-0000-4000-8000-000000000026', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d798f9b-c6e6-11f0-955b-ea727f233291', '00000027-0000-4000-8000-000000000027', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d799039-c6e6-11f0-955b-ea727f233291', '00000028-0000-4000-8000-000000000028', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d7990d2-c6e6-11f0-955b-ea727f233291', '00000029-0000-4000-8000-000000000029', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994'),
('6d799147-c6e6-11f0-955b-ea727f233291', '00000030-0000-4000-8000-000000000030', 'Özelleştirme yapılıyor mu?', 'Yazı tipi, desen, ölçü ve taş cinsi özelleştirilebilir. Proje onayı sonrası üretime alınır.', 30, 1, '2025-11-21 14:29:02.994', '2025-11-21 14:29:02.994');


-- ----------------------------
-- Table structure for `services`
-- ----------------------------
DROP TABLE IF EXISTS `services`;
CREATE TABLE `services` (
  `id` char(36) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(32) NOT NULL DEFAULT 'other',
  `category` varchar(64) NOT NULL DEFAULT 'general',
  `material` varchar(255) DEFAULT NULL,
  `price` varchar(128) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `featured` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  `display_order` int(10) unsigned NOT NULL DEFAULT 1,
  `image_url` varchar(500) DEFAULT NULL,
  `image_asset_id` char(36) DEFAULT NULL,
  `alt` varchar(255) DEFAULT NULL,
  `featured_image` varchar(500) DEFAULT NULL,
  `area` varchar(64) DEFAULT NULL,
  `duration` varchar(64) DEFAULT NULL,
  `maintenance` varchar(64) DEFAULT NULL,
  `season` varchar(64) DEFAULT NULL,
  `soil_type` varchar(128) DEFAULT NULL,
  `thickness` varchar(64) DEFAULT NULL,
  `equipment` varchar(128) DEFAULT NULL,
  `warranty` varchar(128) DEFAULT NULL,
  `includes` varchar(255) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_services_slug` (`slug`),
  KEY `services_active_idx` (`is_active`),
  KEY `services_order_idx` (`display_order`),
  KEY `services_type_idx` (`type`),
  KEY `services_category_idx` (`category`),
  KEY `services_image_asset_idx` (`image_asset_id`),
  KEY `services_created_idx` (`created_at`),
  KEY `services_updated_idx` (`updated_at`),
  KEY `services_active_type_order_idx` (`is_active`,`type`,`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of `services`
-- ----------------------------
INSERT INTO `services` (`id`, `slug`, `name`, `type`, `category`, `material`, `price`, `description`, `featured`, `is_active`, `display_order`, `image_url`, `image_asset_id`, `alt`, `featured_image`, `area`, `duration`, `maintenance`, `season`, `soil_type`, `thickness`, `equipment`, `warranty`, `includes`, `created_at`, `updated_at`) VALUES 
('6e16b868-c6e6-11f0-955b-ea727f233291', 'mevsimlik-cicek-ekimi', 'Mevsimlik Çiçek Ekimi', 'gardening', 'mevsimlik', 'Mevsim Çiçekleri', 'Fiyat İçin Arayınız', 'Mezar alanınıza mevsimlik çiçek ekimi ve düzenli bakım hizmeti', 1, 1, 1, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop', NULL, 'Mevsimlik çiçek ekimi', NULL, '2-5 m²', '3-4 Ay', 'Haftalık Bakım', 'Mevsimlik', NULL, NULL, NULL, 'Çiçek Sağlığı Garantisi', 'Çiçek + Toprak + Ekim + Bakım', '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6e16bafc-c6e6-11f0-955b-ea727f233291', 'bahar-cicekleri-duzenlemesi', 'Bahar Çiçekleri Düzenlemesi', 'gardening', 'mevsimlik', 'Bahar Çiçekleri', 'Fiyat İçin Arayınız', 'Lale, sümbül ve nergis gibi bahar çiçekleri ile düzenleme', 0, 1, 2, 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop', NULL, 'Bahar çiçekleri düzenlemesi', NULL, '1-3 m²', '2-3 Ay', 'Haftalık Bakım', 'Bahar', NULL, NULL, NULL, 'Çiçek Sağlığı Garantisi', 'Soğan + Toprak + Ekim + Bakım', '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6e16bbfe-c6e6-11f0-955b-ea727f233291', 'yaz-cicekleri-ekimi', 'Yaz Çiçekleri Ekimi', 'gardening', 'mevsimlik', 'Yaz Çiçekleri', 'Fiyat İçin Arayınız', 'Petunya, begonya ve diğer yaz çiçekleri ile renkli düzenleme', 0, 1, 3, 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop', NULL, 'Yaz çiçekleri ekimi', NULL, '2-4 m²', '4-5 Ay', 'Haftalık Bakım', 'Yaz', NULL, NULL, NULL, 'Çiçek Sağlığı Garantisi', 'Fide + Toprak + Ekim + Bakım', '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6e16bcda-c6e6-11f0-955b-ea727f233291', 'cim-ekimi-ve-duzenlemesi', 'Çim Ekimi ve Düzenlemesi', 'gardening', 'surekli', 'Çim + Bitki', 'Fiyat İçin Arayınız', 'Mezar alanında çim ekimi ve sürekli yeşil alan oluşturma', 1, 1, 4, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop', NULL, 'Çim ekimi ve düzenlemesi', NULL, '3-10 m²', 'Sürekli', 'Aylık Bakım', 'Tüm Mevsim', NULL, NULL, NULL, '1 Yıl Çim Garantisi', 'Çim Tohumu + Toprak + Ekim + Bakım', '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6e16bdfb-c6e6-11f0-955b-ea727f233291', 'sus-bitkisi-dikimi', 'Süs Bitkisi Dikimi', 'gardening', 'surekli', 'Süs Bitkileri', 'Fiyat İçin Arayınız', 'Dayanıklı süs bitkileri ile kalıcı yeşil alan oluşturma', 0, 1, 5, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop', NULL, 'Süs bitkisi dikimi', NULL, '2-6 m²', 'Sürekli', 'Aylık Bakım', 'Tüm Mevsim', NULL, NULL, NULL, '6 Ay Bitki Garantisi', 'Bitki + Toprak + Dikim + Bakım', '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6e16bfd2-c6e6-11f0-955b-ea727f233291', 'cali-ve-agac-dikimi', 'Çalı ve Ağaç Dikimi', 'gardening', 'surekli', 'Ağaç + Çalı', 'Fiyat İçin Arayınız', 'Küçük ağaç ve çalı dikimi ile doğal gölgelik alan', 0, 1, 6, 'https://images.unsplash.com/photo-1574263867128-dacbc0fc09ce?w=400&h=300&fit=crop', NULL, 'Çalı ve ağaç dikimi', NULL, '1-4 m²', 'Sürekli', 'Mevsimlik Bakım', 'Tüm Mevsim', NULL, NULL, NULL, '1 Yıl Ağaç Garantisi', 'Ağaç/Çalı + Toprak + Dikim + Bakım', '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6e16c0bb-c6e6-11f0-955b-ea727f233291', 'ozel-peyzaj-tasarimi', 'Özel Peyzaj Tasarımı', 'gardening', 'ozel', 'Karma Peyzaj', 'Fiyat İçin Arayınız', 'Özel tasarım peyzaj düzenlemesi ve sürekli bakım hizmeti', 1, 1, 7, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop', NULL, 'Özel peyzaj tasarımı', NULL, '5-15 m²', 'Sürekli', 'Haftalık Bakım', 'Tüm Mevsim', NULL, NULL, NULL, '2 Yıl Peyzaj Garantisi', 'Tasarım + Malzeme + Uygulama + Bakım', '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6e16c1ba-c6e6-11f0-955b-ea727f233291', 'cicek-bahcesi-duzenlemesi', 'Çiçek Bahçesi Düzenlemesi', 'gardening', 'ozel', 'Çiçek Bahçesi', 'Fiyat İçin Arayınız', 'Karışık çiçek türleri ile özel bahçe düzenlemesi', 0, 1, 8, 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop', NULL, 'Çiçek bahçesi düzenlemesi', NULL, '3-8 m²', 'Mevsimlik', 'Haftalık Bakım', 'Bahar-Yaz', NULL, NULL, NULL, 'Çiçek Sağlığı Garantisi', 'Çiçek + Tasarım + Ekim + Bakım', '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6e16c309-c6e6-11f0-955b-ea727f233291', 'tema-peyzaj-duzenlemesi', 'Tema Peyzaj Düzenlemesi', 'gardening', 'ozel', 'Tema Bitkileri', 'Fiyat İçin Arayınız', 'Özel tema ile (Akdeniz, Japon vb.) peyzaj düzenlemesi', 0, 1, 9, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop', NULL, 'Tema peyzaj düzenlemesi', NULL, '4-12 m²', 'Sürekli', 'Aylık Bakım', 'Tüm Mevsim', NULL, NULL, NULL, '1 Yıl Peyzaj Garantisi', 'Tema Tasarım + Bitki + Uygulama + Bakım', '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6e16c3ea-c6e6-11f0-955b-ea727f233291', 'standart-toprak-doldurumu', 'Standart Toprak Doldurumu', 'soil', 'temel', 'Kaliteli Bahçe Toprağı', 'Fiyat İçin Arayınız', 'Mezar alanının temel toprak doldurumu ve düzeltme işlemi', 1, 1, 1, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop', NULL, 'Standart toprak doldurumu', NULL, '2-10 m²', NULL, NULL, NULL, 'Kaliteli Bahçe Toprağı', '20-30 cm', 'El Aletleri + Küçük Makine', '6 Ay Çöküntü Garantisi', 'Toprak + Nakliye + İşçilik + Düzeltme', '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6e16c4f6-c6e6-11f0-955b-ea727f233291', 'genis-alan-toprak-dolumu', 'Geniş Alan Toprak Dolumu', 'soil', 'temel', 'Büyük Hacim Toprak', 'Fiyat İçin Arayınız', 'Geniş mezar alanları için büyük hacimli toprak doldurumu', 0, 1, 2, 'https://images.unsplash.com/photo-1574263867128-dacbc0fc09ce?w=400&h=300&fit=crop', NULL, 'Geniş alan toprak dolumu', NULL, '10-50 m²', NULL, NULL, NULL, 'Kaliteli Karma Toprak', '30-50 cm', 'Makine Destekli', '1 Yıl Çöküntü Garantisi', 'Toprak + Nakliye + Makine + İşçilik', '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6e16c5f6-c6e6-11f0-955b-ea727f233291', 'hizli-toprak-doldurumu', 'Hızlı Toprak Doldurumu', 'soil', 'temel', 'Hazır Karışım Toprak', 'Fiyat İçin Arayınız', 'Acil ihtiyaçlar için hızlı toprak doldurumu hizmeti', 0, 1, 3, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop', NULL, 'Hızlı toprak doldurumu', NULL, '1-5 m²', NULL, NULL, NULL, 'Hazır Karışım', '15-25 cm', 'El Aletleri', '3 Ay Garanti', 'Toprak + Hızlı Nakliye + İşçilik', '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6e16c709-c6e6-11f0-955b-ea727f233291', 'bitki-toprak-karisimi', 'Bitki Toprak Karışımı', 'soil', 'ozel', 'Bitki Toprak + Gübre', 'Fiyat İçin Arayınız', 'Çiçek ve bitki ekimi için özel toprak karışımı', 1, 1, 4, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop', NULL, 'Bitki toprak karışımı', NULL, '2-8 m²', NULL, NULL, NULL, 'Bitki Toprağı + Organik Gübre', '25-35 cm', 'El Aletleri + Karıştırma', '1 Yıl Bitki Garantisi', 'Özel Toprak + Gübre + Karıştırma + İşçilik', '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6e16c819-c6e6-11f0-955b-ea727f233291', 'drenajli-toprak-sistemi', 'Drenajlı Toprak Sistemi', 'soil', 'ozel', 'Drenaj + Toprak', 'Fiyat İçin Arayınız', 'Su baskını önleyici drenaj sistemi ile toprak doldurumu', 0, 1, 5, 'https://images.unsplash.com/photo-1574263867128-dacbc0fc09ce?w=400&h=300&fit=crop', NULL, 'Drenajlı toprak sistemi', NULL, '3-12 m²', NULL, NULL, NULL, 'Drenajlı Toprak Karışımı', '35-45 cm', 'Drenaj Sistemi + Makine', '2 Yıl Drenaj Garantisi', 'Drenaj + Toprak + Sistem + İşçilik', '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6e16c921-c6e6-11f0-955b-ea727f233291', 'premium-toprak-karisimi', 'Premium Toprak Karışımı', 'soil', 'ozel', 'Premium Bahçe Toprağı', 'Fiyat İçin Arayınız', 'En kaliteli malzemelerle hazırlanmış premium toprak', 0, 1, 6, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop', NULL, 'Premium toprak karışımı', NULL, '2-6 m²', NULL, NULL, NULL, 'Premium Organik Toprak', '30-40 cm', 'Özel Karıştırma Aletleri', '2 Yıl Kalite Garantisi', 'Premium Toprak + Organik Gübre + Özel İşçilik', '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6e16ca35-c6e6-11f0-955b-ea727f233291', 'cokmus-alan-restorasyonu', 'Çökmüş Alan Restorasyonu', 'soil', 'restorasyon', 'Restorasyon Toprağı', 'Fiyat İçin Arayınız', 'Çökmüş ve bozulmuş mezar alanlarının tamiri', 1, 1, 7, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop', NULL, 'Çökmüş alan restorasyonu', NULL, '3-15 m²', NULL, NULL, NULL, 'Sıkıştırılmış Kaliteli Toprak', '40-60 cm', 'Ağır Makine + Sıkıştırma', '2 Yıl Restorasyon Garantisi', 'Kazı + Toprak + Sıkıştırma + Düzeltme', '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6e16cb4b-c6e6-11f0-955b-ea727f233291', 'eski-mezar-yenileme', 'Eski Mezar Yenileme', 'soil', 'restorasyon', 'Yenileme Toprağı', 'Fiyat İçin Arayınız', 'Eski mezarların toprak yenileme ve düzeltme işlemi', 0, 1, 8, 'https://images.unsplash.com/photo-1574263867128-dacbc0fc09ce?w=400&h=300&fit=crop', NULL, 'Eski mezar yenileme', NULL, '4-20 m²', NULL, NULL, NULL, 'Kaliteli Yenileme Toprağı', '30-50 cm', 'Tam Donanımlı Makine', '18 Ay Yenileme Garantisi', 'Eski Toprak Kaldırma + Yeni Toprak + İşçilik', '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('6e16cc5c-c6e6-11f0-955b-ea727f233291', 'tam-restorasyon-paketi', 'Tam Restorasyon Paketi', 'soil', 'restorasyon', 'Komple Restorasyon', 'Fiyat İçin Arayınız', 'Kapsamlı mezar alanı restorasyonu ve yenileme', 0, 1, 9, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop', NULL, 'Tam restorasyon paketi', NULL, '5-25 m²', NULL, NULL, NULL, 'Çoklu Toprak Sistemleri', '50-80 cm', 'Tam Profesyonel Ekipman', '3 Yıl Kapsamlı Garanti', 'Kazı + Drenaj + Toprak + Düzenleme + Garanti', '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000');


-- ----------------------------
-- Table structure for `contact_messages`
-- ----------------------------
DROP TABLE IF EXISTS `contact_messages`;
CREATE TABLE `contact_messages` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(64) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` longtext NOT NULL,
  `status` varchar(32) NOT NULL DEFAULT 'new',
  `is_resolved` tinyint(1) NOT NULL DEFAULT 0,
  `admin_note` varchar(2000) DEFAULT NULL,
  `ip` varchar(64) DEFAULT NULL,
  `user_agent` varchar(512) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `contact_created_idx` (`created_at`),
  KEY `contact_updated_idx` (`updated_at`),
  KEY `contact_status_idx` (`status`),
  KEY `contact_resolved_idx` (`is_resolved`),
  KEY `contact_status_resolved_created_idx` (`status`,`is_resolved`,`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of `contact_messages`
-- ----------------------------
INSERT INTO `contact_messages` (`id`, `name`, `email`, `phone`, `subject`, `message`, `status`, `is_resolved`, `admin_note`, `ip`, `user_agent`, `website`, `created_at`, `updated_at`) VALUES 
('6e359ebe-c6e6-11f0-955b-ea727f233291', 'Ahmet Yılmaz', 'ahmet@example.com', '+90 532 000 00 01', 'Mezar taşı teklifi', 'Merhaba, tek kişilik mermer mezar için fiyat ve teslim süresi alabilir miyim?', 'new', 0, NULL, '203.0.113.11', 'Mozilla/5.0', '', '2024-01-02 10:00:00.000', '2024-01-02 10:00:00.000'),
('6e35a1a8-c6e6-11f0-955b-ea727f233291', 'Ayşe Demir', 'ayse@example.com', '+90 555 111 11 22', 'Aile mezarı hakkında', 'Aile mezarı ölçü ve granit seçenekleri hakkında bilgi rica ederim.', 'in_progress', 0, 'Teklif hazırla ve ölçü istedi.', '198.51.100.5', 'Mozilla/5.0', NULL, '2024-01-03 12:30:00.000', '2024-01-03 12:45:00.000'),
('6e35a2a8-c6e6-11f0-955b-ea727f233291', 'Mehmet Kara', 'mehmet@example.com', '+90 542 222 22 33', 'Bakım hizmeti', 'Mevcut mezarın temizlik ve bakım ücretleri nedir?', 'closed', 1, 'Bilgi verildi, kapanış yapıldı.', '192.0.2.44', 'Mozilla/5.0', NULL, '2024-01-04 09:15:00.000', '2024-01-04 10:00:00.000'),
('6e35a334-c6e6-11f0-955b-ea727f233291', 'Elif Koç', 'elif@example.com', '+90 530 333 33 44', 'Özel tasarım mezar', 'Modern tasarım granit mezar için görsel ve fiyat bilgisi rica ediyorum.', 'new', 0, NULL, NULL, NULL, NULL, '2024-01-05 14:20:00.000', '2024-01-05 14:20:00.000');


-- ----------------------------
-- Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `wallet_balance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `email_verified` tinyint(1) NOT NULL DEFAULT 0,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  `last_sign_in_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of `users`
-- ----------------------------
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `wallet_balance`, `is_active`, `email_verified`, `reset_token`, `reset_token_expires`, `created_at`, `updated_at`, `last_sign_in_at`) VALUES 
('0ac37a5c-a8be-4d25-b853-1e5c9574c1b3', 'mehmet@gmail.com', '$2b$12$temporary.hash.needs.reset', 'Mehmet Kuber', '05454905148', '0.00', 1, 0, NULL, NULL, '2025-10-07 09:49:06.000', '2025-10-16 09:26:05.000', NULL),
('19a2bc26-63d1-43ad-ab56-d7f3c3719a34', 'hostingisletmesi@gmail.com', '$2b$12$temporary.hash.needs.reset', 'Nuri Muh', '05414417854', '0.00', 1, 0, NULL, NULL, '2025-10-13 15:07:15.000', '2025-10-16 09:26:05.000', NULL),
('4a8fb7f7-0668-4429-9309-fe88ac90eed2', 'mlhgs1@gmail.com', '$2b$12$temporary.hash.needs.reset', 'Sultan Abdü', '05427354197', '0.00', 1, 0, NULL, NULL, '2025-10-13 20:14:20.000', '2025-10-16 09:26:05.000', NULL),
('4f618a8d-6fdb-498c-898a-395d368b2193', 'orhanguzell@gmail.com', '$2b$12$meUSHEIC8jruMTd7xjVoBuK0eI.Tvc7nsgCrFjk2Mre8Nt/.Qb84m', 'Orhan Güzel', '+905551112233', '0.00', 1, 1, NULL, NULL, '2025-11-21 14:29:02.889', '2025-11-21 15:38:15.266', '2025-11-21 15:38:15.266'),
('7129bc31-88dc-42da-ab80-415a21f2ea9a', 'melihkececi@yandex.com', '$2b$12$temporary.hash.needs.reset', 'Melih Keçeci', NULL, '0.00', 1, 0, NULL, NULL, '2025-10-06 18:08:24.000', '2025-10-16 09:26:05.000', NULL),
('d279bb9d-797d-4972-a8bd-a77a40caba91', 'kececimelih@gmail.com', '$2b$12$temporary.hash.needs.reset', 'Keçeci Melih', '05425547474', '0.00', 1, 0, NULL, NULL, '2025-10-14 07:49:48.000', '2025-10-16 09:26:05.000', NULL);


-- ----------------------------
-- Table structure for `product_stock`
-- ----------------------------
DROP TABLE IF EXISTS `product_stock`;
CREATE TABLE `product_stock` (
  `id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `stock_content` varchar(255) NOT NULL,
  `is_used` tinyint(1) NOT NULL DEFAULT 0,
  `used_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `order_item_id` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_stock_product_id_idx` (`product_id`),
  KEY `product_stock_is_used_idx` (`product_id`,`is_used`),
  KEY `product_stock_order_item_id_idx` (`order_item_id`),
  CONSTRAINT `fk_product_stock_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- ----------------------------
-- Table structure for `product_reviews`
-- ----------------------------
DROP TABLE IF EXISTS `product_reviews`;
CREATE TABLE `product_reviews` (
  `id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `customer_name` varchar(255) DEFAULT NULL,
  `review_date` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `product_reviews_product_id_idx` (`product_id`),
  KEY `product_reviews_approved_idx` (`product_id`,`is_active`),
  KEY `product_reviews_rating_idx` (`rating`),
  CONSTRAINT `fk_product_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of `product_reviews`
-- ----------------------------
INSERT INTO `product_reviews` (`id`, `product_id`, `user_id`, `rating`, `comment`, `is_active`, `customer_name`, `review_date`, `created_at`, `updated_at`) VALUES 
('6d7bacb0-c6e6-11f0-955b-ea727f233291', '00000001-0000-4000-8000-000000000001', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7bad63-c6e6-11f0-955b-ea727f233291', '00000002-0000-4000-8000-000000000002', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7badcf-c6e6-11f0-955b-ea727f233291', '00000003-0000-4000-8000-000000000003', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7bae1a-c6e6-11f0-955b-ea727f233291', '00000004-0000-4000-8000-000000000004', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7bae65-c6e6-11f0-955b-ea727f233291', '00000005-0000-4000-8000-000000000005', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7baeac-c6e6-11f0-955b-ea727f233291', '00000006-0000-4000-8000-000000000006', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7baef3-c6e6-11f0-955b-ea727f233291', '00000007-0000-4000-8000-000000000007', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7baf43-c6e6-11f0-955b-ea727f233291', '00000008-0000-4000-8000-000000000008', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7baffa-c6e6-11f0-955b-ea727f233291', '00000009-0000-4000-8000-000000000009', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7bb10e-c6e6-11f0-955b-ea727f233291', '00000010-0000-4000-8000-000000000010', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7bb175-c6e6-11f0-955b-ea727f233291', '00000011-0000-4000-8000-000000000011', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7bb24c-c6e6-11f0-955b-ea727f233291', '00000012-0000-4000-8000-000000000012', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7bb28a-c6e6-11f0-955b-ea727f233291', '00000013-0000-4000-8000-000000000013', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7bb30d-c6e6-11f0-955b-ea727f233291', '00000014-0000-4000-8000-000000000014', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7bb36a-c6e6-11f0-955b-ea727f233291', '00000015-0000-4000-8000-000000000015', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7bb438-c6e6-11f0-955b-ea727f233291', '00000016-0000-4000-8000-000000000016', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7bb47e-c6e6-11f0-955b-ea727f233291', '00000017-0000-4000-8000-000000000017', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7bb50c-c6e6-11f0-955b-ea727f233291', '00000018-0000-4000-8000-000000000018', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7bb561-c6e6-11f0-955b-ea727f233291', '00000019-0000-4000-8000-000000000019', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7bb5e2-c6e6-11f0-955b-ea727f233291', '00000020-0000-4000-8000-000000000020', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7bb671-c6e6-11f0-955b-ea727f233291', '00000021-0000-4000-8000-000000000021', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7bb70a-c6e6-11f0-955b-ea727f233291', '00000022-0000-4000-8000-000000000022', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7bb90a-c6e6-11f0-955b-ea727f233291', '00000023-0000-4000-8000-000000000023', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7bb9c5-c6e6-11f0-955b-ea727f233291', '00000024-0000-4000-8000-000000000024', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7bba3b-c6e6-11f0-955b-ea727f233291', '00000025-0000-4000-8000-000000000025', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7bbabb-c6e6-11f0-955b-ea727f233291', '00000026-0000-4000-8000-000000000026', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7bbb66-c6e6-11f0-955b-ea727f233291', '00000027-0000-4000-8000-000000000027', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7bbbf4-c6e6-11f0-955b-ea727f233291', '00000028-0000-4000-8000-000000000028', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7bbc81-c6e6-11f0-955b-ea727f233291', '00000029-0000-4000-8000-000000000029', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7bbd1d-c6e6-11f0-955b-ea727f233291', '00000030-0000-4000-8000-000000000030', NULL, 5, 'Zamanında teslim edildi, işçilikten memnun kaldık.', 1, 'A. Yılmaz', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007', '2025-11-21 14:29:03.007'),
('6d7ce1b5-c6e6-11f0-955b-ea727f233291', '00000001-0000-4000-8000-000000000001', NULL, 5, 'Çok kaliteli işçilik ve malzeme kullanılmış. Personel çok ilgili ve profesyoneldi. Tavsiye ederim. — İhlamurkuyu Mezarlığı', 1, 'Mehmet KARATAŞ', '2025-11-21 14:29:03.010', '2025-11-21 14:29:03.010', '2025-11-21 14:29:03.010'),
('6d7ce301-c6e6-11f0-955b-ea727f233291', '00000002-0000-4000-8000-000000000002', NULL, 5, 'Mezar taşımız çok güzel oldu. Zamanında teslim edildi ve kalitesi çok iyi. Memnun kaldık. — Zincirlikuyu Mezarlığı', 1, 'Ayşe YILMAZ', '2025-11-21 14:29:03.010', '2025-11-21 14:29:03.010', '2025-11-21 14:29:03.010'),
('6d7ce3b0-c6e6-11f0-955b-ea727f233291', '00000003-0000-4000-8000-000000000003', NULL, 5, 'Profesyonel hizmet ve uygun fiyat. Ailece çok memnun kaldık. Teşekkür ederiz. — Karacaahmet Mezarlığı', 1, 'Ali DEMIR', '2025-11-21 14:29:03.010', '2025-11-21 14:29:03.010', '2025-11-21 14:29:03.010');


-- ----------------------------
-- Table structure for `slider`
-- ----------------------------
DROP TABLE IF EXISTS `slider`;
CREATE TABLE `slider` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `image_asset_id` char(36) DEFAULT NULL,
  `alt` varchar(255) DEFAULT NULL,
  `button_text` varchar(100) DEFAULT NULL,
  `button_link` varchar(255) DEFAULT NULL,
  `featured` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  `display_order` int(10) unsigned NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_slider_slug` (`slug`),
  UNIQUE KEY `uniq_slider_uuid` (`uuid`),
  KEY `idx_slider_active` (`is_active`),
  KEY `idx_slider_order` (`display_order`),
  KEY `idx_slider_image_asset` (`image_asset_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of `slider`
-- ----------------------------
INSERT INTO `slider` (`id`, `uuid`, `name`, `slug`, `description`, `image_url`, `image_asset_id`, `alt`, `button_text`, `button_link`, `featured`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES 
(1, '6e4ae89a-c6e6-11f0-955b-ea727f233291', 'İstanbul\'un En Deneyimli Mezar Yapım Firması', 'istanbulun-en-deneyimli-mezar-yapim-firmasi', '25 yıllık deneyimimizle kaliteli mezar yapımı, mezar taşı ve restorasyon hizmetleri', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=600&fit=crop', NULL, 'İstanbul mezar yapım firması - Kaliteli mezar modelleri', 'Hemen Arayın', 'tel:05334838971', 0, 1, 1, '2024-01-20 00:00:00.000', '2024-01-20 00:00:00.000'),
(2, '6e4aecf1-c6e6-11f0-955b-ea727f233291', 'Premium Mermer ve Granit Mezar Modelleri', 'premium-mermer-ve-granit-mezar-modelleri', 'A+ kalite doğal taşlar, özel tasarım ve profesyonel işçilik garantisi', 'https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=1200&h=600&fit=crop', NULL, 'Premium mermer granit mezar modelleri', 'Modelleri İncele', 'models', 0, 1, 2, '2024-01-21 00:00:00.000', '2024-01-21 00:00:00.000'),
(3, '6e4aefcd-c6e6-11f0-955b-ea727f233291', 'Ücretsiz Keşif ve Proje Çizimi', 'ucretsiz-kesif-ve-proje-cizimi', 'Mezar projeleriniz için profesyonel keşif hizmeti ve detaylı fiyat teklifi', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop', NULL, 'Ücretsiz mezar keşif hizmeti', 'Keşif Talep Et', 'contact', 0, 1, 3, '2024-01-22 00:00:00.000', '2024-01-22 00:00:00.000'),
(4, '6e4af209-c6e6-11f0-955b-ea727f233291', 'Mezar Onarım ve Restorasyon Hizmetleri', 'mezar-onarim-ve-restorasyon-hizmetleri', 'Çökmüş, çatlak veya eski mezarların profesyonel onarımı ve yenilenmesi', 'https://images.unsplash.com/photo-1544024994-27c5b7b22c55?w=1200&h=600&fit=crop', NULL, 'Mezar onarım restorasyon hizmetleri', 'Onarım Talebi', 'contact', 0, 0, 4, '2024-01-23 00:00:00.000', '2024-01-23 00:00:00.000'),
(5, '6e4af367-c6e6-11f0-955b-ea727f233291', 'Mezar Çiçeklendirme ve Peyzaj Hizmetleri', 'mezar-ciceklendirme-ve-peyzaj-hizmetleri', 'Mezar çevresi düzenleme, çiçeklendirme ve sürekli bakım hizmetleri', 'https://images.unsplash.com/photo-1589677216159-5c27977717ed?w=1200&h=600&fit=crop', NULL, 'Mezar çiçeklendirme peyzaj hizmetleri', 'Bakım Hizmeti', 'gardening', 0, 0, 5, '2024-01-24 00:00:00.000', '2024-01-24 00:00:00.000');


-- ----------------------------
-- Table structure for `announcements`
-- ----------------------------
DROP TABLE IF EXISTS `announcements`;
CREATE TABLE `announcements` (
  `id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(500) NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`content`)),
  `link` varchar(255) NOT NULL,
  `bg_color` varchar(64) NOT NULL,
  `hover_color` varchar(64) NOT NULL,
  `icon_color` varchar(64) NOT NULL,
  `text_color` varchar(64) NOT NULL,
  `border_color` varchar(64) NOT NULL,
  `badge_text` varchar(64) DEFAULT NULL,
  `badge_color` varchar(64) DEFAULT NULL,
  `button_text` varchar(64) DEFAULT NULL,
  `button_color` varchar(64) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `storage_asset_id` char(36) DEFAULT NULL,
  `alt` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_published` tinyint(1) NOT NULL DEFAULT 1,
  `display_order` int(11) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  `published_at` datetime(3) DEFAULT NULL,
  `expires_at` datetime(3) DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `announcements_active_idx` (`is_active`,`is_published`),
  KEY `announcements_order_idx` (`display_order`),
  KEY `announcements_expires_idx` (`expires_at`),
  KEY `announcements_asset_idx` (`storage_asset_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of `announcements`
-- ----------------------------
INSERT INTO `announcements` (`id`, `title`, `description`, `content`, `link`, `bg_color`, `hover_color`, `icon_color`, `text_color`, `border_color`, `badge_text`, `badge_color`, `button_text`, `button_color`, `image_url`, `storage_asset_id`, `alt`, `is_active`, `is_published`, `display_order`, `created_at`, `updated_at`, `published_at`, `expires_at`, `meta_title`, `meta_description`) VALUES 
('6dcf9abe-c6e6-11f0-955b-ea727f233291', 'Ramazan Kampanyası', 'Ramazan ayına özel mezar yapımı ve işçilik kampanyası', '{\"html\": \"<h2>Ramazan Ayına Özel Mezar Yapımı Kampanyası</h2>...\"}', '/kampanyalar/ramazan', 'bg-amber-50', 'hover:bg-amber-100', 'text-amber-600', 'text-amber-700', 'border-amber-200', 'Kampanya', 'bg-amber-500', 'Kampanya Detayları', 'bg-amber-600 hover:bg-amber-700', NULL, NULL, NULL, 1, 1, 1, '2024-01-15 00:00:00.000', '2024-01-15 00:00:00.000', '2024-01-15 00:00:00.000', '2024-05-15 00:00:00.000', 'Ramazan Kampanyası - %20 İndirim', 'Ramazan ayına özel kampanya...'),
('6dcf9d00-c6e6-11f0-955b-ea727f233291', 'Ücretsiz Keşif', 'Ücretsiz keşif ve fiyat teklifi alın', '{\"html\": \"<h2>Ücretsiz Keşif Hizmeti</h2>...\"}', '/ucretsiz-kesif', 'bg-green-50', 'hover:bg-green-100', 'text-green-600', 'text-green-700', 'border-green-200', 'Hizmet', 'bg-green-500', 'Keşif Talep Et', 'bg-green-600 hover:bg-green-700', NULL, NULL, NULL, 1, 1, 2, '2024-01-05 00:00:00.000', '2024-01-25 00:00:00.000', '2024-01-05 00:00:00.000', NULL, 'Ücretsiz Keşif Hizmeti', 'Ücretsiz keşif hizmeti...');


-- ----------------------------
-- Table structure for `categories`
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` longtext DEFAULT NULL,
  `storage_asset_id` char(36) DEFAULT NULL,
  `alt` varchar(255) DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_uq` (`slug`),
  KEY `categories_active_idx` (`is_active`),
  KEY `categories_order_idx` (`display_order`),
  KEY `categories_storage_asset_idx` (`storage_asset_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of `categories`
-- ----------------------------
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image_url`, `storage_asset_id`, `alt`, `icon`, `is_active`, `is_featured`, `display_order`, `created_at`, `updated_at`) VALUES 
('aaaa0001-1111-4111-8111-aaaaaaaa0001', 'MEZAR MODELLERİ', 'mezar-modelleri', NULL, NULL, NULL, NULL, NULL, 1, 0, 10, '2025-11-21 14:29:02.913', '2025-11-21 14:29:02.913'),
('aaaa0002-1111-4111-8111-aaaaaaaa0002', 'MEZAR BAŞ TAŞI MODELLERİ', 'mezar-bas-tasi-modelleri', NULL, NULL, NULL, NULL, NULL, 1, 0, 20, '2025-11-21 14:29:02.913', '2025-11-21 14:29:02.913'),
('aaaa0003-1111-4111-8111-aaaaaaaa0003', 'MEZAR AKSESUARLARI', 'mezar-aksesuarlari', NULL, NULL, NULL, NULL, NULL, 1, 0, 30, '2025-11-21 14:29:02.913', '2025-11-21 14:29:02.913'),
('aaaa0004-1111-4111-8111-aaaaaaaa0004', 'MEZAR ÇİÇEKLENDİRME', 'mezar-ciceklendirme', NULL, NULL, NULL, NULL, NULL, 1, 0, 40, '2025-11-21 14:29:02.913', '2025-11-21 14:29:02.913'),
('aaaa0005-1111-4111-8111-aaaaaaaa0005', 'MEZAR TOPRAK DOLUMU', 'mezar-toprak-dolumu', NULL, NULL, NULL, NULL, NULL, 1, 0, 50, '2025-11-21 14:29:02.913', '2025-11-21 14:29:02.913');


-- ----------------------------
-- Table structure for `user_roles`
-- ----------------------------
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `role` enum('admin','moderator','user') NOT NULL DEFAULT 'user',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_roles_user_id_role_unique` (`user_id`,`role`),
  KEY `user_roles_user_id_idx` (`user_id`),
  CONSTRAINT `fk_user_roles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of `user_roles`
-- ----------------------------
INSERT INTO `user_roles` (`id`, `user_id`, `role`, `created_at`) VALUES 
('6d6aaf69-c6e6-11f0-955b-ea727f233291', '4f618a8d-6fdb-498c-898a-395d368b2193', 'admin', '2025-11-21 14:29:02.896'),
('d49103a1-9095-4efc-8645-c08dd05ed100', '7129bc31-88dc-42da-ab80-415a21f2ea9a', 'admin', '2025-10-06 18:09:39.000');


-- ----------------------------
-- Table structure for `product_specs`
-- ----------------------------
DROP TABLE IF EXISTS `product_specs`;
CREATE TABLE `product_specs` (
  `id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` text NOT NULL,
  `category` enum('physical','material','service','custom') NOT NULL DEFAULT 'custom',
  `order_num` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `product_specs_product_id_idx` (`product_id`),
  CONSTRAINT `fk_product_specs_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of `product_specs`
-- ----------------------------
INSERT INTO `product_specs` (`id`, `product_id`, `name`, `value`, `category`, `order_num`, `created_at`, `updated_at`) VALUES 
('6d73c28b-c6e6-11f0-955b-ea727f233291', '00000001-0000-4000-8000-000000000001', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c2a1-c6e6-11f0-955b-ea727f233291', '00000001-0000-4000-8000-000000000001', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c2ab-c6e6-11f0-955b-ea727f233291', '00000001-0000-4000-8000-000000000001', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c2b6-c6e6-11f0-955b-ea727f233291', '00000001-0000-4000-8000-000000000001', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c2c0-c6e6-11f0-955b-ea727f233291', '00000001-0000-4000-8000-000000000001', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c2c9-c6e6-11f0-955b-ea727f233291', '00000001-0000-4000-8000-000000000001', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c2d3-c6e6-11f0-955b-ea727f233291', '00000002-0000-4000-8000-000000000002', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c2dd-c6e6-11f0-955b-ea727f233291', '00000002-0000-4000-8000-000000000002', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c2e7-c6e6-11f0-955b-ea727f233291', '00000002-0000-4000-8000-000000000002', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c2f1-c6e6-11f0-955b-ea727f233291', '00000002-0000-4000-8000-000000000002', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c2fb-c6e6-11f0-955b-ea727f233291', '00000002-0000-4000-8000-000000000002', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c305-c6e6-11f0-955b-ea727f233291', '00000002-0000-4000-8000-000000000002', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c30f-c6e6-11f0-955b-ea727f233291', '00000003-0000-4000-8000-000000000003', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c319-c6e6-11f0-955b-ea727f233291', '00000003-0000-4000-8000-000000000003', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c323-c6e6-11f0-955b-ea727f233291', '00000003-0000-4000-8000-000000000003', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c32d-c6e6-11f0-955b-ea727f233291', '00000003-0000-4000-8000-000000000003', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c337-c6e6-11f0-955b-ea727f233291', '00000003-0000-4000-8000-000000000003', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c341-c6e6-11f0-955b-ea727f233291', '00000003-0000-4000-8000-000000000003', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c34b-c6e6-11f0-955b-ea727f233291', '00000004-0000-4000-8000-000000000004', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c354-c6e6-11f0-955b-ea727f233291', '00000004-0000-4000-8000-000000000004', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c35f-c6e6-11f0-955b-ea727f233291', '00000004-0000-4000-8000-000000000004', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c368-c6e6-11f0-955b-ea727f233291', '00000004-0000-4000-8000-000000000004', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c373-c6e6-11f0-955b-ea727f233291', '00000004-0000-4000-8000-000000000004', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c37c-c6e6-11f0-955b-ea727f233291', '00000004-0000-4000-8000-000000000004', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c387-c6e6-11f0-955b-ea727f233291', '00000005-0000-4000-8000-000000000005', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c390-c6e6-11f0-955b-ea727f233291', '00000005-0000-4000-8000-000000000005', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c39a-c6e6-11f0-955b-ea727f233291', '00000005-0000-4000-8000-000000000005', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c3a4-c6e6-11f0-955b-ea727f233291', '00000005-0000-4000-8000-000000000005', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c3ae-c6e6-11f0-955b-ea727f233291', '00000005-0000-4000-8000-000000000005', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c3b8-c6e6-11f0-955b-ea727f233291', '00000005-0000-4000-8000-000000000005', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c3c2-c6e6-11f0-955b-ea727f233291', '00000006-0000-4000-8000-000000000006', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c3cc-c6e6-11f0-955b-ea727f233291', '00000006-0000-4000-8000-000000000006', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c3d6-c6e6-11f0-955b-ea727f233291', '00000006-0000-4000-8000-000000000006', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c3df-c6e6-11f0-955b-ea727f233291', '00000006-0000-4000-8000-000000000006', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c3e9-c6e6-11f0-955b-ea727f233291', '00000006-0000-4000-8000-000000000006', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c3f3-c6e6-11f0-955b-ea727f233291', '00000006-0000-4000-8000-000000000006', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c3fd-c6e6-11f0-955b-ea727f233291', '00000007-0000-4000-8000-000000000007', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c407-c6e6-11f0-955b-ea727f233291', '00000007-0000-4000-8000-000000000007', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c410-c6e6-11f0-955b-ea727f233291', '00000007-0000-4000-8000-000000000007', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c41a-c6e6-11f0-955b-ea727f233291', '00000007-0000-4000-8000-000000000007', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c424-c6e6-11f0-955b-ea727f233291', '00000007-0000-4000-8000-000000000007', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c42e-c6e6-11f0-955b-ea727f233291', '00000007-0000-4000-8000-000000000007', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c438-c6e6-11f0-955b-ea727f233291', '00000008-0000-4000-8000-000000000008', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c442-c6e6-11f0-955b-ea727f233291', '00000008-0000-4000-8000-000000000008', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c44b-c6e6-11f0-955b-ea727f233291', '00000008-0000-4000-8000-000000000008', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c455-c6e6-11f0-955b-ea727f233291', '00000008-0000-4000-8000-000000000008', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c45f-c6e6-11f0-955b-ea727f233291', '00000008-0000-4000-8000-000000000008', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c469-c6e6-11f0-955b-ea727f233291', '00000008-0000-4000-8000-000000000008', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c473-c6e6-11f0-955b-ea727f233291', '00000009-0000-4000-8000-000000000009', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c47c-c6e6-11f0-955b-ea727f233291', '00000009-0000-4000-8000-000000000009', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c486-c6e6-11f0-955b-ea727f233291', '00000009-0000-4000-8000-000000000009', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c490-c6e6-11f0-955b-ea727f233291', '00000009-0000-4000-8000-000000000009', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c49a-c6e6-11f0-955b-ea727f233291', '00000009-0000-4000-8000-000000000009', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c4a4-c6e6-11f0-955b-ea727f233291', '00000009-0000-4000-8000-000000000009', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c4ae-c6e6-11f0-955b-ea727f233291', '00000010-0000-4000-8000-000000000010', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c4b7-c6e6-11f0-955b-ea727f233291', '00000010-0000-4000-8000-000000000010', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c4c1-c6e6-11f0-955b-ea727f233291', '00000010-0000-4000-8000-000000000010', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c4cb-c6e6-11f0-955b-ea727f233291', '00000010-0000-4000-8000-000000000010', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c4d5-c6e6-11f0-955b-ea727f233291', '00000010-0000-4000-8000-000000000010', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c4de-c6e6-11f0-955b-ea727f233291', '00000010-0000-4000-8000-000000000010', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c4e9-c6e6-11f0-955b-ea727f233291', '00000011-0000-4000-8000-000000000011', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c4f2-c6e6-11f0-955b-ea727f233291', '00000011-0000-4000-8000-000000000011', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c4fc-c6e6-11f0-955b-ea727f233291', '00000011-0000-4000-8000-000000000011', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c505-c6e6-11f0-955b-ea727f233291', '00000011-0000-4000-8000-000000000011', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c50f-c6e6-11f0-955b-ea727f233291', '00000011-0000-4000-8000-000000000011', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c519-c6e6-11f0-955b-ea727f233291', '00000011-0000-4000-8000-000000000011', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c523-c6e6-11f0-955b-ea727f233291', '00000012-0000-4000-8000-000000000012', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c52d-c6e6-11f0-955b-ea727f233291', '00000012-0000-4000-8000-000000000012', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c536-c6e6-11f0-955b-ea727f233291', '00000012-0000-4000-8000-000000000012', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c540-c6e6-11f0-955b-ea727f233291', '00000012-0000-4000-8000-000000000012', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c54a-c6e6-11f0-955b-ea727f233291', '00000012-0000-4000-8000-000000000012', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c554-c6e6-11f0-955b-ea727f233291', '00000012-0000-4000-8000-000000000012', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c55e-c6e6-11f0-955b-ea727f233291', '00000013-0000-4000-8000-000000000013', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c567-c6e6-11f0-955b-ea727f233291', '00000013-0000-4000-8000-000000000013', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c571-c6e6-11f0-955b-ea727f233291', '00000013-0000-4000-8000-000000000013', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c57b-c6e6-11f0-955b-ea727f233291', '00000013-0000-4000-8000-000000000013', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c584-c6e6-11f0-955b-ea727f233291', '00000013-0000-4000-8000-000000000013', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c58e-c6e6-11f0-955b-ea727f233291', '00000013-0000-4000-8000-000000000013', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c598-c6e6-11f0-955b-ea727f233291', '00000014-0000-4000-8000-000000000014', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c5a2-c6e6-11f0-955b-ea727f233291', '00000014-0000-4000-8000-000000000014', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c5ab-c6e6-11f0-955b-ea727f233291', '00000014-0000-4000-8000-000000000014', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c5b5-c6e6-11f0-955b-ea727f233291', '00000014-0000-4000-8000-000000000014', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c5bf-c6e6-11f0-955b-ea727f233291', '00000014-0000-4000-8000-000000000014', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c5c9-c6e6-11f0-955b-ea727f233291', '00000014-0000-4000-8000-000000000014', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c5d3-c6e6-11f0-955b-ea727f233291', '00000015-0000-4000-8000-000000000015', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c5dc-c6e6-11f0-955b-ea727f233291', '00000015-0000-4000-8000-000000000015', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c5e6-c6e6-11f0-955b-ea727f233291', '00000015-0000-4000-8000-000000000015', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c5f0-c6e6-11f0-955b-ea727f233291', '00000015-0000-4000-8000-000000000015', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c5fa-c6e6-11f0-955b-ea727f233291', '00000015-0000-4000-8000-000000000015', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c603-c6e6-11f0-955b-ea727f233291', '00000015-0000-4000-8000-000000000015', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c60d-c6e6-11f0-955b-ea727f233291', '00000016-0000-4000-8000-000000000016', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c617-c6e6-11f0-955b-ea727f233291', '00000016-0000-4000-8000-000000000016', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c621-c6e6-11f0-955b-ea727f233291', '00000016-0000-4000-8000-000000000016', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c62b-c6e6-11f0-955b-ea727f233291', '00000016-0000-4000-8000-000000000016', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c634-c6e6-11f0-955b-ea727f233291', '00000016-0000-4000-8000-000000000016', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c63e-c6e6-11f0-955b-ea727f233291', '00000016-0000-4000-8000-000000000016', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c648-c6e6-11f0-955b-ea727f233291', '00000017-0000-4000-8000-000000000017', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c652-c6e6-11f0-955b-ea727f233291', '00000017-0000-4000-8000-000000000017', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c65c-c6e6-11f0-955b-ea727f233291', '00000017-0000-4000-8000-000000000017', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c665-c6e6-11f0-955b-ea727f233291', '00000017-0000-4000-8000-000000000017', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955');
INSERT INTO `product_specs` (`id`, `product_id`, `name`, `value`, `category`, `order_num`, `created_at`, `updated_at`) VALUES 
('6d73c66f-c6e6-11f0-955b-ea727f233291', '00000017-0000-4000-8000-000000000017', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c679-c6e6-11f0-955b-ea727f233291', '00000017-0000-4000-8000-000000000017', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c683-c6e6-11f0-955b-ea727f233291', '00000018-0000-4000-8000-000000000018', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c68c-c6e6-11f0-955b-ea727f233291', '00000018-0000-4000-8000-000000000018', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c696-c6e6-11f0-955b-ea727f233291', '00000018-0000-4000-8000-000000000018', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c6a0-c6e6-11f0-955b-ea727f233291', '00000018-0000-4000-8000-000000000018', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c6aa-c6e6-11f0-955b-ea727f233291', '00000018-0000-4000-8000-000000000018', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c6b3-c6e6-11f0-955b-ea727f233291', '00000018-0000-4000-8000-000000000018', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c6bd-c6e6-11f0-955b-ea727f233291', '00000019-0000-4000-8000-000000000019', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c6c7-c6e6-11f0-955b-ea727f233291', '00000019-0000-4000-8000-000000000019', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c6d1-c6e6-11f0-955b-ea727f233291', '00000019-0000-4000-8000-000000000019', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c6db-c6e6-11f0-955b-ea727f233291', '00000019-0000-4000-8000-000000000019', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c6e4-c6e6-11f0-955b-ea727f233291', '00000019-0000-4000-8000-000000000019', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c6ee-c6e6-11f0-955b-ea727f233291', '00000019-0000-4000-8000-000000000019', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c6f8-c6e6-11f0-955b-ea727f233291', '00000020-0000-4000-8000-000000000020', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c702-c6e6-11f0-955b-ea727f233291', '00000020-0000-4000-8000-000000000020', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c70c-c6e6-11f0-955b-ea727f233291', '00000020-0000-4000-8000-000000000020', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c715-c6e6-11f0-955b-ea727f233291', '00000020-0000-4000-8000-000000000020', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c71f-c6e6-11f0-955b-ea727f233291', '00000020-0000-4000-8000-000000000020', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c729-c6e6-11f0-955b-ea727f233291', '00000020-0000-4000-8000-000000000020', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c733-c6e6-11f0-955b-ea727f233291', '00000021-0000-4000-8000-000000000021', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c73d-c6e6-11f0-955b-ea727f233291', '00000021-0000-4000-8000-000000000021', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c747-c6e6-11f0-955b-ea727f233291', '00000021-0000-4000-8000-000000000021', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c750-c6e6-11f0-955b-ea727f233291', '00000021-0000-4000-8000-000000000021', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c75a-c6e6-11f0-955b-ea727f233291', '00000021-0000-4000-8000-000000000021', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c764-c6e6-11f0-955b-ea727f233291', '00000021-0000-4000-8000-000000000021', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c76e-c6e6-11f0-955b-ea727f233291', '00000022-0000-4000-8000-000000000022', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c778-c6e6-11f0-955b-ea727f233291', '00000022-0000-4000-8000-000000000022', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c782-c6e6-11f0-955b-ea727f233291', '00000022-0000-4000-8000-000000000022', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c78c-c6e6-11f0-955b-ea727f233291', '00000022-0000-4000-8000-000000000022', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c796-c6e6-11f0-955b-ea727f233291', '00000022-0000-4000-8000-000000000022', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c79f-c6e6-11f0-955b-ea727f233291', '00000022-0000-4000-8000-000000000022', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c7a9-c6e6-11f0-955b-ea727f233291', '00000023-0000-4000-8000-000000000023', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c7b3-c6e6-11f0-955b-ea727f233291', '00000023-0000-4000-8000-000000000023', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c7bd-c6e6-11f0-955b-ea727f233291', '00000023-0000-4000-8000-000000000023', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c7c7-c6e6-11f0-955b-ea727f233291', '00000023-0000-4000-8000-000000000023', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c7d0-c6e6-11f0-955b-ea727f233291', '00000023-0000-4000-8000-000000000023', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c7da-c6e6-11f0-955b-ea727f233291', '00000023-0000-4000-8000-000000000023', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c7e4-c6e6-11f0-955b-ea727f233291', '00000024-0000-4000-8000-000000000024', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c7ee-c6e6-11f0-955b-ea727f233291', '00000024-0000-4000-8000-000000000024', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c7f7-c6e6-11f0-955b-ea727f233291', '00000024-0000-4000-8000-000000000024', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c801-c6e6-11f0-955b-ea727f233291', '00000024-0000-4000-8000-000000000024', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c80b-c6e6-11f0-955b-ea727f233291', '00000024-0000-4000-8000-000000000024', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c815-c6e6-11f0-955b-ea727f233291', '00000024-0000-4000-8000-000000000024', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c890-c6e6-11f0-955b-ea727f233291', '00000025-0000-4000-8000-000000000025', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c89e-c6e6-11f0-955b-ea727f233291', '00000025-0000-4000-8000-000000000025', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c8a9-c6e6-11f0-955b-ea727f233291', '00000025-0000-4000-8000-000000000025', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c8b4-c6e6-11f0-955b-ea727f233291', '00000025-0000-4000-8000-000000000025', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c8c0-c6e6-11f0-955b-ea727f233291', '00000025-0000-4000-8000-000000000025', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c8cc-c6e6-11f0-955b-ea727f233291', '00000025-0000-4000-8000-000000000025', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c8d8-c6e6-11f0-955b-ea727f233291', '00000026-0000-4000-8000-000000000026', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c8e3-c6e6-11f0-955b-ea727f233291', '00000026-0000-4000-8000-000000000026', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c8f0-c6e6-11f0-955b-ea727f233291', '00000026-0000-4000-8000-000000000026', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c900-c6e6-11f0-955b-ea727f233291', '00000026-0000-4000-8000-000000000026', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c90c-c6e6-11f0-955b-ea727f233291', '00000026-0000-4000-8000-000000000026', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c915-c6e6-11f0-955b-ea727f233291', '00000026-0000-4000-8000-000000000026', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c91f-c6e6-11f0-955b-ea727f233291', '00000027-0000-4000-8000-000000000027', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c929-c6e6-11f0-955b-ea727f233291', '00000027-0000-4000-8000-000000000027', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c932-c6e6-11f0-955b-ea727f233291', '00000027-0000-4000-8000-000000000027', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c93c-c6e6-11f0-955b-ea727f233291', '00000027-0000-4000-8000-000000000027', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c946-c6e6-11f0-955b-ea727f233291', '00000027-0000-4000-8000-000000000027', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c950-c6e6-11f0-955b-ea727f233291', '00000027-0000-4000-8000-000000000027', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c95a-c6e6-11f0-955b-ea727f233291', '00000028-0000-4000-8000-000000000028', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c963-c6e6-11f0-955b-ea727f233291', '00000028-0000-4000-8000-000000000028', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c96d-c6e6-11f0-955b-ea727f233291', '00000028-0000-4000-8000-000000000028', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c977-c6e6-11f0-955b-ea727f233291', '00000028-0000-4000-8000-000000000028', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c981-c6e6-11f0-955b-ea727f233291', '00000028-0000-4000-8000-000000000028', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c98a-c6e6-11f0-955b-ea727f233291', '00000028-0000-4000-8000-000000000028', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c994-c6e6-11f0-955b-ea727f233291', '00000029-0000-4000-8000-000000000029', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c99e-c6e6-11f0-955b-ea727f233291', '00000029-0000-4000-8000-000000000029', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c9a7-c6e6-11f0-955b-ea727f233291', '00000029-0000-4000-8000-000000000029', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c9b1-c6e6-11f0-955b-ea727f233291', '00000029-0000-4000-8000-000000000029', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c9bb-c6e6-11f0-955b-ea727f233291', '00000029-0000-4000-8000-000000000029', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c9c5-c6e6-11f0-955b-ea727f233291', '00000029-0000-4000-8000-000000000029', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c9cf-c6e6-11f0-955b-ea727f233291', '00000030-0000-4000-8000-000000000030', 'dimensions', '60×180 cm', 'physical', 10, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c9d8-c6e6-11f0-955b-ea727f233291', '00000030-0000-4000-8000-000000000030', 'weight', '250 kg', 'physical', 20, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c9e2-c6e6-11f0-955b-ea727f233291', '00000030-0000-4000-8000-000000000030', 'thickness', '3 cm', 'physical', 30, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c9ec-c6e6-11f0-955b-ea727f233291', '00000030-0000-4000-8000-000000000030', 'surfaceFinish', 'Parlak / Honlu', 'material', 40, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73c9f6-c6e6-11f0-955b-ea727f233291', '00000030-0000-4000-8000-000000000030', 'warranty', '10 Yıl İşçilik Garantisi', 'service', 50, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955'),
('6d73ca00-c6e6-11f0-955b-ea727f233291', '00000030-0000-4000-8000-000000000030', 'installationTime', '2–3 İş Günü (hava şartlarına bağlı)', 'service', 60, '2025-11-21 14:29:02.955', '2025-11-21 14:29:02.955');


-- ----------------------------
-- Table structure for `info_cards`
-- ----------------------------
DROP TABLE IF EXISTS `info_cards`;
CREATE TABLE `info_cards` (
  `id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(500) NOT NULL,
  `icon` varchar(32) NOT NULL,
  `icon_type` enum('emoji','lucide') NOT NULL DEFAULT 'emoji',
  `lucide_icon` varchar(64) DEFAULT NULL,
  `link` varchar(255) NOT NULL,
  `bg_color` varchar(64) NOT NULL,
  `hover_color` varchar(64) NOT NULL,
  `icon_color` varchar(64) NOT NULL,
  `text_color` varchar(64) NOT NULL,
  `border_color` varchar(64) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `display_order` int(11) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `info_cards_active_idx` (`is_active`),
  KEY `info_cards_order_idx` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of `info_cards`
-- ----------------------------
INSERT INTO `info_cards` (`id`, `title`, `description`, `icon`, `icon_type`, `lucide_icon`, `link`, `bg_color`, `hover_color`, `icon_color`, `text_color`, `border_color`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES 
('6dc4e56c-c6e6-11f0-955b-ea727f233291', 'Mezar Yapımı Konusunda Sıkça Sorulan Sorular', 'Mezar inşaatı, fiyatlar, malzemeler ve süreçler hakkında sık sorulan sorular', '❓', 'emoji', NULL, 'faq', 'bg-teal-50', 'hover:bg-teal-100', 'text-teal-600', 'text-teal-700', 'border-teal-200', 1, 1, '2025-11-21 14:29:03.487', '2025-11-21 14:29:03.487'),
('6dc4e93e-c6e6-11f0-955b-ea727f233291', 'İstanbul İl Genelinde Bulunan Mezarlıklar', 'İstanbul\'daki tüm mezarlıkların listesi ve bölge bilgileri', '🗂️', 'emoji', NULL, 'cemeteries', 'bg-teal-50', 'hover:bg-teal-100', 'text-teal-600', 'text-teal-700', 'border-teal-200', 1, 2, '2025-11-21 14:29:03.487', '2025-11-21 14:29:03.487'),
('6dc4eaa8-c6e6-11f0-955b-ea727f233291', 'Mezarlık Müdürlükleri Adres ve Telefon Bilgileri', '14 mezarlık müdürlüğünün detaylı adres ve iletişim bilgileri', '📞', 'emoji', NULL, 'cemeteries', 'bg-teal-50', 'hover:bg-teal-100', 'text-teal-600', 'text-teal-700', 'border-teal-200', 1, 3, '2025-11-21 14:29:03.487', '2025-11-21 14:29:03.487');


-- ----------------------------
-- Table structure for `notifications`
-- ----------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(50) NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_notifications_user_id` (`user_id`),
  KEY `idx_notifications_user_read` (`user_id`,`is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of `notifications`
-- ----------------------------
INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `is_read`, `created_at`) VALUES 
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'Hoş geldiniz!', 'Hesabınız başarıyla oluşturuldu. İyi alışverişler!', 'system', 0, '2025-11-21 14:29:04.000'),
('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'İlk sipariş fırsatı', 'İlk siparişinizde ekstra indirim kazandınız. Sepette kupon kullanmayı unutmayın.', 'custom', 0, '2025-11-21 14:29:04.000');


-- ----------------------------
-- Table structure for `products`
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `category_id` char(36) NOT NULL,
  `sub_category_id` char(36) DEFAULT NULL,
  `image_url` longtext DEFAULT NULL,
  `storage_asset_id` char(36) DEFAULT NULL,
  `alt` varchar(255) DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT json_array() CHECK (json_valid(`images`)),
  `storage_image_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT json_array() CHECK (json_valid(`storage_image_ids`)),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT json_array() CHECK (json_valid(`tags`)),
  `specifications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specifications`)),
  `product_code` varchar(64) DEFAULT NULL,
  `stock_quantity` int(11) NOT NULL DEFAULT 0,
  `rating` decimal(3,2) NOT NULL DEFAULT 5.00,
  `review_count` int(11) NOT NULL DEFAULT 0,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` varchar(500) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_uq` (`slug`),
  UNIQUE KEY `products_code_uq` (`product_code`),
  KEY `products_category_id_idx` (`category_id`),
  KEY `products_sub_category_id_idx` (`sub_category_id`),
  KEY `products_active_idx` (`is_active`),
  KEY `products_asset_idx` (`storage_asset_id`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_products_subcategory` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of `products`
-- ----------------------------
INSERT INTO `products` (`id`, `title`, `slug`, `price`, `description`, `category_id`, `sub_category_id`, `image_url`, `storage_asset_id`, `alt`, `images`, `storage_image_ids`, `is_active`, `is_featured`, `tags`, `specifications`, `product_code`, `stock_quantity`, `rating`, `review_count`, `meta_title`, `meta_description`, `created_at`, `updated_at`) VALUES 
('00000001-0000-4000-8000-000000000001', 'TEK KİŞİLİK DİKDÖRTGEN MEZAR', 'no-1-tek-kisilik-dikdortgen-mezar', '26400.00', 'İstanbul mezar yapım işlerinde en çok tercih edilen tek kişilik dikdörtgen mezar modelimiz, birinci sınıf Afyon beyaz mermerinden üretilmektedir. Kaliteli mezar taşı işçiliği ile 10 yıl garanti kapsamındadır. Mezarlık düzenlemelerinde klasik ve şık görünüm sağlar.', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'bbbb0001-2222-4222-8222-bbbbbbbb0001', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center', NULL, NULL, '[\"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1594736797933-d0401ba0af65?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1654866489943-e1c6b3055146?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1717399244709-1325f90e1594?w=800&h=600&fit=crop\"]', '[]', 1, 0, '[]', NULL, 'NO:1', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.945', '2025-11-21 14:29:02.945'),
('00000002-0000-4000-8000-000000000002', 'TEK KİŞİLİK KARE MEZAR', 'no-2-tek-kisilik-kare-mezar', '26400.00', 'Modern mezar tasarımı arayanlar için özel olarak hazırlanan kare mezar modelimiz, çağdaş mezarlık mimarisine uygun şekilde üretilmiştir. Afyon mermerinden imal edilen mezar taşı modeli, dayanıklı yapısı ve şık görünümü ile öne çıkar.', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'bbbb0001-2222-4222-8222-bbbbbbbb0001', 'https://images.unsplash.com/photo-1594736797933-d0401ba0af65?w=800&h=600&fit=crop&crop=center', NULL, NULL, '[\"https://images.unsplash.com/photo-1594736797933-d0401ba0af65?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1654866489943-e1c6b3055146?w=800&h=600&fit=crop\"]', '[]', 1, 0, '[]', NULL, 'NO:2', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.945', '2025-11-21 14:29:02.945'),
('00000003-0000-4000-8000-000000000003', 'TEK KİŞİLİK SÜTUNLU MEZAR', 'no-3-tek-kisilik-sutunlu-mezar', '34500.00', 'Klasik mimari tarzını seven aileler için özel tasarlanan sütunlu mezar modelimiz.', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'bbbb0007-2222-4222-8222-bbbbbbbb0007', 'https://images.unsplash.com/photo-1549573822-0ee3701de11d?w=800&h=600&fit=crop&crop=center', NULL, NULL, '[\"https://images.unsplash.com/photo-1549573822-0ee3701de11d?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1627694241584-78b5a9c3e714?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1559366682-b24d010f6d65?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop\"]', '[]', 1, 0, '[]', NULL, 'NO:3', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.945', '2025-11-21 14:29:02.945'),
('00000004-0000-4000-8000-000000000004', 'TEK KİŞİLİK BEYAZ MERMER MEZAR', 'no-4-tek-kisilik-beyaz-mermer-mezar', '28900.00', 'Saf beyaz mermerden üretilen premium mezar modelimiz.', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'bbbb0001-2222-4222-8222-bbbbbbbb0001', 'https://images.unsplash.com/photo-1627694241584-78b5a9c3e714?w=800&h=600&fit=crop', NULL, NULL, '[\"https://images.unsplash.com/photo-1627694241584-78b5a9c3e714?w=800&h=600&fit=crop\"]', '[]', 1, 0, '[]', NULL, 'NO:4', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.945', '2025-11-21 14:29:02.945'),
('00000005-0000-4000-8000-000000000005', 'TEK KİŞİLİK ÇİFT TAŞLI MEZAR', 'no-5-tek-kisilik-cift-tasli-mezar', '31000.00', 'Ekonomik mezar çözümleri arayanlar için geliştirilen çift taşlı mezar modelimiz.', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'bbbb0001-2222-4222-8222-bbbbbbbb0001', 'https://images.unsplash.com/photo-1559366682-b24d010f6d65?w=800&h=600&fit=crop', NULL, NULL, '[\"https://images.unsplash.com/photo-1559366682-b24d010f6d65?w=800&h=600&fit=crop\"]', '[]', 1, 0, '[]', NULL, 'NO:5', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.945', '2025-11-21 14:29:02.945'),
('00000006-0000-4000-8000-000000000006', 'TEK KİŞİLİK MEZAR - EKONOMİK', 'no-6-tek-kisilik-mezar-ekonomik', '24600.00', 'Bütçe dostu mezar modelleri arasında kaliteli seçenek.', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'bbbb0001-2222-4222-8222-bbbbbbbb0001', 'https://images.unsplash.com/photo-1717399244709-1325f90e1594?w=800&h=600&fit=crop', NULL, NULL, '[\"https://images.unsplash.com/photo-1717399244709-1325f90e1594?w=800&h=600&fit=crop\"]', '[]', 1, 0, '[]', NULL, 'NO:6', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.945', '2025-11-21 14:29:02.945'),
('00000007-0000-4000-8000-000000000007', 'TEK KİŞİLİK TAM SİZE MEZAR', 'no-7-tek-kisilik-tam-size-mezar', '42600.00', 'Premium mezar kategorisinde yer alan geniş boyutlu tasarım.', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'bbbb0001-2222-4222-8222-bbbbbbbb0001', 'https://images.unsplash.com/photo-1654866489943-e1c6b3055146?w=800&h=600&fit=crop', NULL, NULL, '[\"https://images.unsplash.com/photo-1654866489943-e1c6b3055146?w=800&h=600&fit=crop\"]', '[]', 1, 0, '[]', NULL, 'NO:7', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.945', '2025-11-21 14:29:02.945'),
('00000008-0000-4000-8000-000000000008', 'TEK KİŞİLİK YUVARLAK MEZAR', 'no-8-tek-kisilik-yuvarlak-mezar', '28900.00', 'Yuvarlak formda çağdaş estetik.', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'bbbb0001-2222-4222-8222-bbbbbbbb0001', 'https://images.unsplash.com/photo-1675488367379-b2f761bfacef?w=800&h=600&fit=crop', NULL, NULL, '[\"https://images.unsplash.com/photo-1675488367379-b2f761bfacef?w=800&h=600&fit=crop\"]', '[]', 1, 0, '[]', NULL, 'NO:8', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.945', '2025-11-21 14:29:02.945'),
('00000009-0000-4000-8000-000000000009', 'TEK KİŞİLİK MİNİMALİST MEZAR', 'no-9-tek-kisilik-minimalist-mezar', '22900.00', 'Sade ve modern tasarım anlayışı.', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'bbbb0001-2222-4222-8222-bbbbbbbb0001', 'https://images.unsplash.com/photo-1750832444604-f793c5ad39bb?w=800&h=600&fit=crop', NULL, NULL, '[\"https://images.unsplash.com/photo-1750832444604-f793c5ad39bb?w=800&h=600&fit=crop\"]', '[]', 1, 0, '[]', NULL, 'NO:9', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.945', '2025-11-21 14:29:02.945'),
('00000010-0000-4000-8000-000000000010', 'TEK KİŞİLİK YÜKSEK MEZAR', 'no-10-tek-kisilik-yuksek-mezar', '44200.00', 'Yüksek profilli gösterişli tasarım.', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'bbbb0001-2222-4222-8222-bbbbbbbb0001', 'https://images.unsplash.com/photo-1594736797933-d0401ba0af65?w=800&h=600&fit=crop', NULL, NULL, '[\"https://images.unsplash.com/photo-1594736797933-d0401ba0af65?w=800&h=600&fit=crop\"]', '[]', 1, 0, '[]', NULL, 'NO:10', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.945', '2025-11-21 14:29:02.945'),
('00000011-0000-4000-8000-000000000011', 'TEK KİŞİLİK GRANİT MEZAR', 'no-11-tek-kisilik-granit-mezar', '35600.00', 'Birinci sınıf ithal granit, uzun ömür.', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'bbbb0002-2222-4222-8222-bbbbbbbb0002', 'https://images.unsplash.com/photo-1750832444604-f793c5ad39bb?w=800&h=600&fit=crop&crop=center', NULL, NULL, '[\"https://images.unsplash.com/photo-1750832444604-f793c5ad39bb?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1675488367379-b2f761bfacef?w=800&h=600&fit=crop\"]', '[]', 1, 0, '[]', NULL, 'NO:11', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.945', '2025-11-21 14:29:02.945'),
('00000012-0000-4000-8000-000000000012', 'ÇİFT KİŞİLİK DİKDÖRTGEN MEZAR', 'no-12-cift-kisilik-dikdortgen-mezar', '33600.00', 'Aile mezarları için geniş boyutlu tasarım.', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'bbbb0003-2222-4222-8222-bbbbbbbb0003', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center', NULL, NULL, '[\"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop\"]', '[]', 1, 0, '[]', NULL, 'NO:12', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.945', '2025-11-21 14:29:02.945'),
('00000013-0000-4000-8000-000000000013', 'TEK KİŞİLİK BAŞ TAŞI SÜTUNLU MERMER MEZAR', 'no-13-tek-kisilik-bas-tasi-sutunlu-mermer-mezar', '25000.00', 'Klasik sütun detayları ile estetik görünüm.', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'bbbb0007-2222-4222-8222-bbbbbbbb0007', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', NULL, NULL, '[\"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop\"]', '[]', 1, 0, '[]', NULL, 'NO:13', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.945', '2025-11-21 14:29:02.945'),
('00000014-0000-4000-8000-000000000014', 'TEK KİŞİLİK SÜTUNLU MEZAR', 'no-14-tek-kisilik-sutunlu-mezar', '23000.00', 'Klasik görünüm, uygun fiyat.', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'bbbb0007-2222-4222-8222-bbbbbbbb0007', 'https://images.unsplash.com/photo-1549573822-0ee3701de11d?w=800&h=600&fit=crop', NULL, NULL, '[\"https://images.unsplash.com/photo-1549573822-0ee3701de11d?w=800&h=600&fit=crop\"]', '[]', 1, 0, '[]', NULL, 'NO:14', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.945', '2025-11-21 14:29:02.945'),
('00000015-0000-4000-8000-000000000015', 'TEK KİŞİLİK KOMPLE MERMER MEZAR', 'no-15-tek-kisilik-komple-mermer-mezar', '22000.00', 'Tek parça mermer işçiliği ile ekonomik çözüm.', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'bbbb0001-2222-4222-8222-bbbbbbbb0001', 'https://images.unsplash.com/photo-1594736797933-d0401ba0af65?w=800&h=600&fit=crop', NULL, NULL, '[\"https://images.unsplash.com/photo-1594736797933-d0401ba0af65?w=800&h=600&fit=crop\"]', '[]', 1, 0, '[]', NULL, 'NO:15', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.945', '2025-11-21 14:29:02.945'),
('00000016-0000-4000-8000-000000000016', 'TEK KİŞİLİK MERMER MEZAR', 'no-16-tek-kisilik-mermer-mezar', '21000.00', 'Geleneksel, sade ve şık.', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'bbbb0001-2222-4222-8222-bbbbbbbb0001', 'https://images.unsplash.com/photo-1627694241584-78b5a9c3e714?w=800&h=600&fit=crop', NULL, NULL, '[\"https://images.unsplash.com/photo-1627694241584-78b5a9c3e714?w=800&h=600&fit=crop\"]', '[]', 1, 0, '[]', NULL, 'NO:16', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.945', '2025-11-21 14:29:02.945'),
('00000017-0000-4000-8000-000000000017', 'TEK KİŞİLİK MEZAR', 'no-17-tek-kisilik-mezar', '34000.00', 'Kaliteli işçilik ve uygun fiyat.', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'bbbb0001-2222-4222-8222-bbbbbbbb0001', 'https://images.unsplash.com/photo-1559366682-b24d010f6d65?w=800&h=600&fit=crop', NULL, NULL, '[\"https://images.unsplash.com/photo-1559366682-b24d010f6d65?w=800&h=600&fit=crop\"]', '[]', 1, 0, '[]', NULL, 'NO:17', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.945', '2025-11-21 14:29:02.945'),
('00000018-0000-4000-8000-000000000018', 'TEK KİŞİLİK BAŞ TAŞI GÖVDE GRANİT MEZAR', 'no-18-tek-kisilik-bas-tasi-govde-granit-mezar', '31500.00', 'Granit gövde ve baş taşı kombinasyonu.', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'bbbb0002-2222-4222-8222-bbbbbbbb0002', 'https://images.unsplash.com/photo-1750832444604-f793c5ad39bb?w=800&h=600&fit=crop', NULL, NULL, '[\"https://images.unsplash.com/photo-1750832444604-f793c5ad39bb?w=800&h=600&fit=crop\"]', '[]', 1, 0, '[]', NULL, 'NO:18', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.945', '2025-11-21 14:29:02.945'),
('00000019-0000-4000-8000-000000000019', 'TEK KİŞİLİK GRANİT MEZAR (PREMIUM)', 'no-19-tek-kisilik-granit-mezar-premium', '37000.00', 'Premium granit malzeme.', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'bbbb0002-2222-4222-8222-bbbbbbbb0002', 'https://images.unsplash.com/photo-1675488367379-b2f761bfacef?w=800&h=600&fit=crop', NULL, NULL, '[\"https://images.unsplash.com/photo-1675488367379-b2f761bfacef?w=800&h=600&fit=crop\"]', '[]', 1, 0, '[]', NULL, 'NO:19', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.945', '2025-11-21 14:29:02.945'),
('00000020-0000-4000-8000-000000000020', 'TEK KİŞİLİK KOMPLE GRANİT MEZAR', 'no-20-tek-kisilik-komple-granit-mezar', '0.00', 'Özel ölçü/tasarım → fiyat için iletişime geçiniz.', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'bbbb0002-2222-4222-8222-bbbbbbbb0002', 'https://images.unsplash.com/photo-1717399244709-1325f90e1594?w=800&h=600&fit=crop', NULL, NULL, '[\"https://images.unsplash.com/photo-1717399244709-1325f90e1594?w=800&h=600&fit=crop\"]', '[]', 1, 0, '[]', NULL, 'NO:20', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.945', '2025-11-21 14:29:02.945'),
('00000021-0000-4000-8000-000000000021', 'İKİ KİŞİLİK BAŞ TAŞI ÖZEL KESİM GRANİT MEZAR YAPIMI', 'no-21-iki-kisilik-bas-tasi-ozel-kesim-granit-mezar-yapimi', '0.00', 'Kişiye özel tasarım ve ölçüler.', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'bbbb0004-2222-4222-8222-bbbbbbbb0004', 'https://images.unsplash.com/photo-1654866489943-e1c6b3055146?w=800&h=600&fit=crop', NULL, NULL, '[\"https://images.unsplash.com/photo-1654866489943-e1c6b3055146?w=800&h=600&fit=crop\"]', '[]', 1, 0, '[]', NULL, 'NO:21', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.945', '2025-11-21 14:29:02.945'),
('00000022-0000-4000-8000-000000000022', 'TEK KİŞİLİK SÜTUNLU GRANİT MERMER MEZAR', 'no-22-tek-kisilik-sutunlu-granit-mermer-mezar', '38500.00', 'Granit ve mermer kombinasyonu ile sütunlu tasarım.', 'aaaa0001-1111-4111-8111-aaaaaaaa0001', 'bbbb0007-2222-4222-8222-bbbbbbbb0007', 'https://images.unsplash.com/photo-1594736797933-d0401ba0af65?w=800&h=600&fit=crop', NULL, NULL, '[\"https://images.unsplash.com/photo-1594736797933-d0401ba0af65?w=800&h=600&fit=crop\"]', '[]', 1, 0, '[]', NULL, 'NO:22', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.945', '2025-11-21 14:29:02.945'),
('00000023-0000-4000-8000-000000000023', 'GÜNAY YAMAN – Siyah Granit Çerçeveli Mezar Baş Taşı', 'bas-1-siyah-granit-cerceveli-mezar-bas-tasi', '0.00', 'Siyah granit çerçeve ve beyaz mermer kombinasyonu ile modern, şık ve dayanıklı baş taşı tasarımı.', 'aaaa0002-1111-4111-8111-aaaaaaaa0002', 'cccc0002-3333-4333-8333-cccccccc0002', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center', NULL, NULL, '[\"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center\", \"https://images.unsplash.com/photo-1594736797933-d0401ba0af65?w=800&h=600&fit=crop&crop=center\", \"https://images.unsplash.com/photo-1654866489943-e1c6b3055146?w=800&h=600&fit=crop&crop=center\"]', '[]', 1, 1, '[]', NULL, 'BAS:01', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.938', '2025-11-21 14:29:02.938'),
('00000024-0000-4000-8000-000000000024', 'Tek Kişilik Granit Mezar Baş Taşı Modeli', 'bas-2-tek-kisilik-granit-mezar-bas-tasi', '0.00', 'Dayanıklı siyah granit malzeme ile tek kişilik modern baş taşı.', 'aaaa0002-1111-4111-8111-aaaaaaaa0002', 'cccc0002-3333-4333-8333-cccccccc0002', 'https://images.unsplash.com/photo-1675488367379-b2f761bfacef?w=800&h=600&fit=crop&crop=center', NULL, NULL, '[\"https://images.unsplash.com/photo-1675488367379-b2f761bfacef?w=800&h=600&fit=crop&crop=center\", \"https://images.unsplash.com/photo-1717399244709-1325f90e1594?w=800&h=600&fit=crop&crop=center\", \"https://images.unsplash.com/photo-1549573822-0ee3701de11d?w=800&h=600&fit=crop&crop=center\"]', '[]', 1, 0, '[]', NULL, 'BAS:02', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.938', '2025-11-21 14:29:02.938'),
('00000025-0000-4000-8000-000000000025', 'Çift Kişilik Mermer Mezar Baş Taşı', 'bas-3-cift-kisilik-mermer-mezar-bas-tasi', '0.00', 'Klasik beyaz mermerden çift kişilik baş taşı; doğal mermer cila ile uzun ömür.', 'aaaa0002-1111-4111-8111-aaaaaaaa0002', 'cccc0001-3333-4333-8333-cccccccc0001', 'https://images.unsplash.com/photo-1578948856697-db91d246b7b8?w=800&h=600&fit=crop&crop=center', NULL, NULL, '[\"https://images.unsplash.com/photo-1578948856697-db91d246b7b8?w=800&h=600&fit=crop&crop=center\", \"https://images.unsplash.com/photo-1654866489943-e1c6b3055146?w=800&h=600&fit=crop&crop=center\"]', '[]', 1, 0, '[]', NULL, 'BAS:03', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.938', '2025-11-21 14:29:02.938'),
('00000026-0000-4000-8000-000000000026', 'Özel Tasarım Tek Kişilik Mezar Baş Taşı', 'bas-4-ozel-tasarim-tek-kisilik-mezar-bas-tasi', '0.00', 'Mozaik ve özel işçilik seçenekleriyle kişiye özel tasarlanmış baş taşı.', 'aaaa0002-1111-4111-8111-aaaaaaaa0002', 'cccc0004-3333-4333-8333-cccccccc0004', 'https://images.unsplash.com/photo-1589894403421-1c4b0c6b3b6e?w=800&h=600&fit=crop&crop=center', NULL, NULL, '[\"https://images.unsplash.com/photo-1589894403421-1c4b0c6b3b6e?w=800&h=600&fit=crop&crop=center\", \"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center\"]', '[]', 1, 0, '[]', NULL, 'BAS:04', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.938', '2025-11-21 14:29:02.938'),
('00000027-0000-4000-8000-000000000027', 'Sütunlu Mermer Baş Taşı', 'bas-5-sutunlu-mermer-bas-tasi', '0.00', 'Klasik sütun detaylı mermer baş taşı; gösterişli ve zarif görünüm.', 'aaaa0002-1111-4111-8111-aaaaaaaa0002', 'cccc0003-3333-4333-8333-cccccccc0003', 'https://images.unsplash.com/photo-1549573822-0ee3701de11d?w=800&h=600&fit=crop&crop=center', NULL, NULL, '[\"https://images.unsplash.com/photo-1549573822-0ee3701de11d?w=800&h=600&fit=crop&crop=center\", \"https://images.unsplash.com/photo-1578948856697-db91d246b7b8?w=800&h=600&fit=crop&crop=center\"]', '[]', 1, 1, '[]', NULL, 'BAS:05', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.938', '2025-11-21 14:29:02.938'),
('00000028-0000-4000-8000-000000000028', 'Tek Kişilik Mermer Mezar Baş Taşı', 'bas-6-tek-kisilik-mermer-mezar-bas-tasi', '0.00', 'Geleneksel beyaz mermer tek kişilik baş taşı; sade ve şık.', 'aaaa0002-1111-4111-8111-aaaaaaaa0002', 'cccc0001-3333-4333-8333-cccccccc0001', 'https://images.unsplash.com/photo-1578948854345-1b9b2e5f3b9c?w=800&h=600&fit=crop&crop=center', NULL, NULL, '[\"https://images.unsplash.com/photo-1578948854345-1b9b2e5f3b9c?w=800&h=600&fit=crop&crop=center\", \"https://images.unsplash.com/photo-1594736797933-d0401ba0af65?w=800&h=600&fit=crop&crop=center\"]', '[]', 1, 0, '[]', NULL, 'BAS:06', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.938', '2025-11-21 14:29:02.938'),
('00000029-0000-4000-8000-000000000029', 'Tek Kişilik Granit Mezar Baş Taşı', 'bas-7-tek-kisilik-granit-mezar-bas-tasi', '0.00', 'Modern çizgilere sahip parlak granit yüzeyli tek kişilik baş taşı.', 'aaaa0002-1111-4111-8111-aaaaaaaa0002', 'cccc0002-3333-4333-8333-cccccccc0002', 'https://images.unsplash.com/photo-1750832444604-f793c5ad39bb?w=800&h=600&fit=crop&crop=center', NULL, NULL, '[\"https://images.unsplash.com/photo-1750832444604-f793c5ad39bb?w=800&h=600&fit=crop&crop=center\", \"https://images.unsplash.com/photo-1675488367379-b2f761bfacef?w=800&h=600&fit=crop&crop=center\"]', '[]', 1, 0, '[]', NULL, 'BAS:07', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.938', '2025-11-21 14:29:02.938'),
('00000030-0000-4000-8000-000000000030', 'Özel Yapım Granit Baş Taşı', 'bas-8-ozel-yapim-granit-bas-tasi', '0.00', 'Müşteri talebine göre ölçü ve detayları belirlenen özel yapım granit baş taşı.', 'aaaa0002-1111-4111-8111-aaaaaaaa0002', 'cccc0004-3333-4333-8333-cccccccc0004', 'https://images.unsplash.com/photo-1654866489943-e1c6b3055146?w=800&h=600&fit=crop&crop=center', NULL, NULL, '[\"https://images.unsplash.com/photo-1654866489943-e1c6b3055146?w=800&h=600&fit=crop&crop=center\", \"https://images.unsplash.com/photo-1594736797933-d0401ba0af65?w=800&h=600&fit=crop&crop=center\"]', '[]', 1, 1, '[]', NULL, 'BAS:08', 0, '5.00', 0, NULL, NULL, '2025-11-21 14:29:02.938', '2025-11-21 14:29:02.938');


-- ----------------------------
-- Table structure for `profiles`
-- ----------------------------
DROP TABLE IF EXISTS `profiles`;
CREATE TABLE `profiles` (
  `id` char(36) NOT NULL,
  `full_name` text DEFAULT NULL,
  `phone` varchar(64) DEFAULT NULL,
  `avatar_url` text DEFAULT NULL,
  `address_line1` varchar(255) DEFAULT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(128) DEFAULT NULL,
  `country` varchar(128) DEFAULT NULL,
  `postal_code` varchar(32) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_profiles_id_users_id` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of `profiles`
-- ----------------------------
INSERT INTO `profiles` (`id`, `full_name`, `phone`, `avatar_url`, `address_line1`, `address_line2`, `city`, `country`, `postal_code`, `created_at`, `updated_at`) VALUES 
('0ac37a5c-a8be-4d25-b853-1e5c9574c1b3', 'Mehmet Kuber', '05454905148', NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-21 14:29:02.864', '2025-11-21 14:29:02.864'),
('19a2bc26-63d1-43ad-ab56-d7f3c3719a34', 'Nuri Muh', '05414417854', NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-21 14:29:02.864', '2025-11-21 14:29:02.864'),
('4a8fb7f7-0668-4429-9309-fe88ac90eed2', 'Sultan Abdü', '05427354197', NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-21 14:29:02.864', '2025-11-21 14:29:02.864'),
('4f618a8d-6fdb-498c-898a-395d368b2193', 'Orhan Güzel', '+905551112233', NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-21 14:29:02.895', '2025-11-21 14:29:02.895'),
('7129bc31-88dc-42da-ab80-415a21f2ea9a', 'Melih Keçeci', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-21 14:29:02.864', '2025-11-21 14:29:02.864'),
('d279bb9d-797d-4972-a8bd-a77a40caba91', 'Keçeci Melih', '05425547474', NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-21 14:29:02.864', '2025-11-21 14:29:02.864');


-- ----------------------------
-- Table structure for `simple_campaigns`
-- ----------------------------
DROP TABLE IF EXISTS `simple_campaigns`;
CREATE TABLE `simple_campaigns` (
  `id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(500) NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `storage_asset_id` char(36) DEFAULT NULL,
  `alt` varchar(255) DEFAULT NULL,
  `seo_keywords` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`seo_keywords`)),
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `simple_campaigns_active_idx` (`is_active`),
  KEY `simple_campaigns_asset_idx` (`storage_asset_id`),
  KEY `simple_campaigns_created_idx` (`created_at`),
  KEY `simple_campaigns_updated_idx` (`updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of `simple_campaigns`
-- ----------------------------
INSERT INTO `simple_campaigns` (`id`, `title`, `description`, `image_url`, `storage_asset_id`, `alt`, `seo_keywords`, `is_active`, `created_at`, `updated_at`) VALUES 
('6ddde0fd-c6e6-11f0-955b-ea727f233291', 'Yazlık Mezar Bakım Kampanyası', 'Yaz aylarında mezarlarınızın bakımı için özel indirimli paketlerimizden faydalanın!', 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1762878680/custom_pages/609da17f-bee8-11f0-947f-e7685059cf04/cover/mezartasi.png', NULL, NULL, '[\"yazlık mezar bakımı\", \"mezar temizlik hizmeti\", \"yaz bakım kampanyası\", \"mezar onarımı\", \"istanbul mezar bakımı\", \"mezar restorasyon\", \"mezar çiçeklendirme\", \"mezar toprak doldurumu\", \"profesyonel mezar bakımı\"]', 1, '2024-06-01 00:00:00.000', '2024-06-01 00:00:00.000'),
('6dde720e-c6e6-11f0-955b-ea727f233291', 'Mermer Mezar Taşları %25 İndirim', 'Kaliteli mermer mezar taşlarında özel indirim fırsatı! Sınırlı süreyle geçerli.', 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1762878680/custom_pages/609da17f-bee8-11f0-947f-e7685059cf04/cover/mezartasi.png', NULL, NULL, '[\"mermer mezar taşı\", \"mermer indirim\", \"doğal mermer mezar\", \"kaliteli mermer taşı\", \"mermer mezar modelleri\", \"istanbul mermer mezar\", \"mermer taş işçiliği\", \"özel mermer tasarım\", \"mermer mezar fiyatları\"]', 1, '2024-05-01 00:00:00.000', '2024-05-01 00:00:00.000'),
('6dde9264-c6e6-11f0-955b-ea727f233291', 'Aile Mezarı Özel Paket Kampanyası', 'Aile mezarları için komplet çözüm paketi! İnşaat, taş işçiliği ve peyzaj dahil.', 'https://res.cloudinary.com/dbozv7wqd/image/upload/v1762878680/custom_pages/609da17f-bee8-11f0-947f-e7685059cf04/cover/mezartasi.png', NULL, NULL, '[\"aile mezarı\", \"büyük mezar yapımı\", \"çoklu mezar inşaatı\", \"aile mezar modelleri\", \"geniş mezar tasarımı\", \"istanbul aile mezarı\", \"mezar kompleksi\", \"büyük mezar taşı\", \"aile mezar fiyatları\"]', 1, '2024-04-01 00:00:00.000', '2024-04-01 00:00:00.000');
