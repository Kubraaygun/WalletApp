import { StyleSheet } from "react-native";

const BalanceCardStyles = StyleSheet.create({
  card: {
    width: "90%",
    borderWidth: 0.6,
    backgroundColor: Colors.LIGHT,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    color: Colors.BLACK,
    marginBottom: 10,
    fontWeight: "bold",
  },
});

export default BalanceCardStyles;
