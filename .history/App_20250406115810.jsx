import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigation from "./src/navigation/rootNavigation";
import { Provider } from "react-redux";
import store from "./src/store/store";

// create a component
useEffect(() => {
  // Yüklenen veriyi AsyncStorage'dan alıp store'a yükleyelim
  AsyncStorage.getItem("walletData")
    .then((data) => {
      if (data) {
        const parsedData = JSON.parse(data);
        dispatch(setInitialData(parsedData));
      }
    })
    .catch((error) => console.error("Error loading wallet data: ", error));
}, [dispatch]);

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootNavigation />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
