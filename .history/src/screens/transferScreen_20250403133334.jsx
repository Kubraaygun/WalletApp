import { StyleSheet, Text, View } from "react-native";
import React from "react";

const TransferScreen = ({ navigation }) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  return (
    <View>
      <Text>transferScreen</Text>
    </View>
  );
};

export default TransferScreen;

const styles = StyleSheet.create({});
