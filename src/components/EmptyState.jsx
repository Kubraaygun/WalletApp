import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Animated, { 
  FadeIn, 
  SlideInUp,
} from "react-native-reanimated";
import { Feather as Icon } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";

/**
 * EmptyState - Reusable empty state component
 * 
 * @param {string} icon - Feather icon name
 * @param {string} title - Main title
 * @param {string} description - Description text
 * @param {string} actionLabel - Button label
 * @param {function} onAction - Button press callback
 */
const EmptyState = ({ 
  icon = "inbox",
  title = "Henüz içerik yok",
  description = "Burada gösterilecek bir şey yok.",
  actionLabel,
  onAction,
}) => {
  const { colors } = useTheme();

  return (
    <Animated.View 
      entering={FadeIn.duration(400)}
      style={styles.container}
    >
      {/* Icon */}
      <Animated.View 
        entering={SlideInUp.delay(100).springify()}
        style={[styles.iconContainer, { backgroundColor: `${colors.PRIMARY}15` }]}
      >
        <Icon 
          name={icon} 
          size={IconSize["2xl"]} 
          color={colors.PRIMARY} 
        />
      </Animated.View>

      {/* Text */}
      <Animated.View entering={FadeIn.delay(200)}>
        <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>
          {title}
        </Text>
        <Text style={[styles.description, { color: colors.TEXT_SECONDARY }]}>
          {description}
        </Text>
      </Animated.View>

      {/* Action Button */}
      {actionLabel && onAction && (
        <Animated.View entering={FadeIn.delay(300)}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.PRIMARY }]}
            onPress={onAction}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>{actionLabel}</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
};

/**
 * ErrorState - Error display component
 */
export const ErrorState = ({ 
  title = "Bir hata oluştu",
  description = "Lütfen daha sonra tekrar deneyin.",
  onRetry,
}) => {
  const { colors } = useTheme();

  return (
    <Animated.View 
      entering={FadeIn.duration(400)}
      style={styles.container}
    >
      <Animated.View 
        entering={SlideInUp.delay(100).springify()}
        style={[styles.iconContainer, { backgroundColor: `${colors.ERROR}15` }]}
      >
        <Icon 
          name="alert-circle" 
          size={IconSize["2xl"]} 
          color={colors.ERROR} 
        />
      </Animated.View>

      <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>
        {title}
      </Text>
      <Text style={[styles.description, { color: colors.TEXT_SECONDARY }]}>
        {description}
      </Text>

      {onRetry && (
        <Animated.View entering={FadeIn.delay(300)}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.ERROR }]}
            onPress={onRetry}
            activeOpacity={0.8}
          >
            <Icon name="refresh-cw" size={18} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.actionButtonText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
};

/**
 * NoConnectionState - Offline state component
 */
export const NoConnectionState = ({ onRetry }) => {
  const { colors } = useTheme();

  return (
    <Animated.View 
      entering={FadeIn.duration(400)}
      style={styles.container}
    >
      <Animated.View 
        entering={SlideInUp.delay(100).springify()}
        style={[styles.iconContainer, { backgroundColor: `${colors.WARNING}15` }]}
      >
        <Icon 
          name="wifi-off" 
          size={IconSize["2xl"]} 
          color={colors.WARNING} 
        />
      </Animated.View>

      <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>
        İnternet bağlantısı yok
      </Text>
      <Text style={[styles.description, { color: colors.TEXT_SECONDARY }]}>
        Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.
      </Text>

      {onRetry && (
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.PRIMARY }]}
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing["3xl"],
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    ...TextStyles.h4,
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  description: {
    ...TextStyles.bodyMedium,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  buttonIcon: {
    marginRight: Spacing.xs,
  },
  actionButtonText: {
    ...TextStyles.labelMedium,
    color: "#FFFFFF",
  },
});

export default EmptyState;
