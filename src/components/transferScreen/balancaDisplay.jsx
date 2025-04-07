import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Colors } from "../../utils/colors";

const BalanceDisplay = ({ balance }) => (
  <View style={styles.balanceContainer}>
    <Text style={styles.balanceTextContainer}>
      Bakiye:{" "}
      {parseFloat(balance).toLocaleString("tr-TR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}
      TL
    </Text>
  </View>
);

const styles = StyleSheet.create({
  balanceContainer: {
    fontWeight: "bold",
    marginTop: 20,
  },
  balanceTextContainer: {
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default BalanceDisplay;
