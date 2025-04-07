import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Platform,
  Animated,
} from "react-native";
import { Colors } from "../utils/colors";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../components/customButton";
import { setInitialData } from "../store/walletSlice";
import { resetBalance } from "../store/walletSlice";
import useWindowDimensions from "../components/useWindowDimensions";
import { height, width } from "../utils/constant";
const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { height, width } = useWindowDimensions();
  const { balance, transactions } = useSelector((state) => state.wallet);

  // Animasyon için başlangıç değerleri
  const [animatedBalance] = useState(new Animated.Value(0));
  const [scale] = useState(new Animated.Value(1));
  const [translateY] = useState(new Animated.Value(0)); // Y ekseninde hareket
  const [rotate] = useState(new Animated.Value(0)); // Dönme animasyonu
  const [colorChange] = useState(new Animated.Value(0)); // Renk değişim efekti

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

  // Bakiyenin değişmesini animasyonla göstermek için
  useEffect(() => {
    Animated.sequence([
      // Bakiyeyi 0'dan hedef değere animasyonla yükselt
      Animated.timing(animatedBalance, {
        toValue: balance,
        duration: 800,
        useNativeDriver: false,
      }),
      // Dönme animasyonu
      Animated.timing(rotate, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Büyütme ve renk değişimi
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1.3, // Büyütme
          friction: 3,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(colorChange, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }),
      ]),
      // Sonra eski haline döndürme
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(colorChange, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
      ]),
      // Y ekseninde hareket
      Animated.timing(translateY, {
        toValue: 10, // Ekranın biraz yukarısına kayma
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [balance]);
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
  const balanceInterpolation = animatedBalance.interpolate({
    inputRange: [0, 1000], // Bu aralık örnek olarak alındı, ihtiyaca göre değiştirilebilir
    outputRange: ["0", "1000"], // Benzer şekilde animasyon çıktıları
  });

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

          <Animated.Text
            style={[styles.balanceText, { opacity: animatedBalance }]}
          >
            {balanceInterpolation}
            TL
          </Animated.Text>
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
