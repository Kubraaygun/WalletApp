import { StyleSheet } from "react-native";

const PasswordInputStyles = StyleSheet.create({
  passwordContainer: {
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    right: 17,
    top: "50%",
    transform: [{ translateY: -17 }],
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});

export default PasswordInputStyles;
