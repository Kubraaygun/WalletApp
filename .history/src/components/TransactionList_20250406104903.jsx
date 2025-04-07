// components/TransactionList.js
import React, { useState } from "react";
import { FlatList, View, Text, StyleSheet, RefreshControl } from "react-native";
import { Colors } from "../utils/colors";

const TransactionList = ({ transactions }) => {
  const [refreshing, setRefreshing] = useState(false);
  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionsText}>To: {item.receiver}</Text>
      <Text style={styles.transactionsText}>₺ {item.amount}</Text>
      <Text style={styles.transactionsText}>{item.date}</Text>
    </View>
  );
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <FlatList
      data={transactions}
      renderItem={renderTransaction}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.transactionList}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

const styles = StyleSheet.create({
  transactionList: {
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  transactionItem: {
    backgroundColor: Colors.WHITE,
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  transactionsText: {
    color: Colors.BLACK,
    fontSize: 16,
  },
});

export default TransactionList;
