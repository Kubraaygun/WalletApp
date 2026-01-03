import axios from "axios";
import * as SecureStore from "expo-secure-store";

// API Base URL - Production'da environment variable olarak ayarlanmalı
const API_BASE_URL = "https://api.walletapp.com/v1"; // Placeholder

// Axios instance oluştur
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor - Her istekte token ekle
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn("Token okuma hatası:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Hata yönetimi ve token yenileme
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        if (refreshToken) {
          // Token yenileme isteği
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, newRefreshToken } = response.data;

          // Yeni token'ları kaydet
          await SecureStore.setItemAsync("authToken", accessToken);
          if (newRefreshToken) {
            await SecureStore.setItemAsync("refreshToken", newRefreshToken);
          }

          // Orijinal isteği yeni token ile tekrarla
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token da geçersizse logout yap
        await SecureStore.deleteItemAsync("authToken");
        await SecureStore.deleteItemAsync("refreshToken");
        // Navigation reset işlemi burada yapılabilir
        return Promise.reject(refreshError);
      }
    }

    // Diğer hatalar için standart hata objesi döndür
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Bir hata oluştu. Lütfen tekrar deneyin.";

    return Promise.reject({
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data,
    });
  }
);

export default apiClient;
