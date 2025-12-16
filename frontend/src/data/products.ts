export interface ProductSpecification {
  id: string;
  name: string;
  value: string;
  category: 'physical' | 'material' | 'service' | 'custom';
  order: number;
}

export interface Product {
  id: number;
  productCode: string;
  title: string;
  price: string;
  image: string;
  images?: string[];
  description?: string;
  specifications?: string; // Deprecated - will be replaced by technicalSpecs
  technicalSpecs?: ProductSpecification[];
  detailedDescription?: string;
  category: string;
  subCategory?: string;
  status?: 'Active' | 'Inactive';
  tags?: string[];
}

export const products: Product[] = [
  {
    id: 1,
    productCode: "NO:1",
    title: "TEK KİŞİLİK DİKDÖRTGEN MEZAR",
    price: "26400 TL",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1594736797933-d0401ba0af65?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1654866489943-e1c6b3055146?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1717399244709-1325f90e1594?w=800&h=600&fit=crop"
    ],
    description: "İstanbul mezar yapım işlerinde en çok tercih edilen tek kişilik dikdörtgen mezar modelimiz, birinci sınıf Afyon beyaz mermerinden üretilmektedir. Kaliteli mezar taşı işçiliği ile 10 yıl garanti kapsamındadır. Mezarlık düzenlemelerinde klasik ve şık görünüm sağlar.",
    specifications: "Boyutlar: 200cm x 100cm x 15cm • Ağırlık: 450 kg • Kalınlık: 15 cm • Yüzey İşlemi: Doğal Mermer Cilalı • Garanti: 10 Yıl Garanti • Kurulum Süresi: 1-2 Gün",
    detailedDescription: "Mezar yapım işlerinde istediğiniz takdirde uygun fiyat farklı küpeste ve mezar baş taşı kalınlığı artırabiliniz. Tek kişilik baş taşı sütür mermer mezar modelimizde 1 adet suluk, 2 adet baştaşı kenarına sütün, 3 adet köşebent ve baş taşı yazısı fiyata dahildir.\n\nMezar yapımında kullandığımız granit 1. sınıf ithal granittir. Mezar yapımında 2 cm kalınlığında granit taban kullanılmaktadır. Mezar yapımında 2 cm kalınlığında granit süpürgelik kullanılmaktadır. Mezar yapımında 2 cm kalınlığında granit gövde kullanılmaktadır. Mezar yapımında 2 cm kalınlığında granit küpeste kullanılmaktadır. Mezar yapımında 4 cm kalınlığında granit baş taşından oluşmaktadır.\n\nTüm mezar yapım işlerimizde 8'lik demir kullanmaktayız. Mezar yapımında kot farkı olan mezar yerinde mezar temelinin ölçüsü değişiklik gösterebilir. Mezar yerlerinin ve eski yapılı mezarların yenilenmesi konularında tekrardan ölçü alımı ve mezar yapım ruhsatı alındıktan sonra mezarisim.com tarafından ücretsiz olarak yapılmaktadır.",
    category: "tek-kisilik-mermer"
  },
  {
    id: 2,
    productCode: "NO:2",
    title: "TEK KİŞİLİK KARE MEZAR",
    price: "26400 TL",
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba0af65?w=800&h=600&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1594736797933-d0401ba0af65?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1654866489943-e1c6b3055146?w=800&h=600&fit=crop"
    ],
    description: "Modern mezar tasarımı arayanlar için özel olarak hazırlanan kare mezar modelimiz, çağdaş mezarlık mimarisine uygun şekilde üretilmiştir. Afyon mermerinden imal edilen mezar taşı modeli, dayanıklı yapısı ve şık görünümü ile öne çıkar. İstanbul mezar yapım hizmetlerimizde en popüler modellerden biridir.",
    specifications: "Boyutlar: 150cm x 150cm x 15cm • Ağırlık: 380 kg • Kalınlık: 15 cm • Yüzey İşlemi: Doğal Mermer Cilalı • Garanti: 10 Yıl Garanti • Kurulum Süresi: 1 Gün",
    detailedDescription: "Kare mezar modelimiz modern mezarlık tasarımlarında tercih edilen şık bir seçenektir. Mezar yapımında kullanılan malzemeler en yüksek kalite standartlarına uygun olarak seçilmiştir. Profesyonel mezar montaj ekibimiz ile hızlı ve güvenli kurulum garantisi sunmaktayız.\n\nMezar yapımında kullanılan mermer malzemeler doğal damarlı Afyon mermeridir. Kare formda kesilen mermer levhalar özel tekniklerle işlenerek estetik görünüm sağlanır. Mezar köşe detayları ve birleşim noktaları titizlikle işçilik yapılır.",
    category: "tek-kisilik-mermer"
  },
  {
    id: 3,
    productCode: "NO:3",
    title: "TEK KİŞİLİK SÜTUNLU MEZAR",
    price: "34500 TL",
    image: "https://images.unsplash.com/photo-1549573822-0ee3701de11d?w=800&h=600&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1549573822-0ee3701de11d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1627694241584-78b5a9c3e714?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1559366682-b24d010f6d65?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"
    ],
    description: "Klasik mimari tarzını seven aileler için özel tasarlanan sütunlu mezar modelimiz, geleneksel mezar taşı sanatının en güzel örneklerinden biridir. Mezar yapımında kullanılan mermer malzeme ve sütun detayları ile gösterişli bir mezarlık görünümü sağlar. İstanbul'un en kaliteli mezar yapım işçiliği ile üretilir.",
    specifications: "Boyutlar: 200cm x 100cm x 25cm • Ağırlık: 520 kg • Kalınlık: 15 cm • Yüzey İşlemi: Mermer Cilalı • Garanti: 12 Yıl Garanti • Kurulum Süresi: 2-3 Gün",
    detailedDescription: "Sütunlu mezar modelimiz, klasik mezar mimarisi arayanlar için ideal bir seçenektir. Mezar yapımında 4 adet sütun ve özel işlenmiş mermer detaylar kullanılmaktadır. Tüm mezar bileşenleri usta işçiliği ile tek tek işlenir ve özenle montajlanır.\n\nSütun başlıkları ve mezar kenar detayları el işçiliği ile oyularak klasik mezar estetiği yakalanır. Mezar yapımında kullanılan sütunlar doğal mermerden tek parça halinde üretilir ve dayanıklılık açısından üstün özellikler gösterir.",
    category: "sutunlu"
  },
  {
    id: 4,
    productCode: "NO:4",
    title: "TEK KİŞİLİK BEYAZ MERMER MEZAR",
    price: "28900 TL",
    image: "https://images.unsplash.com/photo-1627694241584-78b5a9c3e714?w=800&h=600&fit=crop",
    description: "Saf beyaz mermerden üretilen premium mezar modelimiz, mezarlık estetiğinde zarafet arayan aileler için tasarlanmıştır. Birinci kalite Afyon beyaz mermer kullanılarak üretilen mezar taşı, uzun yıllar boyunca beyazlığını korur. Mezar yapım sektöründe kalite ve estetik anlayışının bir araya geldiği özel bir modeldir.",
    specifications: "Boyutlar: 190cm x 95cm x 15cm • Ağırlık: 420 kg • Kalınlık: 15 cm • Yüzey İşlemi: Doğal Mermer Cilalı • Garanti: 10 Yıl Garanti",
    detailedDescription: "Beyaz mermer mezar modelimiz, doğal taş dokusunu en iyi şekilde yansıtan özel işlem teknikleri ile üretilmektedir. Mezar yüzeyindeki doğal damarlama deseni her mezarı benzersiz kılmaktadır.\n\nAfyon beyaz mermeri, Türkiye'nin en kaliteli mermer türlerinden biridir. Saf beyaz rengi ve homojen yapısı ile mezar yapımında tercih edilen premium malzemedir. Özel cilalama teknikleri ile yıllarca parlak kalır.",
    category: "tek-kisilik-mermer"
  },
  {
    id: 5,
    productCode: "NO:5",
    title: "TEK KİŞİLİK ÇİFT TAŞLI MEZAR",
    price: "31000 TL",
    image: "https://images.unsplash.com/photo-1559366682-b24d010f6d65?w=800&h=600&fit=crop",
    description: "Ekonomik mezar çözümleri arayanlar için geliştirilen çift taşlı mezar modelimiz, kaliteli mezar yapımını uygun fiyata sunar. Mezar taşı kombinasyonu ile estetik görünüm sağlanırken, dayanıklılık ve uzun ömür garantisi verilir. İstanbul mezar fiyatları içerisinde en uygun seçeneklerden biridir.",
    specifications: "Boyutlar: 200cm x 100cm x 15cm • Ağırlık: 480 kg • Kalınlık: 15 cm • Yüzey İşlemi: Doğal Mermer Cilalı • Garanti: 8 Yıl Garanti",
    detailedDescription: "Çift taşlı mezar modeli, farklı mermer türlerinin harmoni içinde kullanıldığı özel bir tasarımdır. Mezar yapımında maliyet optimizasyonu sağlarken kaliteden ödün verilmez.\n\nBu modelde ana gövde için bir mermer türü, çerçeve ve detaylar için farklı renkte mermer kullanılarak estetik bir kontrast yaratılır. Ekonomik olmasına rağmen görsel zenginlik sunan akıllı bir tasarım anlayışıdır.",
    category: "tek-kisilik-mermer"
  },
  {
    id: 6,
    productCode: "NO:6",
    title: "TEK KİŞİLİK MEZAR - EKONOMİK",
    price: "24600 TL",
    image: "https://images.unsplash.com/photo-1717399244709-1325f90e1594?w=800&h=600&fit=crop",
    description: "Bütçe dostu mezar modelleri arasında en kaliteli seçenek olan ekonomik mezar modelimiz, uygun fiyatlı mezar yapımı arayanlar için ideal çözümdür. Kaliteli mermer malzeme kullanılarak üretilen mezar taşı, ekonomik olmasına rağmen dayanıklılık ve estetik açısından üst segment mezar modelleri ile rekabet eder.",
    specifications: "Boyutlar: 180cm x 90cm x 12cm • Ağırlık: 350 kg • Kalınlık: 12 cm • Yüzey İşlemi: Doğal Mermer Cilalı • Garanti: 8 Yıl Garanti",
    detailedDescription: "Ekonomik mezar modelimiz, maddi imkanları sınırlı aileler için tasarlanmış kaliteli bir çözümdür. Mezar yapımında kullanılan malzemeler titizlikle seçilir ve işçilik kalitesinden ödün verilmez.\n\nKompakt boyutlarda tasarlanan bu model, küçük mezarlık alanları için de uygundur. Sade tasarımı ve kaliteli malzemesi ile uzun yıllar boyunca dayanıklılık sağlar.",
    category: "tek-kisilik-mermer"
  },
  {
    id: 7,
    productCode: "NO:7",
    title: "TEK KİŞİLİK TAM SİZE MEZAR",
    price: "42600 TL",
    image: "https://images.unsplash.com/photo-1654866489943-e1c6b3055146?w=800&h=600&fit=crop",
    description: "Premium mezar kategorisinde yer alan tam size mezar modelimiz, geniş mezarlık alanları için tasarlanmış gösterişli bir mezar taşı çözümüdür. Maksimum boyutlarda üretilen mermer mezar, mezarlık içerisinde dikkat çeken bir görünüm sunar. Lüks mezar modelleri arayanlar için ideal seçenektir.",
    specifications: "Boyutlar: 220cm x 110cm x 18cm • Ağırlık: 650 kg • Kalınlık: 18 cm • Yüzey İşlemi: Premium Mermer Cilalı • Garanti: 15 Yıl Garanti",
    detailedDescription: "Tam size mezar modelimiz, en büyük boyutlarda mezar arayanlar için özel olarak tasarlanmıştır. Kalın mermer levhalar ve özel işçilik detayları ile üretilen bu model, prestijli mezarlık görünümü sağlar.\n\nGeniş yüzey alanı sayesinde detaylı yazı işleri ve süsleme elementleri için ideal alan sunar. Premium cilalama işlemi ile uzun yıllar boyunca parlak ve temiz görünümünü korur.",
    category: "tek-kisilik-mermer"
  },
  {
    id: 8,
    productCode: "NO:8",
    title: "TEK KİŞİLİK YUVARLAK MEZAR",
    price: "28900 TL",
    image: "https://images.unsplash.com/photo-1675488367379-b2f761bfacef?w=800&h=600&fit=crop",
    description: "Modern mezar tasarımlarında trend olan yuvarlak mezar modelimiz, geleneksel mezar formlarından farklı estetik arayışında olan aileler için özel üretilmiştir. Dairesel formda tasarlanan mezar taşı, mezarlık içerisinde benzersiz bir görünüm yaratır. Çağdaş mezar mimarisi örneklerinden biridir.",
    specifications: "Boyutlar: Çap 200cm x 15cm • Ağırlık: 450 kg • Kalınlık: 15 cm • Yüzey İşlemi: Doğal Mermer Cilalı • Garanti: 10 Yıl Garanti",
    detailedDescription: "Yuvarlak mezar modelimiz, modern mezarlık tasarımı konusunda yenilikçi bir yaklaşımı temsil eder. Dairesel forma uygun özel kesim teknikleri ile üretilen mezar taşı, estetik ve fonksiyonelliği bir araya getirir.\n\nDairesel tasarım, mezarlık içerisinde yumuşak ve organik bir görünüm yaratır. Özel kesim ve işleme teknikleri gerektiren bu model, usta işçiliğinin en iyi örneklerinden biridir.",
    category: "tek-kisilik-mermer"
  },
  {
    id: 9,
    productCode: "NO:9",
    title: "TEK KİŞİLİK MİNİMALİST MEZAR",
    price: "22900 TL",
    image: "https://images.unsplash.com/photo-1750832444604-f793c5ad39bb?w=800&h=600&fit=crop",
    description: "Sade ve modern tasarım anlayışını benimseyen minimalist mezar modelimiz, gösterişsiz ama kaliteli mezar yapımı isteyen aileler için tasarlanmıştır. Mat mermer yüzey işlemi ile farklı bir estetik sunan mezar taşı, çağdaş mezarlık düzenlemelerinde tercih edilen bir modeldir. Şıklık ve sadelik bir arada.",
    specifications: "Boyutlar: 185cm x 85cm x 12cm • Ağırlık: 320 kg • Kalınlık: 12 cm • Yüzey İşlemi: Mat Mermer • Garanti: 8 Yıl Garanti",
    detailedDescription: "Minimalist mezar tasarımımız, sadelik ve zarafeti seven ailelerin tercihi olmaktadır. Mat yüzey işlemi ile doğal taş dokusunu koruyan bu model, modern mezarlık estetiğinin en güzel örneklerinden biridir.\n\nGereksiz süslemelerden arınmış, saf geometrik formda tasarlanan bu mezar, çağdaş sanat anlayışını mezar tasarımına taşır. Mat yüzey işlemi, doğal mermer dokusunu ön plana çıkarır.",
    category: "tek-kisilik-mermer"
  },
  {
    id: 10,
    productCode: "NO:10",
    title: "TEK KİŞİLİK YÜKSEK MEZAR",
    price: "44200 TL",
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba0af65?w=800&h=600&fit=crop",
    description: "Gösterişli mezar modelleri kategorisinde yer alan yüksek profilli mezar tasarımımız, prestijli mezarlık görünümü isteyen aileler için özel üretilmiştir. Kalın mermer levhalar ve yüksek işçilik kalitesi ile üretilen mezar taşı, mezarlık içerisinde saygın bir duruş sergiler. Lüks mezar yapımı arayanlar için ideal.",
    specifications: "Boyutlar: 200cm x 100cm x 25cm • Ağırlık: 750 kg • Kalınlık: 25 cm • Yüzey İşlemi: Premium Cilalı • Garanti: 20 Yıl Garanti",
    detailedDescription: "Yüksek profilli mezar modelimiz, en kalın mermer levhalar kullanılarak üretilen prestijli bir mezar taşı çözümüdür. Ekstra kalınlık ve özel cilalama işlemi ile uzun yıllar boyunca parlak görünümünü korur.\n\n25 cm kalınlığındaki mermer levhalar, üstün dayanıklılık ve görsel etki sağlar. Premium cilalama teknikleri ile işlenen yüzey, yıllarca bakım gerektirmez. Prestijaşı mezarlık alanları için ideal bir seçenektir.",
    category: "tek-kisilik-mermer"
  },
  {
    id: 11,
    productCode: "NO:11",
    title: "TEK KİŞİLİK GRANİT MEZAR",
    price: "35600 TL",
    image: "https://images.unsplash.com/photo-1750832444604-f793c5ad39bb?w=800&h=600&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1750832444604-f793c5ad39bb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1675488367379-b2f761bfacef?w=800&h=600&fit=crop"
    ],
    description: "Dayanıklılık ve uzun ömür arayanlar için ideal granit mezar modelimiz, birinci sınıf ithal granit malzemeden üretilmektedir. Granit mezar taşı, hava koşullarına karşı üstün direnç gösterir ve yıllar boyunca ilk günkü görünümünü korur. İstanbul granit mezar yapımında 25 yıl garanti ile sunulan en kaliteli seçenektir.",
    specifications: "Boyutlar: 195cm x 97cm x 16cm • Ağırlık: 580 kg • Kalınlık: 16 cm • Yüzey İşlemi: Granit Cilalı • Garanti: 25 Yıl Garanti • Kurulum Süresi: 2-3 Gün",
    detailedDescription: "Granit mezar modelimizde 1. sınıf ithal granit kullanılmaktadır. Mezar yapımında 2 cm kalınlığında granit taban, süpürgelik, gövde ve küpeste malzemesi kullanılır. Granit malzeme üstün dayanıklılığı ile mezar bakım masraflarını minimize eder.\n\nGranit, doğal taşlar arasında en dayanıklı olanlarından biridir. Don, yağmur, güneş gibi hava koşullarına karşı üstün direnç gösterir. 25 yıl garanti süresi, granit malzemenin kalitesinin en büyük göstergesidir.",
    category: "tek-kisilik-granit"
  },
  {
    id: 12,
    productCode: "NO:12",
    title: "ÇİFT KİŞİLİK DİKDÖRTGEN MEZAR",
    price: "33600 TL",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center",
    description: "Aile mezarları için tasarlanan çift kişilik mezar modelimiz, geniş boyutları ve estetik tasarımı ile öne çıkar. İki kişilik mezar yapımında kullanılan kaliteli mermer malzeme ve profesyonel işçilik, uzun yıllar boyunca dayanıklılık sağlar. İstanbul'da aile mezar yapımı konusunda en çok tercih edilen modellerden biridir.",
    specifications: "Boyutlar: 250cm x 150cm x 15cm • Ağırlık: 650 kg • Kalınlık: 15 cm • Yüzey İşlemi: Doğal Mermer Cilalı • Garanti: 12 Yıl Garanti • Kurulum Süresi: 2-3 Gün",
    detailedDescription: "Çift kişilik mezar modelimiz, aile mezarlarında geleneksel tercih edilen geniş boyutlu bir tasarımdır. Mezar yapımında kullanılan mermer levhalar özel olarak seçilir ve aile isimlerinin yazılması için uygun alanlar tasarlanır.\n\nGeniş yüzey alanı sayesinde çift isim yazısı ve detaylı süslemeler için ideal alan sağlar. Aile mezarlarında görsel uyum ve estetik bütünlük için tasarlanmış özel bir modeldir.",
    category: "iki-kisilik-mermer"
  },
  // Fotoğraftaki ek ürünler
  {
    id: 13,
    productCode: "NO:13",
    title: "TEK KİŞİLİK BAŞ TAŞI SÜTUNLU MERMER MEZAR",
    price: "25000 TL",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    description: "Baş taşı sütunlu mermer mezar modelimiz, geleneksel mezar sanatı ile modern tasarımın mükemmel birleşimidir. Klasik sütun detayları ile estetik görünüm sağlar.",
    specifications: "Boyutlar: 190cm x 95cm x 20cm • Ağırlık: 480 kg • Kalınlık: 15 cm • Yüzey İşlemi: Doğal Mermer Cilalı • Garanti: 10 Yıl Garanti",
    detailedDescription: "Baş taşında sütun detayları bulunan bu özel mezar modeli, klasik mezar mimarisinin en güzel örneklerinden biridir. Usta işçiliği ile üretilen sütunlar, mezarlık içerisinde gösterişli bir görünüm yaratır.",
    category: "sutunlu"
  },
  {
    id: 14,
    productCode: "NO:14",
    title: "TEK KİŞİLİK SÜTUNLU MEZAR",
    price: "23000 TL",
    image: "https://images.unsplash.com/photo-1549573822-0ee3701de11d?w=800&h=600&fit=crop",
    description: "Ekonomik sütunlu mezar modelimiz, klasik görünümü uygun fiyata sunar. Kaliteli mermer malzeme ve profesyonel işçilik ile üretilir.",
    specifications: "Boyutlar: 185cm x 90cm x 18cm • Ağırlık: 420 kg • Kalınlık: 12 cm • Yüzey İşlemi: Doğal Mermer Cilalı • Garanti: 8 Yıl Garanti",
    detailedDescription: "Ekonomik sütunlu mezar serisinin popüler modeli. Bütçe dostu olmasına rağmen estetik görünüm ve kaliteli işçilik standartlarından ödün vermez.",
    category: "sutunlu"
  },
  {
    id: 15,
    productCode: "NO:15",
    title: "TEK KİŞİLİK KOMPLE MERMER MEZAR",
    price: "22000 TL",
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba0af65?w=800&h=600&fit=crop",
    description: "Komple mermer mezar modelimiz, tek parça mermer işçiliği ile üretilen ekonomik çözümlerden biridir. Şık ve dayanıklı tasarım.",
    specifications: "Boyutlar: 190cm x 95cm x 14cm • Ağırlık: 400 kg • Kalınlık: 14 cm • Yüzey İşlemi: Doğal Mermer Cilalı • Garanti: 8 Yıl Garanti",
    detailedDescription: "Komple mermer işçiliği ile hazırlanan bu model, tek parça mermer bloğundan elde edilen homojen yapısı ile öne çıkar. Ekonomik seçenekler arasında en kaliteli modellerden biridir.",
    category: "tek-kisilik-mermer"
  },
  {
    id: 16,
    productCode: "NO:16",
    title: "TEK KİŞİLİK MERMER MEZAR",
    price: "21000 TL",
    image: "https://images.unsplash.com/photo-1627694241584-78b5a9c3e714?w=800&h=600&fit=crop",
    description: "Klasik mermer mezar modelimiz, geleneksel tasarım tercih eden aileler için ideal seçenektir. Sade ve şık görünüm.",
    specifications: "Boyutlar: 180cm x 90cm x 12cm • Ağırlık: 350 kg • Kalınlık: 12 cm • Yüzey İşlemi: Doğal Mermer Cilalı • Garanti: 8 Yıl Garanti",
    detailedDescription: "Geleneksel mermer mezar tasarımının en sade hali. Klasik çizgiler ve kaliteli malzeme kullanımı ile uzun yıllar dayanıklılık sağlar.",
    category: "tek-kisilik-mermer"
  },
  {
    id: 17,
    productCode: "NO:17",
    title: "TEK KİŞİLİK MEZAR",
    price: "34000 TL",
    image: "https://images.unsplash.com/photo-1559366682-b24d010f6d65?w=800&h=600&fit=crop",
    description: "Standart tek kişilik mezar modelimiz, kaliteli işçilik ve uygun fiyat avantajı sunar. Modern tasarım anlayışı.",
    specifications: "Boyutlar: 200cm x 100cm x 15cm • Ağırlık: 450 kg • Kalınlık: 15 cm • Yüzey İşlemi: Doğal Mermer Cilalı • Garanti: 10 Yıl Garanti",
    detailedDescription: "Standart ölçülerde üretilen bu mezar modeli, modern tasarım anlayışı ile geleneksel mezar sanatını birleştirir. Orta segment için ideal bir seçenektir.",
    category: "tek-kisilik-mermer"
  },
  {
    id: 18,
    productCode: "NO:18",
    title: "TEK KİŞİLİK BAŞ TAŞI GÖVDE GRANİT MEZAR",
    price: "31500 TL",
    image: "https://images.unsplash.com/photo-1750832444604-f793c5ad39bb?w=800&h=600&fit=crop",
    description: "Granit gövde ve baş taşı kombinasyonu ile üretilen dayanıklı mezar modelimiz. Premium granit malzeme kullanımı.",
    specifications: "Boyutlar: 195cm x 95cm x 16cm • Ağırlık: 520 kg • Kalınlık: 16 cm • Yüzey İşlemi: Granit Cilalı • Garanti: 20 Yıl Garanti",
    detailedDescription: "Granit gövde ve baş taşı kombini bu model, üstün dayanıklılık ve estetik görünüm sağlar. İthal granit malzeme kullanımı ile 20 yıl garanti sunar.",
    category: "tek-kisilik-granit"
  },
  {
    id: 19,
    productCode: "NO:19",
    title: "TEK KİŞİLİK GRANİT MEZAR",
    price: "37000 TL",
    image: "https://images.unsplash.com/photo-1675488367379-b2f761bfacef?w=800&h=600&fit=crop",
    description: "Premium granit malzemeden üretilen lüks mezar modelimiz. Üstün kalite ve dayanıklılık garantisi.",
    specifications: "Boyutlar: 200cm x 100cm x 18cm • Ağırlık: 600 kg • Kalınlık: 18 cm • Yüzey İşlemi: Premium Granit Cilalı • Garanti: 25 Yıl Garanti",
    detailedDescription: "Premium kalite granit malzemeden üretilen bu lüks mezar modeli, en üst segment müşteriler için tasarlanmıştır. 25 yıl garanti ile desteklenen üstün kalite.",
    category: "tek-kisilik-granit"
  },
  {
    id: 20,
    productCode: "NO:20",
    title: "TEK KİŞİLİK KOMPLE GRANİT MEZAR",
    price: "Fiyat İçin Arayınız",
    image: "https://images.unsplash.com/photo-1717399244709-1325f90e1594?w=800&h=600&fit=crop",
    description: "Komple granit mezar çözümü, özel tasarım ve ölçülerde üretim. Fiyat için iletişime geçiniz.",
    specifications: "Boyutlar: Özel Ölçü • Ağırlık: Değişken • Kalınlık: 18-25 cm • Yüzey İşlemi: Premium Granit Cilalı • Garanti: 25 Yıl Garanti",
    detailedDescription: "Tamamen granit malzemeden üretilen komple mezar çözümü. Özel tasarım ve ölçülerde üretim imkanı. Fiyat bilgisi için lütfen iletişime geçiniz.",
    category: "tek-kisilik-granit"
  },
  {
    id: 21,
    productCode: "NO:21",
    title: "İKİ KİŞİLİK BAŞ TAŞI ÖZEL KESİM GRANİT MEZAR YAPIMI",
    price: "Fiyat İçin Arayınız",
    image: "https://images.unsplash.com/photo-1654866489943-e1c6b3055146?w=800&h=600&fit=crop",
    description: "Özel kesim iki kişilik granit mezar, kişiye özel tasarım ve ölçülerde üretim. Fiyat için iletişime geçiniz.",
    specifications: "Boyutlar: Özel Ölçü • Ağırlık: Değişken • Kalınlık: 20-25 cm • Yüzey İşlemi: Özel Granit İşlemli • Garanti: 25 Yıl Garanti",
    detailedDescription: "İki kişilik özel kesim granit mezar projesi. Müşteri isteklerine göre özel tasarım ve ölçülerde üretim yapılır. Fiyat bilgisi için detaylı görüşme gereklidir.",
    category: "iki-kisilik-granit"
  },
  {
    id: 22,
    productCode: "NO:22",
    title: "TEK KİŞİLİK SÜTUNLU GRANİT MERMER MEZAR",
    price: "38500 TL",
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba0af65?w=800&h=600&fit=crop",
    description: "Granit ve mermer kombinasyonu ile sütunlu mezar modelimiz. Klasik ve modern tasarımın birleşimi.",
    specifications: "Boyutlar: 200cm x 100cm x 25cm • Ağırlık: 550 kg • Kalınlık: 16 cm • Yüzey İşlemi: Granit-Mermer Kombini • Garanti: 20 Yıl Garanti",
    detailedDescription: "Granit gövde ve mermer sütun kombinasyonu ile üretilen bu özel model, klasik sütunlu tasarımı modern granit dayanıklılığı ile birleştirir. Hibrit çözüm arayan müşteriler için ideal.",
    category: "sutunlu"
  }
];

export function getProductById(id: number): Product | undefined {
  return products.find(product => product.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(product => product.category === category);
}

export function searchProducts(searchTerm: string): Product[] {
  return products.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productCode.toLowerCase().includes(searchTerm.toLowerCase())
  );
}