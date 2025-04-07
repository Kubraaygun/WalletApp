import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useDispatch } from "react-redux";

const TransferScreen = ({ navigation }) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const dispatch = useDispatch();
  return (
    <View>
      <Text>transferScreen</Text>
    </View>
  );
};

export default TransferScreen;

const styles = StyleSheet.create({});
