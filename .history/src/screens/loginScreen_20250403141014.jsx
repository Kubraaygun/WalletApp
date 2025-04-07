//import liraries
import { useNavigation } from "@react-navigation/native";
import React, { Component, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
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
              placeholder="Email or Phone"
              style={styles.input}
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
            />
            {touched.emailOrPhone && errors.emailOrPhone && (
              <Text style={styles.errorText}>{errors.emailOrPhone}</Text>
            )}
            <TextInput
              placeholder="Password"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
            <TouchableOpacity
              style={[
                styles.button,
                (!values.emailOrPhone || !values.password) &&
                  styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={!values.emailOrPhone || !values.password}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
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
});

//make this component available to the app
export default LoginScreen;
