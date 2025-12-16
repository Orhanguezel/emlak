import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import backgroundImage from "figma:asset/0a9012ca17bfb48233c0877277b7fb8427a12d4c.png";
import { useListFaqsQuery } from "@/integrations/rtk/endpoints/faqs.endpoints";
import { faqsFallback } from "@/data/faqsFallback";
import type { Faq } from "@/integrations/rtk/types/faqs";

interface FAQPageProps {
  onNavigate: (page: string) => void;
}

type FaqLike = Partial<Faq> & { question: string; answer: string };

function normalizeFaqs(list: FaqLike[]): Faq[] {
  return list.map((item, i) => {
    const slug =
      item.slug ??
      item.question
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 80);

    // Zorunlu alanlar
    const base: Omit<Faq, "created_at" | "updated_at"> = {
      id: item.id ?? `faq-fallback-${i}`,
      slug: slug || `faq-fallback-${i}`,
      question: item.question,
      answer: item.answer,
      category:
        typeof item.category === "string" ? item.category : item.category ?? null,
      is_active: typeof item.is_active === "boolean" ? item.is_active : true,
      display_order:
        typeof item.display_order === "number"
          ? item.display_order
          : Number.isFinite(item.display_order as any)
            ? Number(item.display_order)
            : i + 1,
    };

    // Opsiyonelleri sadece string ise ekle
    const withDates: Faq = {
      ...base,
      ...(typeof item.created_at === "string" ? { created_at: item.created_at } : {}),
      ...(typeof item.updated_at === "string" ? { updated_at: item.updated_at } : {}),
    };

    return withDates;
  });
}


export function FAQPage({ onNavigate }: FAQPageProps) {
  const { data, isLoading, isError } = useListFaqsQuery({
    active: true,
    limit: 200,
    orderBy: "display_order",
    order: "asc",
  });

  const source: FaqLike[] =
    !isError && Array.isArray(data) && data.length > 0 ? (data as FaqLike[]) : (faqsFallback as FaqLike[]);

  const faqs: Faq[] = normalizeFaqs(source);

  return (
    <div className="min-h-screen">
      {/* Hero section with green background */}
      <div
        className="relative bg-teal-500 py-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-teal-500 bg-opacity-90"></div>
        <div className="relative container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <nav className="flex items-center space-x-2 text-sm mb-4">
                <button onClick={() => onNavigate("home")} className="hover:text-teal-200 transition-colors">
                  Anasayfa
                </button>
                <span>&gt;</span>
                <span>Mezar Yapımında Sık Sorulan Sorular</span>
              </nav>
              <h1 className="text-4xl mb-2">Mezar Yapımında Sık Sorulan Sorular</h1>
              <p className="text-lg opacity-90">Anasayfa &gt; Mezar Yapımında Sık Sorulan Sorular</p>
            </div>

            <div className="hidden lg:block">
              <div className="w-48 h-32 flex items-center justify-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-4xl text-white">?</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="mt-6 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-white text-sm">
              Yükleniyor…
            </div>
          )}
          {isError && (
            <div className="mt-6 inline-flex items-center rounded-md bg-red-500/20 px-3 py-1 text-white text-sm">
              API hatası—yerel içerik gösteriliyor.
            </div>
          )}
        </div>
      </div>

      {/* Content section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-teal-500 mb-4">MEZAR YAPIMINDA BİZE DAİR BİR ŞÜPHENİZ BULUNMASIN</h2>
              <p className="text-gray-700 text-lg font-medium mb-6">
                Değerli müşterilerimizin mezar yapımı konusunda en sık karşılaştığı sorunları derledik ve size sunuyoruz.
              </p>
            </div>

            {/* FAQ Accordion */}
            <div className="mb-16">
              <Accordion type="single" collapsible className="w-full space-y-2">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={faq.id || faq.slug || `item-${index}`}
                    value={`item-${index}`}
                    className="border border-gray-200 rounded-lg px-4"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-4">
                      <span className="text-gray-800 font-semibold text-base">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-3 accordion-content-limited">
                      <div className="text-gray-700 leading-relaxed font-medium text-base">{faq.answer}</div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Contact Information and Map Section */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-xl text-teal-500 mb-6">Mezarisim.com</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="order-2 lg:order-1">
                  <div className="w-full h-64 rounded-lg shadow-lg overflow-hidden relative">
                    <iframe
                      src="https://maps.google.com/maps?q=Hekimba%C5%9F%C4%B1%20Mahallesi%20Y%C4%B1ld%C4%B1ztepe%20Caddesi%20No%3A31%20%C3%9Cmraniye%20%C4%B0stanbul&output=embed&z=16"
                      width="100%"
                      height="256"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Mezarisi.com Konum - Hekimbaşı Mah. Yıldıztepe Cad. No:31 Ümraniye/İstanbul"
                    ></iframe>

                    <div className="absolute top-2 right-2">
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=Hekimba%C5%9F%C4%B1+Mahallesi+Y%C4%B1ld%C4%B1ztepe+Caddesi+No%3A31+%C3%9Cmraniye+%C4%B0stanbul"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-teal-500 px-3 py-1 rounded shadow-md hover:bg-teal-50 transition-colors text-xs"
                      >
                        🔗 Büyük Görünüm
                      </a>
                    </div>
                  </div>
                </div>

                <div className="order-1 lg:order-2">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg text-gray-800 mb-2">İletişim Bilgileri</h4>
                    </div>

                    <div className="flex items-start space-x-3">
                      <span className="text-teal-500 mt-1">📍</span>
                      <div>
                        <p className="text-gray-700">
                          <strong>Adres:</strong>
                          <br />
                          Hekimbaşı Mah. Yıldıztepe Cad. No:31 Ümraniye/İstanbul
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-teal-500">📞</span>
                      <div>
                        <p className="text-gray-700">
                          <strong>Cep Telefonu:</strong>
                          <br />
                          <a href="tel:+905334838971" className="text-teal-500 hover:text-teal-600">
                            0533 483 89 71
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-teal-500">✉️</span>
                      <div>
                        <p className="text-gray-700">
                          <strong>E-posta:</strong>
                          <br />
                          <a href="mailto:mezarisim.com@gmail.com" className="text-teal-500 hover:text-teal-600">
                            mezarisim.com@gmail.com
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                      <a href="tel:+905334838971" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors text-center">
                        📞 Hemen Ara
                      </a>
                    </div>

                    <div className="pt-3">
                      <a
                        href="https://wa.me/905334838971?text=Merhaba,%20mezar%20yapımı%20hakkında%20bilgi%20almak%20istiyorum."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors w-full text-center flex items-center justify-center"
                      >
                        💬 WhatsApp ile İletişim
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
