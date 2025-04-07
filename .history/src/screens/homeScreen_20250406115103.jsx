import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Animated,
} from "react-native";
import { Colors } from "../utils/colors";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../components/customButton";
import { setInitialData, addTransaction } from "../store/walletSlice";

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { balance, transactions } = useSelector((state) => state.wallet);

  useEffect(() => {
    const loadData = async () => {
      const storedData = await AsyncStorage.getItem("walletData");
      console.log(storedData);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        dispatch(setInitialData(parsedData));
      }
    };

    loadData();
  }, [dispatch]); // Bu effect sadece component mount olduğunda çalışacak
  const handleTransaction = (amount, receiver) => {
    // Yeni bir işlem ekleyelim
    dispatch(addTransaction({ amount, receiver }));
    // Animasyonla bakiyeyi güncelle
    Animated.timing(balanceAnim, {
      toValue: balance - amount,
      duration: 500,
      useNativeDriver: false,
    }).start();
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
        <Text style={styles.title}>Cüzdan</Text>

        {/* Bakiye gösterimi */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>Bakiye:</Text>
          <Animated.Text style={styles.balanceAmount}>
            {balanceAnim.interpolate({
              inputRange: [0, balance],
              outputRange: ["0", `${balance} TL`],
            })}
          </Animated.Text>
        </View>

        <View style={styles.transactionsContainer}>
          <Text style={styles.sectionTitle}>Son İşlemler</Text>

          {/* FlatList ile son işlemleri göster */}
          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
              <Text style={styles.noTransactionsText}>
                Henüz işlem yapılmadı.
              </Text>
            }
          />
        </View>

        <TouchableOpacity
          style={styles.transferButton}
          onPress={() => navigation.navigate("TransferScreen")}
        >
          <Text style={styles.transferButtonText}>Transfer Yap</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  card: {
    width: "100%",
    backgroundColor: Colors.LIGHT,

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
    fontSize: 18,
    color: Colors.BLACK,
    marginBottom: 10,
    fontWeight: "bold",
  },
  balanceText: {
    fontSize: 32,
    color: Colors.BLACK,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  transactionList: {
    width: "100%",
  },
  transactionItem: {
    backgroundColor: Colors.BLACK,
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  transactionsText: {
    color: Colors.BLACK,
    fontSize: 16,
  },
});

export default HomeScreen;
