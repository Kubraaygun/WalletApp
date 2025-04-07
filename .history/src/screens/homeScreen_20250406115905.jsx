import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setInitialData } from "../store/walletSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../utils/colors"; // Renkleriniz varsa ekleyin

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { balance, transactions } = useSelector((state) => state.wallet);

  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Pull to refresh fonksiyonu
  const onRefresh = () => {
    setIsRefreshing(true);
    AsyncStorage.getItem("walletData")
      .then((data) => {
        if (data) {
          const parsedData = JSON.parse(data);
          dispatch(setInitialData(parsedData));
        }
      })
      .finally(() => setIsRefreshing(false));
  };

  // Component did mount
  useEffect(() => {
    AsyncStorage.getItem("walletData")
      .then((data) => {
        if (data) {
          const parsedData = JSON.parse(data);
          dispatch(setInitialData(parsedData));
        }
      })
      .catch((error) => console.error("Error loading wallet data: ", error));
  }, [dispatch]);

  const renderItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionText}>
        {item.receiver} - {item.amount} TL
      </Text>
      <Text style={styles.transactionDate}>
        {new Date(item.date).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.balanceTitle}>Cüzdan Bakiyesi</Text>
      <Text style={styles.balanceAmount}>{balance} TL</Text>

      <FlatList
        data={transactions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.transactionsContainer}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.PRIMARY, // Renk ayarlama
  },
  balanceTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.WHITE, // Renk ayarlama
    marginBottom: 10,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.WHITE, // Renk ayarlama
    marginBottom: 20,
  },
  transactionsContainer: {
    flexGrow: 1,
  },
  transactionItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: Colors.WHITE, // Renk ayarlama
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  transactionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionDate: {
    fontSize: 12,
    color: "#777",
    marginTop: 5,
  },
});

export default HomeScreen;
