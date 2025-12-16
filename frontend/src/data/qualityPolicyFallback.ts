// Statik fallback HTML (DB boş ya da ulaşılamazsa)
// Not: Stil sınıfları Tailwind ile uyumlu; mevcut sayfanın görünümü korunur.
export const QUALITY_POLICY_HTML_FALLBACK = `
<section class="container mx-auto px-4 py-8">
  <h1 class="text-3xl md:text-4xl font-bold text-teal-600 mb-4">KALİTE POLİTİKAMIZ</h1>
  <p class="text-gray-700 mb-8"><strong>İstanbul'da mezar yapımı sektöründe kalite lideri</strong> olarak, <em>25 yıllık deneyimimizle</em> müşterilerimize <strong>A+ kalite garantisi</strong> sunuyoruz.</p>

  <!-- Mezar Yapımında Kalite Anlayışımız -->
  <div class="bg-gradient-to-br from-teal-50 to-blue-50 p-8 rounded-xl border-l-4 border-teal-500 shadow-lg mb-8">
    <h2 class="text-2xl text-teal-600 mb-6 flex items-center">
      <span class="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center mr-4 text-white">🏆</span>
      Mezar Yapımında Kalite Anlayışımız
    </h2>
    <div class="space-y-5 text-gray-700">
      <p><strong>İstanbul'da mezar yapımı konusunda sektörün en güvenilir firması</strong> olarak, <em>kaliteli mezar inşaatı, mermer mezar taşı yapımı, granit mezar taşı üretimi</em> ve <strong>mezar bakım hizmetlerinde</strong> asla taviz vermediğimiz standartlarımız bulunmaktadır. <strong>Tek kişilik mezar, iki kişilik mezar, aile mezarı</strong> projelerinde <em>İstanbul Büyükşehir Belediyesi normlarına uygun</em> kaliteli işçilik garantisi veriyoruz.</p>
      <p><strong>Mezar yapım kalitemiz</strong>, kullandığımız <em>A+ sınıf mermer, granit, traverten</em> malzemelerden başlayarak, <strong>profesyonel mezar ustalarımızın</strong> deneyimi ile devam eder. <em>Mezar onarımı, mezar restorasyonu, mezar çiçeklendirme</em> ve <strong>mezar toprak doldurumu</strong> hizmetlerimizde de aynı kalite standardını koruyoruz.</p>
      <p><strong>Uygun fiyat mezar yapımı</strong> sunarken kaliteden asla ödün vermeyiz. <em>Karaca Ahmet, Zincirlikuyu, Eyüp Sultan, Edirnekapı</em> mezarlıklarında gerçekleştirdiğimiz tüm projelerimiz <strong>5 yıl işçilik garantisi</strong> ile teslim edilir. <em>Modern mezar tasarımı, klasik mezar modelleri</em> ve özel tasarım projelerimizde <strong>mükemmellik standardı</strong> hedefliyoruz.</p>
    </div>
  </div>

  <!-- Kalite Kontrol Süreci -->
  <div class="bg-white border border-gray-200 p-8 rounded-xl shadow-lg mb-8">
    <h2 class="text-xl text-blue-600 mb-6 flex items-center">
      <span class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-white text-sm">🔍</span>
      Mezar Yapım Kalite Kontrol Sürecimiz
    </h2>
    <div class="grid md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <div class="flex items-start"><span class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 text-white text-xs mt-1">1</span><div><h3 class="text-sm text-gray-900 mb-1">Malzeme Kalite Kontrolü</h3><p class="text-xs text-gray-600"><strong>A+ sınıf mermer ve granit</strong> seçimi, dayanıklılık testleri</p></div></div>
        <div class="flex items-start"><span class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 text-white text-xs mt-1">2</span><div><h3 class="text-sm text-gray-900 mb-1">Ölçüm ve Planlama</h3><p class="text-xs text-gray-600"><strong>Ücretsiz keşif</strong>, teknik çizim ve <em>İBB standartları</em> kontrolü</p></div></div>
        <div class="flex items-start"><span class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 text-white text-xs mt-1">3</span><div><h3 class="text-sm text-gray-900 mb-1">İşçilik Kalitesi</h3><p class="text-xs text-gray-600"><strong>25+ yıl deneyimli ustalar</strong>, profesyonel araç-gereç kullanımı</p></div></div>
      </div>
      <div class="space-y-4">
        <div class="flex items-start"><span class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-white text-xs mt-1">4</span><div><h3 class="text-sm text-gray-900 mb-1">Montaj ve Uygulama</h3><p class="text-xs text-gray-600"><strong>Hassas montaj</strong>, estetik detaylar ve <em>dayanıklılık</em> odaklı kurulum</p></div></div>
        <div class="flex items-start"><span class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-white text-xs mt-1">5</span><div><h3 class="text-sm text-gray-900 mb-1">Final Kontrolü</h3><p class="text-xs text-gray-600"><strong>Teslim öncesi kalite</strong> kontrolü, <em>müşteri memnuniyet</em> onayı</p></div></div>
        <div class="flex items-start"><span class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3 text-white text-xs mt-1">6</span><div><h3 class="text-sm text-gray-900 mb-1">Garanti ve Takip</h3><p class="text-xs text-gray-600"><strong>5 yıl garanti</strong>, ücretsiz bakım kontrolü ve <em>7/24 destek</em></p></div></div>
      </div>
    </div>
  </div>

  <!-- Kalite İlkeleri -->
  <div class="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl shadow-lg mb-8">
    <h2 class="text-xl text-teal-600 mb-6 flex items-center">
      <span class="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center mr-3 text-white text-sm">📋</span>
      İstanbul Mezar Yapımında Kalite İlkelerimiz
    </h2>
    <div class="grid md:grid-cols-2 gap-4">
      <div class="space-y-4">
        <div class="flex items-start bg-white p-4 rounded-lg shadow-sm"><span class="w-4 h-4 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full mt-1 mr-3 flex-shrink-0"></span><div><h3 class="text-sm text-gray-900 mb-1">Müşteri Memnuniyeti Garantisi</h3><p class="text-xs text-gray-600"><strong>%98 müşteri memnuniyeti</strong> oranı ile <em>mezar yapımında</em> güvenilir hizmet</p></div></div>
        <div class="flex items-start bg-white p-4 rounded-lg shadow-sm"><span class="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mt-1 mr-3 flex-shrink-0"></span><div><h3 class="text-sm text-gray-900 mb-1">A+ Kalite Malzeme Kullanımı</h3><p class="text-xs text-gray-600"><strong>Mermer, granit, traverten</strong> seçiminde <em>kaliteden taviz yok</em></p></div></div>
        <div class="flex items-start bg-white p-4 rounded-lg shadow-sm"><span class="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full mt-1 mr-3 flex-shrink-0"></span><div><h3 class="text-sm text-gray-900 mb-1">Zamanında Teslimat Garantisi</h3><p class="text-xs text-gray-600"><strong>%95 zamanında teslimat</strong> oranı, <em>söz verdiğimiz tarihte</em> teslim</p></div></div>
      </div>
      <div class="space-y-4">
        <div class="flex items-start bg-white p-4 rounded-lg shadow-sm"><span class="w-4 h-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mt-1 mr-3 flex-shrink-0"></span><div><h3 class="text-sm text-gray-900 mb-1">Sürekli Gelişim ve İnovasyon</h3><p class="text-xs text-gray-600"><strong>Modern mezar tasarımları</strong> ve <em>teknolojik yenilikler</em> takibi</p></div></div>
        <div class="flex items-start bg-white p-4 rounded-lg shadow-sm"><span class="w-4 h-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mt-1 mr-3 flex-shrink-0"></span><div><h3 class="text-sm text-gray-900 mb-1">Çevre Dostu Mezar Yapımı</h3><p class="text-xs text-gray-600"><strong>Sürdürülebilir malzeme</strong> kullanımı ve <em>doğa dostu</em> üretim</p></div></div>
        <div class="flex items-start bg-white p-4 rounded-lg shadow-sm"><span class="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full mt-1 mr-3 flex-shrink-0"></span><div><h3 class="text-sm text-gray-900 mb-1">Profesyonel Ekip Çalışması</h3><p class="text-xs text-gray-600"><strong>25+ yıl deneyimli ustalar</strong>, <em>takım halinde</em> mükemmel sonuç</p></div></div>
      </div>
    </div>
  </div>

  <!-- Taahhüt + metrikler -->
  <div class="bg-gradient-to-r from-teal-500 to-blue-500 text-white p-8 rounded-xl shadow-lg">
    <div class="flex items-center mb-4">
      <span class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4 text-2xl">🤝</span>
      <h2 class="text-xl m-0">Kalite Taahhüdümüz</h2>
    </div>
    <div class="space-y-4 text-white/95">
      <p><strong>İstanbul'da mezar yapımı konusunda sektör lideri</strong> olarak, <em>kalite standartlarımızı sürekli yükseltmeyi</em>, müşterilerimizin beklentilerini karşılamayı ve aşmayı taahhüt ediyoruz. <strong>Her mezar projemizde mükemmellik</strong> arayışımız devam etmektedir.</p>
      <p><em>Tek kişilik mezar, iki kişilik mezar, aile mezarı</em> ve özel tasarım projelerimizde <strong>5 yıl işçilik garantisi</strong> veriyor, <em>ücretsiz bakım kontrolü</em> ile hizmetimizi sürdürüyoruz. <strong>Mezarlarınızın kalitesi bizim gururumuzdur</strong>.</p>
    </div>
    <div class="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/30">
      <div class="text-center"><div class="text-2xl mb-1">98%</div><div class="text-xs opacity-90">Müşteri Memnuniyeti</div></div>
      <div class="text-center"><div class="text-2xl mb-1">5 Yıl</div><div class="text-xs opacity-90">İşçilik Garantisi</div></div>
      <div class="text-center"><div class="text-2xl mb-1">25+</div><div class="text-xs opacity-90">Yıl Deneyim</div></div>
    </div>
  </div>
</section>
`;
