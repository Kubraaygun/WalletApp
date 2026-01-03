import apiClient from "./apiClient";
import * as SecureStore from "expo-secure-store";

/**
 * Kullanıcı girişi
 * @param {string} emailOrPhone - Email veya telefon numarası
 * @param {string} password - Şifre
 */
export const login = async (emailOrPhone, password) => {
  const response = await apiClient.post("/auth/login", {
    emailOrPhone,
    password,
  });

  const { user, accessToken, refreshToken } = response.data;

  // Token'ları güvenli depolamaya kaydet
  await SecureStore.setItemAsync("authToken", accessToken);
  await SecureStore.setItemAsync("refreshToken", refreshToken);

  return { user, token: accessToken };
};

/**
 * Yeni kullanıcı kaydı
 * @param {object} userData - Kullanıcı bilgileri
 */
export const register = async (userData) => {
  const response = await apiClient.post("/auth/register", userData);

  const { user, accessToken, refreshToken } = response.data;

  // Token'ları güvenli depolamaya kaydet
  await SecureStore.setItemAsync("authToken", accessToken);
  await SecureStore.setItemAsync("refreshToken", refreshToken);

  return { user, token: accessToken };
};

/**
 * Kullanıcı çıkışı
 */
export const logout = async () => {
  try {
    // Backend'e logout bildirimi (opsiyonel)
    await apiClient.post("/auth/logout");
  } catch (error) {
    // Logout API hatası olsa bile token'ları temizle
    console.warn("Logout API hatası:", error);
  } finally {
    // Token'ları güvenli depolamadan sil
    await SecureStore.deleteItemAsync("authToken");
    await SecureStore.deleteItemAsync("refreshToken");
  }
};

/**
 * Mevcut kullanıcı bilgilerini getir
 */
export const getCurrentUser = async () => {
  const response = await apiClient.get("/auth/me");
  return response.data;
};

/**
 * Şifre sıfırlama isteği
 * @param {string} email - Email adresi
 */
export const requestPasswordReset = async (email) => {
  const response = await apiClient.post("/auth/forgot-password", { email });
  return response.data;
};

/**
 * Şifre değiştirme
 * @param {string} currentPassword - Mevcut şifre
 * @param {string} newPassword - Yeni şifre
 */
export const changePassword = async (currentPassword, newPassword) => {
  const response = await apiClient.post("/auth/change-password", {
    currentPassword,
    newPassword,
  });
  return response.data;
};
