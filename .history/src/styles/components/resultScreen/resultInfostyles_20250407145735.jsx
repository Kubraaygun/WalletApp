import { StyleSheet } from "react-native";

const ResultInfoStyles = StyleSheet.create({
  resultInfo: {
    padding: 20,
    alignItems: "center",
    width: "90%",
    borderWidth: 1,
    backgroundColor: Colors.LIGHT,
    borderColor: Colors.LIGHTGRAY,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  info: {
    fontSize: 18,
    marginVertical: 5,
    fontWeight: "bold",
  },
});

export default ResultInfoStyles;
