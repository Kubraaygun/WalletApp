import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Colors } from "../utils/colors";

const ResultScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { success, phoneNumber, amount, description, timestamp, errorMessage } =
    route.params;

  const formattedAmount = parseFloat(amount).toLocaleString("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
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
          <Text style={styles.info}>Tutar: {formattedAmount} TL</Text>
          <Text style={styles.info}>Alıcı: {phoneNumber}</Text>
          {description ? (
            <Text style={styles.info}>Açıklama: {description}</Text>
          ) : null}
          <Text style={styles.info}>
            Zaman: {new Date(timestamp).toLocaleString("tr-TR")}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.buttonText}>Ana Sayfaya Dön</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.info}>
            Hata: {errorMessage || "Bilinmeyen hata"}
          </Text>

          <TouchableOpacity
            style={[styles.button, styles.retryButton]}
            onPress={() => navigation.goBack()}
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
