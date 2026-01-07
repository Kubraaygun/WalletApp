import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { BorderRadius, ButtonHeight, Spacing, moderateScale } from "../utils/spacing";
import { Shadows } from "../utils/shadows";

const CustomButton = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  style,
  textStyle,
  ...props
}) => {
  const { colors } = useTheme();

  const getVariantStyles = () => {
    const variants = {
      primary: {
        button: {
          backgroundColor: colors.ACCENT,
          ...Shadows.md,
        },
        text: {
          color: colors.WHITE,
        },
      },
      secondary: {
        button: {
          backgroundColor: colors.GRAY_100,
        },
        text: {
          color: colors.TEXT_PRIMARY,
        },
      },
      outline: {
        button: {
          backgroundColor: "transparent",
          borderWidth: 1.5,
          borderColor: colors.ACCENT,
        },
        text: {
          color: colors.ACCENT,
        },
      },
      ghost: {
        button: {
          backgroundColor: "transparent",
        },
        text: {
          color: colors.ACCENT,
        },
      },
      danger: {
        button: {
          backgroundColor: colors.ERROR,
          ...Shadows.md,
        },
        text: {
          color: colors.WHITE,
        },
      },
      success: {
        button: {
          backgroundColor: colors.SUCCESS,
          ...Shadows.md,
        },
        text: {
          color: colors.WHITE,
        },
      },
    };
    return variants[variant] || variants.primary;
  };

  const getSizeStyles = () => {
    const sizes = {
      sm: {
        button: {
          height: ButtonHeight.sm,
          paddingHorizontal: Spacing.md,
          borderRadius: BorderRadius.sm,
        },
        text: {
          fontSize: moderateScale(12),
          fontWeight: "500",
        },
      },
      md: {
        button: {
          height: ButtonHeight.md,
          paddingHorizontal: Spacing.lg,
          borderRadius: BorderRadius.md,
        },
        text: {
          fontSize: moderateScale(14),
          fontWeight: "600",
        },
      },
      lg: {
        button: {
          height: ButtonHeight.lg,
          paddingHorizontal: Spacing.xl,
          borderRadius: BorderRadius.lg,
        },
        text: {
          fontSize: moderateScale(16),
          fontWeight: "600",
        },
      },
    };
    return sizes[size] || sizes.md;
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        sizeStyles.button,
        variantStyles.button,
        fullWidth && styles.fullWidth,
        disabled && { backgroundColor: colors.GRAY_200, opacity: 0.7 },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.text.color} size="small" />
      ) : (
        <View style={styles.content}>
          {leftIcon}
          <Text
            style={[
              styles.text,
              sizeStyles.text,
              variantStyles.text,
              disabled && { color: colors.GRAY_400 },
              (leftIcon || rightIcon) && styles.textWithIcon,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: Spacing.xs,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: {
    width: "100%",
  },
  text: {
    textAlign: "center",
  },
  textWithIcon: {
    marginHorizontal: Spacing.xs,
  },
});

export default CustomButton;
