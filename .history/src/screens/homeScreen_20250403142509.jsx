import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { formatCurrency } from "../utils/formatCurrency";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { balance, transactions } = useSelector((state) => state.user);

  return (
    <View style={styles.container}>
      <Text style={styles.balance}>Bakiye: {formatCurrency(balance)}</Text>
      <FlatList
        data={transactions}
        renderItem={({ item }) => (
          <View style={styles.transactionCard}>
            <Text>{item.description}</Text>
            <Text>{formatCurrency(item.amount)}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Transfer")}
      >
        <Text style={styles.buttonText}>Para Gönder</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  balance: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  transactionCard: { padding: 10, borderWidth: 1, marginBottom: 10 },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontSize: 16 },
});

export default HomeScreen;
