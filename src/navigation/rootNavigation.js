import React from "react";
import { useSelector } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Feather";
import { View, Platform, StyleSheet } from "react-native";

// Screens
import HomeScreen from "../screens/homeScreen";
import ResultScreen from "../screens/resultScreen";
import TransferScreen from "../screens/transferScreen";
import LoginScreen from "../screens/loginScreen";
import RegisterScreen from "../screens/registerScreen";
import QRScannerScreen from "../screens/qrScannerScreen";
import ProfileScreen from "../screens/profileScreen";
import OnboardingScreen from "../screens/onboardingScreen";
import CryptoScreen from "../screens/cryptoScreen";
import StatsScreen from "../screens/statsScreen";
import CardsScreen from "../screens/cardsScreen";
import CurrencyConverterScreen from "../screens/currencyConverterScreen";

import {
  HOMESCREEN,
  LOGINSCREEN,
  RESULTSCREEN,
  TRANSFERSCREEN,
  REGISTERSCREEN,
  QRSCANNERSCREEN,
  PROFILESCREEN,
  ONBOARDINGSCREEN,
  CRYPTOSCREEN,
  STATSSCREEN,
  CARDSSCREEN,
  CURRENCYSCREEN,
} from "../utils/routes";
import { Colors } from "../utils/colors";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Bar Icon Component
const TabIcon = ({ name, color, size, focused }) => (
  <View style={styles.iconContainer}>
    <Icon name={name} size={size} color={color} />
    {focused && <View style={styles.activeDot} />}
  </View>
);

// Main Tab Navigation
const TabStack = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: Colors.PRIMARY,
      tabBarInactiveTintColor: Colors.GRAY_500,
      tabBarStyle: styles.tabBar,
      tabBarShowLabel: true,
      tabBarLabelStyle: styles.tabBarLabel,
      tabBarIcon: ({ color, size, focused }) => {
        let iconName;
        if (route.name === HOMESCREEN) iconName = "home";
        else if (route.name === STATSSCREEN) iconName = "pie-chart";
        else if (route.name === CARDSSCREEN) iconName = "credit-card";
        else if (route.name === CRYPTOSCREEN) iconName = "trending-up";
        else if (route.name === PROFILESCREEN) iconName = "user";
        
        return <TabIcon name={iconName} color={color} size={22} focused={focused} />;
      },
    })}
  >
    <Tab.Screen 
      name={HOMESCREEN} 
      component={HomeScreen} 
      options={{ tabBarLabel: "Ana Sayfa" }}
    />
    <Tab.Screen 
      name={STATSSCREEN} 
      component={StatsScreen} 
      options={{ tabBarLabel: "İstatistik" }}
    />
    <Tab.Screen 
      name={CRYPTOSCREEN} 
      component={CryptoScreen} 
      options={{ tabBarLabel: "Kripto" }}
    />
    <Tab.Screen 
      name={CARDSSCREEN} 
      component={CardsScreen} 
      options={{ tabBarLabel: "Kartlarım" }}
    />
    <Tab.Screen 
      name={PROFILESCREEN} 
      component={ProfileScreen} 
      options={{ tabBarLabel: "Profil" }}
    />
  </Tab.Navigator>
);

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ONBOARDINGSCREEN} component={OnboardingScreen} />
    <Stack.Screen name={LOGINSCREEN} component={LoginScreen} />
    <Stack.Screen name={REGISTERSCREEN} component={RegisterScreen} />
  </Stack.Navigator>
);

// Root Navigation Structure
const RootNavigation = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={TabStack} />
          <Stack.Screen name={TRANSFERSCREEN} component={TransferScreen} />
          <Stack.Screen name={RESULTSCREEN} component={ResultScreen} />
          <Stack.Screen 
            name={QRSCANNERSCREEN} 
            component={QRScannerScreen}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen name={CURRENCYSCREEN} component={CurrencyConverterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.WHITE,
    borderTopWidth: 0,
    elevation: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    height: Platform.OS === "ios" ? 88 : 65,
    paddingBottom: Platform.OS === "ios" ? 30 : 10,
    paddingTop: 10,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 4,
  },
  iconContainer: {
    alignItems: "center",
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.PRIMARY,
    marginTop: 4,
    position: "absolute",
    bottom: -8,
  },
});

export default RootNavigation;
