import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Colors } from "../utils/colors";

const ResultScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { success, phoneNumber, amount, description, timestamp, errorMessage } =
    params || {};

  const formattedAmount = parseFloat(amount).toLocaleString("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const formattedTime = new Date(timestamp).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <View style={styles.container}>
      <Image
        source={
          success
            ? require("../assets/images/check.png")
            : require("../assets/images/close.png")
        }
        style={styles.icon}
      />

      <Text style={styles.title}>
        {success ? "İşlem Başarılı" : "İşlem Başarısız"}
      </Text>

      {success ? (
        <>
          <View
            style={{
              alignItems: "center",
              borderWidth: 1,
              backgroundColor: Colors.LIGHT,
              borderColor: Colors.LIGHTGRAY,
              padding: 10,
              borderRadius: 10,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 4,
            }}
          >
            <Text style={styles.info}>Tutar: {formattedAmount} TL</Text>
            <Text style={styles.info}>Alıcı: {phoneNumber}</Text>
            {description ? (
              <Text style={styles.info}>Açıklama: {description}</Text>
            ) : null}
            <Text style={styles.info}>
              Tarih: {new Date(timestamp).toLocaleString("tr-TR")}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("HomeScreen")}
          >
            <Text style={styles.buttonText}>Ana Sayfaya Dön</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.info}>Hata: {errorMessage}</Text>

          <TouchableOpacity
            style={[styles.button, styles.retryButton]}
            onPress={() => navigation.navigate("TransferScreen")}
          >
            <Text style={styles.buttonText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  info: {
    fontSize: 16,
    marginVertical: 5,
  },
  button: {
    backgroundColor: Colors.BLACK,
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: "60%",
    alignItems: "center",
  },
  retryButton: {
    backgroundColor: "#D32F2F",
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ResultScreen;
