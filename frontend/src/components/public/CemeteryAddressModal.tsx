import { useState } from "react";
import { X, MapPin, Phone, Clock, Users, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { cemeteriesData, CemeteryData } from "../../data/cemeteriesData";

interface CemeteryAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CemeteryAddressModal({ isOpen, onClose }: CemeteryAddressModalProps) {
  const [selectedCemetery, setSelectedCemetery] = useState<CemeteryData | null>(null);

  // Öne çıkan kartlar için veri
  const featuredCards = [
    {
      id: "faq",
      title: "Çeviz Konu Yapımında Sıkça Sorulan Sorular",
      icon: "❓",
      bgColor: "bg-teal-50",
      textColor: "text-teal-700"
    },
    {
      id: "locations",
      title: "İstanbul İl Genelinde Bulunan Mezarlıklar",
      icon: "🏛️",
      bgColor: "bg-teal-50",
      textColor: "text-teal-700"
    },
    {
      id: "contact",
      title: "Mezarlık Müdürlükleri Adres ve Telefon Bilgileri",
      icon: "📞",
      bgColor: "bg-teal-100",
      textColor: "text-teal-800"
    }
  ];

  const handleCemeterySelect = (cemetery: CemeteryData) => {
    setSelectedCemetery(cemetery);
  };

  const generateMapUrl = (cemetery: CemeteryData) => {
    const { lat, lng } = cemetery.coordinates;
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${lat},${lng}&zoom=15`;
  };

  // Mock map URL for demo (gerçek projede Google Maps API key gerekli)
  const getMapEmbedUrl = (cemetery: CemeteryData) => {
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3007.123456789!2d${cemetery.coordinates.lng}!3d${cemetery.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${encodeURIComponent(cemetery.name)}!5e0!3m2!1str!2str!4v1234567890`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-7xl max-h-[90vh] overflow-hidden p-0"
        aria-describedby="cemetery-modal-description"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Mezarlık Adres ve İletişim Bilgileri</DialogTitle>
          <DialogDescription id="cemetery-modal-description">
            İstanbul İl genelindeki mezarlık müdürlükleri ve iletişim bilgileri
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl mb-2">Mezarlık Adres ve İletişim Bilgileri</h2>
                <p className="text-teal-100">İstanbul İl genelindeki mezarlık müdürlükleri ve iletişim bilgileri</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-teal-600"
              >
                <X size={24} />
              </Button>
            </div>
          </div>

          {/* Featured Cards */}
          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredCards.map((card) => (
                <div
                  key={card.id}
                  className={`${card.bgColor} rounded-lg p-4 border-2 ${card.id === 'contact' ? 'border-teal-200' : 'border-transparent'
                    }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{card.icon}</div>
                    <h3 className={`text-sm ${card.textColor}`}>
                      {card.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-xl text-teal-600 mb-4 flex items-center">
                <MapPin className="mr-2" size={20} />
                MEZARLIK ADRESLERİ
              </h3>
            </div>

            <div className="space-y-6 max-h-[60vh] overflow-y-auto">
              {cemeteriesData.map((cemetery) => (
                <Card key={cemetery.id} className="overflow-hidden border-2 border-gray-200 hover:border-teal-200 transition-colors">
                  <CardContent className="p-0">
                    <div className="grid lg:grid-cols-2 gap-0">
                      {/* Left side - Cemetery Info */}
                      <div className="p-6 bg-gray-50">
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg text-teal-700">{cemetery.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {cemetery.type}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            <strong>İlçe:</strong> {cemetery.district}
                          </div>
                        </div>

                        <div className="space-y-3">
                          {/* Address */}
                          <div className="flex items-start space-x-2">
                            <MapPin className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" />
                            <div>
                              <div className="text-sm">
                                <strong>Adres:</strong> {cemetery.address}
                              </div>
                            </div>
                          </div>

                          {/* Phone */}
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-teal-600 flex-shrink-0" />
                            <div className="text-sm">
                              <strong>Telefon:</strong> {cemetery.phone}
                              {cemetery.fax && (
                                <span className="ml-2">
                                  <strong>Fax:</strong> {cemetery.fax}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Working Hours */}
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-teal-600 flex-shrink-0" />
                            <div className="text-sm">
                              <strong>Çalışma Saatleri:</strong> {cemetery.workingHours}
                            </div>
                          </div>

                          {/* Services */}
                          <div className="flex items-start space-x-2">
                            <Users className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" />
                            <div className="text-sm">
                              <strong>Hizmetler:</strong>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {cemetery.services.map((service, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {service}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          {cemetery.description && (
                            <div className="flex items-start space-x-2">
                              <Info className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" />
                              <div className="text-sm">
                                <strong>Açıklama:</strong> {cemetery.description}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex space-x-2 pt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`tel:${cemetery.phone.replace(/\s/g, '')}`)}
                              className="text-teal-600 border-teal-600 hover:bg-teal-50"
                            >
                              <Phone className="w-4 h-4 mr-1" />
                              Ara
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${cemetery.coordinates.lat},${cemetery.coordinates.lng}`;
                                window.open(mapsUrl, '_blank');
                              }}
                              className="text-teal-600 border-teal-600 hover:bg-teal-50"
                            >
                              <MapPin className="w-4 h-4 mr-1" />
                              Haritada Göster
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Right side - Map */}
                      <div className="relative h-64 lg:h-auto">
                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                          {/* Placeholder map - gerçek projede Google Maps embed kullanılabilir */}
                          <div className="text-center text-gray-500">
                            <MapPin className="w-12 h-12 mx-auto mb-2 text-teal-500" />
                            <p className="text-sm">{cemetery.name}</p>
                            <p className="text-xs text-gray-400">
                              {cemetery.coordinates.lat.toFixed(4)}, {cemetery.coordinates.lng.toFixed(4)}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 text-teal-600 border-teal-600"
                              onClick={() => {
                                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${cemetery.coordinates.lat},${cemetery.coordinates.lng}`;
                                window.open(mapsUrl, '_blank');
                              }}
                            >
                              Haritada Aç
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6 border-t">
            <div className="text-center text-sm text-gray-600">
              <p>
                <strong>Not:</strong> Güncel adres ve telefon bilgileri için lütfen ilgili müdürlüklerle iletişime geçiniz.
              </p>
              <p className="mt-2">
                <strong>Acil durumlar için:</strong>
                <a
                  href="tel:02123126585"
                  className="text-teal-600 hover:text-teal-800 ml-2"
                >
                  0212 312 65 85
                </a>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}