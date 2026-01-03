import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

/**
 * Cihazda biyometrik donanım olup olmadığını kontrol et
 */
export const hasBiometricHardware = async () => {
  try {
    return await LocalAuthentication.hasHardwareAsync();
  } catch (error) {
    console.warn("Biyometrik donanım kontrolü hatası:", error);
    return false;
  }
};

/**
 * Kayıtlı biyometrik veri olup olmadığını kontrol et
 */
export const hasBiometricEnrolled = async () => {
  try {
    return await LocalAuthentication.isEnrolledAsync();
  } catch (error) {
    console.warn("Biyometrik kayıt kontrolü hatası:", error);
    return false;
  }
};

/**
 * Desteklenen biyometrik türlerini getir
 * @returns {Promise<string[]>} Desteklenen türler (FINGERPRINT, FACIAL_RECOGNITION, IRIS)
 */
export const getSupportedBiometricTypes = async () => {
  try {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const typeNames = types.map((type) => {
      switch (type) {
        case LocalAuthentication.AuthenticationType.FINGERPRINT:
          return "FINGERPRINT";
        case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
          return "FACIAL_RECOGNITION";
        case LocalAuthentication.AuthenticationType.IRIS:
          return "IRIS";
        default:
          return "UNKNOWN";
      }
    });
    return typeNames;
  } catch (error) {
    console.warn("Biyometrik tür kontrolü hatası:", error);
    return [];
  }
};

/**
 * Biyometrik doğrulama yap
 * @param {string} promptMessage - Kullanıcıya gösterilecek mesaj
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const authenticateWithBiometric = async (promptMessage = "Kimliğinizi doğrulayın") => {
  try {
    // Önce donanım ve kayıt kontrolü yap
    const hasHardware = await hasBiometricHardware();
    if (!hasHardware) {
      return {
        success: false,
        error: "Cihazınızda biyometrik donanım bulunamadı",
      };
    }

    const isEnrolled = await hasBiometricEnrolled();
    if (!isEnrolled) {
      return {
        success: false,
        error: "Kayıtlı biyometrik veri bulunamadı. Lütfen cihaz ayarlarından Face ID veya Touch ID ekleyin.",
      };
    }

    // Doğrulama yap
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      cancelLabel: "İptal",
      fallbackLabel: "Şifre Kullan",
      disableDeviceFallback: false, // Şifre ile giriş seçeneği aktif
    });

    if (result.success) {
      return { success: true };
    }

    // Hata durumları
    switch (result.error) {
      case "user_cancel":
        return { success: false, error: "Doğrulama iptal edildi" };
      case "lockout":
        return { success: false, error: "Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin." };
      case "not_enrolled":
        return { success: false, error: "Biyometrik veri bulunamadı" };
      default:
        return { success: false, error: result.error || "Doğrulama başarısız" };
    }
  } catch (error) {
    console.error("Biyometrik doğrulama hatası:", error);
    return { success: false, error: "Beklenmeyen bir hata oluştu" };
  }
};

/**
 * Biyometrik girişin etkin olup olmadığını kontrol et
 */
export const isBiometricLoginEnabled = async () => {
  try {
    const enabled = await SecureStore.getItemAsync("biometricLoginEnabled");
    return enabled === "true";
  } catch (error) {
    return false;
  }
};

/**
 * Biyometrik girişi etkinleştir/devre dışı bırak
 */
export const setBiometricLoginEnabled = async (enabled) => {
  try {
    await SecureStore.setItemAsync("biometricLoginEnabled", enabled ? "true" : "false");
    return true;
  } catch (error) {
    console.error("Biyometrik ayar kaydetme hatası:", error);
    return false;
  }
};
