import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { Colors } from "../utils/colors";
import { TextStyles } from "../utils/typography";
import { BorderRadius, InputHeight, Spacing, IconSize } from "../utils/spacing";
import { Shadows } from "../utils/shadows";

const CustomTextInput = ({
  label,
  placeholder = "",
  value,
  onChangeText,
  onBlur,
  onFocus,
  error,
  secureTextEntry = false,
  keyboardType = "default",
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  size = "md",
  disabled = false,
  helperText,
  maxLength,
  autoCapitalize = "none",
  style,
  inputStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const toggleSecure = () => {
    setIsSecure(!isSecure);
  };

  const getLabelStyle = () => ({
    position: "absolute",
    left: leftIcon ? Spacing.xl + Spacing.md : Spacing.md,
    top: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [InputHeight[size] / 2 - 8, -8],
    }),
    fontSize: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [14, 12],
    }),
    color: error
      ? Colors.ERROR
      : isFocused
        ? Colors.ACCENT
        : Colors.TEXT_SECONDARY,
    backgroundColor: Colors.SURFACE,
    paddingHorizontal: 4,
    zIndex: 1,
  });

  const getBorderColor = () => {
    if (error) return Colors.ERROR;
    if (isFocused) return Colors.ACCENT;
    return Colors.BORDER;
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            height: InputHeight[size],
            borderColor: getBorderColor(),
            backgroundColor: disabled ? Colors.GRAY_50 : Colors.SURFACE,
          },
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}
      >
        {leftIcon && (
          <View style={styles.iconLeft}>
            <Icon
              name={leftIcon}
              size={IconSize.sm}
              color={isFocused ? Colors.ACCENT : Colors.GRAY_400}
            />
          </View>
        )}

        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || showPasswordToggle) && styles.inputWithRightIcon,
            inputStyle,
          ]}
          placeholder={!label || isFocused || value ? placeholder : ""}
          placeholderTextColor={Colors.GRAY_400}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          editable={!disabled}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          {...props}
        />

        {showPasswordToggle && secureTextEntry && (
          <TouchableOpacity style={styles.iconRight} onPress={toggleSecure}>
            <Icon
              name={isSecure ? "eye-off" : "eye"}
              size={IconSize.sm}
              color={Colors.GRAY_400}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !showPasswordToggle && (
          <View style={styles.iconRight}>
            <Icon
              name={rightIcon}
              size={IconSize.sm}
              color={Colors.GRAY_400}
            />
          </View>
        )}
      </View>

      {(error || helperText) && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
    width: "100%",
  },
  label: {
    ...TextStyles.labelMedium,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.xxs,
    marginLeft: Spacing.xs,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.SURFACE,
  },
  inputFocused: {
    ...Shadows.sm,
    borderWidth: 2,
  },
  inputError: {
    borderColor: Colors.ERROR,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: Spacing.md,
    fontSize: 14,
    fontWeight: "400",
    color: Colors.TEXT_PRIMARY,
  },
  inputWithLeftIcon: {
    paddingLeft: Spacing.xs,
  },
  inputWithRightIcon: {
    paddingRight: Spacing.xs,
  },
  iconLeft: {
    paddingLeft: Spacing.md,
  },
  iconRight: {
    paddingRight: Spacing.md,
  },
  helperText: {
    marginTop: Spacing.xxs,
    marginLeft: Spacing.md,
    ...TextStyles.caption,
    color: Colors.TEXT_SECONDARY,
  },
  errorText: {
    color: Colors.ERROR,
  },
});

export default CustomTextInput;
