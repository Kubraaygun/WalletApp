//import liraries
import React from "react";
import { Provider } from "react-redux";

const App = () => {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
};

export default App;
