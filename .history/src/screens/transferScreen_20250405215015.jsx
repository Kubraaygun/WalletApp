//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";

// create a component
const TransferScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [phoneNumber, setPhoneNumber] = React.useState("");

  return (
    <View style={styles.container}>
      <Text>TransferScreen</Text>
    </View>
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
export default TransferScreen;
