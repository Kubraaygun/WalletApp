import React from "react";
import CustomTextInput from "../customTextInput";

const EmailOrPhoneInput = ({ value, onChangeText, onBlur, error }) => (
  <CustomTextInput
    label="Email veya Telefon"
    placeholder="ornek@email.com"
    value={value}
    onChangeText={onChangeText}
    onBlur={onBlur}
    error={error}
    leftIcon="user"
    keyboardType="email-address"
    autoCapitalize="none"
  />
);

export default EmailOrPhoneInput;
