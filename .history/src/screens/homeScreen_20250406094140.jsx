//import liraries
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList, Animated } from "react-native";
import { Colors } from "../utils/colors";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {} from "react-native-gesture-handler";
import CustomButton from "../components/customButton";
import { setInitialData } from "../store/walletSlice";

// create a componentconst HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { balance, transactions } = useSelector((state) => state.wallet);
  const [refreshing, setRefreshing] = useState(false);
  const animatedBalance = useRef(new Animated.Value(0)).current;

  const loadData = async () => {
    const storedData = await AsyncStorage.getItem("walletData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      dispatch(setInitialData(parsedData));
    }
  };

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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionsText}>Receiver: {item.receiver}</Text>
      <Text style={styles.transactionsText}>Amount:{item.amount}</Text>
      <Text style={styles.transactionsText}> Date:{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current Balance</Text>
        <Animated.Text style={styles.balance}>
          ${Number(balance).toFixed(2)}
        </Animated.Text>
      </View>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.transactionList}
      />
      <CustomButton
        title="Transfer Money"
        onPress={() => navigation.navigate("TransferScreen")}
        style={{
          marginBottom: 20,
          width: "50%",
          backgroundColor: Colors.BLACK,
        }}
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
  transactionsText: {
    fontSize: 16,
  },
});

//make this component available to the app
export default HomeScreen;
