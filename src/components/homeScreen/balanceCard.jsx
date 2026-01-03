import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Feather as Icon } from "@expo/vector-icons";
import { Colors, Gradients } from "../../utils/colors";
import { TextStyles } from "../../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../../utils/spacing";
import { GlowShadows } from "../../utils/shadows";

const BalanceCard = ({ balance = 0 }) => {
  const [isHidden, setIsHidden] = useState(false);
  const scale = useSharedValue(1);

  const formatBalance = (amount) => {
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const toggleVisibility = () => {
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withSpring(1, { damping: 15, stiffness: 400 })
    );
    setIsHidden(!isHidden);
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <LinearGradient
        colors={Gradients.balance}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.label}>Toplam Bakiye</Text>
          <TouchableOpacity style={styles.eyeButton} onPress={toggleVisibility}>
            <Icon
              name={isHidden ? "eye-off" : "eye"}
              size={IconSize.sm}
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.currency}>₺</Text>
          <Text style={styles.balance}>
            {isHidden ? "••••••" : formatBalance(balance)}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.cardInfo}>
            <Icon name="credit-card" size={IconSize.sm} color="rgba(255,255,255,0.7)" />
            <Text style={styles.cardNumber}>•••• 4582</Text>
          </View>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Aktif</Text>
          </View>
        </View>

        {/* Decorative circles */}
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    ...GlowShadows.primary,
  },
  gradient: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    overflow: "hidden",
    minHeight: 180,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    ...TextStyles.labelMedium,
    color: "rgba(255, 255, 255, 0.8)",
  },
  eyeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  currency: {
    ...TextStyles.h2,
    color: Colors.WHITE,
    marginRight: Spacing.xxs,
  },
  balance: {
    ...TextStyles.displayLarge,
    color: Colors.WHITE,
    letterSpacing: -1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardNumber: {
    ...TextStyles.bodySmall,
    color: "rgba(255, 255, 255, 0.7)",
    marginLeft: Spacing.xs,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.full,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4ADE80",
    marginRight: Spacing.xxs,
  },
  statusText: {
    ...TextStyles.labelSmall,
    color: Colors.WHITE,
    textTransform: "none",
  },
  decorCircle1: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  decorCircle2: {
    position: "absolute",
    bottom: -60,
    left: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
});

export default BalanceCard;
