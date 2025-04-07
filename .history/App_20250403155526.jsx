import React from "react";

import RootNavigation from "./src/navigation/rootNavigation";
import { Provider } from "react-redux";
import store from "./src/store/store";

// create a component
const App = () => {
  return (
    <Provider store={store}>
      <RootNavigation />
    </Provider>
  );
};

export default App;
