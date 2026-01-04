import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  emailOrPhone: Yup.string()
    .required("Email veya telefon numarası gerekli")
    .test(
      "email-or-phone",
      "Geçersiz e-posta veya telefon numarası",
      (value) => {
        if (!value) return false;

        const isEmail = value.includes("@");

        const isPhone = /^\d{11}$/.test(value);

        return isEmail || isPhone; // Hem e-posta hem telefon numarası kabul edilir
      }
    )
    .test(
      "both-email-and-phone",
      "Hem e-posta hem telefon formatında olamaz",
      (value) => {
        if (!value) return true;
        const hasEmail = /@/.test(value);
        const hasOnlyNumbers = /^[0-9]+$/.test(value);
        return !(hasEmail && hasOnlyNumbers); // Hem e-posta hem telefon olamaz
      }
    ),
  password: Yup.string()
    .required("Parola gerekli")
    .min(6, "Parola en az 6 karakter olmalı"),
});

export default validationSchema;
