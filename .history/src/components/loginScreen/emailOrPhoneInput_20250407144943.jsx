import React from "react";
import { Text, StyleSheet } from "react-native";
import CustomTextInput from "../customTextInput";
import styles from "../../styles/components/loginscreen/EmailOrPhoneInputStyles";
const EmailOrPhoneInput = ({ value, onChangeText, onBlur, error }) => (
  <>
    <CustomTextInput
      placeholder="Email or Phone"
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </>
);

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});

export default EmailOrPhoneInput;
