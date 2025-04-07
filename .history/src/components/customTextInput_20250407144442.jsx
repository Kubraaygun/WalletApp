import React from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";
import styles from "../styles/components/customTextInputStyles";
const CustomTextInput = ({
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default CustomTextInput;
