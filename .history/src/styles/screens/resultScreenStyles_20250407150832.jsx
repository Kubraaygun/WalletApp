import { StyleSheet } from "react-native";
import { Colors } from "../../utils/colors";

const ResultScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
});

export default ResultScreenStyles;
