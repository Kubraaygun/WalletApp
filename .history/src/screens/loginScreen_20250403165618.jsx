//import liraries
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { Colors } from "../utils/colors";
import CustomButton from "../components/customButton";
import CustomTextInput from "../components/customTextInput";
import {
  validateEmail,
  validatePassword,
  validatePhone,
} from "../utils/validation";

// create a component
const LoginScreen = ({ navigation }) => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    // E-posta doğrulaması
    if (validateEmail(emailOrPhone)) {
      // E-posta doğrulaması başarılı
      setError("");
    }
    // Telefon numarası doğrulaması
    else if (validatePhone(emailOrPhone)) {
      // Telefon numarası doğrulaması başarılı
      setError("");
    } else {
      setError("Geçersiz e-posta veya telefon numarası.");
      return;
    }

    // Parola doğrulaması
    if (!validatePassword(password)) {
      setError(
        "Parola en az 8 karakter olmalı, bir büyük harf, bir küçük harf ve bir rakam içermeli."
      );
      return;
    }
    setError("");
    navigation.navigate("HomeScreen");
  };

  // Butonun aktif olup olmaması için emailOrPhone ve password değerlerinin dolu olup olmadığını kontrol et
  const isButtonDisabled = !emailOrPhone || !password || error;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <CustomTextInput
        placeholder="Email or Phone"
        value={emailOrPhone}
        onChangeText={setEmailOrPhone}
      />
      <CustomTextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      <CustomButton
        title="Login"
        onPress={handleSubmit}
        disabled={isButtonDisabled}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    marginBottom: 20,
    backgroundColor: Colors.PRIMARY,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
});

//make this component available to the app
export default LoginScreen;
