import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";
import { Colors } from "../utils/colors";
import { BorderRadius, ButtonHeight, Spacing } from "../utils/spacing";
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
  const getVariantStyles = () => {
    const variants = {
      primary: {
        button: {
          backgroundColor: Colors.ACCENT,
          ...Shadows.md,
        },
        text: {
          color: Colors.WHITE,
        },
      },
      secondary: {
        button: {
          backgroundColor: Colors.GRAY_100,
        },
        text: {
          color: Colors.TEXT_PRIMARY,
        },
      },
      outline: {
        button: {
          backgroundColor: "transparent",
          borderWidth: 1.5,
          borderColor: Colors.ACCENT,
        },
        text: {
          color: Colors.ACCENT,
        },
      },
      ghost: {
        button: {
          backgroundColor: "transparent",
        },
        text: {
          color: Colors.ACCENT,
        },
      },
      danger: {
        button: {
          backgroundColor: Colors.ERROR,
          ...Shadows.md,
        },
        text: {
          color: Colors.WHITE,
        },
      },
      success: {
        button: {
          backgroundColor: Colors.SUCCESS,
          ...Shadows.md,
        },
        text: {
          color: Colors.WHITE,
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
          fontSize: 12,
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
          fontSize: 14,
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
          fontSize: 16,
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
        disabled && styles.disabled,
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
              disabled && styles.disabledText,
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
  disabled: {
    backgroundColor: Colors.GRAY_200,
    opacity: 0.7,
  },
  disabledText: {
    color: Colors.GRAY_400,
  },
});

export default CustomButton;
