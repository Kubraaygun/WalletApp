//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

// create a component
const ResultScreen = ({ route, navigation }) => {
  const { success, recipient, amount, decsription, timestamp } = route.params;

  const handleBackToHome = () => {
    navigation.navigate("Home");
  };
  return (
    <View style={styles.container}>
     {success  ? ( 
        <>
        <Text> Transfer Successfull</Text>
        <Text> Amount: ${amount.toFixed(2)}</Text>
        <Text> Recipient : ${recipient}</Text>
       {
        decsription ? <Text>Description: {decsription}</Text>:null
        <Text>timestamp: {timestamp}</Text>
       }
        
            </>
     )}
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
export default ResultScreen;
