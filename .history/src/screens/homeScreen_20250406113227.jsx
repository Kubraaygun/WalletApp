import React, { useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList } from "react-native";
import { Colors } from "../utils/colors";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../components/customButton";
import { setInitialData } from "../store/walletSlice";

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { balance, transactions } = useSelector((state) => state.wallet);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("walletData");
        console.log("Stored Data:", storedData); // Burada veriyi kontrol et
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          console.log("Parsed Data:", parsedData); // Veriyi kontrol et
          dispatch(setInitialData(parsedData));
        } 
      } 
    };

    loadData();
  }, []); // sadece componeeffect sadece component mount olduğunda çalışacak

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
          <Text style={styles.balanceText}>₺ {(balance || 0).toFixed(2)}</Text>
        </View>

        <Text style={styles.sectionTitle}>Son İşlemler</Text>

        {transactions && transactions.length === 0 ? (
          <Text style={{ marginTop: 10 }}>Henüz işlem yok</Text>
        ) : (
          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.transactionList}
          />
        )}

        <CustomButton
          title="Para Gönder"
          onPress={() => navigation.navigate("TransferScreen")}
          style={{
            marginTop: 20,
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
