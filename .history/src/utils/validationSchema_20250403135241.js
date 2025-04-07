import * as Yup from "yup";

// Yup ile doğrulama şeması
export const validationSchema = Yup.object({
  emailOrPhone: Yup.string()
    .required("Email or Phone number is required")
    .test(
      "email-or-phone",
      "Invalid email or phone number format",
      (value) =>
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value) ||
        /^[0-9]{10}$/.test(value) // 10 haneli telefon numarası kontrolü
    ),
  password: Yup.string().required("Password is required"),
});
