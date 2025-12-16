import { Button } from "../ui/button";
import { Calendar, Tag, ArrowLeft, Star } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface MarbleCollectionPageProps {
  onNavigate: (page: string) => void;
}

export function MarbleCollectionPage({ onNavigate }: MarbleCollectionPageProps) {
  const marbleTypes = [
    {
      name: "Carrara Beyazı",
      origin: "İtalya",
      features: "Yüksek dayanıklılık, homojen yapı",
      image: "https://images.unsplash.com/photo-1566722295977-45efd252d476?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJibGUlMjBjYXJyYXJhfGVufDF8fHx8MTc1NjA3MTEzNnww&ixlib=rb-4.1.0&q=80&w=300&h=200&fit=crop&crop=center"
    },
    {
      name: "Thassos Beyazı",
      origin: "Yunanistan",
      features: "Kristal yapı, parlak yüzey",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJibGUlMjB3aGl0ZSUyMHN0b25lfGVufDF8fHx8MTc1NjA3MTEzNnww&ixlib=rb-4.1.0&q=80&w=300&h=200&fit=crop&crop=center"
    },
    {
      name: "Nero Marquina",
      origin: "İspanya",
      features: "Siyah renk, beyaz damarlar",
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba0af65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJibGUlMjBibGFjayUyMHN0b25lfGVufDF8fHx8MTc1NjA3MTEzNnww&ixlib=rb-4.1.0&q=80&w=300&h=200&fit=crop&crop=center"
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
              src="https://images.unsplash.com/photo-1566722295977-45efd252d476?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJibGUlMjBjb2xsZWN0aW9uJTIwc2hvd3Jvb218ZW58MXx8fHwxNzU2MDcxMTM2fDA&ixlib=rb-4.1.0&q=80&w=800&h=400&fit=crop&crop=center"
              alt="Yeni Mermer Koleksiyonu Showroom"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <span className="bg-blue-500 px-3 py-1 rounded-full text-sm font-semibold">Duyuru</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Meta Info */}
            <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Şubat 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>Duyuru</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Yeni Mermer Koleksiyonumuz Showroomda!
            </h1>

            {/* Content */}
            <div className="prose max-w-none space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
                <h2 className="text-xl font-semibold text-blue-700 mb-3">
                  ✨ İtalyan Mermeri ile Üretilen Yeni Modeller
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Showroomumuzda sergilenen yeni mermer koleksiyonumuz, İtalya'nın en kaliteli
                  mermer ocaklarından getirilen hammaddelerle üretilmiştir. Estetik ve dayanıklılık
                  bir arada sunulan bu modeller, sevdiklerinizin anısını en güzel şekilde yaşatmanızı sağlar.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    Koleksiyonun Özellikleri
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      %100 doğal İtalyan mermeri
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Üstün dayanıklılık ve uzun ömür
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Modern ve klasik tasarım seçenekleri
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Özel işleme teknikleri ile parlatılmış
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Çevre koşullarına dayanıklı
                    </li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Showroom Bilgileri</h3>
                  <div className="space-y-3 text-gray-700">
                    <div>
                      <strong>Adres:</strong><br />
                      Çekmeköy, İstanbul Anadolu Yakası
                    </div>
                    <div>
                      <strong>Çalışma Saatleri:</strong><br />
                      Pazartesi - Cumartesi: 09:00 - 18:00<br />
                      Pazar: 10:00 - 16:00
                    </div>
                    <div>
                      <strong>Randevu:</strong><br />
                      Önceden randevu almanız önerilir
                    </div>
                  </div>
                </div>
              </div>

              {/* Marble Types */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Koleksiyondaki Mermer Türleri</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {marbleTypes.map((marble, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={marble.image}
                        alt={marble.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">{marble.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Köken:</strong> {marble.origin}
                        </p>
                        <p className="text-sm text-gray-700">{marble.features}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">📍 Showroom Ziyareti</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Yeni mermer koleksiyonumuzu yakından görmek ve detaylı bilgi almak için
                  showroomumuzı ziyaret edebilirsiniz. Uzman ekibimiz size en uygun modeli
                  seçmenizde yardımcı olacaktır.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => window.open("tel:+905334838971")}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Randevu Al: 0533 483 89 71
                  </Button>
                  <Button
                    onClick={() => window.open("https://wa.me/905334838971?text=Yeni%20mermer%20koleksiyonu%20hakkında%20bilgi%20almak%20istiyorum")}
                    variant="outline"
                    className="border-blue-500 text-blue-600 hover:bg-blue-50"
                  >
                    WhatsApp ile İletişim
                  </Button>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-3">💎 Kalite Garantisi</h3>
                <p className="text-green-700 leading-relaxed">
                  Tüm mermer koleksiyonumuz kalite sertifikası ile birlikte sunulmaktadır.
                  İtalyan mermerinin orijinalliği ve kalitesi garanti altındadır.
                  25 yıllık tecrübemizle, en kaliteli malzemeyi en uygun fiyata sunuyoruz.
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
            className="h-auto p-4 text-left border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            <div>
              <h4 className="font-semibold mb-1">Mezar Modelleri</h4>
              <p className="text-sm text-gray-600">Tüm mezar modellerimizi inceleyin</p>
            </div>
          </Button>
          <Button
            onClick={() => onNavigate("contact")}
            variant="outline"
            className="h-auto p-4 text-left border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            <div>
              <h4 className="font-semibold mb-1">Showroom Adresi</h4>
              <p className="text-sm text-gray-600">Adres ve yol tarifi bilgileri</p>
            </div>
          </Button>
          <Button
            onClick={() => onNavigate("pricing")}
            variant="outline"
            className="h-auto p-4 text-left border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            <div>
              <h4 className="font-semibold mb-1">Fiyat Listesi</h4>
              <p className="text-sm text-gray-600">Mermer fiyatlarını görüntüleyin</p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}