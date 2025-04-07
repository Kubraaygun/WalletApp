import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../redux/reducers";

const loginValidationSchema = Yup.object().shape({
  emailOrPhone: Yup.string()
    .required("Email veya telefon gereklidir.")
    .matches(/^[0-9]{10}$/, "Geçerli bir telefon numarası girin")
    .email("Geçerli bir e-posta adresi girin"),
  password: Yup.string().required("Şifre gereklidir"),
});

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (values) => {
    setIsLoading(true);
    setTimeout(() => {
      dispatch(setUserDetails(values));
      navigation.navigate("Home");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Formik
        initialValues={{ emailOrPhone: "", password: "" }}
        validationSchema={loginValidationSchema}
        onSubmit={handleLogin}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <TextInput
              placeholder="Email veya Telefon"
              style={styles.input}
              value={values.emailOrPhone}
              onChangeText={handleChange("emailOrPhone")}
              onBlur={handleBlur("emailOrPhone")}
            />
            {touched.emailOrPhone && errors.emailOrPhone && (
              <Text style={styles.errorText}>{errors.emailOrPhone}</Text>
            )}

            <TextInput
              placeholder="Şifre"
              style={styles.input}
              secureTextEntry
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={isLoading || !values.emailOrPhone || !values.password}
            >
              <Text style={styles.buttonText}>Giriş Yap</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: "80%",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16 },
  errorText: { color: "red", fontSize: 12 },
});

export default LoginScreen;
