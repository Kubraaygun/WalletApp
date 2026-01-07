import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Feather as Icon } from "@expo/vector-icons";
import { Colors } from "../utils/colors";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";
import { Shadows } from "../utils/shadows";
import { logout } from "../store/authSlice";
import { resetWallet } from "../store/walletSlice";
import { biometricService } from "../services";
import { changeLanguage, supportedLanguages, getCurrentLanguage } from "../i18n";
import { useTheme } from "../contexts/ThemeContext";
import Avatar from "../components/avatar";

const SettingItem = ({ icon, label, value, onPress, hasArrow = true, rightComponent }) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
    <View style={styles.settingLeft}>
      <View style={styles.settingIconContainer}>
        <Icon name={icon} size={IconSize.sm} color={Colors.ACCENT} />
      </View>
      <Text style={styles.settingLabel}>{label}</Text>
    </View>
    <View style={styles.settingRight}>
      {value && <Text style={styles.settingValue}>{value}</Text>}
      {rightComponent}
      {hasArrow && !rightComponent && (
        <Icon name="chevron-right" size={IconSize.sm} color={Colors.GRAY_400} />
      )}
    </View>
  </TouchableOpacity>
);

const ProfileScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { themeMode, setTheme, isDark } = useTheme();
  
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());

  React.useEffect(() => {
    checkBiometricSetting();
  }, []);

  const checkBiometricSetting = async () => {
    const enabled = await biometricService.isBiometricLoginEnabled();
    setBiometricEnabled(enabled);
  };

  const handleBiometricToggle = async (value) => {
    if (value) {
      // Önce doğrulama yap
      const result = await biometricService.authenticateWithBiometric(
        "Biyometrik girişi etkinleştirmek için doğrulayın"
      );
      if (result.success) {
        await biometricService.setBiometricLoginEnabled(true);
        setBiometricEnabled(true);
      } else {
        Alert.alert("Doğrulama Başarısız", result.error);
      }
    } else {
      await biometricService.setBiometricLoginEnabled(false);
      setBiometricEnabled(false);
    }
  };

  const handleLanguageChange = () => {
    Alert.alert(
      t("settings.language"),
      "Dil seçin / Select language",
      supportedLanguages.map((lang) => ({
        text: `${lang.flag} ${lang.name}`,
        onPress: async () => {
          await changeLanguage(lang.code);
          setCurrentLang(lang.code);
        },
      }))
    );
  };

  const handleThemeChange = () => {
    const themeOptions = [
      { text: "Acik", mode: "light" },
      { text: "Koyu", mode: "dark" },
      { text: "Sistem", mode: "system" },
    ];

    Alert.alert(
      "Tema",
      "Tema secin",
      themeOptions.map((option) => ({
        text: option.text,
        onPress: () => setTheme(option.mode),
      }))
    );
  };

  const getThemeName = () => {
    switch (themeMode) {
      case "light":
        return "Acik";
      case "dark":
        return "Koyu";
      case "system":
        return "Sistem";
      default:
        return "Sistem";
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t("auth.logout"),
      "Çıkış yapmak istediğinize emin misiniz?",
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("auth.logout"),
          style: "destructive",
          onPress: () => {
            dispatch(logout());
            dispatch(resetWallet());
            navigation.reset({
              index: 0,
              routes: [{ name: "LoginScreen" }],
            });
          },
        },
      ]
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const getLangName = () => {
    const lang = supportedLanguages.find((l) => l.code === currentLang);
    return lang ? `${lang.flag} ${lang.name}` : "Türkçe";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={Colors.BACKGROUND} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>{t("settings.profile")}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Avatar name={user?.name || "Kullanıcı"} size="xl" />
          <Text style={styles.profileName}>{user?.name || "Kullanıcı"}</Text>
          <Text style={styles.profileEmail}>{user?.email || "email@example.com"}</Text>
        </View>

        {/* Settings Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tercihler</Text>
          <View style={styles.sectionCard}>
            <SettingItem
              icon="globe"
              label={t("settings.language")}
              value={getLangName()}
              onPress={handleLanguageChange}
            />
            <SettingItem
              icon="moon"
              label="Tema"
              value={getThemeName()}
              onPress={handleThemeChange}
            />
            <SettingItem
              icon="bell"
              label={t("settings.notifications")}
              hasArrow={false}
              rightComponent={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: Colors.GRAY_300, true: Colors.ACCENT }}
                  thumbColor={Colors.WHITE}
                />
              }
            />
            <SettingItem
              icon="smartphone"
              label={t("settings.biometric")}
              hasArrow={false}
              rightComponent={
                <Switch
                  value={biometricEnabled}
                  onValueChange={handleBiometricToggle}
                  trackColor={{ false: Colors.GRAY_300, true: Colors.ACCENT }}
                  thumbColor={Colors.WHITE}
                />
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Uygulama</Text>
          <View style={styles.sectionCard}>
            <SettingItem
              icon="shield"
              label={t("settings.security")}
              onPress={() => {}}
            />
            <SettingItem
              icon="info"
              label={t("settings.about")}
              value="v1.0.0"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out" size={IconSize.sm} color={Colors.ERROR} />
          <Text style={styles.logoutText}>{t("auth.logout")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
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
    borderRadius: 22,
    backgroundColor: Colors.GRAY_100,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    ...TextStyles.h3,
    color: Colors.TEXT_PRIMARY,
  },
  headerSpacer: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing["2xl"],
  },
  profileCard: {
    alignItems: "center",
    backgroundColor: Colors.SURFACE,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  profileName: {
    ...TextStyles.h3,
    color: Colors.TEXT_PRIMARY,
    marginTop: Spacing.md,
  },
  profileEmail: {
    ...TextStyles.bodyMedium,
    color: Colors.TEXT_SECONDARY,
    marginTop: Spacing.xxs,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...TextStyles.labelMedium,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  sectionCard: {
    backgroundColor: Colors.SURFACE,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_100,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: `${Colors.ACCENT}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
  },
  settingLabel: {
    ...TextStyles.bodyMedium,
    color: Colors.TEXT_PRIMARY,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingValue: {
    ...TextStyles.bodySmall,
    color: Colors.TEXT_SECONDARY,
    marginRight: Spacing.xs,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${Colors.ERROR}10`,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
  },
  logoutText: {
    ...TextStyles.labelLarge,
    color: Colors.ERROR,
    marginLeft: Spacing.xs,
  },
});

export default ProfileScreen;
