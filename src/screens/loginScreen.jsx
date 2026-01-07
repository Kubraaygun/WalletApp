import React, { useState, useEffect } from "react";
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
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import { Feather as Icon } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";
import validationSchema from "../utils/validation";
import { authSuccess } from "../store/authSlice";
import { biometricService } from "../services";

// Components
import LoginHeader from "../components/loginScreen/loginHeader";
import EmailOrPhoneInput from "../components/loginScreen/emailOrPhoneInput";
import PasswordInput from "../components/loginScreen/passwordInput";
import CustomButton from "../components/customButton";
import mockAuthService from "../services/mockAuthService";

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState("Face ID");

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const hasHardware = await biometricService.hasBiometricHardware();
    const isEnrolled = await biometricService.hasBiometricEnrolled();
    const isEnabled = await biometricService.isBiometricLoginEnabled();
    
    setBiometricAvailable(hasHardware && isEnrolled && isEnabled);
    
    const types = await biometricService.getSupportedBiometricTypes();
    if (types.includes("FACIAL_RECOGNITION")) {
      setBiometricType("Face ID");
    } else if (types.includes("FINGERPRINT")) {
      setBiometricType("Touch ID");
    }
  };

  const handleLogin = async (values) => {
    setIsLoading(true);
    try {
      const result = await mockAuthService.login({
        emailOrPhone: values.emailOrPhone,
        password: values.password,
      });
      
      dispatch(authSuccess({
        user: result.user,
        token: result.token,
      }));
    } catch (error) {
      Alert.alert("Giris Hatasi", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    const result = await biometricService.authenticateWithBiometric(
      `${biometricType} ile giris yapin`
    );

    if (result.success) {
      dispatch(authSuccess({
        user: { name: "Kubra", email: "biometric@example.com" },
        token: "biometric_token_12345",
      }));
    } else {
      Alert.alert("Dogrulama Basarisiz", result.error);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.BACKGROUND }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.BACKGROUND} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
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
                setFieldValue,
                setFieldTouched,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View style={styles.form}>
                  <EmailOrPhoneInput
                    value={values.emailOrPhone}
                    onChangeText={(text) => setFieldValue("emailOrPhone", text)}
                    onBlur={() => setFieldTouched("emailOrPhone", true)}
                    error={touched.emailOrPhone && errors.emailOrPhone}
                  />

                  <PasswordInput
                    value={values.password}
                    onChangeText={(text) => setFieldValue("password", text)}
                    onBlur={() => setFieldTouched("password", true)}
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
                          { borderColor: colors.GRAY_300 },
                          rememberMe && { backgroundColor: colors.ACCENT, borderColor: colors.ACCENT },
                        ]}
                      >
                        {rememberMe && (
                          <Icon name="check" size={12} color={colors.WHITE} />
                        )}
                      </View>
                      <Text style={[styles.rememberText, { color: colors.TEXT_SECONDARY }]}>Beni hatirla</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                      <Text style={[styles.forgotPassword, { color: colors.ACCENT }]}>Sifremi unuttum</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Login Button */}
                  <CustomButton
                    title="Giris Yap"
                    onPress={handleSubmit}
                    variant="primary"
                    size="lg"
                    disabled={!values.emailOrPhone || !values.password || isLoading}
                    loading={isLoading}
                    style={styles.loginButton}
                  />

                  {/* Biometric Login */}
                  {biometricAvailable && (
                    <TouchableOpacity 
                      style={styles.biometricButton}
                      onPress={handleBiometricLogin}
                    >
                      <Icon
                        name={biometricType === "Face ID" ? "smartphone" : "fingerprint"}
                        size={IconSize.md}
                        color={colors.ACCENT}
                      />
                      <Text style={[styles.biometricText, { color: colors.ACCENT }]}>
                        {biometricType} ile giris yap
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </Formik>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.TEXT_SECONDARY }]}>Hesabiniz yok mu?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
              <Text style={[styles.signUpText, { color: colors.ACCENT }]}> Kayit Ol</Text>
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
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.xs,
  },
  rememberText: {
    ...TextStyles.bodySmall,
  },
  forgotPassword: {
    ...TextStyles.labelMedium,
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
    marginLeft: Spacing.xs,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: Spacing.xl,
  },
  footerText: {
    ...TextStyles.bodyMedium,
  },
  signUpText: {
    ...TextStyles.labelLarge,
  },
});

export default LoginScreen;
