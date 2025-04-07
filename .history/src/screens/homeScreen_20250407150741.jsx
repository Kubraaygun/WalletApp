import React, { useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setInitialData, resetBalance } from "../store/walletSlice";
import CustomButton from "../components/customButton";
import { Colors } from "../utils/colors";
import BalanceCard from "../components/homeScreen/balanceCard";
import TransactionList from "../components/homeScreen/transactionList";
import { height } from "../utils/constant";
import styles from "../styles/screens/homeScreenStyles";

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
  }, []);

  const handleReset = () => {
    dispatch(resetBalance());
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.PRIMARY }}>
      <View style={styles.container}>
        {/* BALANCE  */}
        <BalanceCard balance={balance} />

        {transactions.length > 0 && (
          <Text style={styles.sectionTitle}>Son İşlemler</Text>
        )}
        {/* TRANSACTION LIST  */}
        <TransactionList transactions={transactions} />

        <CustomButton
          title="Para Gönder"
          onPress={() => navigation.navigate("TransferScreen")}
          style={styles.sendButton}
        />
        <CustomButton
          title="Sıfırla"
          onPress={handleReset}
          style={styles.resetButton}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
