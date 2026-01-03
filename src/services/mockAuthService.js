/**
 * Mock Authentication Service
 * AsyncStorage tabanlı yerel auth sistemi
 * Backend hazır olduğunda authService.js ile değiştirilebilir
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const USERS_KEY = "@wallet_users";
const CURRENT_USER_KEY = "@wallet_current_user";

/**
 * Kayıtlı kullanıcıları getir
 */
const getUsers = async () => {
  try {
    const usersJson = await AsyncStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
};

/**
 * Kullanıcıları kaydet
 */
const saveUsers = async (users) => {
  try {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Error saving users:", error);
    throw error;
  }
};

/**
 * Yeni kullanıcı kaydı
 */
export const register = async ({ name, email, phone, password }) => {
  const users = await getUsers();

  // Email kontrolü
  const existingUser = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (existingUser) {
    throw new Error("Bu email adresi zaten kayıtlı");
  }

  // Telefon kontrolü
  const existingPhone = users.find((u) => u.phone === phone);
  if (existingPhone) {
    throw new Error("Bu telefon numarası zaten kayıtlı");
  }

  // Yeni kullanıcı oluştur
  const newUser = {
    id: `user_${Date.now()}`,
    name,
    email: email.toLowerCase(),
    phone,
    password, // Gerçek uygulamada hash'lenmeli!
    createdAt: new Date().toISOString(),
    balance: 5000, // Başlangıç bakiyesi (demo için)
  };

  users.push(newUser);
  await saveUsers(users);

  return {
    success: true,
    message: "Kayıt başarılı",
    user: { id: newUser.id, name: newUser.name, email: newUser.email },
  };
};

/**
 * Kullanıcı girişi
 */
export const login = async ({ emailOrPhone, password }) => {
  const users = await getUsers();

  // Email veya telefon ile kullanıcı bul
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === emailOrPhone.toLowerCase() ||
      u.phone === emailOrPhone
  );

  if (!user) {
    throw new Error("Kullanıcı bulunamadı");
  }

  if (user.password !== password) {
    throw new Error("Şifre hatalı");
  }

  // Token oluştur (mock)
  const token = `mock_token_${user.id}_${Date.now()}`;

  // Token'ı SecureStore'a kaydet
  await SecureStore.setItemAsync("authToken", token);
  await SecureStore.setItemAsync("userId", user.id);

  // Current user bilgisini kaydet
  await AsyncStorage.setItem(
    CURRENT_USER_KEY,
    JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      balance: user.balance,
    })
  );

  return {
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      balance: user.balance,
    },
  };
};

/**
 * Çıkış yap
 */
export const logout = async () => {
  try {
    await SecureStore.deleteItemAsync("authToken");
    await SecureStore.deleteItemAsync("userId");
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

/**
 * Mevcut kullanıcıyı getir
 */
export const getCurrentUser = async () => {
  try {
    const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

/**
 * Token geçerliliğini kontrol et
 */
export const validateToken = async () => {
  try {
    const token = await SecureStore.getItemAsync("authToken");
    const userId = await SecureStore.getItemAsync("userId");

    if (!token || !userId) {
      return { valid: false };
    }

    const users = await getUsers();
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return { valid: false };
    }

    return {
      valid: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        balance: user.balance,
      },
    };
  } catch (error) {
    console.error("Token validation error:", error);
    return { valid: false };
  }
};

/**
 * Kullanıcı bakiyesini güncelle
 */
export const updateBalance = async (userId, newBalance) => {
  const users = await getUsers();
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    throw new Error("Kullanıcı bulunamadı");
  }

  users[userIndex].balance = newBalance;
  await saveUsers(users);

  // Current user'ı da güncelle
  const currentUser = await getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    currentUser.balance = newBalance;
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
  }

  return { success: true, balance: newBalance };
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  validateToken,
  updateBalance,
};
