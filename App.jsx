import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import store, { persistor } from "./src/store/store";
import RootNavigation from "./src/navigation/rootNavigation";
import LoadingModal from "./src/components/loadingModal";
import { Colors } from "./src/utils/colors";
import { notificationService } from "./src/services";
import { initSentry, withSentry } from "./src/services/sentryService";

// i18n yapılandırmasını yükle
import "./src/i18n";

// Sentry'yi başlat (production'da aktif)
initSentry();

// Persist yüklenirken gösterilecek loading ekranı
const PersistLoading = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={Colors.ACCENT} />
  </View>
);

const App = () => {
  useEffect(() => {
    // Push notification izni ve token al
    notificationService.registerForPushNotifications().then((token) => {
      if (token) {
        console.log("Push token:", token);
        // TODO: Token'ı backend'e gönder
      }
    });

    // Notification listener'ları kur
    const unsubscribe = notificationService.setupNotificationListeners(
      (notification) => {
        // Bildirim alındığında
        console.log("Notification received:", notification);
      },
      (response) => {
        // Bildirime tıklandığında
        console.log("Notification response:", response);
        // TODO: Bildirim tipine göre navigasyon yap
      }
    );

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <PersistGate loading={<PersistLoading />} persistor={persistor}>
          <NavigationContainer>
            <RootNavigation />
          </NavigationContainer>
          <LoadingModal />
        </PersistGate>
      </SafeAreaProvider>
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

// Sentry HOC ile sar (crash raporlama için)
export default withSentry(App);
