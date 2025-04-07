//import liraries
import React, { Component, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../utils/colors";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "react-native-gesture-handler";
import CustomButton from "../components/customButton";

// create a component
const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { balance, transactions } = useSelector((state) => state.wallet);

  useEffect(() => {
    const loadData = async () => {
      const storedData = await AsyncStorage.getItem("walletData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        dispatch(setInitialData(parsedData));
      }
    };
    loadData();
  }, [dispatch]);

  const handleClearWallet = () => {
    dispatch(clearWallet());
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactions}>
      <Text style={styles.transactionsText}>Receiver: {item.receiver}</Text>
      <Text style={styles.transactionsText}>Amount:{item.amount}</Text>
      <Text style={styles.transactionsText}> Date:{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.balanceText}>Balance: {balance}</Text>

      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.transactionList}
      />

      <CustomButton
        title="Transfer Money"
        onPress={() => navigation.navigate("TransferScreen")}
        style={styles.button}
      />
      <CustomButton
        title="Clear Wallet"
        onPress={handleClearWallet}
        style={[styles.button, styles.clearButton]}
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
    backgroundColor: Colors.WHITE,
    padding: 20,
  },
  balanceText: {
    fontSize: 24,
    marginBottom: 20,
  },
  transactionList: {
    marginBottom: 20,
    width: "100%",
  },
  transactionItem: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  transactionText: {
    fontSize: 16,
  },
  button: {
    marginBottom: 10,
    width: "60%",
  },
  clearButton: {
    backgroundColor: Colors.GREEN,
  },
});

//make this component available to the app
export default HomeScreen;
