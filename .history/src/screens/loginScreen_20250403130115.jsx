//import liraries
import { useNavigation } from "@react-navigation/native";
import React, { Component, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { TextInput } from "react-native-gesture-handler";

// create a component
const LoginScreen = () => {
  const [phone, setPhone] = useState("");
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <TextInput placeholder="Phone Number" />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

//make this component available to the app
export default LoginScreen;
