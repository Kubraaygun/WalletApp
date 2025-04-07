import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Colors } from "../utils/colors";
import { useDispatch } from "react-redux";
import { setDescription } from "../store/walletSlice";
const ResultScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();

  const dispatch = useDispatch();
  const { success, phoneNumber, amount, description, timestamp, errorMessage } =
    params || {};

  const formattedAmount = parseFloat(amount).toLocaleString("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  const formattedDate = new Date(timestamp).toLocaleDateString("tr-TR");
  const formattedTime = new Date(timestamp).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    if (success && description) {
      dispatch(setDescription(description)); // işlem başarılı ve açıklama varsa Redux'a kaydet
    }
  }, [success, description, dispatch]);
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
              padding: 20,
              alignItems: "center",
              width: "90%",
              borderWidth: 1,
              backgroundColor: Colors.LIGHT,
              borderColor: Colors.LIGHTGRAY,
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
              <Text style={styles.info}>{description}</Text>
            ) : null}
            <Text style={styles.info}>Tarih: {formattedDate}</Text>
            <Text style={styles.info}>Saat: {formattedTime}</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("HomeScreen", {
                description: description || "Varsayılan açıklama",
              })
            }
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
    fontSize: 18,
    marginVertical: 5,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: Colors.BLACK,
    padding: 12,
    borderRadius: 8,
    marginTop: 30,
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
