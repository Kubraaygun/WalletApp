//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../utils/colors";

// create a component
const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>HomeScreen</Text>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.PRIMARY,
  },
});

//make this component available to the app
export default HomeScreen;
