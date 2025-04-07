import { StyleSheet } from "react-native";

const ActionButtonsStyles = StyleSheet.create({
  button: {
    backgroundColor: Colors.BLACK,
    padding: 12,
    borderRadius: 8,
    marginTop: 30,
    width: "60%",
    alignItems: "center",
  },
  retryButton: {
    backgroundColor: "#D32F2F",
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ActionButtonsStyles;
