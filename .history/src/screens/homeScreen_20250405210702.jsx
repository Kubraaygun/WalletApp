//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../utils/colors";
import { useDispatch } from "react-redux";

// create a component
const HomeScreen = ({navigation}) => {
  const dispatch=useDispatch();
  const {balance, transactions}=useSelector((state)=>state.wallet);
  return (
   
   
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
