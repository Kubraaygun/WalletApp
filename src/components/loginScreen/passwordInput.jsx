import React from "react";
import CustomTextInput from "../customTextInput";

const PasswordInput = ({ value, onChangeText, onBlur, error }) => (
  <CustomTextInput
    label="Parola"
    placeholder="••••••••"
    value={value}
    onChangeText={onChangeText}
    onBlur={onBlur}
    error={error}
    leftIcon="lock"
    secureTextEntry={true}
    showPasswordToggle={true}
    autoCapitalize="none"
  />
);

export default PasswordInput;
