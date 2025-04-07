//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Colors } from "../utils/colors";
import { Icon } from "react-native-vector-icons/Feather";
import { useDispatch, useSelector } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
// create a component
const ResultScreen = ({ route, navigation }) => {
  const { isSuccess, transactionDetails } = route.params;
  const dispatch = useDispatch();
  const currentBalance = useSelector((state) => state.wallet.balance);
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: Colors.PRIMARY }}
    >
      <View style={styles.container}>
        <AntDesign name="checkcircle" size={60} color={Colors.GREEN} />
        <Text style={styles.message}>Islem Basarili</Text>
        <Text style={styles.details}>
          Alici: Alıcı: {transactionDetails.receiverPhone}
        </Text>
        <Text style={styles.details}>Islem Basarili</Text>
      </View>
    </ScrollView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
});

//make this component available to the app
export default ResultScreen;
