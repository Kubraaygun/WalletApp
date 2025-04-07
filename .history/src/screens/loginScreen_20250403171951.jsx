//import liraries
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { Colors } from "../utils/colors";
import CustomButton from "../components/customButton";
import CustomTextInput from "../components/customTextInput";
import {
  validateEmail,
  validatePassword,
  validatePhone,
} from "../utils/validation";
import Icon from "react-native-vector-icons/Feather";
// create a component
const LoginScreen = ({ navigation }) => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const togglePasswordVisibility = () => {
    setSecureTextEntry((prevState) => !prevState); // secureTextEntry durumunu tersine çevir
  };

  const handleSubmit = () => {
    // E-posta doğrulaması
    if (validateEmail(emailOrPhone)) {
      // E-posta doğrulaması başarıl
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
            size={24}
            color={!secureTextEntry ? Colors.BLACK : Colors.LIGHTGRAY}
          />
        </TouchableOpacity>
      </View>
      {error && <Text style={{ color: "red" }}>{error}</Text>}

      <CustomButton
        title="Login"
        onPress={handleSubmit}
        disabled={isButtonDisabled}
        style={{
          backgroundColor: isButtonDisabled ? Colors.BASEGRAY : Colors.BLACK,
        }}
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
  passwordContainer: {
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    right: 10,

    top: "50%",
    transform: [{ translateY: -17 }],
  },
});

//make this component available to the app
export default LoginScreen;
