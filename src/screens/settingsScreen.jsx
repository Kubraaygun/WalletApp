import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather as Icon } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "../contexts/ThemeContext";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";
import { Shadows } from "../utils/shadows";

const SettingsScreen = ({ navigation }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  
  // Settings states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [transactionAlerts, setTransactionAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [saveLoginInfo, setSaveLoginInfo] = useState(true);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleToggle = (setter, value, label) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setter(!value);
  };

  const SettingsSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.TEXT_SECONDARY }]}>
        {title}
      </Text>
      <View style={[styles.sectionContent, { backgroundColor: colors.SURFACE }]}>
        {children}
      </View>
    </View>
  );

  const SettingsItem = ({ 
    icon, 
    label, 
    description,
    value, 
    onValueChange, 
    type = "toggle",
    color = colors.PRIMARY,
    showArrow = false,
    onPress,
    danger = false,
  }) => (
    <TouchableOpacity
      style={styles.settingsItem}
      onPress={onPress || (type === "toggle" ? () => onValueChange?.(!value) : undefined)}
      disabled={type === "toggle" && !onPress}
      activeOpacity={type === "toggle" ? 1 : 0.7}
    >
      <View style={[styles.itemIcon, { backgroundColor: `${danger ? colors.ERROR : color}15` }]}>
        <Icon name={icon} size={20} color={danger ? colors.ERROR : color} />
      </View>
      <View style={styles.itemContent}>
        <Text style={[
          styles.itemLabel, 
          { color: danger ? colors.ERROR : colors.TEXT_PRIMARY }
        ]}>
          {label}
        </Text>
        {description && (
          <Text style={[styles.itemDescription, { color: colors.TEXT_SECONDARY }]}>
            {description}
          </Text>
        )}
      </View>
      {type === "toggle" && (
        <Switch
          value={value}
          onValueChange={(val) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onValueChange?.(val);
          }}
          trackColor={{ false: colors.GRAY_300, true: colors.PRIMARY }}
          thumbColor="#FFFFFF"
          ios_backgroundColor={colors.GRAY_300}
        />
      )}
      {showArrow && (
        <Icon name="chevron-right" size={20} color={colors.GRAY_400} />
      )}
    </TouchableOpacity>
  );

  const Divider = () => (
    <View style={[styles.divider, { backgroundColor: colors.BORDER }]} />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.BACKGROUND }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-left" size={IconSize.md} color={colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.TEXT_PRIMARY }]}>Ayarlar</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance */}
        <SettingsSection title="GÖRÜNÜM">
          <SettingsItem
            icon={isDark ? "moon" : "sun"}
            label="Karanlık Mod"
            description={isDark ? "Açık" : "Kapalı"}
            value={isDark}
            onValueChange={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              toggleTheme();
            }}
            color="#8B5CF6"
          />
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="BİLDİRİMLER">
          <SettingsItem
            icon="bell"
            label="Bildirimleri Etkinleştir"
            description="Tüm bildirimler"
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            color="#F59E0B"
          />
          <Divider />
          <SettingsItem
            icon="activity"
            label="İşlem Uyarıları"
            description="Her işlemde bildirim al"
            value={transactionAlerts}
            onValueChange={setTransactionAlerts}
            color={colors.SUCCESS}
          />
          <Divider />
          <SettingsItem
            icon="mail"
            label="Pazarlama E-postaları"
            description="Kampanya ve fırsatlardan haberdar ol"
            value={marketingEmails}
            onValueChange={setMarketingEmails}
            color={colors.SECONDARY}
          />
        </SettingsSection>

        {/* Security */}
        <SettingsSection title="GÜVENLİK">
          <SettingsItem
            icon="smartphone"
            label="Biyometrik Giriş"
            description="Face ID veya Touch ID ile giriş"
            value={biometricEnabled}
            onValueChange={setBiometricEnabled}
            color="#EF4444"
          />
          <Divider />
          <SettingsItem
            icon="save"
            label="Giriş Bilgilerini Hatırla"
            description="Otomatik giriş yap"
            value={saveLoginInfo}
            onValueChange={setSaveLoginInfo}
            color={colors.PRIMARY}
          />
          <Divider />
          <SettingsItem
            icon="lock"
            label="Şifre Değiştir"
            type="link"
            showArrow
            onPress={() => Alert.alert("Bilgi", "Şifre değiştirme yakında aktif olacak")}
          />
          <Divider />
          <SettingsItem
            icon="key"
            label="PIN Kodu"
            type="link"
            showArrow
            onPress={() => Alert.alert("Bilgi", "PIN kodu ayarları yakında aktif olacak")}
          />
        </SettingsSection>

        {/* Account */}
        <SettingsSection title="HESAP">
          <SettingsItem
            icon="user"
            label="Profil Bilgileri"
            type="link"
            showArrow
            onPress={() => navigation.navigate("ProfileScreen")}
          />
          <Divider />
          <SettingsItem
            icon="credit-card"
            label="Kayıtlı Kartlarım"
            type="link"
            showArrow
            onPress={() => navigation.navigate("CardsScreen")}
          />
          <Divider />
          <SettingsItem
            icon="file-text"
            label="Hesap Özeti"
            type="link"
            showArrow
            onPress={() => Alert.alert("Bilgi", "Hesap özeti yakında aktif olacak")}
          />
        </SettingsSection>

        {/* Support */}
        <SettingsSection title="DESTEK">
          <SettingsItem
            icon="help-circle"
            label="Yardım Merkezi"
            type="link"
            showArrow
            onPress={() => Alert.alert("Bilgi", "Yardım merkezi yakında aktif olacak")}
            color="#06B6D4"
          />
          <Divider />
          <SettingsItem
            icon="message-circle"
            label="Bize Ulaşın"
            type="link"
            showArrow
            onPress={() => Alert.alert("Bilgi", "İletişim formu yakında aktif olacak")}
            color="#10B981"
          />
          <Divider />
          <SettingsItem
            icon="info"
            label="Hakkında"
            description="Versiyon 2.0.0"
            type="link"
            showArrow
            onPress={() => Alert.alert("WalletApp", "Versiyon 2.0.0\n\n© 2026 WalletApp. Tüm hakları saklıdır.")}
          />
        </SettingsSection>

        {/* Danger Zone */}
        <SettingsSection title="TEHLİKE BÖLGESİ">
          <SettingsItem
            icon="log-out"
            label="Çıkış Yap"
            type="link"
            showArrow
            danger
            onPress={() => {
              Alert.alert(
                "Çıkış Yap",
                "Hesabınızdan çıkmak istediğinize emin misiniz?",
                [
                  { text: "İptal", style: "cancel" },
                  { 
                    text: "Çıkış Yap", 
                    style: "destructive",
                    onPress: () => {
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                      // Handle logout
                    }
                  }
                ]
              );
            }}
          />
          <Divider />
          <SettingsItem
            icon="trash-2"
            label="Hesabı Sil"
            type="link"
            showArrow
            danger
            onPress={() => {
              Alert.alert(
                "Hesabı Sil",
                "Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz silinecektir.",
                [
                  { text: "İptal", style: "cancel" },
                  { 
                    text: "Hesabı Sil", 
                    style: "destructive",
                    onPress: () => {
                      Alert.alert("Bilgi", "Hesap silme işlemi için müşteri hizmetleri ile iletişime geçin.");
                    }
                  }
                ]
              );
            }}
          />
        </SettingsSection>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appInfoText, { color: colors.GRAY_400 }]}>
            WalletApp v2.0.0
          </Text>
          <Text style={[styles.appInfoText, { color: colors.GRAY_400 }]}>
            Made with ❤️ in Turkey
          </Text>
        </View>
      </ScrollView>
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
  },
  section: {
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  sectionTitle: {
    ...TextStyles.caption,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  sectionContent: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    ...Shadows.sm,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContent: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  itemLabel: {
    ...TextStyles.labelMedium,
    fontWeight: "500",
  },
  itemDescription: {
    ...TextStyles.caption,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginLeft: 60,
  },
  appInfo: {
    alignItems: "center",
    paddingVertical: Spacing["2xl"],
    gap: Spacing.xxs,
  },
  appInfoText: {
    ...TextStyles.caption,
  },
});

export default SettingsScreen;
