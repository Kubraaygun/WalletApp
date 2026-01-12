# 💳 WalletApp

Modern, güvenli ve kullanıcı dostu bir mobil cüzdan uygulaması.

![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?logo=react)
![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo)
![License](https://img.shields.io/badge/License-0BSD-green)

---

## ✨ Özellikler

### 💸 Finansal İşlemler

- **Para Transferi** - Telefon numarasıyla hızlı para gönderme
- **Para Yükleme** - Karttan bakiye yükleme
- **QR Kod Ödeme** - QR ile anında ödeme başlatma
- **İşlem Filtreleme** - Tarih, tutar ve türe göre işlem arama

### 📊 Analiz & Takip

- **Harcama Grafikleri** - Aylık harcama analizi ve kategorilendirme
- **Kripto Takibi** - Canlı kripto para fiyatları ve trendler
- **Döviz Çevirici** - Anlık döviz kuru hesaplama

### 💳 Kart Yönetimi

- **Sanal Kart Oluşturma** - Farklı türlerde sanal kart oluşturma
- **Kart Limitleri** - Günlük/aylık harcama limiti ayarlama
- **Güvenlik Kontrolleri** - Temassız, online ve yurt dışı kullanım ayarları

### 🔐 Güvenlik

- **Biyometrik Giriş** - Face ID / Touch ID desteği
- **256-bit Şifreleme** - Tüm veriler şifrelenmiş
- **Input Sanitizasyonu** - XSS ve injection koruması
- **Güvenli Depolama** - Hassas veriler için Secure Store

### 🎨 Kullanıcı Deneyimi

- **Dark/Light Mode** - Koyu ve açık tema desteği
- **Bildirimler** - Detaylı bildirim merkezi
- **Skeleton Yükleme** - Profesyonel yükleme animasyonları
- **Pull to Refresh** - Sayfayı çekerek yenileme
- **Haptic Feedback** - Dokunsal geri bildirim

### ⚙️ Ayarlar & Profil

- **Profil Düzenleme** - Kullanıcı bilgilerini güncelleme
- **Ayarlar Sayfası** - Tema, bildirim, güvenlik ayarları
- **Çoklu Dil** - Türkçe ve İngilizce desteği

---

## 🎨 Tasarım Sistemi

- **Minimal White Tema** - Apple Pay tarzı temiz ve modern arayüz
- **Premium Gradientler** - Fintech tarzı gradient kartlar
- **İnteraktif Animasyonlar** - Lottie ve Reanimated ile akıcı geçişler
- **Glassmorphism** - Buzlu cam efektli modern bileşenler

---

## 🛠 Teknolojiler

| Kategori         | Teknoloji                     |
| ---------------- | ----------------------------- |
| Framework        | React Native 0.81 + Expo 54   |
| State Management | Redux Toolkit + Redux Persist |
| Navigation       | React Navigation 7            |
| API              | Axios                         |
| Charts           | react-native-chart-kit        |
| Animations       | react-native-reanimated 4     |
| Secure Storage   | expo-secure-store             |
| Error Tracking   | Sentry                        |
| i18n             | i18next + react-i18next       |

---

## 📱 Ekran Görüntüleri

### Ana Ekran

- Balance kartı ile bakiye görüntüleme
- Hızlı işlemler menüsü
- Son işlemler listesi
- Tema değiştirme butonu

### İşlem Filtreleme

- Gelen/Giden filtresi
- Tarih aralığı seçimi
- Tutar aralığı filtresi

### Kart Yönetimi

- Sanal kart oluşturma
- Kart limitleri ayarlama
- Güvenlik kontrolleri

### Ayarlar

- Görünüm ayarları
- Bildirim tercihleri
- Güvenlik seçenekleri
- Hesap yönetimi

---

## 🚀 Kurulum

```bash
# Repoyu klonla
git clone https://github.com/Kubraaygun/WalletApp.git
cd WalletApp

# Bağımlılıkları yükle
npm install --legacy-peer-deps

# Geliştirme sunucusunu başlat
npx expo start --ios --clear

# Android için
npx expo start --android --clear
```

---

## 📁 Proje Yapısı

```
src/
├── components/       # Yeniden kullanılabilir bileşenler
│   ├── homeScreen/   # Ana sayfa bileşenleri
│   └── animations/   # Animasyon bileşenleri
├── screens/          # Uygulama ekranları
├── navigation/       # Navigasyon yapılandırması
├── store/            # Redux store ve slice'lar
├── contexts/         # React context'leri
├── services/         # API ve servisler
├── utils/            # Yardımcı fonksiyonlar
│   ├── colors.js     # Renk paleti
│   ├── typography.js # Tipografi stilleri
│   ├── spacing.js    # Boşluk sistemi
│   └── shadows.js    # Gölge stilleri
└── i18n/             # Çoklu dil dosyaları
```

---

## 🔒 Güvenlik Notları

- Tüm kullanıcı girdileri sanitize edilir
- Hassas veriler Secure Store'da saklanır
- API istekleri HTTPS üzerinden yapılır
- Biyometrik doğrulama desteklenir

---

## 📄 Lisans

Bu proje [0BSD](LICENSE) lisansı altındadır.

---

## 👩‍💻 Geliştirici

**Kübra Aygün**

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
