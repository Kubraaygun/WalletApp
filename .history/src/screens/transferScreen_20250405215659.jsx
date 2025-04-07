//import liraries
import React, { Component, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";

// create a component
const TransferScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { balance } = useSelector((state) => state.wallet);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const MIN_AMOUNT = 10;

  const isPhoneNumverValid = (number) => /^[0-9]{10}$/.test(number);

  const handleSubmit = () => {
    if (!isPhoneNumverValid(phoneNumber)) {
      Alert.alert("Hata", "Geçersiz telefon numarası");
      return;
    }
    if (parseFloat(amount) < MIN_AMOUNT) {
      Alert.alert("Hata", `Minimum Transfer Tutari ${MIN_AMOUNT} olmalidir.`);
      return;
    }
    if (parseFloat(amount) < MIN_AMOUNT) {
      Alert.alert("Hata", `Minimum Transfer Tutari ${MIN_AMOUNT} olmalidir.`);
      return;
    }
  };

  return (
    <View style={styles.container}>
      <Text>TransferScreen</Text>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

//make this component available to the app
export default TransferScreen;
