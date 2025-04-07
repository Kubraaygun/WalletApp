// screens/ResultScreen.js
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Colors } from "../utils/colors";
import ResultInfo from "../components/resultScreen/resultInfo";
import ActionButtons from "../components/resultScreen/actionButton";

const ResultScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();

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
      <ResultInfo
        formattedAmount={formattedAmount}
        phoneNumber={phoneNumber}
        description={description}
        formattedDate={formattedDate}
        formattedTime={formattedTime}
      />
      <ActionButtons
        success={success}
        navigation={navigation}
        errorMessage={errorMessage}
      />
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
});

export default ResultScreen;
