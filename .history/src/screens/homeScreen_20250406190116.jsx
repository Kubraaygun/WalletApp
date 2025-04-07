import React, { useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList } from "react-native";
import { Colors } from "../utils/colors";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../components/customButton";
import { setInitialData } from "../store/walletSlice";
import { resetBalance } from "../store/walletSlice";
import { useRoute } from "@react-navigation/native";
const HomeScreen = ({ navigation }) => {
  const { balance, transactions } = useSelector((state) => state.wallet);
  const description = useSelector((state) => state.wallet.description);
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

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <View>
        <Text style={styles.transactionsText}> {item.receiver}</Text>
        <Text style={styles.transactionsDate}> {item.date}</Text>
      </View>

      <Text style={styles.transactionsText}>
        ₺
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
            {parseFloat(balance).toLocaleString("tr-TR", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 0,
            })}
            TL
          </Text>
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
            style={styles.flatList}
            showsVerticalScrollIndicator={false}
          />
        )}
        <CustomButton
          title="Para Gönder"
          onPress={() => navigation.navigate("TransferScreen")}
          style={{
            position: "absolute",
            bottom: 60,
            width: "60%",
            backgroundColor: Colors.BLACK,
          }}
        />

        <CustomButton
          title="Sifirla"
          onPress={handleReset}
          style={{
            position: "absolute",
            bottom: 5,
            width: "30%",
            backgroundColor: Colors.LIGHTGRAY,
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
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 0.5,
  },
  cardTitle: {
    fontSize: 18,
    color: Colors.BASEGRAY,
    marginBottom: 10,
    fontWeight: "bold",
  },
  balanceText: {
    fontSize: 32,
    color: Colors.BLACK,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 17,
    marginTop: 20,

    alignSelf: "flex-start",
    fontWeight: "bold",
  },

  transactionList: {
    width: "100%",
    paddingVertical: 25,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.LIGHT,
    padding: 15,
    width: 350,
    borderRadius: 10,
    marginVertical: 9,
    borderWidth: 0.4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    borderColor: Colors.LIGHTGRAY,
  },
  transactionsText: {
    color: Colors.BLACK,
    margin: 3,
    padding: 3,
    fontSize: 18,
  },
  flatList: {
    maxHeight: "65%",
  },
  transactionsDate: {
    color: Colors.BASEGRAY,
    margin: 3,
    padding: 3,
    fontSize: 16,
  },
});

export default HomeScreen;
