import React from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { TextStyles } from "../utils/typography";
import { BorderRadius, InputHeight, Spacing, IconSize, moderateScale } from "../utils/spacing";

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
  const { colors } = useTheme();
  const [isSecure, setIsSecure] = React.useState(secureTextEntry);

  const toggleSecure = () => {
    setIsSecure(prev => !prev);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: colors.TEXT_SECONDARY }]}>{label}</Text>
      )}

      <View
        style={[
          styles.inputContainer,
          { 
            height: InputHeight[size], 
            borderColor: error ? colors.ERROR : colors.BORDER,
            backgroundColor: colors.SURFACE,
          },
        ]}
      >
        {leftIcon && (
          <View style={styles.iconLeft}>
            <Icon
              name={leftIcon}
              size={moderateScale(18)}
              color={colors.GRAY_400}
            />
          </View>
        )}

        <TextInput
          style={[
            styles.input,
            { color: colors.TEXT_PRIMARY },
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || showPasswordToggle) && styles.inputWithRightIcon,
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.GRAY_400}
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
              size={moderateScale(18)}
              color={colors.GRAY_400}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !showPasswordToggle && (
          <View style={styles.iconRight}>
            <Icon
              name={rightIcon}
              size={moderateScale(18)}
              color={colors.GRAY_400}
            />
          </View>
        )}
      </View>

      {(error || helperText) && (
        <Text style={[styles.helperText, { color: error ? colors.ERROR : colors.TEXT_SECONDARY }]}>
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
    marginBottom: Spacing.xxs,
    marginLeft: Spacing.xs,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: Spacing.md,
    fontSize: moderateScale(14),
    fontWeight: "400",
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
  },
});

export default CustomTextInput;
