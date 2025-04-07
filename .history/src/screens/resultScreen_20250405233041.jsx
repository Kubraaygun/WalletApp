import React from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setBalance } from "../store/walletSlice"; // Balance güncellemeyi sağlayacak action
import { AntDesign } from "@expo/vector-icons";

const ResultScreen = ({ route, navigation }) => {
  const { isSuccess, transactionDetails } = route.params;
  const dispatch = useDispatch();
  const currentBalance = useSelector((state) => state.wallet.balance);

  // İşlem sonucu başarılıysa
  const renderSuccess = () => (
    <View style={styles.successContainer}>
      <AntDesign name="checkcircle" size={60} color="green" />
      <Text style={styles.message}>İşlem Başarılı</Text>
      <Text style={styles.details}>
        Alıcı: {transactionDetails.receiverPhone}
      </Text>
      <Text style={styles.details}>Tutar: {transactionDetails.amount} TL</Text>
      <Button
        title="Ana Sayfaya Dön"
        onPress={() => {
          // Bakiye animasyonu eklenebilir
          dispatch(updateBalance(currentBalance - transactionDetails.amount));
          navigation.navigate("Home");
        }}
      />
    </View>
  );

  // İşlem sonucu başarısızsa
  const renderFailure = () => (
    <View style={styles.failureContainer}>
      <AntDesign name="closecircle" size={60} color="red" />
      <Text style={styles.message}>İşlem Başarısız</Text>
      <Text style={styles.details}>
        Sebep: {transactionDetails.errorMessage}
      </Text>
      <Button title="Tekrar Dene" onPress={() => navigation.goBack()} />
    </View>
  );

  return (
    <View style={styles.container}>
      {isSuccess ? renderSuccess() : renderFailure()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  successContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  failureContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
  },
  details: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default ResultScreen;
