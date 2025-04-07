import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  emailOrPhone: Yup.string()
    .required("Email veya telefon numarası gerekli")
    .test(
      "email-or-phone",
      "Geçersiz e-posta veya telefon numarası",
      (value) => {
        if (!value) return false;
        const isEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(
          value
        );
        const isPhone = /^[0-9]{10}$/.test(value);
        return isEmail || isPhone ? true : false; // 🟢 undefined döndürmek önemli
      }
    )
    .test(
      "both-email-and-phone",
      "Hem e-posta hem telefon formatında olamaz",
      (value) => {
        if (!value) return true;
        const hasEmail = /@/.test(value);
        const hasOnlyNumbers = /^[0-9]+$/.test(value);
        return !(hasEmail && hasOnlyNumbers) ? true : false;undefined döndürmek önemli
      }
    ),
  password: Yup.string()
    .required("Parola gerekli")
    .min(8, "Parola en az 8 karakter olmalı")
    .matches(/[a-z]/, "Parola bir küçük harf içermeli")
    .matches(/[A-Z]/, "Parola bir büyük harf içermeli")
    .matches(/[0-9]/, "Parola bir rakam içermeli"),
});

export default validationSchema;
