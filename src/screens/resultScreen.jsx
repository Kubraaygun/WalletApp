import React, { useEffect } from "react";
import { View, Text, StatusBar, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { Feather as Icon } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize, moderateScale } from "../utils/spacing";
import { Shadows } from "../utils/shadows";

// Components
import ResultInfo from "../components/resultScreen/resultInfo";
import ActionButtons from "../components/resultScreen/actionButton";

const ResultScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { colors, isDark } = useTheme();

  const { success, phoneNumber, amount, description, timestamp, errorMessage } =
    params || {};

  const formattedAmount = parseFloat(amount).toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formattedDate = new Date(timestamp).toLocaleDateString("tr-TR");
  const formattedTime = new Date(timestamp).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Animations
  const iconScale = useSharedValue(0);
  const iconRotate = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    iconScale.value = withSequence(
      withTiming(1.2, { duration: 300 }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );
    iconRotate.value = success
      ? 0
      : withSpring(0, { damping: 12, stiffness: 200 });
    contentOpacity.value = withDelay(400, withTiming(1, { duration: 400 }));
  }, []);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { rotate: `${iconRotate.value}deg` },
    ],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  // Dynamic Styles
  const dynamicStyles = {
    iconContainer: {
      width: moderateScale(70),
      height: moderateScale(70),
      borderRadius: moderateScale(35),
    },
    buttonsContainer: {
      paddingBottom: moderateScale(Spacing.lg),
    },
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.BACKGROUND }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.BACKGROUND} />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.centerWrapper}>
          {/* Success/Error Icon */}
          <Animated.View
            style={[
              styles.iconContainer,
              dynamicStyles.iconContainer,
              { backgroundColor: success ? colors.SUCCESS : colors.ERROR },
              iconAnimatedStyle,
            ]}
          >
            <Icon
              name={success ? "check" : "x"}
              size={IconSize["3xl"]}
              color={colors.WHITE}
            />
          </Animated.View>

          {/* Title Area */}
          <View style={styles.titleArea}>
            <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>
              {success ? "Transfer Başarılı!" : "Transfer Başarısız"}
            </Text>
            <Text style={[styles.subtitle, { color: colors.TEXT_SECONDARY }]}>
              {success
                ? "Paranız başarıyla gönderildi"
                : errorMessage || "İşlem sırasında bir hata oluştu"}
            </Text>
          </View>

          {/* Transaction Details */}
          <Animated.View style={[styles.contentContainer, contentAnimatedStyle]}>
            <ResultInfo
              formattedAmount={formattedAmount}
              phoneNumber={phoneNumber}
              description={description}
              formattedDate={formattedDate}
              formattedTime={formattedTime}
            />

            {/* Share Button */}
            {success && (
              <TouchableOpacity style={styles.shareButton}>
                <Icon name="share-2" size={IconSize.sm} color={colors.ACCENT} />
                <Text style={[styles.shareText, { color: colors.ACCENT }]}>Makbuzu Paylaş</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>
      </ScrollView>

      {/* Action Buttons - Fixed at bottom */}
      <View style={[styles.buttonsContainer, dynamicStyles.buttonsContainer, { backgroundColor: colors.BACKGROUND }]}>
        <ActionButtons success={success} navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center", // Vertically center the content
    paddingBottom: Spacing.md,
  },
  centerWrapper: {
    alignItems: "center",
    width: "100%",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
    ...Shadows.lg,
  },
  titleArea: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  title: {
    ...TextStyles.h1,
    marginBottom: Spacing.xxs,
    textAlign: "center",
  },
  subtitle: {
    ...TextStyles.bodyMedium,
    textAlign: "center",
  },
  contentContainer: {
    width: "100%",
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: moderateScale(Spacing.sm),
    marginTop: Spacing.xs,
  },
  shareText: {
    ...TextStyles.labelMedium,
    marginLeft: Spacing.xs,
  },
  buttonsContainer: {
    width: "100%",
  },
});

export default ResultScreen;
