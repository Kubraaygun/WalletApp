import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Animated,
} from "react-native";
import { Colors } from "../utils/colors";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../components/customButton";
import { setInitialData } from "../store/walletSlice";

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { balance, transactions } = useSelector((state) => state.wallet);

  const [refreshing, setRefreshing] = useState(false);
  const animatedBalance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadData();
  }, [dispatch]);

  useEffect(() => {
    Animated.timing(animatedBalance, {
      toValue: balance,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [balance]);

  const loadData = async () => {
    const storedData = await AsyncStorage.getItem("walletData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      dispatch(setInitialData(parsedData));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionsText}>Receiver: {item.receiver}</Text>
      <Text style={styles.transactionsText}>Amount: {item.amount}</Text>
      <Text style={styles.transactionsText}>Date: {item.date}</Text>
    </View>
  );

  const animatedBalanceText = animatedBalance.interpolate({
    inputRange: [0, 100000],
    outputRange: [0, 100000],
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current Balance</Text>
        <Animated.Text style={styles.balance}>
          $
          {animatedBalanceText.toFixed
            ? animatedBalanceText.toFixed(2)
            : balance}
        </Animated.Text>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.transactionList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <CustomButton
        title="Transfer Money"
        onPress={() => navigation.navigate("TransferScreen")}
        style={{
          marginTop: 20,
          width: "60%",
          backgroundColor: Colors.BLACK,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    padding: 20,
    paddingTop: 50,
  },
  card: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    color: Colors.WHITE,
    marginBottom: 8,
  },
  balance: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.WHITE,
  },
  transactionList: {
    paddingBottom: 20,
  },
  transactionItem: {
    backgroundColor: Colors.PRIMARY,
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
  },
  transactionsText: {
    color: Colors.WHITE,
    fontSize: 14,
  },
});

export default HomeScreen;
