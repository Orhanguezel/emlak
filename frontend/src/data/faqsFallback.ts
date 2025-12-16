export type FaqItem = {
  question: string;
  answer: string;
  slug: string;
  category: string;
  is_active: boolean;
  display_order: number;
};

export const faqsFallback: FaqItem[] = [
  {
    question: "Mezar yapımında bize dair bir şüpheniz bulunmasın",
    answer:
      "25 yılı aşkın tecrübemiz ve binlerce başarılı projemizle İstanbul'da mezar yapımı konusunda güvenilir bir firmayız. Kaliteli malzeme, profesyonel işçilik ve müşteri memnuniyeti garantisi ile hizmet veriyoruz. Tüm işlerimizde İstanbul Büyükşehir Belediyesi standartlarına uygun olarak çalışmaktayız.",
    slug: "mezar-yapiminda-bize-dair-bir-supheniz-bulunmasin",
    category: "Genel",
    is_active: true,
    display_order: 1,
  },
  {
    question:
      "Mezar fiyatları mezar modeline göre değişir mi? Hangi mezar modellerinde fiyat artışı olur?",
    answer:
      "Evet, mezar fiyatları kullanılan malzeme ve mezar modeline göre değişiklik gösterir. Tek kişilik mermer mezar modelleri daha uygun fiyatlıdır. Granit mezar taşı, özel tasarım mezarlar ve büyük boy aile mezarları fiyat artışına neden olur. Detaylı fiyat bilgisi için bizimle iletişime geçebilirsiniz.",
    slug:
      "mezar-fiyatlari-mezar-modeline-gore-degisir-mi-hangi-mezar-modellerinde-fiyat-artisi-olur",
    category: "Genel",
    is_active: true,
    display_order: 2,
  },
  {
    question: "Mezar yapımı fiyatları hangi durumlarda değişir?",
    answer:
      "Mezar fiyatları; mezar boyutuna (tek kişilik, çift kişilik), kullanılan malzemeye (mermer, granit, traverten), mezar modelinin karmaşıklığına, özel tasarım isteklerine ve mezarlık lokasyonuna göre değişiklik gösterir. Ayrıca mezar aksesuarları ve özel işlemler de fiyatı etkiler.",
    slug: "mezar-yapimi-fiyatlari-hangi-durumlarda-degisir",
    category: "Genel",
    is_active: true,
    display_order: 3,
  },
  {
    question: "Mezar yapılmak istediğim zaman ne gibi yollara başvurmalıyım?",
    answer:
      "Öncelikle mezar yapım konusunda araştırma yapmalı, güvenilir firmaları karşılaştırmalısınız. Bizimle iletişime geçerek ücretsiz keşif hizmeti alabilir, mezar modelleri hakkında bilgi edinebilir ve fiyat teklifi talep edebilirsiniz. Sonrasında İstanbul Büyükşehir Belediyesi'nden gerekli izinleri alarak işleme başlayabiliriz.",
    slug: "mezar-yapilmak-istedigim-zaman-ne-gibi-yollara-basvurmaliyim",
    category: "Genel",
    is_active: true,
    display_order: 4,
  },
  {
    question: "Mezar yapımında tercih edilen mezar modelleri nelerdir?",
    answer:
      "Mezar yapımında en çok tercih edilen modeller: Mermer mezar modelleri (ekonomik ve estetik), Granit mezar modelleri (dayanıklı ve uzun ömürlü), Traverten mezar modelleri (doğal görünüm), Lahit tipi mezarlar (klasik ve ihtişamlı), Modern tasarım mezarlar ve özel yapım mezar modelleridir. Her birinin kendine özgü avantajları bulunmaktadır.",
    slug: "mezar-yapiminda-tercih-edilen-mezar-modelleri-nelerdir",
    category: "Genel",
    is_active: true,
    display_order: 5,
  },
  {
    question:
      "Mezar yapımı ve mezar işlerinde mezar yerinin inşaat ruhsatını ne zaman çıkartabilirim?",
    answer:
      "Mezar yapımı için inşaat ruhsatını, cenaze defin işleminden 3 ay sonra İstanbul Büyükşehir Belediyesi'nden çıkartabilirsiniz. Bu süre zorunlu bekleme süresidir. Ruhsat başvurusu sırasında mezar planı, malzeme bilgileri ve teknik çizimler gereklidir. Tüm evrak işlemlerinde size yardımcı olabiliriz.",
    slug:
      "mezar-yapimi-ve-mezar-islerinde-mezar-yerinin-insaat-ruhsatini-ne-zaman-cikartabilirim",
    category: "Genel",
    is_active: true,
    display_order: 6,
  },
  {
    question:
      "Mezar yapımında genellikle hangi mezar modelini tercih edilmektedir?",
    answer:
      "Mezar yapımında en çok tercih edilen model mermer mezar modelleridir çünkü hem estetik hem de ekonomiktir. Ancak dayanıklılık açısından granit mezar modelleri daha uzun ömürlüdür ve hava koşullarına karşı daha dirençlidir. Son yıllarda modern tasarım mezarlar da oldukça popülerdir. Tercih tamamen bütçe ve kişisel beğeniye bağlıdır.",
    slug:
      "mezar-yapiminda-genellikle-hangi-mezar-modelini-tercih-edilmektedir",
    category: "Genel",
    is_active: true,
    display_order: 7,
  },
  {
    question:
      "Mezar yapımında mezarı lahit mezar olarak yaptırmam uygun olur mu?",
    answer:
      "Lahit tipi mezar modeli klasik ve ihtişamlı bir görünüm sunar. Ancak lahit mezar yapımı için İstanbul Büyükşehir Belediyesi'nden özel izin almanız ve ruhsat başvurusu sırasında bu tercihinizi belirtmeniz gerekmektedir. Lahit mezarlar daha fazla alan kaplar ve maliyeti yüksektir, ancak çok estetik ve dayanıklıdır.",
    slug:
      "mezar-yapiminda-mezari-lahit-mezar-olarak-yaptirmam-uygun-olur-mu",
    category: "Genel",
    is_active: true,
    display_order: 8,
  },
  {
    question:
      "Mezar yapımında mermer mezar modellerinden tercih etsem dayanıklı olur mu?",
    answer:
      "Mermer mezar modelleri doğru işçilik ve kaliteli malzeme ile yapıldığında oldukça dayanıklıdır. Mezarisi.com güvencesi ile yapılan mermer mezarlar 10 yıl garanti ile teslim edilir. Düzenli bakım ile mermer mezarlar uzun yıllar kullanılabilir. Ancak en yüksek dayanıklılık için granit mezar modellerini öneririz.",
    slug:
      "mezar-yapiminda-mermer-mezar-modellerinden-tercih-etsem-dayanikli-olur-mu",
    category: "Genel",
    is_active: true,
    display_order: 9,
  },
];
