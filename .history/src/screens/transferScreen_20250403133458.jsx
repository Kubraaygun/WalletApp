import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const TransferScreen = ({ navigation }) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const dispatch = useDispatch();

  const handleTransfer = () => {
    if (!recipient || !amount) {
      Alert.alert("Error", "Recipient and Amount are required");
      return;
    }
  };
  return (
    <View>
      <Text>transferScreen</Text>
    </View>
  );
};

export default TransferScreen;

const styles = StyleSheet.create({});
