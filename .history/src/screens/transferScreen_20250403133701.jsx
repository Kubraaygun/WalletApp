import { Alert, Button, TextInput, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTransaction } from "../store/walletSlice";

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
    // Transfer işlemini Redux'a ekledik
    dispatch(addTransaction(transactionData));
    // Transfer başarılı mesajı ve Sonuç ekranına yönlendirme
    navigation.replace("Result", { success: true, ...transactionData });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transfer Money</Text>

      <TextInput
        placeholder="Recipient Phone Number"
        style={styles.input}
        value={recipient}
        onChangeText={setRecipient}
      />
      <TextInput
        placeholder="Amount"
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        placeholder="Description "
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Continue" onPress={handleTransfer} />
    </View>
  );
};

export default TransferScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
});
