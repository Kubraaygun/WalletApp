//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

// create a component
const App = () => {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
};

//make this component available to the app
export default App;
