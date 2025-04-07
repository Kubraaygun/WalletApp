import { createStackNavigator } from "@react-navigation/stack";
import {LOG}
import HomeScreen from "../screens/homeScreen";
import ResultScreen from "../screens/resultScreen";
import TransferScreen from "../screens/transferScreen";
import LoginScreen from "../screens/loginScreen";
import { ROOTNAVIGATION } from "../utils/routes";

const Stack = createStackNavigator();

const RootNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name={ROOTNAVIGATION.LOGINSCREEN}
        component={LoginScreen}
      />
      <Stack.Screen name={ROOTNAVIGATION.HOMESCREEN} component={HomeScreen} />
      <Stack.Screen name={ROOTNAVIGATION.RESULTSCREEN} component={ResultScreen} />
      <Stack.Screen name={ROOTNAVIGATION.TRANSFERSCREEN} component={TransferScreen} />
    </Stack.Navigator>
  );
};
export default RootNavigation;
