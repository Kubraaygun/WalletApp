import React, { useEffect } from "react";
import { View, Text, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity } from "react-native";
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
import { Colors } from "../utils/colors";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";
import { Shadows } from "../utils/shadows";

// Components
import ResultInfo from "../components/resultScreen/resultInfo";
import ActionButtons from "../components/resultScreen/actionButton";

const ResultScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.BACKGROUND} />

      <View style={styles.container}>
        {/* Success/Error Icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            success ? styles.successIcon : styles.errorIcon,
            iconAnimatedStyle,
          ]}
        >
          <Icon
            name={success ? "check" : "x"}
            size={IconSize["3xl"]}
            color={Colors.WHITE}
          />
        </Animated.View>

        {/* Title */}
        <Text style={styles.title}>
          {success ? "Transfer Başarılı!" : "Transfer Başarısız"}
        </Text>
        <Text style={styles.subtitle}>
          {success
            ? "Paranız başarıyla gönderildi"
            : errorMessage || "İşlem sırasında bir hata oluştu"}
        </Text>

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
              <Icon name="share-2" size={IconSize.sm} color={Colors.ACCENT} />
              <Text style={styles.shareText}>Makbuzu Paylaş</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <ActionButtons success={success} navigation={navigation} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: Spacing["3xl"],
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
    ...Shadows.lg,
  },
  successIcon: {
    backgroundColor: Colors.SUCCESS,
  },
  errorIcon: {
    backgroundColor: Colors.ERROR,
  },
  title: {
    ...TextStyles.h1,
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.xxs,
    textAlign: "center",
  },
  subtitle: {
    ...TextStyles.bodyMedium,
    color: Colors.TEXT_SECONDARY,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  contentContainer: {
    width: "100%",
    flex: 1,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
  },
  shareText: {
    ...TextStyles.labelMedium,
    color: Colors.ACCENT,
    marginLeft: Spacing.xs,
  },
  buttonsContainer: {
    width: "100%",
    paddingBottom: Spacing.xl,
  },
});

export default ResultScreen;
