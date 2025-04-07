import React from "react";
import { View, Text, Button } from "react-native";

const ResultScreen = ({ route, navigation }) => {
  const { success, phoneNumber, amount, description, timestamp } = route.params;
  console.log(route.params);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {success ? (
        <View>
          <Text style={{ fontSize: 20, color: "green" }}>
            Başarıyla Transfer Yapıldı
          </Text>
          <Text>Alici: {phoneNumber}</Text>
          <Text>Miktar: {amount} TL</Text>
          {description && <Text>Açıklama: {description}</Text>}
          <Text>Zaman: {timestamp}</Text>
        </View>
      ) : (
        <View>
          <Text style={{ fontSize: 20, color: "red" }}>Transfer Başarısız</Text>
          <Text>Hata: Yetersiz Bakiye veya Geçersiz Alıcı</Text>
          <Button title="Tekrar Dene" onPress={() => navigation.goBack()} />
        </View>
      )}

      <Button
        title="Ana Sayfaya Dön"
        onPress={() => {
          navigation.navigate("Home"); // Ana sayfaya dön
        }}
      />
    </View>
  );
};

export default ResultScreen;
