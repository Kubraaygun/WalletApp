import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../utils/colors";
import CustomButton from "../components/customButton";
import CustomTextInput from "../components/customTextInput";
import { Formik } from "formik";
import Icon from "react-native-vector-icons/Feather";
import validationSchema from "../utils/validationSchema"; //

const LoginScreen = ({ navigation }) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const togglePasswordVisibility = () => {
    setSecureTextEntry((prevState) => !prevState);
  };

  return (
    <View style={styles.container}>
      <Icon name="user" size={60} style={styles.iconStyle} />

      <Text style={styles.title}>Welcome</Text>

      <Formik
        initialValues={{ emailOrPhone: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          navigation.navigate("HomeScreen"); // Giriş başarılı ise Home ekranına yönlendir
        }}
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
              value={values.emailOrPhone}
              onChangeText={handleChange("emailOrPhone")}
              onBlur={handleBlur("emailOrPhone")}
            />
            {touched.emailOrPhone && errors.emailOrPhone && (
              <Text style={styles.errorText}>{errors.emailOrPhone}</Text>
            )}

            <View style={styles.passwordContainer}>
              <CustomTextInput
                placeholder="Password"
                secureTextEntry={secureTextEntry}
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
              />
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
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <CustomButton
              title="Login"
              onPress={handleSubmit}
              disabled={!values.emailOrPhone || !values.password}
              style={{
                backgroundColor:
                  !values.emailOrPhone || !values.password
                    ? Colors.BASEGRAY
                    : Colors.BLACK, // Buton rengi aktif değilse gri olur
              }}
            />
          </>
        )}
      </Formik>
    </View>
  );
};

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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});

export default LoginScreen;
