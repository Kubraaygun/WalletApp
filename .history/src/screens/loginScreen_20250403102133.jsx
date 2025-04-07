//import liraries
import { useNavigation } from "@react-navigation/native";
import React, { Component } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import HomeScreen from "./homeScren";
import { HOME } from "../utils/routes";

// create a component
const LoginScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text>LoginScreen</Text>
      <Button onPress={() => navigation.navigate(HOME)} title="Login" />
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
