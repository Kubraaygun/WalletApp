//import liraries
import { NavigationContainer } from "@react-navigation/native";
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Provider } from "react-redux";
import RootNavigation from "./src/navigation/rootNavigation";

// create a component
const App = () => {
  return (
    <NavigationContainer>
      <RootNavigation />
    </NavigationContainer>
  );
};

export default App;
