# Slider Yönetimi - Admin Paneli İçin Notlar

## Genel Bakış
Ana sayfa hero bölümündeki slider sistemi, gelecekte admin paneli üzerinden kolayca yönetilebilir şekilde tasarlanmıştır.

## Veri Yapısı

### SlideData Interface
```typescript
interface SlideData {
  id: number;           // Benzersiz kimlik
  image: string;        // Resim URL'i
  alt: string;          // Alt metin (SEO için önemli)
  title?: string;       // Başlık (opsiyonel)
  description?: string; // Açıklama (opsiyonel)
  isActive: boolean;    // Aktif/pasif durumu
  order: number;        // Sıralama
}
```

## Admin Paneli İçin Gerekli Özellikler

### 1. Slider Listesi
- Tüm slider'ları listele
- Aktif/pasif durumlarını göster
- Sıralama ile görüntüle

### 2. Slider Ekleme
- Yeni resim yükleme
- Alt metin girişi
- Başlık ve açıklama (opsiyonel)
- Sıralama belirleme
- Aktif/pasif durumu seçme

### 3. Slider Düzenleme
- Mevcut slider bilgilerini güncelleme
- Resim değiştirme
- Sıralama değiştirme
- Aktif/pasif durumu değiştirme

### 4. Slider Silme
- Slider'ı tamamen kaldırma
- Onay penceresi gösterme

### 5. Sıralama
- Drag & drop ile sıralama
- Yukarı/aşağı butonları ile sıralama
- Otomatik order değeri güncelleme

## Kullanılabilir Fonksiyonlar

### `useActiveSlidesRtk()`
Sadece aktif olan slider'ları sıralı şekilde döner.

### `updateSlideData(id, updates)`
Belirli bir slider'ın bilgilerini günceller.

### `addNewSlide(slideData)`
Yeni slider ekler ve benzersiz ID atar.

### `deleteSlide(id)`
Belirli bir slider'ı siler.

## API Entegrasyonu İçin Öneriler

### Endpoints
- `GET /api/slides` - Tüm slider'ları getir
- `POST /api/slides` - Yeni slider ekle
- `PUT /api/slides/:id` - Slider güncelle
- `DELETE /api/slides/:id` - Slider sil
- `PUT /api/slides/reorder` - Sıralama güncelle

### Dosya Yükleme
- Resim dosyalarını cloud storage'a yükle (AWS S3, Cloudinary vb.)
- Optimizasyon (WebP formatı, farklı boyutlar)
- Alt metin ve başlık bilgilerini kaydet

## Güvenlik Notları
- Yalnızca yetkilendirilmiş kullanıcılar slider yönetebilmeli
- Dosya yükleme sırasında güvenlik kontrolü yapılmalı
- Maksimum dosya boyutu sınırı konulmalı
- Sadece resim dosyaları kabul edilmeli

## Performans Önerileri
- Resimler lazy loading ile yüklensin
- CDN kullanılması önerilir
- Resim optimizasyonu otomatik yapılmalı
- Maksimum 15 slider önerilir (performans için)

## Mevcut Durum
Şu anda 10 adet örnek slider bulunmaktadır. Tümü aktif durumdadır ve 4 saniyede bir otomatik geçiş yapmaktadır.

## Gelecek Geliştirmeler
- Admin paneli arayüzü
- Resim yükleme sistemi
- Database entegrasyonu
- Slider analytics (görüntülenme sayıları vb.)
- Responsive slider boyutları
- Video slider desteği