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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 17,
    marginTop: 20,
    marginLeft: 16,
    alignSelf: "flex-start",
    fontWeight: "bold",
  },
  sendButton: {
    position: "absolute",
    bottom: 60,
    height: height * 0.1,
    width: "60%",
    backgroundColor: Colors.BLACK,
  },
  resetButton: {
    position: "absolute",
    bottom: 5,
    width: "30%",
    backgroundColor: Colors.LIGHTGRAY,
  },
});

export default HomeScreen;
