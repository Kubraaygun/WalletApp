import * as Sentry from "@sentry/react-native";

/**
 * Sentry'yi başlat
 * NOT: Production'da gerçek DSN kullanılmalı
 */
export const initSentry = () => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN || "",
    
    // Performans izleme
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,
    
    // Development modda devre dışı bırak
    enabled: !__DEV__,
    
    // Kullanıcı geri bildirimlerini etkinleştir
    enableAutoSessionTracking: true,
    
    // Native crash raporlama
    enableNativeCrashHandling: true,
    
    // Breadcrumbs
    enableAutoPerformanceTracing: true,
    
    // Environment
    environment: __DEV__ ? "development" : "production",
    
    // Debug modda detaylı log
    debug: __DEV__,
  });
};

/**
 * Kullanıcı bilgisini Sentry'ye kaydet
 */
export const setUser = (user) => {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.name,
    });
  } else {
    Sentry.setUser(null);
  }
};

/**
 * Manuel hata raporla
 */
export const captureException = (error, context = {}) => {
  Sentry.captureException(error, {
    extra: context,
  });
};

/**
 * Manuel mesaj raporla
 */
export const captureMessage = (message, level = "info") => {
  Sentry.captureMessage(message, level);
};

/**
 * Breadcrumb ekle (kullanıcı aksiyonlarını takip)
 */
export const addBreadcrumb = (category, message, data = {}) => {
  Sentry.addBreadcrumb({
    category,
    message,
    data,
    level: "info",
  });
};

/**
 * Transaction başlat (performans izleme)
 */
export const startTransaction = (name, op = "navigation") => {
  return Sentry.startTransaction({ name, op });
};

/**
 * Sentry HOC wrapper
 */
export const withSentry = Sentry.wrap;

export default Sentry;
