import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useSelector } from "react-redux";
import { Colors } from "../utils/colors";

// create a component
const ResultScreen = ({ navigation }) => {
  const { lastTransaction } = useSelector((state) => state.wallet);

  const handleGoHome = () => {
    navigation.navigate("HomeScreen"); // Ana ekran ismini değiştirebilirsiniz
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>İşlem Sonucu</Text>

      {lastTransaction ? (
        <>
          <Text style={styles.successMessage}>Transfer Başarılı!</Text>
          <Text style={styles.transactionText}>
            Alici: {lastTransaction.receiver}
          </Text>
          <Text style={styles.transactionText}>
            Miktar: {lastTransaction.amount} TL
          </Text>
          {lastTransaction.description && (
            <Text style={styles.transactionText}>
              Açıklama: {lastTransaction.description}
            </Text>
          )}
        </>
      ) : (
        <>
          <Text style={styles.errorMessage}>Bir hata oluştu.</Text>
          <Text style={styles.transactionText}>İşlem başarısız oldu.</Text>
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleGoHome}>
        <Text style={styles.buttonText}>Ana Sayfaya Dön</Text>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.PRIMARY,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  successMessage: {
    fontSize: 20,
    color: "green",
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 20,
    color: "red",
    marginBottom: 10,
  },
  transactionText: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: Colors.BLACK,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
});

//make this component available to the
export default ResultScreen;
