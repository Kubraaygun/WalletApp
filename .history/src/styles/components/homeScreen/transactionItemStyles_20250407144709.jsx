import { StyleSheet } from "react-native";

const TransactionItemStyles = StyleSheet.create({
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.LIGHT,
    padding: 15,
    width: 300,
    borderRadius: 10,
    marginVertical: 9,
    borderWidth: 0.6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    borderColor: Colors.LIGHTGRAY,
  },
  transactionsText: {
    color: Colors.BLACK,
    margin: 3,
    padding: 3,
    fontSize: 16,
  },
});
export default TransactionItemStyles;
