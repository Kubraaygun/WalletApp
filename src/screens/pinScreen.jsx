import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather as Icon } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import { useTheme } from "../contexts/ThemeContext";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius } from "../utils/spacing";

const PIN_LENGTH = 4;
const PIN_KEY = "wallet_app_pin";

const PinScreen = ({ navigation, route }) => {
  const { colors, isDark } = useTheme();
  const mode = route?.params?.mode || "verify"; // verify, setup, change
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [step, setStep] = useState(1); // 1: enter, 2: confirm (for setup)
  const [error, setError] = useState("");
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleNumberPress = (num) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (step === 1 && pin.length < PIN_LENGTH) {
      const newPin = pin + num;
      setPin(newPin);
      setError("");
      
      if (newPin.length === PIN_LENGTH) {
        if (mode === "setup" || mode === "change") {
          setTimeout(() => {
            setStep(2);
            setConfirmPin(newPin);
            setPin("");
          }, 200);
        } else {
          verifyPin(newPin);
        }
      }
    } else if (step === 2 && pin.length < PIN_LENGTH) {
      const newPin = pin + num;
      setPin(newPin);
      setError("");
      
      if (newPin.length === PIN_LENGTH) {
        if (newPin === confirmPin) {
          savePin(newPin);
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          shake();
          setError("PIN kodları eşleşmiyor");
          setPin("");
          setStep(1);
          setConfirmPin("");
        }
      }
    }
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPin(pin.slice(0, -1));
    setError("");
  };

  const handleBiometric = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (!hasHardware || !isEnrolled) {
        Alert.alert("Bilgi", "Biyometrik doğrulama bu cihazda kullanılamıyor");
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Giriş yapmak için doğrulayın",
        cancelLabel: "PIN ile giriş",
        fallbackLabel: "PIN kullan",
      });

      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigation.replace("HomeScreen");
      }
    } catch (error) {
      console.log("Biometric error:", error);
    }
  };

  const verifyPin = async (enteredPin) => {
    try {
      const storedPin = await SecureStore.getItemAsync(PIN_KEY);
      
      if (storedPin === enteredPin) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigation.replace("HomeScreen");
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        shake();
        setError("Yanlış PIN kodu");
        setPin("");
      }
    } catch (error) {
      setError("PIN doğrulanamadı");
      setPin("");
    }
  };

  const savePin = async (newPin) => {
    try {
      await SecureStore.setItemAsync(PIN_KEY, newPin);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "Başarılı",
        mode === "change" ? "PIN kodunuz değiştirildi" : "PIN kodunuz oluşturuldu",
        [{ text: "Tamam", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert("Hata", "PIN kaydedilemedi");
    }
  };

  const getTitle = () => {
    if (mode === "setup") return step === 1 ? "PIN Oluştur" : "PIN'i Onayla";
    if (mode === "change") return step === 1 ? "Yeni PIN Gir" : "PIN'i Onayla";
    return "PIN Girin";
  };

  const getSubtitle = () => {
    if (mode === "setup") return step === 1 ? "4 haneli PIN oluşturun" : "PIN'i tekrar girin";
    if (mode === "change") return step === 1 ? "Yeni 4 haneli PIN girin" : "PIN'i tekrar girin";
    return "Devam etmek için PIN girin";
  };

  const NumberButton = ({ number, onPress }) => (
    <TouchableOpacity
      style={[styles.numberButton, { backgroundColor: colors.SURFACE }]}
      onPress={() => onPress(number)}
      activeOpacity={0.7}
    >
      <Text style={[styles.numberText, { color: colors.TEXT_PRIMARY }]}>{number}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={styles.header}>
        {mode !== "verify" && (
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={colors.TEXT_PRIMARY} />
          </TouchableOpacity>
        )}
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <View style={[styles.lockIcon, { backgroundColor: `${colors.PRIMARY}15` }]}>
          <Icon name="lock" size={32} color={colors.PRIMARY} />
        </View>
        <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>{getTitle()}</Text>
        <Text style={[styles.subtitle, { color: colors.TEXT_SECONDARY }]}>{getSubtitle()}</Text>
      </View>

      {/* PIN Dots */}
      <Animated.View style={[styles.dotsContainer, { transform: [{ translateX: shakeAnim }] }]}>
        {[...Array(PIN_LENGTH)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i < pin.length ? colors.PRIMARY : colors.GRAY_300,
                borderColor: error ? colors.ERROR : colors.GRAY_300,
              }
            ]}
          />
        ))}
      </Animated.View>

      {/* Error */}
      {error ? (
        <Text style={[styles.errorText, { color: colors.ERROR }]}>{error}</Text>
      ) : (
        <View style={styles.errorPlaceholder} />
      )}

      {/* Keypad */}
      <View style={styles.keypad}>
        <View style={styles.keypadRow}>
          <NumberButton number="1" onPress={handleNumberPress} />
          <NumberButton number="2" onPress={handleNumberPress} />
          <NumberButton number="3" onPress={handleNumberPress} />
        </View>
        <View style={styles.keypadRow}>
          <NumberButton number="4" onPress={handleNumberPress} />
          <NumberButton number="5" onPress={handleNumberPress} />
          <NumberButton number="6" onPress={handleNumberPress} />
        </View>
        <View style={styles.keypadRow}>
          <NumberButton number="7" onPress={handleNumberPress} />
          <NumberButton number="8" onPress={handleNumberPress} />
          <NumberButton number="9" onPress={handleNumberPress} />
        </View>
        <View style={styles.keypadRow}>
          {mode === "verify" ? (
            <TouchableOpacity style={styles.actionButton} onPress={handleBiometric}>
              <Icon name="smartphone" size={24} color={colors.PRIMARY} />
            </TouchableOpacity>
          ) : (
            <View style={styles.actionButton} />
          )}
          <NumberButton number="0" onPress={handleNumberPress} />
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Icon name="delete" size={24} color={colors.TEXT_SECONDARY} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Forgot PIN */}
      {mode === "verify" && (
        <TouchableOpacity style={styles.forgotButton}>
          <Text style={[styles.forgotText, { color: colors.PRIMARY }]}>PIN'i Unuttum</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: 56, justifyContent: "center", paddingHorizontal: Spacing.md },
  backButton: { width: 44, height: 44, justifyContent: "center", alignItems: "center" },
  titleContainer: { alignItems: "center", marginTop: Spacing.xl },
  lockIcon: { width: 72, height: 72, borderRadius: 36, justifyContent: "center", alignItems: "center", marginBottom: Spacing.md },
  title: { ...TextStyles.h2, marginBottom: Spacing.xs },
  subtitle: { ...TextStyles.bodyMedium },
  dotsContainer: { flexDirection: "row", justifyContent: "center", marginTop: Spacing.xl, gap: Spacing.md },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2 },
  errorText: { ...TextStyles.caption, textAlign: "center", marginTop: Spacing.md },
  errorPlaceholder: { height: 20, marginTop: Spacing.md },
  keypad: { flex: 1, justifyContent: "center", paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl },
  keypadRow: { flexDirection: "row", justifyContent: "center", marginBottom: Spacing.md },
  numberButton: { width: 72, height: 72, borderRadius: 36, justifyContent: "center", alignItems: "center", marginHorizontal: Spacing.md },
  numberText: { fontSize: 28, fontWeight: "600" },
  actionButton: { width: 72, height: 72, justifyContent: "center", alignItems: "center", marginHorizontal: Spacing.md },
  forgotButton: { alignItems: "center", paddingBottom: Spacing.xl },
  forgotText: { ...TextStyles.labelMedium },
});

export default PinScreen;
