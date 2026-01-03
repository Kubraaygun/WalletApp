# WalletApp

Modern, güvenli ve kullanıcı dostu bir mobil cüzdan uygulaması.

![React Native](https://img.shields.io/badge/React_Native-0.76.9-61DAFB?logo=react)
![Expo](https://img.shields.io/badge/Expo-52-000020?logo=expo)
![License](https://img.shields.io/badge/License-0BSD-green)

---

## ✨ Önizleme (Showcase)

<p align="center">
  <img src="assets/screenshots/showcase_onboarding.png" width="200" alt="Onboarding" />
  <img src="assets/screenshots/showcase_home.png" width="200" alt="Ana Sayfa" />
  <img src="assets/screenshots/showcase_crypto.png" width="200" alt="Kripto Takibi" />
  <img src="assets/screenshots/showcase_stats.png" width="200" alt="İstatistikler" />
</p>

---

## 📱 Özellikler

- **💸 Para Transferi** - Telefon numarasıyla hızlı para gönderme
- **� Harcama Grafikleri** - Aylık harcama analizi ve kategorilendirme
- **🪙 Kripto Takibi** - Canlı kripto para fiyatları ve trendler
- **�📷 QR Kod Tarama** - QR ile anında ödeme başlatma
- **🔐 Biyometrik Giriş** - Face ID / Touch ID desteği
- **� Kart Yönetimi** - Sanal kart oluşturma ve yönetme
- **💱 Döviz Çevirici** - Anlık döviz kuru hesaplama
- **🌍 Çoklu Dil Desteği** - Türkçe ve İngilizce desteği

## 🎨 Tasarım Sistemi

- **Minimal White Tema** - Apple Pay tarzı temiz ve modern arayüz
- **İnteraktif Animasyonlar** - Lottie ve Reanimated ile akıcı geçişler
- **Glassmorphism** - Buzlu cam efektli modern bileşenler
- **Dark Mode Hazırlığı** - Koyu mod uyumlu renk paleti

## 🛠 Teknolojiler

| Kategori         | Teknoloji                     |
| ---------------- | ----------------------------- |
| Framework        | React Native + Expo           |
| State Management | Redux Toolkit + Redux Persist |
| Navigation       | React Navigation              |
| API              | Axios                         |
| Charts           | react-native-chart-kit        |
| Animations       | reanimated + reanimated       |
| Secure Storage   | expo-secure-store             |
| Error Tracking   | Sentry                        |

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+
- npm veya yarn
- Expo CLI
- iOS Simulator (Mac) veya Android Emulator

### Adımlar

```bash
# Repoyu klonla
git clone https://github.com/Kubraaygun/WalletApp.git
cd WalletApp

# Bağımlılıkları yükle
npm install

# Environment dosyasını oluştur
cp .env.example .env

# iOS'ta çalıştır
npm run ios
```

## 🔐 Güvenlik

- Hassas veriler `.env` dosyasında saklanır (gitignore'da)
- Token'lar `expo-secure-store` ile şifrelenir
- API istekleri JWT ile korunur
- Biyometrik doğrulama opsiyonel olarak aktif edilebilir

## 🗺 Yol Haritası

- [x] **Faz 1**: Mimari ve Güvenlik Temelleri
- [x] **Faz 2**: QR Kod ve Biyometrik Giriş
- [x] **Faz 3**: Push Notifications, i18n
- [x] **Faz 4**: Store Yayını Hazırlığı (Sentry, EAS Build)
- [x] **Faz 5**: Tasarım Yenileme (Minimal White) ve Yeni Özellikler

## 📄 Lisans

Bu proje [0BSD](LICENSE) lisansı altındadır.

## 👩‍💻 Geliştirici

**Kübra Aygün**

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
