import React from "react";
import { useSelector } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { AnimatedTabIcon } from "../components/animations";
import { ScreenTransitions } from "../utils/transitions";

// Screens
import HomeScreen from "../screens/homeScreen";
import ResultScreen from "../screens/resultScreen";
import TransferScreen from "../screens/transferScreen";
import LoginScreen from "../screens/loginScreen";
import RegisterScreen from "../screens/registerScreen";
import QRScannerScreen from "../screens/qrScannerScreen";
import QRCodeScreen from "../screens/qrCodeScreen";
import NotificationsScreen from "../screens/notificationsScreen";
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
  QRCODESCREEN,
  NOTIFICATIONSSCREEN,
  PROFILESCREEN,
  ONBOARDINGSCREEN,
  CRYPTOSCREEN,
  STATSSCREEN,
  CARDSSCREEN,
  CURRENCYSCREEN,
} from "../utils/routes";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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

// Auth Stack with Custom Transitions
const AuthStack = () => (
  <Stack.Navigator 
    screenOptions={{ 
      headerShown: false,
      ...ScreenTransitions.slideFromRight,
    }}
  >
    <Stack.Screen 
      name={ONBOARDINGSCREEN} 
      component={OnboardingScreen}
      options={ScreenTransitions.fadeIn}
    />
    <Stack.Screen 
      name={LOGINSCREEN} 
      component={LoginScreen}
      options={ScreenTransitions.fadeIn}
    />
    <Stack.Screen 
      name={REGISTERSCREEN} 
      component={RegisterScreen}
      options={ScreenTransitions.slideFromRight}
    />
  </Stack.Navigator>
);

// Root Navigation Structure with Custom Transitions
const RootNavigation = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        ...ScreenTransitions.slideFromRight,
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen 
          name="Auth" 
          component={AuthStack}
          options={ScreenTransitions.fadeIn}
        />
      ) : (
        <>
          <Stack.Screen 
            name="MainTabs" 
            component={TabStack}
            options={ScreenTransitions.fadeIn}
          />
          <Stack.Screen 
            name={TRANSFERSCREEN} 
            component={TransferScreen}
            options={ScreenTransitions.slideFromRight}
          />
          <Stack.Screen 
            name={RESULTSCREEN} 
            component={ResultScreen}
            options={ScreenTransitions.scaleFromCenter}
          />
          <Stack.Screen 
            name={QRSCANNERSCREEN} 
            component={QRScannerScreen}
            options={{
              presentation: "modal",
              ...ScreenTransitions.slideFromBottom,
            }}
          />
          <Stack.Screen 
            name={CURRENCYSCREEN} 
            component={CurrencyConverterScreen}
            options={ScreenTransitions.slideFromBottom}
          />
          <Stack.Screen 
            name={QRCODESCREEN} 
            component={QRCodeScreen}
            options={ScreenTransitions.slideFromBottom}
          />
          <Stack.Screen 
            name={NOTIFICATIONSSCREEN} 
            component={NotificationsScreen}
            options={ScreenTransitions.slideFromRight}
          />
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
