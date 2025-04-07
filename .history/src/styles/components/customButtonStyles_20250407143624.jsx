import { StyleSheet } from "react-native";
import { Colors } from "../../utils/colors";

const customButtonStyles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: Colors.LIGHT,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default customButtonStyles;
