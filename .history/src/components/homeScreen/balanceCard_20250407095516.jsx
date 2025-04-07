import React from "react";
import { View, Text, Platform, StyleSheet } from "react-native";
Colors;
import AnimationComponent from "./animationComponent";
import { height } from "../utils/constant";
import { Colors } from "../../utils/colors";

const BalanceCard = ({ balance }) => (
  <View
    style={[
      styles.card,
      { marginTop: Platform.OS === "android" ? height * 0.05 : 0 },
    ]}
  >
    <Text style={styles.cardTitle}>Cüzdan Bakiyesi</Text>
    <AnimationComponent balance={balance} />
  </View>
);

const styles = StyleSheet.create({
  card: {
    width: "90%",
    borderWidth: 0.6,
    backgroundColor: Colors.LIGHT,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    color: Colors.BLACK,
    marginBottom: 10,
    fontWeight: "bold",
  },
});

export default BalanceCard;
