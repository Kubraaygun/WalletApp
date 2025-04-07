import React from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";
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
const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    width: width * 0.7,
  },
  error: {
    color: "red",
    fontSize: 12,
  },
});

export default CustomTextInput;
