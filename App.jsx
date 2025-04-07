import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigation from "./src/navigation/rootNavigation";
import { Provider } from "react-redux";
import store from "./src/store/store";
import { useDispatch, useSelector } from "react-redux";
import LoadingModal from "./src/components/loadingModal";

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootNavigation />
      </NavigationContainer>
      <LoadingModal />
    </Provider>
  );
};

export default App;
