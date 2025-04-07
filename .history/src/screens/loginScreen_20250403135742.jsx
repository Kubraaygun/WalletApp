//import liraries
import { useNavigation } from "@react-navigation/native";
import React, { Component, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { width } from "../utils/constants";
import { validationSchema } from "../utils/validationSchema";
import { Formik } from "formik";
validationSchema;

// create a component
const LoginScreen = ({ navigation }) => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = () => {
    if (emailOrPhone && password) {
      navigation.navigate("Home");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Formik
        initialValues={{
          emailOrPhone: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        <TextInput
          placeholder="Email or Phone"
          style={styles.input}
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={[
            styles.button,
            (!emailOrPhone || !password) && styles.disabledButton,
          ]}
          onPress={handleLogin}
          disabled={!password || !emailOrPhone}
        >
          <Text style={{ fontSize: "16", fontWeight: "bold", color: "#fff" }}>
            Login
          </Text>
        </TouchableOpacity>
      </Formik>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: width * 0.7,
    borderWidth: 1,
    borderColor: "#777",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignContent: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    alignContent: "center",
  },
  buttonText: {},
});

//make this component available to the app
export default LoginScreen;
