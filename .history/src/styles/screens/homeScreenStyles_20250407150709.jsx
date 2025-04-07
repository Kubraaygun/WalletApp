import { StyleSheet } from "react-native";

const HomeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 17,
    marginTop: 20,
    marginLeft: 16,
    alignSelf: "flex-start",
    fontWeight: "bold",
  },
  sendButton: {
    position: "absolute",
    bottom: 60,
    width: "60%",
    backgroundColor: Colors.BLACK,
  },
  resetButton: {
    position: "absolute",
    bottom: 5,
    width: "30%",
    backgroundColor: Colors.LIGHTGRAY,
  },
});

export default HomeScreenStyles;
