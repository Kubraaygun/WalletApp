import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Platform,
} from "react-native";
import { Colors } from "../utils/colors";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../components/customButton";
import { setInitialData } from "../store/walletSlice";
import { resetBalance } from "../store/walletSlice";
import useWindowDimensions from "../components/useWindowDimensions";
import { height, width } from "../utils/constant";
const HomeScreen = ({ navigation }) => {
  const { height, width } = useWindowDimensions();
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

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <View>
        <Text style={styles.transactionsText}> {item.receiver}</Text>
        <Text style={styles.transactionsText}> {item.date}</Text>
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
        {/* Cüzdan Bakiyesi Kartı */}
        <View
          style={[
            styles.card,
            { marginTop: Platform.OS === "android" ? height * 0.05 : 0 },
          ]}
        >
          <Text style={styles.cardTitle}>Cüzdan Bakiyesi</Text>

          <Text style={styles.balanceText}>
            {parseFloat(balance).toLocaleString("tr-TR", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 0,
            })}
            TL
          </Text>
        </View>

        {/* Son İşlemler Başlığı */}
        <Text style={styles.sectionTitle}>Son İşlemler</Text>

        {/* İşlem Listesi */}
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

        {/* Butonlar */}
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
    justifyContent: "flex-start", // Yukar
    alignItems: "center",
  },
  card: {
    width: "90%",
    width: height * 0.4,
    backgroundColor: Colors.LIGHT,
    padding: 20,
    borderRadius: 16,
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
    width: 300,
    borderRadius: 10,
    marginVertical: 9,
    borderWidth: 0.5,
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
    fontSize: 16,
  },
  flatList: {
    maxHeight: "65%",
  },
});

export default HomeScreen;
