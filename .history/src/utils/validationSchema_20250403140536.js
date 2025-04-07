import * as Yup from "yup";

// Email veya telefon doğrulama için regex
const phoneRegex = /^[0-9]{10}$/; // 10 haneli telefon numarası için

const validationSchema = Yup.object().shape({
  // Email veya telefon doğrulama
  contact: Yup.string()
    .matches(phoneRegex, "Geçerli bir telefon numarası girin")
    .email("Geçerli bir email adresi girin")
    .required("Email veya telefon gereklidir"),

  // Şifre doğrulama
  password: Yup.string()
    .min(6, "Şifre en az 6 karakter olmalı")
    .required("Şifre gereklidir"),
});

export default validationSchema;
