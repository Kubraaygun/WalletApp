import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigation from "./src/navigation/rootNavigation";
import { Provider } from "react-redux";
import store from "./src/store/store";
import { ScrollView } from "react-native";

// create a component
const App = () => {
  return (
    <Provider store={store}>
      <ScrollView>
        <NavigationContainer>
          <RootNavigation />
        </NavigationContainer>
      </ScrollView>
    </Provider>
  );
};

export default App;
