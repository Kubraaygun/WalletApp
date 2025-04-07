import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setSuccess } from "../store/walletSlice"; // actions

const ResultScreen = ({ navigation }) => {
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
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: Colors.PRIMARY }} // ScrollView'ın arka planını ayarladık
    >
      <View style={styles.container}>
        {success ? (
          <View style={styles.successContainer}>
            <Text style={styles.successMessage}>İşlem Başarılı!</Text>
            {/* Diğer başarılı işlem detayları */}
            <Button
              title="Ana Sayfaya Dön"
              onPress={() => navigation.navigate("HomeScreen")}
            />
          </View>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorMessage}>İşlem Başarısız!</Text>
            <Button
              title="Tekrar Dene"
              onPress={() => navigation.goBack()} // Geribildirim veya yeniden deneme için
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  successContainer: {
    alignItems: "center",
  },
  errorContainer: {
    alignItems: "center",
  },
  successMessage: {
    color: "green",
    fontSize: 20,
    fontWeight: "bold",
  },
  errorMessage: {
    color: "red",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default ResultScreen;
