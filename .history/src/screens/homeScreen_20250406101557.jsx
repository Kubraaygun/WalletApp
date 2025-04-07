import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  RefreshControl,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Colors } from "../utils/colors";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../components/customButton";
import { setInitialData } from "../store/walletSlice";
import { width } from "../utils/constant";
import TransactionList from "../components/TransactionList";

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { balance, transactions = [] } = useSelector((state) => state.wallet);
  const [refreshing, setRefreshing] = useState(false);
  const animatedBalance = useRef(new Animated.Value(0)).current;
  const [animatedBalanceText, setAnimatedBalanceText] = useState("0");

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

  useEffect(() => {
    Animated.timing(animatedBalance, {
      toValue: balance,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [balance]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionsText}>To: {item.receiver}</Text>
      <Text style={styles.transactionsText}>₺ {item.amount}</Text>
      <Text style={styles.transactionsText}>{item.date}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.PRIMARY }}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cüzdan Bakiyesi</Text>
          <Text style={styles.balanceText}>₺{animatedBalanceText}</Text>
        </View>

        <Text style={styles.sectionTitle}>Son İşlemler:</Text>

        {transactions.length === 0 ? (
          <Text style={{ marginTop: 10 }}>Henüz işlem yok</Text>
        ) : (
          <TransactionList transactions={transactions} />
        )}

        <CustomButton
          title="Para Gönder"
          onPress={() => navigation.navigate("TransferScreen")}
          style={{
            bottom: 20,
            position: "absolute",
            width: "60%",
            backgroundColor: Colors.BLACK,
          }}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: Colors.PRIMARY,
  },
  card: {
    width: "100%",
    backgroundColor: Colors.WHITE,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    color: Colors.BLACK,
    marginBottom: 10,
    fontWeight: "bold",
  },
  balanceText: {
    fontSize: 34,
    color: Colors.BLACK,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 10,
    alignSelf: "flex-start",
    fontWeight: "bold",
  },
});

export default HomeScreen;
