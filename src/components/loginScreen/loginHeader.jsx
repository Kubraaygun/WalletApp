import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather as Icon } from "@expo/vector-icons";
import { Colors, Gradients } from "../../utils/colors";
import { TextStyles } from "../../utils/typography";
import { Spacing, IconSize, BorderRadius } from "../../utils/spacing";

const LoginHeader = () => {
  return (
    <View style={styles.container}>
      {/* Logo Container */}
      <LinearGradient
        colors={Gradients.balance}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.logoContainer}
      >
        <Icon name="credit-card" size={IconSize["2xl"]} color={Colors.WHITE} />
      </LinearGradient>

      {/* App Name */}
      <Text style={styles.appName}>WalletApp</Text>

      {/* Tagline */}
      <Text style={styles.tagline}>Güvenli para transferi</Text>

      {/* Welcome Text */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>Hoş Geldiniz</Text>
        <Text style={styles.welcomeSubtitle}>
          Devam etmek için giriş yapın
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: Spacing["2xl"],
    paddingBottom: Spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.xl,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  appName: {
    ...TextStyles.h1,
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.xxs,
  },
  tagline: {
    ...TextStyles.bodySmall,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing["2xl"],
  },
  welcomeContainer: {
    alignItems: "center",
  },
  welcomeTitle: {
    ...TextStyles.displaySmall,
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.xxs,
  },
  welcomeSubtitle: {
    ...TextStyles.bodyMedium,
    color: Colors.TEXT_SECONDARY,
  },
});

export default LoginHeader;
