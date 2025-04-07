import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  emailOrPhone: Yup.string()
    .required("Email veya telefon numarası gerekli")
    .test(
      "email-or-phone",
      "Geçersiz e-posta veya telefon numarası",
      (value) => {
        if (!value) return false; // Boş bırakılmamalı
        const isEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(
          value
        );
        const isPhone = /^[0-9]{10}$/.test(value); // Sadece 10 haneli rakamlar

        return isEmail || isPhone; // Biri geçerliyse true döner
      }
    )
    .test(
      "both-email-and-phone",
      "Hem e-posta hem telefon formatında olamaz",
      (value) => {
        if (!value) return true; // Eğer zaten boşsa kontrol etme
        const hasEmail = /@/.test(value); // "@" işareti varsa e-posta olabilir
        const hasOnlyNumbers = /^[0-9]+$/.test(value); // Sadece rakam içeriyorsa telefon olabilir
        return !(hasEmail && hasOnlyNumbers); // Eğer ikisi de aynı anda varsa hata döndür
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
