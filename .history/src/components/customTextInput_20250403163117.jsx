import React from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";
const CustomTextInput = (
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry
) => {
  return (
    <View style={{ marginBottom: 15 }}>
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
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  error: {
    color: "red",
    fontSize: 12,
  },
});

export default CustomTextInput;
