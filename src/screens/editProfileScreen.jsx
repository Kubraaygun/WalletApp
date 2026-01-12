import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather as Icon } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "../contexts/ThemeContext";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";
import { Shadows } from "../utils/shadows";
import Avatar from "../components/avatar";
import { updateUser } from "../store/authSlice";

const EditProfileScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  // Form states
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  // Input validation - sanitize inputs
  const sanitizeInput = (text) => {
    // Remove any potentially dangerous characters
    return text.replace(/[<>{}]/g, "").trim();
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    // Turkish phone format or international
    const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
    return !phone || phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const handleSave = async () => {
    // Validation
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPhone = sanitizeInput(phone);
    const sanitizedAddress = sanitizeInput(address);

    if (!sanitizedName || sanitizedName.length < 2) {
      Alert.alert("Hata", "Ad en az 2 karakter olmalıdır");
      return;
    }

    if (sanitizedName.length > 50) {
      Alert.alert("Hata", "Ad en fazla 50 karakter olabilir");
      return;
    }

    if (!validateEmail(sanitizedEmail)) {
      Alert.alert("Hata", "Geçerli bir e-posta adresi girin");
      return;
    }

    if (sanitizedPhone && !validatePhone(sanitizedPhone)) {
      Alert.alert("Hata", "Geçerli bir telefon numarası girin (5XX XXX XXXX)");
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    Alert.alert(
      "Profil Güncelleme",
      "Bilgilerinizi güncellemek istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Güncelle",
          onPress: async () => {
            setLoading(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Update Redux store
            dispatch(updateUser({
              name: sanitizedName,
              email: sanitizedEmail,
              phone: sanitizedPhone,
              address: sanitizedAddress,
            }));
            
            setLoading(false);
            Alert.alert(
              "Başarılı",
              "Profil bilgileriniz güncellendi.",
              [{ text: "Tamam", onPress: () => navigation.goBack() }]
            );
          }
        }
      ]
    );
  };

  const FormInput = ({ 
    label, 
    value, 
    onChangeText, 
    placeholder, 
    icon,
    keyboardType = "default",
    autoCapitalize = "sentences",
    maxLength = 100,
  }) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.inputLabel, { color: colors.TEXT_SECONDARY }]}>
        {label}
      </Text>
      <View style={[styles.inputWrapper, { backgroundColor: colors.SURFACE, borderColor: colors.BORDER }]}>
        <View style={[styles.inputIcon, { backgroundColor: `${colors.PRIMARY}15` }]}>
          <Icon name={icon} size={18} color={colors.PRIMARY} />
        </View>
        <TextInput
          style={[styles.input, { color: colors.TEXT_PRIMARY }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.GRAY_400}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.BACKGROUND }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-left" size={IconSize.md} color={colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.TEXT_PRIMARY }]}>Profil Düzenle</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <Avatar name={name || "K"} size="2xl" />
            <TouchableOpacity 
              style={[styles.changeAvatarButton, { backgroundColor: colors.PRIMARY }]}
              onPress={() => Alert.alert("Bilgi", "Fotoğraf değiştirme yakında aktif olacak")}
            >
              <Icon name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={[styles.avatarHint, { color: colors.TEXT_SECONDARY }]}>
              Fotoğrafı değiştirmek için dokun
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <FormInput
              label="Ad Soyad"
              value={name}
              onChangeText={(text) => setName(sanitizeInput(text))}
              placeholder="Adınızı girin"
              icon="user"
              autoCapitalize="words"
              maxLength={50}
            />

            <FormInput
              label="E-posta"
              value={email}
              onChangeText={(text) => setEmail(text.toLowerCase().trim())}
              placeholder="ornek@email.com"
              icon="mail"
              keyboardType="email-address"
              autoCapitalize="none"
              maxLength={100}
            />

            <FormInput
              label="Telefon"
              value={phone}
              onChangeText={(text) => setPhone(text.replace(/[^0-9+\s]/g, ""))}
              placeholder="5XX XXX XX XX"
              icon="phone"
              keyboardType="phone-pad"
              maxLength={15}
            />

            <FormInput
              label="Adres"
              value={address}
              onChangeText={(text) => setAddress(sanitizeInput(text))}
              placeholder="Adresinizi girin"
              icon="map-pin"
              maxLength={200}
            />
          </View>

          {/* Security Notice */}
          <View style={[styles.securityNotice, { backgroundColor: `${colors.INFO}10` }]}>
            <Icon name="shield" size={18} color={colors.INFO} />
            <Text style={[styles.securityText, { color: colors.INFO }]}>
              Bilgileriniz 256-bit şifreleme ile korunmaktadır.
            </Text>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={[styles.bottomContainer, { backgroundColor: colors.BACKGROUND }]}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.PRIMARY }]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.saveButtonText}>Kaydediliyor...</Text>
            ) : (
              <>
                <Icon name="check" size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Değişiklikleri Kaydet</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    ...TextStyles.h3,
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  avatarSection: {
    alignItems: "center",
    marginVertical: Spacing.xl,
  },
  changeAvatarButton: {
    position: "absolute",
    bottom: 30,
    right: "35%",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.sm,
  },
  avatarHint: {
    ...TextStyles.caption,
    marginTop: Spacing.sm,
  },
  form: {
    gap: Spacing.md,
  },
  inputContainer: {
    marginBottom: Spacing.sm,
  },
  inputLabel: {
    ...TextStyles.labelSmall,
    marginBottom: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  inputIcon: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: Spacing.sm,
    ...TextStyles.bodyMedium,
  },
  securityNotice: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  securityText: {
    ...TextStyles.caption,
    flex: 1,
  },
  bottomContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
  },
  saveButtonText: {
    ...TextStyles.labelLarge,
    color: "#FFFFFF",
  },
});

export default EditProfileScreen;
