import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Colors } from "../utils/colors";
import CustomButton from "../components/customButton";
import { Formik } from "formik";
import validationSchema from "../utils/validation";
import LoginHeader from "../components/login/LoginHeader";
import EmailOrPhoneInput from "../components/login/EmailOrPhoneInput";
import PasswordInput from "../components/login/PasswordInput";

const LoginScreen = ({ navigation }) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: Colors.PRIMARY }}
    >
      <View style={styles.container}>
        <LoginHeader />
        <Formik
          initialValues={{ emailOrPhone: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => navigation.navigate("HomeScreen")}
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
              <EmailOrPhoneInput
                value={values.emailOrPhone}
                onChangeText={handleChange("emailOrPhone")}
                onBlur={handleBlur("emailOrPhone")}
                error={touched.emailOrPhone && errors.emailOrPhone}
              />
              <PasswordInput
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                error={touched.password && errors.password}
                secureTextEntry={secureTextEntry}
                toggleVisibility={togglePasswordVisibility}
              />
              <CustomButton
                title="Login"
                onPress={handleSubmit}
                disabled={!values.emailOrPhone || !values.password}
                style={{
                  backgroundColor:
                    !values.emailOrPhone || !values.password
                      ? Colors.BASEGRAY
                      : Colors.BLACK,
                }}
              />
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
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
});

export default LoginScreen;
