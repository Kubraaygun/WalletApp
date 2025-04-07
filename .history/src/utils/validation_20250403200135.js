import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  emailOrPhone: Yup.string()
    .required("Email veya telefon numarası gerekli") // Burada hata mesajı doğru mu?
    .test(
      "email-or-phone",
      "Geçersiz e-posta veya telefon numarası",
      (value) => {
        console.log("Doğrulanan Değer:", value); // Debug için
        return (
          /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value) ||
          /^[0-9]{10}$/.test(value)
        );
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
