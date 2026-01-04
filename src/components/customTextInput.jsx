import React from "react";
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
  const [isSecure, setIsSecure] = React.useState(secureTextEntry);

  const toggleSecure = () => {
    setIsSecure(prev => !prev);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}

      <View
        style={[
          styles.inputContainer,
          { height: InputHeight[size] },
          error && styles.inputError,
        ]}
      >
        {leftIcon && (
          <View style={styles.iconLeft}>
            <Icon
              name={leftIcon}
              size={IconSize.sm}
              color={Colors.GRAY_400}
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
          placeholder={placeholder}
          placeholderTextColor={Colors.GRAY_400}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          editable={!disabled}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
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
    borderColor: Colors.BORDER,
    backgroundColor: Colors.SURFACE,
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
