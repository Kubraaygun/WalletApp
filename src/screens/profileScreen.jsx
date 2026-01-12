import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Feather as Icon } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";
import { Shadows } from "../utils/shadows";
import { logout } from "../store/authSlice";
import { resetWallet } from "../store/walletSlice";
import { biometricService } from "../services";
import { changeLanguage, supportedLanguages, getCurrentLanguage } from "../i18n";
import Avatar from "../components/avatar";

const SettingItem = ({ icon, label, value, onPress, hasArrow = true, rightComponent, colors }) => (
  <TouchableOpacity 
    style={[styles.settingItem, { borderBottomColor: colors.BORDER }]} 
    onPress={onPress} 
    disabled={!onPress}
  >
    <View style={styles.settingLeft}>
      <View style={[styles.settingIconContainer, { backgroundColor: `${colors.ACCENT}15` }]}>
        <Icon name={icon} size={IconSize.sm} color={colors.ACCENT} />
      </View>
      <Text style={[styles.settingLabel, { color: colors.TEXT_PRIMARY }]}>{label}</Text>
    </View>
    <View style={styles.settingRight}>
      {value && <Text style={[styles.settingValue, { color: colors.TEXT_SECONDARY }]}>{value}</Text>}
      {rightComponent}
      {hasArrow && !rightComponent && (
        <Icon name="chevron-right" size={IconSize.sm} color={colors.GRAY_400} />
      )}
    </View>
  </TouchableOpacity>
);

const ProfileScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { colors, themeMode, setTheme, isDark } = useTheme();
  
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
      const result = await biometricService.authenticateWithBiometric(
        "Biyometrik girisi etkinlestirmek icin dogrulayin"
      );
      if (result.success) {
        await biometricService.setBiometricLoginEnabled(true);
        setBiometricEnabled(true);
      } else {
        Alert.alert("Dogrulama Basarisiz", result.error);
      }
    } else {
      await biometricService.setBiometricLoginEnabled(false);
      setBiometricEnabled(false);
    }
  };

  const handleLanguageChange = () => {
    Alert.alert(
      t("settings.language"),
      "Dil secin / Select language",
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
      "Cikis yapmak istediginize emin misiniz?",
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

  const getLangName = () => {
    const lang = supportedLanguages.find((l) => l.code === currentLang);
    return lang ? `${lang.flag} ${lang.name}` : "Turkce";
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.BACKGROUND }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.BACKGROUND} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={[styles.headerTitle, { color: colors.TEXT_PRIMARY }]}>{t("settings.profile")}</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => navigation.navigate("SettingsScreen")}
        >
          <Icon name="settings" size={IconSize.md} color={colors.TEXT_PRIMARY} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.SURFACE }]}>
          <Avatar name={user?.name || "Kullanici"} size="xl" />
          <Text style={[styles.profileName, { color: colors.TEXT_PRIMARY }]}>{user?.name || "Kullanici"}</Text>
          <Text style={[styles.profileEmail, { color: colors.TEXT_SECONDARY }]}>{user?.email || "email@example.com"}</Text>
        </View>

        {/* Settings Sections */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.TEXT_SECONDARY }]}>Tercihler</Text>
          <View style={[styles.sectionCard, { backgroundColor: colors.SURFACE }]}>
            <SettingItem
              icon="globe"
              label={t("settings.language")}
              value={getLangName()}
              onPress={handleLanguageChange}
              colors={colors}
            />
            <SettingItem
              icon="moon"
              label="Tema"
              value={getThemeName()}
              onPress={handleThemeChange}
              colors={colors}
            />
            <SettingItem
              icon="bell"
              label={t("settings.notifications")}
              hasArrow={false}
              colors={colors}
              rightComponent={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: colors.GRAY_300, true: colors.ACCENT }}
                  thumbColor={colors.WHITE}
                />
              }
            />
            <SettingItem
              icon="smartphone"
              label={t("settings.biometric")}
              hasArrow={false}
              colors={colors}
              rightComponent={
                <Switch
                  value={biometricEnabled}
                  onValueChange={handleBiometricToggle}
                  trackColor={{ false: colors.GRAY_300, true: colors.ACCENT }}
                  thumbColor={colors.WHITE}
                />
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.TEXT_SECONDARY }]}>Uygulama</Text>
          <View style={[styles.sectionCard, { backgroundColor: colors.SURFACE }]}>
            <SettingItem
              icon="shield"
              label={t("settings.security")}
              onPress={() => {}}
              colors={colors}
            />
            <SettingItem
              icon="info"
              label={t("settings.about")}
              value="v1.0.0"
              onPress={() => {}}
              colors={colors}
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: `${colors.ERROR}15` }]} onPress={handleLogout}>
          <Icon name="log-out" size={IconSize.sm} color={colors.ERROR} />
          <Text style={[styles.logoutText, { color: colors.ERROR }]}>{t("auth.logout")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  headerTitle: {
    ...TextStyles.h3,
  },
  headerSpacer: {
    width: 44,
  },
  settingsButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
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
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  profileName: {
    ...TextStyles.h3,
    marginTop: Spacing.md,
  },
  profileEmail: {
    ...TextStyles.bodyMedium,
    marginTop: Spacing.xxs,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...TextStyles.labelMedium,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  sectionCard: {
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
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
  },
  settingLabel: {
    ...TextStyles.bodyMedium,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingValue: {
    ...TextStyles.bodySmall,
    marginRight: Spacing.xs,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
  },
  logoutText: {
    ...TextStyles.labelLarge,
    marginLeft: Spacing.xs,
  },
});

export default ProfileScreen;
