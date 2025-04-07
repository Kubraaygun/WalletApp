import React from "react";

import RootNavigation from "./src/navigation/rootNavigation";

// create a component
const App = () => {
  return (
    <Provider store={store}>
      <RootNavigation />
    </Provider>
  );
};

export default App;
