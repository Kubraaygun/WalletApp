import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  FadeInUp,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Feather as Icon } from "@expo/vector-icons";
import { Colors, Gradients } from "../../utils/colors";
import { useTheme } from "../../contexts/ThemeContext";
import { TextStyles } from "../../utils/typography";
import { Spacing, BorderRadius, IconSize, scale, verticalScale, moderateScale } from "../../utils/spacing";
import { GlowShadows } from "../../utils/shadows";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const BalanceCard = ({ balance = 0 }) => {
  const { colors, isDark } = useTheme();
  const [isHidden, setIsHidden] = useState(false);
  const scaleAnim = useSharedValue(1);
  
  // Entry animation values
  const entryProgress = useSharedValue(0);
  const shimmer = useSharedValue(0);

  useEffect(() => {
    // Entry animation
    entryProgress.value = withDelay(
      200,
      withSpring(1, { damping: 12, stiffness: 100, mass: 0.8 })
    );
    
    // Shimmer effect (subtle glow pulse)
    const runShimmer = () => {
      shimmer.value = withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      );
    };
    runShimmer();
    const interval = setInterval(runShimmer, 4000);
    return () => clearInterval(interval);
  }, []);

  const formatBalance = (amount) => {
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Entry animation style
  const entryAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(entryProgress.value, [0, 0.5, 1], [0, 0.8, 1]),
    transform: [
      { 
        translateY: interpolate(
          entryProgress.value, 
          [0, 1], 
          [30, 0],
          Extrapolation.CLAMP
        ) 
      },
      { 
        scale: interpolate(
          entryProgress.value, 
          [0, 0.5, 1], 
          [0.9, 1.02, 1],
          Extrapolation.CLAMP
        ) 
      },
    ],
  }));

  // Press/toggle animation style
  const pressAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  // Shimmer glow style
  const shimmerStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(shimmer.value, [0, 1], [0.3, 0.6]),
    shadowRadius: interpolate(shimmer.value, [0, 1], [15, 25]),
  }));

  const toggleVisibility = () => {
    scaleAnim.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withSpring(1, { damping: 15, stiffness: 400 })
    );
    setIsHidden(!isHidden);
  };

  // Responsive card height based on screen width
  const cardHeight = Math.max(verticalScale(180), 160);
  const balanceFontSize = SCREEN_WIDTH < 375 ? 28 : SCREEN_WIDTH < 414 ? 32 : 36;

  return (
    <Animated.View style={[styles.container, entryAnimatedStyle, shimmerStyle]}>
      <Animated.View style={pressAnimatedStyle}>
        <LinearGradient
          colors={isDark ? Gradients.balanceDark || Gradients.balance : Gradients.balance}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { minHeight: cardHeight }]}
        >
          <View style={styles.header}>
            <Text style={styles.label}>Toplam Bakiye</Text>
            <TouchableOpacity style={styles.eyeButton} onPress={toggleVisibility}>
              <Icon
                name={isHidden ? "eye-off" : "eye"}
                size={moderateScale(18)}
                color={Colors.WHITE}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.balanceContainer}>
            <Text style={[styles.currency, { fontSize: moderateScale(20) }]}>₺</Text>
            <Text style={[styles.balance, { fontSize: balanceFontSize }]}>
              {isHidden ? "••••••" : formatBalance(balance)}
            </Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.cardInfo}>
              <Icon name="credit-card" size={moderateScale(16)} color="rgba(255,255,255,0.7)" />
              <Text style={styles.cardNumber}>•••• 4582</Text>
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Aktif</Text>
            </View>
          </View>

          {/* Decorative circles */}
          <View style={[styles.decorCircle1, { width: scale(120), height: scale(120), borderRadius: scale(60) }]} />
          <View style={[styles.decorCircle2, { width: scale(150), height: scale(150), borderRadius: scale(75) }]} />
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    ...GlowShadows.primary,
    shadowColor: "#667EEA",
  },
  gradient: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    overflow: "hidden",
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
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    flexWrap: "nowrap",
  },
  currency: {
    fontWeight: "700",
    color: Colors.WHITE,
    marginRight: Spacing.xxs,
  },
  balance: {
    fontWeight: "700",
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
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  decorCircle2: {
    position: "absolute",
    bottom: -60,
    left: -30,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
});

export default BalanceCard;
