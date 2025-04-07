//import liraries
import React from "react";

import { Provider } from "react-redux";

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
