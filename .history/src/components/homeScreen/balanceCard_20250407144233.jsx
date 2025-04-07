import React from "react";
import { View, Text, Platform, StyleSheet } from "react-native";
import { Colors } from "../../utils/colors";
import AnimatedBalance from "../animationComponent";
import { height } from "../../utils/constant";

const BalanceCard = ({ balance }) => (
  <View
    style={[
      styles.card,
      { marginTop: Platform.OS === "android" ? height * 0.05 : 0 },
    ]}
  >
    <Text style={styles.cardTitle}>Cüzdan Bakiyesi</Text>
    <AnimatedBalance balance={balance} />
  </View>
);

export default BalanceCard;
