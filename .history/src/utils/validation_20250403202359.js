import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  emailOrPhone:Yup.string()
  .required("E-posta gerekli")
  .email("Geçersiz e-posta adresi"),
});
  password: Yup.string()
    .required("Parola gerekli")
    .min(8, "Parola en az 8 karakter olmalı")
    .matches(/[a-z]/, "Parola bir küçük harf içermeli")
    .matches(/[A-Z]/, "Parola bir büyük harf içermeli")
    .matches(/[0-9]/, "Parola bir rakam içermeli"),
});
export default validationSchema;
