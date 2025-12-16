import { Button } from "../ui/button";
import { Calendar, Tag, ArrowLeft, Star, Shield, Gem, Droplets } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface GraniteDiscountPageProps {
  onNavigate: (page: string) => void;
}

export function GraniteDiscountPage({ onNavigate }: GraniteDiscountPageProps) {
  const graniteTypes = [
    {
      name: "Absolute Black",
      origin: "Hindistan",
      price: "4.500 TL",
      discountPrice: "3.825 TL",
      features: ["Yoğun siyah renk", "Yüksek parlaklık", "Leke yapmaz"],
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba0af65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGdyYW5pdGUlMjBzdG9uZXxlbnwxfHx8fDE3NTYwNzExMzZ8MA&ixlib=rb-4.1.0&q=80&w=300&h=200&fit=crop&crop=center"
    },
    {
      name: "Kashmir White",
      origin: "Hindistan",
      price: "3.800 TL",
      discountPrice: "3.230 TL",
      features: ["Beyaz-gri tonlar", "Doğal damarlar", "Uzun ömürlü"],
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGdyYW5pdGUlMjBzdG9uZXxlbnwxfHx8fDE3NTYwNzExMzZ8MA&ixlib=rb-4.1.0&q=80&w=300&h=200&fit=crop&crop=center"
    },
    {
      name: "Viscont White",
      origin: "Brezilya",
      price: "4.200 TL",
      discountPrice: "3.570 TL",
      features: ["Krem-beyaz renk", "İnce taneli yapı", "Dayanıklı"],
      image: "https://images.unsplash.com/photo-1566722295977-45efd252d476?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMG1hcmJsZSUyMGdyYW5pdGV8ZW58MXx8fHwxNzU2MDcxMTM2fDA&ixlib=rb-4.1.0&q=80&w=300&h=200&fit=crop&crop=center"
    }
  ];

  const graniteAdvantages = [
    {
      icon: Shield,
      title: "Yüksek Dayanıklılık",
      description: "Granit, doğanın en sert kayalarından biridir ve onlarca yıl bozulmadan kalabilir."
    },
    {
      icon: Droplets,
      title: "Su Geçirmez",
      description: "Granit doğal olarak su emici değildir, bu nedenle don-çözülme döngülerinden etkilenmez."
    },
    {
      icon: Gem,
      title: "Estetik Görünüm",
      description: "Doğal renk ve desenler ile benzersiz ve şık bir görünüm sunar."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Button
          onClick={() => onNavigate("home")}
          variant="outline"
          className="mb-6 flex items-center gap-2 hover:bg-teal-50 border-teal-500 text-teal-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Ana Sayfaya Dön
        </Button>

        {/* Article Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Featured Image */}
          <div className="relative h-64 md:h-80">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1594736797933-d0401ba0af65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFuaXRlJTIwc3RvbmUlMjBtb251bWVudHxlbnwxfHx8fDE3NTYwNzExMzZ8MA&ixlib=rb-4.1.0&q=80&w=800&h=400&fit=crop&crop=center"
              alt="Granit Mezar Modelleri İndirim Kampanyası"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <span className="bg-red-500 px-3 py-1 rounded-full text-sm font-semibold">Kampanya</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Meta Info */}
            <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Nisan 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>Kampanya</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Granit Mezar Modelleri %15 İndirim Kampanyası
            </h1>

            {/* Content */}
            <div className="prose max-w-none space-y-6">
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded">
                <h2 className="text-xl font-semibold text-red-700 mb-3">
                  💎 Tüm Granit Mezar Modellerinde %15 İndirim!
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Dayanıklılığı ve şıklığı ile öne çıkan granit mezar taşlarımızda özel indirim kampanyası!
                  Yüksek kaliteli granit mezar modelleri, uzun ömürlü yapısı ve estetik görünümü ile
                  sevdiklerinizin anısını en güzel şekilde yaşatır. Bu fırsat sınırlı sürelidir.
                </p>
              </div>

              {/* Granite Advantages */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Granitin Avantajları</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {graniteAdvantages.map((advantage, index) => {
                    const IconComponent = advantage.icon;
                    return (
                      <div key={index} className="bg-white border border-gray-200 p-6 rounded-lg text-center">
                        <div className="flex justify-center mb-4">
                          <div className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center">
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-3">{advantage.title}</h4>
                        <p className="text-gray-600 text-sm">{advantage.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Granite Types and Prices */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Kampanya Kapsamındaki Granit Türleri</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {graniteTypes.map((granite, index) => (
                    <div key={index} className="bg-white border-2 border-red-200 rounded-lg overflow-hidden shadow-md">
                      <ImageWithFallback
                        src={granite.image}
                        alt={granite.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">{granite.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          <strong>Köken:</strong> {granite.origin}
                        </p>

                        {/* Features */}
                        <ul className="space-y-1 mb-4">
                          {granite.features.map((feature, idx) => (
                            <li key={idx} className="text-xs text-gray-700 flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>

                        {/* Pricing */}
                        <div className="border-t pt-3">
                          <div className="text-center">
                            <div className="text-sm text-gray-500 line-through">{granite.price}</div>
                            <div className="text-lg font-bold text-red-600">{granite.discountPrice}</div>
                            <div className="text-xs text-green-600 font-semibold">%15 İndirimli</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Campaign Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Kampanya Kapsamı</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Tüm granit mezar modelleri
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Tek ve çift kişilik mezarlar
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Özel tasarım mezar taşları
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      İşçilik ve montaj dahil
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      5 yıl garanti kapsamında
                    </li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Kampanya Şartları</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      Nisan ayı sonuna kadar geçerli
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      Minimum 8.000 TL tutarında sipariş
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      %50 peşin ödeme şartı
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      Sözleşme imzalanması gerekli
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      Diğer kampanyalarla birleştirilemez
                    </li>
                  </ul>
                </div>
              </div>

              {/* Why Choose Granite */}
              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">🏔️ Granit Neden Tercih Edilmeli?</h3>
                <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                  <div>
                    <h4 className="font-semibold mb-2">Dayanıklılık:</h4>
                    <p className="text-sm mb-4">Granit, doğadaki en sert kayalardan biridir. Yıllarca şeklini ve rengini korur, hava koşullarından etkilenmez.</p>

                    <h4 className="font-semibold mb-2">Bakım Kolaylığı:</h4>
                    <p className="text-sm">Su ve deterjan ile kolayca temizlenebilir. Özel bakım gerektirmez, parlaklığını uzun süre korur.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Estetik:</h4>
                    <p className="text-sm mb-4">Doğal renk geçişleri ve desenler her graniti benzersiz kılar. Çok çeşitli renk ve desen seçenekleri mevcuttur.</p>

                    <h4 className="font-semibold mb-2">Değer:</h4>
                    <p className="text-sm">Uzun vadede ekonomik bir seçimdir. İlk yatırım sonrası yıllarca ek maliyet gerektirmez.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">📞 Granit İndirim Kampanyası için İletişim</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  %15 indirim fırsatını kaçırmayın! Granit mezar modelleri hakkında detaylı bilgi alın
                  ve ücretsiz keşif hizmetimizden yararlanın. Uzman ekibimiz size en uygun granit türünü
                  seçmenizde yardımcı olacaktır.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => window.open("tel:+905334838971")}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Hemen Ara: 0533 483 89 71
                  </Button>
                  <Button
                    onClick={() => window.open("https://wa.me/905334838971?text=Granit%20mezar%20indirimi%20hakkında%20bilgi%20almak%20istiyorum")}
                    variant="outline"
                    className="border-red-500 text-red-600 hover:bg-red-50"
                  >
                    WhatsApp ile İletişim
                  </Button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">⏰ Son Gün Uyarısı</h3>
                <p className="text-yellow-700 leading-relaxed">
                  Granit mezar modellerinde %15 indirim kampanyası Nisan ayı sonunda sona erecektir.
                  Bu özel fırsatı kaçırmamak için hemen bizimle iletişime geçin. Kampanya sonrası
                  fiyatlar normal seviyeye dönecektir.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Button
            onClick={() => onNavigate("models")}
            variant="outline"
            className="h-auto p-4 text-left border-red-500 text-red-600 hover:bg-red-50"
          >
            <div>
              <h4 className="font-semibold mb-1">Granit Mezar Modelleri</h4>
              <p className="text-sm text-gray-600">Tüm granit modellerimizi inceleyin</p>
            </div>
          </Button>
          <Button
            onClick={() => onNavigate("pricing")}
            variant="outline"
            className="h-auto p-4 text-left border-red-500 text-red-600 hover:bg-red-50"
          >
            <div>
              <h4 className="font-semibold mb-1">Fiyat Listesi</h4>
              <p className="text-sm text-gray-600">Güncel granit fiyatları</p>
            </div>
          </Button>
          <Button
            onClick={() => onNavigate("contact")}
            variant="outline"
            className="h-auto p-4 text-left border-red-500 text-red-600 hover:bg-red-50"
          >
            <div>
              <h4 className="font-semibold mb-1">İletişim</h4>
              <p className="text-sm text-gray-600">Kampanya detayları için arayın</p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}