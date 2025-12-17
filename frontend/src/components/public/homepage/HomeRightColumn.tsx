"use client";

type Props = {};

/**
 * HomeRightColumn (X Emlak)
 * - Kampanya/Duyuru blokları kaldırıldı.
 * - Sadece “Değerleme / Danışmanlık Güvencesi” bölümü kaldı.
 */
export function HomeRightColumn(_props: Props) {
  return (
    <>
      {/* Değerleme / Danışmanlık Güvencesi */}
      <div className="text-center">
        <h2 className="text-lg md:text-xl mb-4 md:mb-6 text-slate-900 leading-tight font-semibold">
          GAYRİMENKUL SATIŞ & KİRALAMADA ŞEFFAF SÜREÇ VE DOĞRU FİYATLANDIRMA!
        </h2>

        <div className="bg-slate-50 border border-slate-200 p-4 md:p-6 rounded-lg mb-4 md:mb-6">
          <p className="text-sm md:text-base leading-relaxed text-gray-700">
            X Emlak ile satış/kiralama sürecinizi güvenle yönetin. Bölgesel emsal analizi,
            doğru fiyat aralığı, profesyonel ilan yönetimi ve hızlı iletişim desteğiyle;
            mülkünüzün değerini en doğru şekilde konumlandırmanıza yardımcı oluyoruz.
            İster satılık, ister kiralık; hedef kitleye doğru kanallardan ulaşmanız için
            süreç boyunca yanınızdayız.
          </p>
        </div>

        <div className="flex justify-center items-center space-x-4 md:space-x-8">
          {/* 1 */}
          <div className="text-center">
            <div className="w-20 h-20 md:w-28 md:h-28 bg-slate-900 rounded-full flex flex-col items-center justify-center text-white mx-auto shadow-lg ring-4 ring-slate-200">
              <svg
                className="w-6 h-6 md:w-8 md:h-8 mb-1"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-xs md:text-sm font-semibold leading-tight">
                Doğru Fiyat
              </span>
            </div>
          </div>

          {/* 2 */}
          <div className="text-center">
            <div className="w-20 h-20 md:w-28 md:h-28 bg-slate-900 rounded-full flex flex-col items-center justify-center text-white mx-auto shadow-lg ring-4 ring-slate-200">
              <svg
                className="w-6 h-6 md:w-8 md:h-8 mb-1"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-10 5h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <span className="text-xs md:text-sm font-semibold leading-tight">
                Şeffaf Süreç
              </span>
            </div>
          </div>

          {/* 3 */}
          <div className="text-center">
            <div className="w-20 h-20 md:w-28 md:h-28 bg-slate-900 rounded-full flex flex-col items-center justify-center text-white mx-auto shadow-lg ring-4 ring-slate-200">
              <svg
                className="w-6 h-6 md:w-8 md:h-8 mb-1"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
              </svg>
              <span className="text-xs md:text-sm font-semibold leading-tight text-center">
                Hızlı
                <br />
                Geri Dönüş
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
