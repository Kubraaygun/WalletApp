import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

// API Base URL - Environment variable'dan al, yoksa placeholder kullan
const getApiBaseUrl = () => {
  // Expo Constants'tan extra config al
  const extra = Constants.expoConfig?.extra;
  
  // Development modda mock API kullan
  if (__DEV__) {
    return extra?.apiUrl || "http://localhost:3001/api";
  }
  
  // Production'da gerçek API URL
  return extra?.apiUrl || "https://api.walletapp.com/v1";
};

const API_BASE_URL = getApiBaseUrl();

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
      // Secure store erişim hatası - sessizce devam et
      if (__DEV__) {
        console.warn("Token okuma hatası:", error);
      }
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
