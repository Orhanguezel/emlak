# 🚀 Mezarisim.com Deployment Guide

## 📋 Hostinger'e Deploy İçin Adım Adım Rehber

### 1️⃣ **Local Development Setup**

```bash
# Proje klasörüne gidin
cd mezarisim-project

# Bağımlılıkları yükleyin
npm install

# Development server başlatın (opsiyonel test için)
npm run dev

# Production build oluşturun
npm run build
```

### 2️⃣ **Build Çıktısını Kontrol Edin**

```bash
# Build sonrası dist/ klasörü oluşmuş olmalı
ls -la dist/

# İçeriği kontrol edin:
# - index.html
# - assets/ (CSS, JS, images)
# - manifest.json
# - robots.txt
# - sitemap.xml
```

### 3️⃣ **Hostinger'e Upload**

#### **File Manager ile Upload:**

1. **Hostinger Panel → File Manager**
2. **public_html** klasörüne gidin
3. **Tüm mevcut dosyaları silin** (veya backup alın)
4. **dist/ klasöründeki TÜM dosya ve klasörleri public_html'e yükleyin:**
   ```
   public_html/
   ├── index.html
   ├── assets/
   │   ├── css/
   │   ├── js/
   │   └── images/
   ├── icons/
   ├── manifest.json
   ├── robots.txt
   ├── sitemap.xml
   └── .htaccess
   ```

5. **.htaccess dosyasını** `/public/.htaccess`'ten `public_html/`'e kopyalayın

#### **FTP ile Upload (Alternatif):**

```bash
# FTP bilgileri (Hostinger'den alın)
Host: ftp.your-domain.com
Username: your-ftp-username
Password: your-ftp-password
Port: 21
```

### 4️⃣ **Domain ve DNS Ayarları**

#### **Hostinger Domain Panel:**
```
A Record: @ → Server IP
CNAME: www → your-domain.com
```

#### **SSL Sertifikası:**
```
Hostinger Panel → SSL → Let's Encrypt → Activate
```

### 5️⃣ **Performance Optimizations**

#### **Hostinger Panel Ayarları:**
- ✅ **Cloudflare**: Aktifleştir
- ✅ **Gzip Compression**: Aktif
- ✅ **Browser Caching**: 1 ay
- ✅ **LiteSpeed Cache**: Aktif (varsa)

### 6️⃣ **Test Etme**

#### **Functionality Tests:**
```bash
# Ana sayfa
https://mezarisim.com/

# Admin panel (gizli erişim)
https://mezarisim.com/#admin
# veya Ctrl+Shift+A

# Sayfalar
https://mezarisim.com/#models
https://mezarisim.com/#contact
https://mezarisim.com/#about
```

#### **Performance Tests:**
- 🔍 **Google PageSpeed Insights**
- 🔍 **GTmetrix**
- 🔍 **WebPageTest**

### 7️⃣ **SEO Setup**

#### **Google Search Console:**
1. **Sitemap gönder**: `https://mezarisim.com/sitemap.xml`
2. **robots.txt kontrol**: `https://mezarisim.com/robots.txt`
3. **Mobile-friendly test**
4. **Core Web Vitals izleme**

#### **Google Analytics (Opsiyonel):**
```html
<!-- index.html head kısmına ekleyin -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🛠️ **Post-Deployment Düzenleme Rehberi**

### **Kod Güncellemeleri İçin:**

#### **1. Local'de Düzenleme:**
```bash
# Değişiklik yapın
# components/, data/, styles/ klasörlerinde

# Test edin
npm run dev

# Build alın
npm run build
```

#### **2. Hostinger'e Upload:**
```bash
# Sadece değişen dosyaları upload edin
# Örnek: Yeni bir component eklendiyse
# - dist/assets/js/* (yeni JS dosyaları)
# - dist/index.html (güncellenmiş)
```

#### **3. Cache Temizleme:**
```bash
# Hostinger Panel
# - Cloudflare Cache → Purge All
# - Browser'da Ctrl+F5
```

---

## 📱 **Mobile PWA Features**

### **PWA Kurulumu Test:**
- ✅ Android Chrome: "Add to Home Screen"
- ✅ iOS Safari: "Add to Home Screen"  
- ✅ Desktop Chrome: Install app icon

### **Offline Functionality:**
- ✅ Service Worker otomatik aktif
- ✅ Kritik sayfalar cache'leniyor
- ✅ Image cache (Unsplash)

---

## 🔐 **Güvenlik Kontrolü**

### **Admin Panel Security:**
```bash
# Test erişim yöntemleri:
1. https://mezarisim.com/#admin ✅
2. Ctrl+Shift+A ✅  
3. Direct access blocked ✅
```

### **Security Headers:**
```bash ✅
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- HSTS (HTTPS sonrası)
```

---

## 📊 **Monitoring & Analytics**

### **Performance Monitoring:**
```javascript
// Browser console'da kontrol edin:
window.mezarisimPerf.marks
// Çıktı: {html-start: 0, dom-ready: 1200, ...}
```

### **Error Tracking:**
```javascript
// Console'da error olup olmadığını kontrol edin
// Admin panel → Console → Errors
```

---

## 🆘 **Troubleshooting**

### **Yaygın Sorunlar:**

#### **404 Errors:**
```bash
# .htaccess dosyası eksik/yanlış
# Çözüm: /public/.htaccess'i public_html/'e kopyala
```

#### **CSS/JS Yüklenmeme:**
```bash
# Build path problemi
# Çözüm: dist/ içindeki assets/ klasörünü kontrol et
```

#### **Admin Panel Açılmama:**
```bash
# Hash routing problemi
# Çözüm: https://mezarisim.com/#admin (# ile)
```

#### **Mobile Performance:**
```bash
# Slow loading
# Çözüm: Cloudflare aktifleştir, image optimization
```

### **Debug Komutları:**
```bash
# Local test
npm run preview

# Build analysis
npm run build -- --analyze

# Type checking
npm run type-check
```

---

## 📞 **Support & Updates**

### **Future Updates:**
- 📝 Kod değişikliklerini local'de test edin
- 🔄 `npm run build` ile production build alın
- 📤 Sadece değişen dosyaları upload edin
- 🧹 Cache temizleyin

### **Backup Strategy:**
- 💾 Hostinger auto-backup: Daily
- 💾 Manual backup: Deploy öncesi
- 💾 Code backup: Version control (Git)

---

**🎉 Deploy tamamlandı! Site artık https://mezarisim.com adresinde canlı!**

**Admin Panel:** `https://mezarisim.com/#admin` veya `Ctrl+Shift+A`