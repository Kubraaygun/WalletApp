# 💰 WalletApp

Modern, güvenli ve kullanıcı dostu bir mobil cüzdan uygulaması.

![React Native](https://img.shields.io/badge/React_Native-0.76.9-61DAFB?logo=react)
![Expo](https://img.shields.io/badge/Expo-52-000020?logo=expo)
![License](https://img.shields.io/badge/License-0BSD-green)

## 📱 Özellikler

- **💸 Para Transferi** - Telefon numarasıyla hızlı para gönderme
- **📷 QR Kod Tarama** - QR ile anında ödeme başlatma
- **🔐 Biyometrik Giriş** - Face ID / Touch ID desteği
- **📊 İşlem Geçmişi** - Tüm transferlerin takibi
- **🔒 Güvenli Depolama** - Token'lar şifrelenmiş olarak saklanır

## 🛠 Teknolojiler

| Kategori         | Teknoloji                     |
| ---------------- | ----------------------------- |
| Framework        | React Native + Expo           |
| State Management | Redux Toolkit + Redux Persist |
| Navigation       | React Navigation              |
| API              | Axios                         |
| Form Validation  | Formik + Yup                  |
| Secure Storage   | expo-secure-store             |
| Biometric        | expo-local-authentication     |
| Camera/QR        | expo-camera                   |

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

# Android'de çalıştır
npm run android
```

## 📁 Proje Yapısı

```
src/
├── components/       # Yeniden kullanılabilir UI bileşenleri
│   ├── homeScreen/   # Ana sayfa bileşenleri
│   ├── loginScreen/  # Giriş ekranı bileşenleri
│   └── ...
├── navigation/       # React Navigation yapılandırması
├── screens/          # Uygulama ekranları
├── services/         # API ve harici servisler
│   ├── apiClient.js  # Axios instance
│   ├── authService.js
│   ├── walletService.js
│   ├── biometricService.js
│   └── qrService.js
├── store/            # Redux store ve slice'lar
└── utils/            # Yardımcı fonksiyonlar ve sabitler
```

## 🔐 Güvenlik

- Hassas veriler `.env` dosyasında saklanır (gitignore'da)
- Token'lar `expo-secure-store` ile şifrelenir
- API istekleri JWT ile korunur
- Biyometrik doğrulama opsiyonel olarak aktif edilebilir

## 📝 Environment Variables

`.env.example` dosyasını kopyalayarak `.env` oluşturun:

```env
API_BASE_URL=https://api.walletapp.com/v1
API_KEY=your_api_key_here
NODE_ENV=development
```

## 🗺 Yol Haritası

- [x] **Faz 1**: Mimari ve Güvenlik Temelleri
- [x] **Faz 2**: QR Kod ve Biyometrik Giriş
- [ ] **Faz 3**: Push Notifications, i18n
- [ ] **Faz 4**: Store Yayını (App Store / Play Store)

## 📄 Lisans

Bu proje [0BSD](LICENSE) lisansı altındadır.

## 👩‍💻 Geliştirici

**Kübra Aygün**

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
