import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

import tr from "./locales/tr.json";
import en from "./locales/en.json";

const LANGUAGE_KEY = "app_language";

// Dil kaynakları
const resources = {
  tr: { translation: tr },
  en: { translation: en },
};

// Kayıtlı dili al veya cihaz dilini kullan
const getStoredLanguage = async () => {
  try {
    const storedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (storedLang) return storedLang;
    
    // Cihaz dilini kontrol et
    const deviceLang = Localization.locale.split("-")[0];
    return deviceLang === "tr" ? "tr" : "en";
  } catch {
    return "tr";
  }
};

// i18n yapılandırması
i18n.use(initReactI18next).init({
  resources,
  lng: "tr", // Varsayılan dil
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

// Async olarak kayıtlı dili yükle
getStoredLanguage().then((lang) => {
  i18n.changeLanguage(lang);
});

/**
 * Dili değiştir ve kaydet
 */
export const changeLanguage = async (lang) => {
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  await i18n.changeLanguage(lang);
};

/**
 * Mevcut dili al
 */
export const getCurrentLanguage = () => i18n.language;

/**
 * Desteklenen diller
 */
export const supportedLanguages = [
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
];

export default i18n;
