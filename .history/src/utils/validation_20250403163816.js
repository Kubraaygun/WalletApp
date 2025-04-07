// utils/validation.js

// E-posta doğrulama fonksiyonu
export const validateEmail = (value) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(value);
};

// Telefon numarası doğrulama fonksiyonu
export const validatePhone = (value) => {
  const phoneRegex = /^[0-9]{10}$/; // 10 haneli telefon numarası formatı
  return phoneRegex.test(value);
};

// Parola doğrulama fonksiyonu
export const validatePassword = (value) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

  return passwordRegex.test(value);
};
