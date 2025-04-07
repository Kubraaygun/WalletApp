import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList } from "react-native";
import { Colors } from "../utils/colors";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../components/customButton";
import { setInitialData } from "../store/walletSlice";
import { resetBalance } from "../store/walletSlice";
const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { balance, transactions } = useSelector((state) => state.wallet);

  useEffect(() => {
    const loadData = async () => {
      console.log(storedData);
      const storedData = await AsyncStorage.getItem("walletData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        dispatch(setInitialData(parsedData));
      }
    };

    loadData();
  }, []); // Bu effect sadece component mount olduğunda çalışacak
  const handleReset = () => {
    dispatch(resetBalance());
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <View>
        <Text style={styles.transactionsText}> {item.receiver}</Text>
        <Text style={styles.transactionsText}> {item.date}</Text>
      </View>

      <Text style={styles.transactionsText}>
        ₺{" "}
        {parseFloat(item.amount).toLocaleString("tr-TR", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.PRIMARY }}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cüzdan Bakiyesi</Text>
          <Text style={styles.balanceText}>
            <Text style={styles.balanceText}>
              {parseFloat(balance).toLocaleString("tr-TR", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
              })}{" "}
              TL
            </Text>
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Son İşlemler</Text>

        {transactions && transactions.length === 0 ? (
          <Text style={{ marginTop: 10 }}>Henüz işlem yok</Text>
        ) : (
          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={(index) => index.toString()}
            contentContainerStyle={styles.transactionList}
          />
        )}

        <CustomButton
          title="Para Gönder"
          onPress={() => navigation.navigate("TransferScreen")}
          style={{
            position: "absolute",
            bottom: 90,
            width: "60%",
            backgroundColor: Colors.BLACK,
          }}
        />

        <CustomButton
          title="Sifirla"
          onPress={handleReset}
          style={{
            position: "absolute",
            bottom: 20,
            width: "60%",
            backgroundColor: Colors.GREEN,
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
    flexDirection: "row",
    backgroundColor: Colors.LIGHT,
    padding: 15,
    width: 300,
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 0.5,
  },
  transactionsText: {
    color: Colors.BLACK,
    margin: 3,
    padding: 3,
    fontSize: 16,
  },
});

export default HomeScreen;
