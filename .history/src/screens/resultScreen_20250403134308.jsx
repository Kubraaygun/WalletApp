//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, Button } from "react-native";

// create a component
const ResultScreen = ({ route, navigation }) => {
  const { success, recipient, amount, decsription, timestamp } = route.params;

  const handleBackToHome = () => {
    navigation.navigate("Home");
  };
  return (
    <View style={styles.container}>
      {success ? (
        <>
          <Text> Transfer Successfull</Text>
          <Text> Amount: ${amount.toFixed(2)}</Text>
          <Text> Recipient : ${recipient}</Text>
          {decsription ? <Text>Description: {decsription}</Text> : null}
          <Text>timestamp: {timestamp}</Text>
          <Button title="Back To Home" onPress={handleBackToHome} />
        </>
      ) : (       <></>
        <Text>Transfer Failed</Text>
        <Text>Transfer Failed</Text>
        <Button title="Back To Home" onPress={handleBackToHome} />  </>
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
