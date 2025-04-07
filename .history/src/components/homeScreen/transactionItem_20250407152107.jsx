import React from "react";
import { View, Text } from "react-native";
import styles from "../../styles/components/homeScreen/transactionItemStyles";

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

export default TransactionItem;
