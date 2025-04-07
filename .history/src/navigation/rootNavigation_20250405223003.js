import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/homeScreen";
import ResultScreen from "../screens/resultScreen";
import TransferScreen from "../screens/transferScreen";
import LoginScreen from "../screens/loginScreen";
import {
  HOMESCREEN,
  LOGINSCREEN,
  RESULTSCREEN,
  TRANSFERSCREEN,
} from "../utils/routes";

const Stack = createStackNavigator();

const RootNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName={TRANSFERSCREEN}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={LOGINSCREEN} component={LoginScreen} />
      <Stack.Screen name={HOMESCREEN} component={HomeScreen} />
      <Stack.Screen name={RESULTSCREEN} component={ResultScreen} />
      <Stack.Screen name={TRANSFERSCREEN} component={TransferScreen} />
    </Stack.Navigator>
  );
};
export default RootNavigation;
