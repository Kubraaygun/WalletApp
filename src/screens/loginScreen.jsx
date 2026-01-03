import React, { useState } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
} from "react-native";
import { Formik } from "formik";
import Icon from "react-native-vector-icons/Feather";
import { Colors } from "../utils/colors";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";
import validationSchema from "../utils/validation";

// Components
import LoginHeader from "../components/loginScreen/loginHeader";
import EmailOrPhoneInput from "../components/loginScreen/emailOrPhoneInput";
import PasswordInput from "../components/loginScreen/passwordInput";
import CustomButton from "../components/customButton";

const LoginScreen = ({ navigation }) => {
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (values) => {
    navigation.navigate("HomeScreen");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.BACKGROUND} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Logo */}
          <LoginHeader />

          {/* Login Form */}
          <View style={styles.formContainer}>
            <Formik
              initialValues={{ emailOrPhone: "", password: "" }}
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
                <View style={styles.form}>
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
                  />

                  {/* Remember Me & Forgot Password */}
                  <View style={styles.optionsRow}>
                    <TouchableOpacity
                      style={styles.rememberMe}
                      onPress={() => setRememberMe(!rememberMe)}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          rememberMe && styles.checkboxChecked,
                        ]}
                      >
                        {rememberMe && (
                          <Icon name="check" size={12} color={Colors.WHITE} />
                        )}
                      </View>
                      <Text style={styles.rememberText}>Beni hatırla</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                      <Text style={styles.forgotPassword}>Şifremi unuttum</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Login Button */}
                  <CustomButton
                    title="Giriş Yap"
                    onPress={handleSubmit}
                    variant="primary"
                    size="lg"
                    disabled={!values.emailOrPhone || !values.password}
                    style={styles.loginButton}
                  />

                  {/* Biometric Login */}
                  <TouchableOpacity style={styles.biometricButton}>
                    <Icon
                      name="smartphone"
                      size={IconSize.md}
                      color={Colors.ACCENT}
                    />
                    <Text style={styles.biometricText}>
                      Face ID ile giriş yap
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Hesabınız yok mu?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
              <Text style={styles.signUpText}> Kayıt Ol</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
  },
  formContainer: {
    flex: 1,
  },
  form: {
    marginTop: Spacing.md,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.GRAY_300,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.xs,
  },
  checkboxChecked: {
    backgroundColor: Colors.ACCENT,
    borderColor: Colors.ACCENT,
  },
  rememberText: {
    ...TextStyles.bodySmall,
    color: Colors.TEXT_SECONDARY,
  },
  forgotPassword: {
    ...TextStyles.labelMedium,
    color: Colors.ACCENT,
  },
  loginButton: {
    marginTop: Spacing.xs,
  },
  biometricButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  biometricText: {
    ...TextStyles.labelMedium,
    color: Colors.ACCENT,
    marginLeft: Spacing.xs,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: Spacing.xl,
  },
  footerText: {
    ...TextStyles.bodyMedium,
    color: Colors.TEXT_SECONDARY,
  },
  signUpText: {
    ...TextStyles.labelLarge,
    color: Colors.ACCENT,
  },
});

export default LoginScreen;
