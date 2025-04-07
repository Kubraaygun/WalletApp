import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../utils/colors";

const TransactionItem = ({ item }) => (
  <View style={styles.transactionItem}>
    <View>
      <Text style={styles.transactionsText}>{item.receiver}</Text>
      <Text style={styles.transactionsText}>{item.date}</Text>
    </View>
    <Text style={styles.transactionsText}>
      ₺
      {parseFloat(item.amount).toLocaleString("tr-TR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}
    </Text>
  </View>
);

const styles = StyleSheet.create({
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

export default TransactionItem;
