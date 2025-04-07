import React from "react";
import { Text } from "react-native";
import CustomTextInput from "../customTextInput";
import styles from "../../styles/components/loginscreen/EmailOrPhoneInputStyles";
const EmailOrPhoneInput = ({ value, onChangeText, onBlur, error }) => (
  <>
    <CustomTextInput
      placeholder="Email veya Telefon"
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </>
);

export default EmailOrPhoneInput;
