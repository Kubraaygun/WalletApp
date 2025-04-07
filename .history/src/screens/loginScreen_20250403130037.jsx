//import liraries
import { useNavigation } from "@react-navigation/native";
import React, { Component } from "react";
import { View, Text, StyleSheet, Button } from "react-native";

// create a component
const LoginScreen = () => {
  const [phone, setPhone] = useState("");
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text>LoginScreen</Text>
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
