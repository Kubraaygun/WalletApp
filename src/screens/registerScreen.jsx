import React, { useState } from "react";
import {
    View,
    ScrollView,
    StatusBar,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Text,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
import * as Yup from "yup";
import { Feather as Icon } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Gradients } from "../utils/colors";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";

// Components
import CustomTextInput from "../components/customTextInput";
import CustomButton from "../components/customButton";
import mockAuthService from "../services/mockAuthService";

const registerValidationSchema = Yup.object().shape({
    fullName: Yup.string()
        .min(2, "İsim en az 2 karakter olmalı")
        .required("İsim zorunlu"),
    email: Yup.string()
        .email("Geçerli bir email girin")
        .required("Email zorunlu"),
    phone: Yup.string()
        .matches(/^[0-9]{10,11}$/, "Geçerli bir telefon numarası girin")
        .required("Telefon numarası zorunlu"),
    password: Yup.string()
        .min(6, "Şifre en az 6 karakter olmalı")
        .required("Şifre zorunlu"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Şifreler eşleşmiyor")
        .required("Şifre tekrarı zorunlu"),
});

const RegisterScreen = ({ navigation }) => {
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (values) => {
        setIsLoading(true);
        try {
            await mockAuthService.register({
                name: values.fullName,
                email: values.email,
                phone: values.phone,
                password: values.password,
            });
            Alert.alert(
                "Kayıt Başarılı! 🎉",
                "Hesabınız oluşturuldu. Şimdi giriş yapabilirsiniz.",
                [
                    {
                        text: "Giriş Yap",
                        onPress: () => navigation.replace("LoginScreen"),
                    },
                ]
            );
        } catch (error) {
            Alert.alert("Kayıt Hatası", error.message);
        } finally {
            setIsLoading(false);
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
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Icon name="arrow-left" size={IconSize.md} color={Colors.TEXT_PRIMARY} />
                        </TouchableOpacity>
                    </View>

                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <LinearGradient
                            colors={Gradients.balance}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.logoGradient}
                        >
                            <Icon name="user-plus" size={IconSize["2xl"]} color={Colors.WHITE} />
                        </LinearGradient>
                        <Text style={styles.title}>Hesap Oluştur</Text>
                        <Text style={styles.subtitle}>Hemen ücretsiz kayıt olun</Text>
                    </View>

                    {/* Register Form */}
                    <View style={styles.formContainer}>
                        <Formik
                            initialValues={{
                                fullName: "",
                                email: "",
                                phone: "",
                                password: "",
                                confirmPassword: "",
                            }}
                            validationSchema={registerValidationSchema}
                            onSubmit={handleRegister}
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
                                    <CustomTextInput
                                        label="Ad Soyad"
                                        placeholder="Adınız Soyadınız"
                                        value={values.fullName}
                                        onChangeText={handleChange("fullName")}
                                        onBlur={handleBlur("fullName")}
                                        error={touched.fullName && errors.fullName}
                                        leftIcon="user"
                                        autoCapitalize="words"
                                    />

                                    <CustomTextInput
                                        label="Email"
                                        placeholder="ornek@email.com"
                                        value={values.email}
                                        onChangeText={handleChange("email")}
                                        onBlur={handleBlur("email")}
                                        error={touched.email && errors.email}
                                        leftIcon="mail"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />

                                    <CustomTextInput
                                        label="Telefon Numarası"
                                        placeholder="5XX XXX XX XX"
                                        value={values.phone}
                                        onChangeText={handleChange("phone")}
                                        onBlur={handleBlur("phone")}
                                        error={touched.phone && errors.phone}
                                        leftIcon="phone"
                                        keyboardType="phone-pad"
                                    />

                                    <CustomTextInput
                                        label="Şifre"
                                        placeholder="••••••••"
                                        value={values.password}
                                        onChangeText={handleChange("password")}
                                        onBlur={handleBlur("password")}
                                        error={touched.password && errors.password}
                                        leftIcon="lock"
                                        secureTextEntry={true}
                                        showPasswordToggle={true}
                                    />

                                    <CustomTextInput
                                        label="Şifre Tekrar"
                                        placeholder="••••••••"
                                        value={values.confirmPassword}
                                        onChangeText={handleChange("confirmPassword")}
                                        onBlur={handleBlur("confirmPassword")}
                                        error={touched.confirmPassword && errors.confirmPassword}
                                        leftIcon="lock"
                                        secureTextEntry={true}
                                        showPasswordToggle={true}
                                    />

                                    {/* Terms Agreement */}
                                    <TouchableOpacity
                                        style={styles.termsRow}
                                        onPress={() => setAgreeTerms(!agreeTerms)}
                                    >
                                        <View
                                            style={[
                                                styles.checkbox,
                                                agreeTerms && styles.checkboxChecked,
                                            ]}
                                        >
                                            {agreeTerms && (
                                                <Icon name="check" size={12} color={Colors.WHITE} />
                                            )}
                                        </View>
                                        <Text style={styles.termsText}>
                                            <Text style={styles.termsLink}>Kullanım Şartları</Text> ve{" "}
                                            <Text style={styles.termsLink}>Gizlilik Politikası</Text>
                                            'nı kabul ediyorum
                                        </Text>
                                    </TouchableOpacity>

                                    {/* Register Button */}
                                    <CustomButton
                                        title="Kayıt Ol"
                                        onPress={handleSubmit}
                                        variant="primary"
                                        size="lg"
                                        disabled={!agreeTerms || isLoading}
                                        loading={isLoading}
                                        style={styles.registerButton}
                                    />
                                </View>
                            )}
                        </Formik>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Zaten hesabınız var mı?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
                            <Text style={styles.loginText}> Giriş Yap</Text>
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
    header: {
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.md,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.GRAY_100,
        justifyContent: "center",
        alignItems: "center",
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: Spacing.xl,
    },
    logoGradient: {
        width: 70,
        height: 70,
        borderRadius: BorderRadius.xl,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: Spacing.md,
    },
    title: {
        ...TextStyles.h1,
        color: Colors.TEXT_PRIMARY,
        marginBottom: Spacing.xxs,
    },
    subtitle: {
        ...TextStyles.bodyMedium,
        color: Colors.TEXT_SECONDARY,
    },
    formContainer: {
        flex: 1,
    },
    form: {},
    termsRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: Spacing.lg,
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
        marginTop: 2,
    },
    checkboxChecked: {
        backgroundColor: Colors.ACCENT,
        borderColor: Colors.ACCENT,
    },
    termsText: {
        ...TextStyles.bodySmall,
        color: Colors.TEXT_SECONDARY,
        flex: 1,
    },
    termsLink: {
        color: Colors.ACCENT,
        fontWeight: "500",
    },
    registerButton: {
        marginTop: Spacing.xs,
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
    loginText: {
        ...TextStyles.labelLarge,
        color: Colors.ACCENT,
    },
});

export default RegisterScreen;
