import React from "react";
import { useSelector } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { AnimatedTabIcon } from "../components/animations";

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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Bar Icon Component - Now using AnimatedTabIcon

// Main Tab Navigation
const TabStack = () => {
  const { colors, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.PRIMARY,
        tabBarInactiveTintColor: colors.GRAY_500,
        tabBarStyle: {
          backgroundColor: colors.SURFACE,
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDark ? 0.3 : 0.05,
          shadowRadius: 10,
          height: Platform.OS === "ios" ? 88 : 80,
          paddingBottom: Platform.OS === "ios" ? 30 : 28,
          paddingTop: 6,
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ focused }) => {
          let iconName;
          if (route.name === HOMESCREEN) iconName = "home";
          else if (route.name === STATSSCREEN) iconName = "pie-chart";
          else if (route.name === CARDSSCREEN) iconName = "credit-card";
          else if (route.name === CRYPTOSCREEN) iconName = "trending-up";
          else if (route.name === PROFILESCREEN) iconName = "user";
          
          return (
            <AnimatedTabIcon 
              name={iconName} 
              focused={focused} 
              size={22} 
              activeColor={colors.PRIMARY} 
              inactiveColor={colors.GRAY_500} 
            />
          );
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
        options={{ tabBarLabel: "Istatistik" }}
      />
      <Tab.Screen 
        name={CRYPTOSCREEN} 
        component={CryptoScreen} 
        options={{ tabBarLabel: "Kripto" }}
      />
      <Tab.Screen 
        name={CARDSSCREEN} 
        component={CardsScreen} 
        options={{ tabBarLabel: "Kartlarim" }}
      />
      <Tab.Screen 
        name={PROFILESCREEN} 
        component={ProfileScreen} 
        options={{ tabBarLabel: "Profil" }}
      />
    </Tab.Navigator>
  );
};

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
  tabBarLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 4,
  },
});

export default RootNavigation;
