import React from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Feather as Icon } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "../contexts/ThemeContext";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";
import { Shadows } from "../utils/shadows";
import { logout } from "../store/authSlice";
import { resetWallet } from "../store/walletSlice";
import Avatar from "../components/avatar";

const ProfileMenuItem = ({ icon, label, description, onPress, color, colors, danger = false }) => (
  <TouchableOpacity 
    style={[styles.menuItem, { backgroundColor: colors.SURFACE }]} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.menuIcon, { backgroundColor: `${danger ? colors.ERROR : color}15` }]}>
      <Icon name={icon} size={20} color={danger ? colors.ERROR : color} />
    </View>
    <View style={styles.menuContent}>
      <Text style={[styles.menuLabel, { color: danger ? colors.ERROR : colors.TEXT_PRIMARY }]}>
        {label}
      </Text>
      {description && (
        <Text style={[styles.menuDescription, { color: colors.TEXT_SECONDARY }]}>
          {description}
        </Text>
      )}
    </View>
    <Icon name="chevron-right" size={18} color={colors.GRAY_400} />
  </TouchableOpacity>
);

const ProfileScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { colors, isDark } = useTheme();

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
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

  // Stats data
  const stats = [
    { label: "İşlem", value: "127", icon: "activity" },
    { label: "Kart", value: "3", icon: "credit-card" },
    { label: "Favori", value: "8", icon: "heart" },
  ];

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
          <Avatar name={user?.name || "Kullanici"} size="2xl" image={user?.profileImage} />
          <Text style={[styles.profileName, { color: colors.TEXT_PRIMARY }]}>
            {user?.name || "Kullanici"}
          </Text>
          <Text style={[styles.profileEmail, { color: colors.TEXT_SECONDARY }]}>
            {user?.email || "email@example.com"}
          </Text>
          
          {/* Stats Row */}
          <View style={styles.statsRow}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: `${colors.PRIMARY}15` }]}>
                  <Icon name={stat.icon} size={16} color={colors.PRIMARY} />
                </View>
                <Text style={[styles.statValue, { color: colors.TEXT_PRIMARY }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: colors.TEXT_SECONDARY }]}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Edit Profile Button */}
          <TouchableOpacity 
            style={[styles.editProfileButton, { backgroundColor: colors.PRIMARY }]}
            onPress={() => navigation.navigate("EditProfileScreen")}
          >
            <Icon name="edit-2" size={16} color="#FFFFFF" />
            <Text style={styles.editProfileText}>Profili Düzenle</Text>
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <Text style={[styles.sectionTitle, { color: colors.TEXT_SECONDARY }]}>HESAP</Text>
        
        <ProfileMenuItem
          icon="credit-card"
          label="Kartlarım"
          description="Sanal kartlarınızı yönetin"
          onPress={() => navigation.navigate("CardsScreen")}
          color={colors.PRIMARY}
          colors={colors}
        />

        <ProfileMenuItem
          icon="activity"
          label="İşlem Geçmişi"
          description="Tüm işlemlerinizi görüntüleyin"
          onPress={() => navigation.navigate("StatsScreen")}
          color={colors.SUCCESS}
          colors={colors}
        />

        <ProfileMenuItem
          icon="bell"
          label="Bildirimler"
          description="Bildirim geçmişiniz"
          onPress={() => navigation.navigate("NotificationsScreen")}
          color="#F59E0B"
          colors={colors}
        />

        {/* Support Section */}
        <Text style={[styles.sectionTitle, { color: colors.TEXT_SECONDARY, marginTop: Spacing.lg }]}>
          DESTEK
        </Text>

        <ProfileMenuItem
          icon="help-circle"
          label="Yardım Merkezi"
          description="Sık sorulan sorular"
          onPress={() => Alert.alert("Bilgi", "Yardım merkezi yakında aktif olacak")}
          color="#06B6D4"
          colors={colors}
        />

        <ProfileMenuItem
          icon="message-circle"
          label="Bize Ulaşın"
          description="Destek ekibimizle iletişime geçin"
          onPress={() => Alert.alert("Bilgi", "İletişim formu yakında aktif olacak")}
          color="#10B981"
          colors={colors}
        />

        {/* Danger Zone */}
        <Text style={[styles.sectionTitle, { color: colors.TEXT_SECONDARY, marginTop: Spacing.lg }]}>
          HESAP İŞLEMLERİ
        </Text>

        <ProfileMenuItem
          icon="log-out"
          label="Çıkış Yap"
          description="Hesabınızdan güvenli çıkış yapın"
          onPress={handleLogout}
          color={colors.ERROR}
          colors={colors}
          danger
        />

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.GRAY_400 }]}>
            WalletApp v2.0.0
          </Text>
        </View>
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
  statsRow: {
    flexDirection: "row",
    marginTop: Spacing.lg,
    gap: Spacing.xl,
  },
  statItem: {
    alignItems: "center",
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xxs,
  },
  statValue: {
    ...TextStyles.h4,
    fontWeight: "700",
  },
  statLabel: {
    ...TextStyles.caption,
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.lg,
    gap: Spacing.xs,
  },
  editProfileText: {
    ...TextStyles.labelMedium,
    color: "#FFFFFF",
  },
  sectionTitle: {
    ...TextStyles.caption,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  menuContent: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  menuLabel: {
    ...TextStyles.labelMedium,
    fontWeight: "500",
  },
  menuDescription: {
    ...TextStyles.caption,
    marginTop: 2,
  },
  versionContainer: {
    alignItems: "center",
    paddingVertical: Spacing["2xl"],
  },
  versionText: {
    ...TextStyles.caption,
  },
});

export default ProfileScreen;
