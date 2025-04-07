//import liraries
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Colors } from "../utils/colors";
import CustomButton from "../components/customButton";
import CustomTextInput from "../components/customTextInput";
import {
  validateEmail,
  validatePassword,
  validatePhone,
} from "../utils/validation";
import Icon from "react-native-vector-icons/Feather";
import { Formik } from "formik";
import validationSchema from "../utils/validationSchema";
// create a component
const LoginScreen = ({ navigation }) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const togglePasswordVisibility = () => {
    // secureTextEntry durumunu tersine çevir
    setSecureTextEntry((prevState) => !prevState);
  };
  useEffect(() => {
    // Email veya telefon numarası değiştiğinde, hata mesajını temizle
    if (
      emailOrPhone &&
      !validateEmail(emailOrPhone) &&
      !validatePhone(emailOrPhone)
    ) {
      setError("Geçersiz e-posta veya telefon numarası.");
    } else {
      setError(""); // Hata yoksa error state sıfırlanır
    }
  });
  const handleSubmit = () => {
    if (
      emailOrPhone &&
      !validateEmail(emailOrPhone) &&
      !validatePhone(emailOrPhone) // Telefon numarasının geçerli olup olmadığı kontrol ediliyor
    ) {
      setError("Geçersiz e-posta veya telefon numarası.");
      return;
    } else {
      setError(""); // Hata yoksa, error state sıfırlanır
    }

    if (!validatePassword(password)) {
      setError(
        "Parola en az 8 karakter olmalı, bir büyük harf, bir küçük harf ve bir rakam içermeli."
      );
      return;
    }

    setError(""); // Başka bir hata yoksa
    navigation.navigate("Home"); // Başarılıysa ana sayfaya geçiş yapılır
  };

  const isButtonDisabled = !emailOrPhone || !password || error;

  return (
    <View style={styles.container}>
      <Icon name="user" size={60} style={styles.iconStyle} />

      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.title}></Text>

      <Formik
        initialValues={{ emailOrPhone: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
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
            <CustomTextInput
              placeholder="Email or Phone"
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
            />
            <View style={styles.passwordContainer}>
              <CustomTextInput
                placeholder="Password"
                secureTextEntry={secureTextEntry}
                value={password}
                onChangeText={setPassword}
              />
              {/* Göz ikonu */}
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={togglePasswordVisibility}
              >
                <Icon
                  name={secureTextEntry ? "eye-off" : "eye"}
                  size={22}
                  color={!secureTextEntry ? Colors.BLACK : Colors.LIGHTGRAY}
                />
              </TouchableOpacity>
            </View>
            {error && <Text style={{ color: "red" }}>{error}</Text>}
            <CustomButton
              title="Login"
              onPress={isButtonDisabled ? null : handleSubmit} // Eğer buton disabled ise onPress işlevi çağrılmaz
              disabled={isButtonDisabled}
              style={{
                backgroundColor: isButtonDisabled
                  ? Colors.BASEGRAY
                  : Colors.BLACK, // Buton rengi aktif olduğunda siyah, değilse gri
              }}
            />{" "}
          </>
        )}
      </Formik>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 40,
    marginBottom: 20,
    backgroundColor: Colors.PRIMARY,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  passwordContainer: {
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -17 }],
  },
  iconStyle: {
    position: "absolute",
    top: 170, // "Welcome" başlığının üstünde kalacak şekilde ayarladık
    left: "50%",
    transform: [{ translateX: 10 }], // icon'u ortalamak için
  },
});

//make this component available to the app
export default LoginScreen;
