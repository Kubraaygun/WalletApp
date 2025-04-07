import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const ResultScreen = ({ route, navigation }) => {
  const { success, error } = route.params;

  return (
    <View style={styles.container}>
      {success ? (
        <Text style={styles.success}>İşlem Başarılı!</Text>
      ) : (
        <Text style={styles.error}>{error || "Bir hata oluştu"}</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>Ana Sayfaya Dön</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  success: { fontSize: 24, color: "green", fontWeight: "bold" },
  error: { fontSize: 24, color: "red", fontWeight: "bold" },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff" },
});

export default ResultScreen;
