// src/sections/AccessoryProcessSection.tsx
"use client";
import React from "react";

export default function ProcessSection() {
  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-teal-50 py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-teal-300 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-300 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-300 rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-7xl mx-auto">
          {/* SEO Optimized Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mb-6">
              <span className="text-2xl">🏺</span>
            </div>
            <h2 className="text-4xl text-gray-800 mb-6">
              <strong>İstanbul Mezar Yapımı</strong> Çalışma Sürecimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              <strong>Mezar inşaatı, mezar taşı yapımı ve mezar onarımı</strong> alanında 
              <strong> 25+ yıllık deneyimimizle</strong> <em>profesyonel hizmet süreci</em>. <strong>İstanbul'da kaliteli mezar yapımı</strong> için izlediğimiz 3 aşamalı sistem.
            </p>
          </div>
          
          {/* Process Steps - Modern Card Design */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Step 1: Tasarım ve Keşif */}
            <div className="group relative">
              {/* Connection Line */}
              <div className="hidden lg:block absolute top-24 left-full w-12 h-0.5 bg-gradient-to-r from-teal-500 to-transparent z-10"></div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xl shadow-lg z-10">1</div>
                
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 shadow-md">
                    <span className="text-4xl">🎨</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-200 to-teal-300 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 transform scale-110"></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  <h3 className="text-2xl text-gray-800 mb-4 group-hover:text-teal-600 transition-colors duration-300">
                    <strong>Tasarım ve Keşif</strong>
                  </h3>
                  
                  <div className="space-y-4">
                    <p className="text-gray-600 leading-relaxed">
                      <strong>Ücretsiz mezar keşfi</strong> ve <em>ölçüm hizmeti</em> ile başlar. <strong>Mezar şuluk, vazo, sütun</strong> 
                      tasarımında <em>müşteri isteklerine özel</em> <strong>3D tasarım hazırlama</strong> süreci.
                    </p>
                    
                    <div className="bg-teal-50 p-4 rounded-xl">
                      <h4 className="text-sm text-teal-700 mb-2">📋 Bu Aşamada Yapılanlar:</h4>
                      <ul className="text-xs text-gray-600 space-y-1 text-left">
                        <li>• <strong>Mezar alanı ölçümü</strong> ve aksesuar yerleşimi</li>
                        <li>• <strong>A+ sınıf malzeme</strong> seçimi (mermer, granit)</li>
                        <li>• <em>Şuluk, vazo, sütun</em> tasarım seçenekleri</li>
                        <li>• <strong>3D görselleştirme</strong> ve onay süreci</li>
                        <li>• <em>Şeffaf fiyat teklifi</em> hazırlama</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                      <p className="text-xs text-green-700">
                        ⏱️ <strong>Süre:</strong> 1-2 gün • 🆓 <strong>Keşif Ücretsiz</strong> • 📞 <strong>7/24 Destek</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Üretim ve İşçilik */}
            <div className="group relative">
              {/* Connection Line */}
              <div className="hidden lg:block absolute top-24 left-full w-12 h-0.5 bg-gradient-to-r from-blue-500 to-transparent z-10"></div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl shadow-lg z-10">2</div>
                
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 shadow-md">
                    <span className="text-4xl">🔨</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-300 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 transform scale-110"></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  <h3 className="text-2xl text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    <strong>Üretim ve İşçilik</strong>
                  </h3>
                  
                  <div className="space-y-4">
                    <p className="text-gray-600 leading-relaxed">
                      <strong>25+ yıl deneyimli ustalarımız</strong> ile <em>A+ kalite malzemede</em> üretim. <strong>Mezar şuluk yapımı, 
                      mermer vazo üretimi, granit sütun</strong> işçiliğinde <em>hassas çalışma</em> ve <strong>kalite kontrolü</strong>.
                    </p>
                    
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <h4 className="text-sm text-blue-700 mb-2">🏭 Üretim Aşamaları:</h4>
                      <ul className="text-xs text-gray-600 space-y-1 text-left">
                        <li>• <strong>A+ sınıf malzeme</strong> tedarik ve kalite kontrolü</li>
                        <li>• <em>Profesyonel kesim ve şekillendirme</em></li>
                        <li>• <strong>El işçiliği ve özel detaylar</strong></li>
                        <li>• <em>Cilalama ve yüzey işlemleri</em></li>
                        <li>• <strong>Final kalite kontrol</strong> ve onay süreci</li>
                      </ul>
                    </div>
                    
                    <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
                      <p className="text-xs text-orange-700">
                        ⏱️ <strong>Süre:</strong> 3-7 gün • 🛡️ <strong>5-10 Yıl Garanti</strong> • ✅ <strong>Kalite Onayı</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Kurulum ve Teslim */}
            <div className="group relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-xl shadow-lg z-10">3</div>
                
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 shadow-md">
                    <span className="text-4xl">📍</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-green-300 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 transform scale-110"></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  <h3 className="text-2xl text-gray-800 mb-4 group-hover:text-green-600 transition-colors duration-300">
                    <strong>Kurulum ve Teslim</strong>
                  </h3>
                  
                  <div className="space-y-4">
                    <p className="text-gray-600 leading-relaxed">
                      <strong>Mezarlıkta profesyonel kurulum</strong>, <em>mezar çiçeklendirme</em> ve <strong>son kontroller</strong>. 
                      İstanbul mezarlıklarında <em>garantili montaj hizmeti</em>. <strong>Final kontrolü</strong> ve teslim belgesi.
                    </p>
                    
                    <div className="bg-green-50 p-4 rounded-xl">
                      <h4 className="text-sm text-green-700 mb-2">🏗️ Kurulum Detayları:</h4>
                      <ul className="text-xs text-gray-600 space-y-1 text-left">
                        <li>• <strong>Mezarlık alanında</strong> ve <em>güvenli kurulum</em></li>
                        <li>• <em>Profesyonel montaj ekibi</em> ve yapıştırma</li>
                        <li>• <strong>Mezar çiçeklendirme</strong> ve son düzenleme</li>
                        <li>• <em>Mezar taprağı düzenleme</em> ve <strong>temizlik</strong></li>
                        <li>• <strong>Final kontrolü</strong> ve teslim belgeleri</li>
                      </ul>
                    </div>
                    
                    <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
                      <p className="text-xs text-purple-700">
                        ⏱️ <strong>Süre:</strong> 1-2 gün • 👥 <strong>Garantili Kurulum</strong> • 📄 <strong>Teslim Belgesi</strong>
                      </p>
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
