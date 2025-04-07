import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Colors } from "../utils/colors";
import Icon from "react-native-vector-icons/Feather"; // İconlar için
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

const ResultScreen = ({ route }) => {
  const success = useSelector((state) => state.wallet.success);
  const dispatch = useDispatch();

  useEffect(() => {
    // Örnek olarak, async veri yükleme veya başarı durumu ayarlama
    dispatch(setSuccess(null)); // Başlangıçta null yapabiliriz
  }, [dispatch]);

  if (success === null) {
    return <Text>Loading...</Text>; // Data henüz gelmediyse yükleme ekranı
  }

  return (
    <View style={styles.container}>
      {success ? (
        // Başarı durumu
        <View style={styles.successContainer}>
          <Icon name="check-circle" size={60} color={Colors.GREEN} />
          <Text style={styles.successMessage}>
            Transfer Başarıyla Gerçekleşti
          </Text>
          <Text style={styles.details}>
            {`Miktar: ${amount} TL\nAlıcı: ${receiver}`}
          </Text>
          {transactionId && (
            <Text style={styles.details}>İşlem ID: {transactionId}</Text>
          )}
          {timestamp && <Text style={styles.details}>Zaman: {timestamp}</Text>}
          <TouchableOpacity style={styles.button} onPress={handleGoHome}>
            <Text style={styles.buttonText}>Ana Sayfaya Dön</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Hata durumu
        <View style={styles.errorContainer}>
          <Icon name="x-circle" size={60} color={Colors.RED} />
          <Text style={styles.errorMessage}>Transfer Başarısız</Text>
          <Text style={styles.details}>{error}</Text>
          <TouchableOpacity style={styles.retryButton}>
            <Text style={styles.buttonText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.PRIMARY,
    padding: 20,
  },
  successContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  successMessage: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.GREEN,
    marginTop: 20,
  },
  errorMessage: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.RED,
    marginTop: 20,
  },
  details: {
    fontSize: 16,
    color: Colors.LIGHTGRAY,
    textAlign: "center",
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 6,
    backgroundColor: Colors.GREEN,
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 6,
    backgroundColor: Colors.RED,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ResultScreen;
