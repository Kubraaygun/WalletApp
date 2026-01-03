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
import { Colors } from "../utils/colors";
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
    
    // Biyometrik türünü belirle
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
      
      // Navigation artık Tab içinde olduğu için reset yerine ana stack'e geç
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    } catch (error) {
      Alert.alert("Giriş Hatası", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    const result = await biometricService.authenticateWithBiometric(
      `${biometricType} ile giriş yapın`
    );

    if (result.success) {
      // TODO: Token'ı SecureStore'dan al ve validasyonunu yap
      dispatch(authSuccess({
        user: { name: "Kübra", email: "biometric@example.com" },
        token: "biometric_token_12345",
      }));
      navigation.navigate("HomeScreen");
    } else {
      Alert.alert("Doğrulama Başarısız", result.error);
    }
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
                        color={Colors.ACCENT}
                      />
                      <Text style={styles.biometricText}>
                        {biometricType} ile giriş yap
                      </Text>
                    </TouchableOpacity>
                  )}
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
