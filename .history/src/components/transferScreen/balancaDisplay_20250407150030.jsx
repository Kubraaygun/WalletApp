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

export default BalanceDisplay;
