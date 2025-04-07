//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useSelector } from "react-redux";

// create a component
const HomeScreen = ({ navigation }) => {
  const balance = useSelector((state) => state.wallet.balance);
  const transactions = useSelector((state) => state.wallet.transactions);
  return (
    <View style={styles.container}>
      <Text>Wallet Balance</Text>
      <Text>${balance.toFixed(2)}</Text>

      <Button
        title="Transfer Money"
        onPress={() => navigation.navigate("Transfer")}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

//make this component available to the app
export default HomeScreen;
