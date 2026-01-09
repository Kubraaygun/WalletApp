import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Feather as Icon } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../contexts/ThemeContext";
import { TextStyles } from "../../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../../utils/spacing";
import { Shadows } from "../../utils/shadows";

const TransactionItem = ({ item, onPress, index = 0 }) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const formatAmount = (amount) => {
    const numAmount = parseFloat(amount);
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numAmount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    if (typeof dateStr === "string" && dateStr.includes("/")) {
      return dateStr;
    }
    return dateStr;
  };

  const isSent = true;

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
      opacity.value = withTiming(0.85, { duration: 80 });
      runOnJS(triggerHaptic)();
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 12, stiffness: 350 });
      opacity.value = withTiming(1, { duration: 150 });
    })
    .onEnd(() => {
      runOnJS(handlePress)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  // Stagger delay based on index
  const staggerDelay = index * 50;

  return (
    <Animated.View
      entering={FadeInRight.delay(staggerDelay).springify().damping(15).stiffness(100)}
    >
      <GestureDetector gesture={tapGesture}>
        <Animated.View
          style={[
            styles.container,
            { backgroundColor: colors.SURFACE },
            animatedStyle,
          ]}
        >
          <View style={styles.leftSection}>
            <View style={[styles.iconContainer, { backgroundColor: `${colors.ERROR}15` }]}>
              <Icon
                name={isSent ? "arrow-up-right" : "arrow-down-left"}
                size={IconSize.sm}
                color={isSent ? colors.ERROR : colors.SUCCESS}
              />
            </View>
            <View style={styles.details}>
              <Text style={[styles.receiver, { color: colors.TEXT_PRIMARY }]} numberOfLines={1}>
                {item.receiver || "Bilinmeyen"}
              </Text>
              <Text style={[styles.date, { color: colors.TEXT_SECONDARY }]}>{formatDate(item.date)}</Text>
            </View>
          </View>

          <View style={styles.rightSection}>
            <Text style={[styles.amount, { color: isSent ? colors.ERROR : colors.SUCCESS }]}>
              {isSent ? "-" : "+"}₺{formatAmount(item.amount)}
            </Text>
            <Icon name="chevron-right" size={IconSize.sm} color={colors.GRAY_400} />
          </View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
    ...Shadows.xs,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  receiver: {
    ...TextStyles.bodyMedium,
    fontWeight: "500",
  },
  date: {
    ...TextStyles.caption,
    marginTop: 2,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  amount: {
    ...TextStyles.bodyMedium,
    fontWeight: "600",
    marginRight: Spacing.xs,
  },
});

export default TransactionItem;
