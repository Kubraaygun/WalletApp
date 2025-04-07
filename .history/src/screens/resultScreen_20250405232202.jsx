//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Colors } from "../utils/colors";
import { Icon } from "react-native-vector-icons/Feather";
import { useDispatch } from "react-redux";

// create a component
const ResultScreen = ({ route, navigation }) => {
  const { isSuccess, transtionDetails } = route.params;
  const dispatch = useDispatch();
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: Colors.PRIMARY }}
    ></ScrollView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
});

//make this component available to the app
export default ResultScreen;
