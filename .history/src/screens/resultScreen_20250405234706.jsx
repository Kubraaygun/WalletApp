import React from "react";
import { View, Text, Button, Image, StyleSheet } from "react-native";
import { Icon } from "react-native-vector-icons/Feather";
import { useSelector } from "react-redux";

const ResultScreen = ({ route, navigation }) => {
  const { success, phoneNumber, amount, description, timestamp } =
    route.params || {};

  // Hata durumu
  const errorMessage = success ? null : "Yetersiz bakiye veya geçersiz alıcı";

  return (
    <View style={styles.container}>
      {success ? (
        <View style={styles.successContainer}>
          <Icon name="user" size={30} />
          <Text style={styles.successMessage}>Başarıyla Transfer Yapıldı</Text>
          <Text style={styles.detail}>Alici: {phoneNumber}</Text>
          <Text style={styles.detail}>Miktar: {amount} TL</Text>
          {description && (
            <Text style={styles.detail}>Açıklama: {description}</Text>
          )}
          <Text style={styles.detail}>Zaman: {timestamp}</Text>
        </View>
      ) : (
        <View style={styles.errorContainer}>
          <Image
            source={require("../assets/error-icon.png")}
            style={styles.icon}
          />
          <Text style={styles.errorMessage}>Transfer Başarısız</Text>
          <Text style={styles.errorDetail}>{errorMessage}</Text>
          <Button title="Tekrar Dene" onPress={() => navigation.goBack()} />
        </View>
      )}

      <Button
        title="Ana Sayfaya Dön"
        onPress={() => {
          // Güncellenmiş bakiye ile ana ekrana dönme
          navigation.navigate("Home");
        }}
      />
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
    alignItems: "center",
    marginBottom: 20,
  },
  errorContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    width: 50,
    height: 50,
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
  detail: {
    fontSize: 16,
    marginVertical: 5,
  },
  errorDetail: {
    fontSize: 16,
    color: "red",
    marginBottom: 10,
  },
});

export default ResultScreen;
