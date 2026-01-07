import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather as Icon } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { Colors, Gradients } from "../../utils/colors";
import { TextStyles } from "../../utils/typography";
import { Spacing, IconSize, BorderRadius, scale, moderateScale, verticalScale } from "../../utils/spacing";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const LoginHeader = () => {
  const { colors, isDark } = useTheme();
  
  // Responsive logo size
  const logoSize = SCREEN_WIDTH < 375 ? 64 : SCREEN_WIDTH < 414 ? 72 : 80;
  const iconSize = SCREEN_WIDTH < 375 ? 28 : SCREEN_WIDTH < 414 ? 32 : 40;

  return (
    <View style={[styles.container, { paddingTop: verticalScale(40) }]}>
      {/* Logo Container */}
      <LinearGradient
        colors={Gradients.balance}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.logoContainer, { width: logoSize, height: logoSize, borderRadius: moderateScale(20) }]}
      >
        <Icon name="credit-card" size={iconSize} color={Colors.WHITE} />
      </LinearGradient>

      {/* App Name */}
      <Text style={[styles.appName, { color: colors.TEXT_PRIMARY, fontSize: moderateScale(28) }]}>WalletApp</Text>

      {/* Tagline */}
      <Text style={[styles.tagline, { color: colors.TEXT_SECONDARY }]}>Guvenli para transferi</Text>

      {/* Welcome Text */}
      <View style={styles.welcomeContainer}>
        <Text style={[styles.welcomeTitle, { color: colors.TEXT_PRIMARY, fontSize: moderateScale(24) }]}>Hos Geldiniz</Text>
        <Text style={[styles.welcomeSubtitle, { color: colors.TEXT_SECONDARY }]}>
          Devam etmek icin giris yapin
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingBottom: Spacing.xl,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  appName: {
    fontWeight: "700",
    marginBottom: Spacing.xxs,
  },
  tagline: {
    ...TextStyles.bodySmall,
    marginBottom: Spacing["2xl"],
  },
  welcomeContainer: {
    alignItems: "center",
  },
  welcomeTitle: {
    fontWeight: "600",
    marginBottom: Spacing.xxs,
  },
  welcomeSubtitle: {
    ...TextStyles.bodyMedium,
  },
});

export default LoginHeader;
