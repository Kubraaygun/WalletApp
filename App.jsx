import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import store, { persistor } from "./src/store/store";
import RootNavigation from "./src/navigation/rootNavigation";
import LoadingModal from "./src/components/loadingModal";
import { Colors } from "./src/utils/colors";

// Persist yüklenirken gösterilecek loading ekranı
const PersistLoading = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={Colors.ACCENT} />
  </View>
);

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<PersistLoading />} persistor={persistor}>
        <NavigationContainer>
          <RootNavigation />
        </NavigationContainer>
        <LoadingModal />
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.BACKGROUND,
  },
});

export default App;
