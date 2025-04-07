//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, Button, FlatList } from "react-native";
import { useSelector } from "react-redux";

// create a component
const HomeScreen = ({ navigation }) => {
  const balance = useSelector((state) => state.wallet.balance);
  const transactions = useSelector((state) => state.wallet.transactions);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet Balance</Text>
      <Text style={styles.balance}>${balance.toFixed(2)}</Text>

      <Button
        title="Transfer Money"
        onPress={() => navigation.navigate("Transfer")}
      />
      <Text style={styles.subtitle}>Recent Transactions</Text>

      <FlatList
        data={transactions}
        keyExtractor={({ item }) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.transaction}>
            <Text>To: {item.recipient}</Text>
            <Text>To: {item.amount.toFixed(2)}</Text>
            <Text>To: {item.description}</Text>
          </View>
        )}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

//make this component available to the app
export default HomeScreen;
