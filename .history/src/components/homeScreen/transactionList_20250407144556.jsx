import React from "react";
import { FlatList, Text, StyleSheet } from "react-native";
import TransactionItem from "./transactionItem";

const TransactionList = ({ transactions }) => {
  if (!transactions.length)
    return (
      <Text style={{ marginTop: 10, position: "absolute", top: "50%" }}>
        Henüz işlem yok
      </Text>
    );

  return (
    <FlatList
      data={transactions}
      renderItem={({ item }) => <TransactionItem item={item} />}
      keyExtractor={(_, index) => index.toString()}
      contentContainerStyle={styles.transactionList}
      style={styles.flatList}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default TransactionList;
