import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import CustomTextInput from "../customTextInput";
import Icon from "react-native-vector-icons/Feather";
import { Colors } from "../../utils/colors";

const PasswordInput = ({
  value,
  onChangeText,
  onBlur,
  error,
  secureTextEntry,
  toggleVisibility,
}) => (
  <>
    <View style={styles.passwordContainer}>
      <CustomTextInput
        placeholder="Password"
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
      />
      <TouchableOpacity style={styles.iconContainer} onPress={toggleVisibility}>
        <Icon
          name={secureTextEntry ? "eye-off" : "eye"}
          size={22}
          color={secureTextEntry ? Colors.LIGHTGRAY : Colors.BLACK}
        />
      </TouchableOpacity>
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </>
);

const styles = StyleSheet.create({
  passwordContainer: {
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -17 }],
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});

export default PasswordInput;
