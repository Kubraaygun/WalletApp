import React from "react";
import CustomTextInput from "../customTextInput";
import { View, StyleSheet, Text } from "react-native";
import { Colors } from "../../utils/colors";

const TransferInputs = ({
  phoneNumber,
  setPhoneNumber,
  amount,
  setAmount,
  description,
  setDescription,
}) => (
  <View style={styles.container}>
    <CustomTextInput
      placeholder="Telefon Numarası"
      keyboardType="numeric"
      value={phoneNumber}
      onChangeText={setPhoneNumber}
    />
    <CustomTextInput
      placeholder="Miktar (TL)"
      keyboardType="numeric"
      value={amount}
      onChangeText={setAmount}
    />
    <CustomTextInput
      style={styles.input}
      placeholder="Açıklama"
      value={description}
      onChangeText={setDescription}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
  },
  input: {
    marginTop: 20,
  },
});

export default TransferInputs;
