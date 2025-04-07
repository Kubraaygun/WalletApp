//import liraries
import { NavigationContainer } from "@react-navigation/native";
import React, { Component } from "react";

import RootNavigation from "./src/navigation/rootNavigation";

// create a component
const App = () => {
  return (
    <Provider>
      <RootNavigation />
    </Provider>
  );
};

export default App;
