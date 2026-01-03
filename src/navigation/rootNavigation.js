import React from "react";
import { useSelector } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/homeScreen";
import ResultScreen from "../screens/resultScreen";
import TransferScreen from "../screens/transferScreen";
import LoginScreen from "../screens/loginScreen";
import RegisterScreen from "../screens/registerScreen";
import QRScannerScreen from "../screens/qrScannerScreen";
import ProfileScreen from "../screens/profileScreen";
import {
  HOMESCREEN,
  LOGINSCREEN,
  RESULTSCREEN,
  TRANSFERSCREEN,
  REGISTERSCREEN,
  QRSCANNERSCREEN,
  PROFILESCREEN,
} from "../utils/routes";

const Stack = createStackNavigator();

// Auth Stack - Giriş yapmamış kullanıcılar için
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={LOGINSCREEN} component={LoginScreen} />
    <Stack.Screen name={REGISTERSCREEN} component={RegisterScreen} />
  </Stack.Navigator>
);

// App Stack - Giriş yapmış kullanıcılar için
const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={HOMESCREEN} component={HomeScreen} />
    <Stack.Screen name={TRANSFERSCREEN} component={TransferScreen} />
    <Stack.Screen name={RESULTSCREEN} component={ResultScreen} />
    <Stack.Screen 
      name={QRSCANNERSCREEN} 
      component={QRScannerScreen}
      options={{ presentation: "modal" }}
    />
    <Stack.Screen name={PROFILESCREEN} component={ProfileScreen} />
  </Stack.Navigator>
);

const RootNavigation = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Auth durumuna göre doğru stack'i göster
  // NOT: Demo mod için şimdilik AppStack'i gösteriyoruz
  // Production'da "isAuthenticated ? <AppStack /> : <AuthStack />" kullanılmalı
  return isAuthenticated ? <AppStack /> : <AppStack />;
};

export default RootNavigation;
