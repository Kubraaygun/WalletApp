import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setSuccess } from "../store/walletSlice"; // actions

const ResultScreen = ({ navigation }) => {
  return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  successContainer: {
    alignItems: "center",
  },
  errorContainer: {
    alignItems: "center",
  },
  successMessage: {
    color: "green",
    fontSize: 20,
    fontWeight: "bold",
  },
  errorMessage: {
    color: "red",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default ResultScreen;
