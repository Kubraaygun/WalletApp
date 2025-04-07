// utils/validation.js

// E-posta doğrulama fonksiyonu
export const validateEmail = (value) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(value);
};

// Telefon numarası doğrulama fonksiyonu
export const validatePhone = (value) => {
  const phoneRegex = /^0?[1-9][0-9]{9}$/; // 10 haneli telefon numarası formatı
  return phoneRegex.test(value);
};

export const validatePassword = (value) => {
  // Büyük harf, küçük harf, rakam ve özel karakterler için genişletilmiş regex
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&._-]{8,}$/;
  return passwordRegex.test(value);
};
