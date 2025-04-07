import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors } from "../utils/colors";

const CustomButton = ({
  title,
  onPress,
  style,
  disabled,
  secureTextEntry,
  textStyle,
  backgroundColor = Colors.BLACK,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      {...props}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
