import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/loginScreen";
import {
  HOMESCREEN,
  LOGINSCREEN,
  RESULTSCREEN,
  TRANSFERSCREEN,
} from "../utils/constants";
import HomeScreen from "../screens/homeScreen";
import ResultScreen from "../screens/resultScreen";
import TransferScreen from "../screens/transferScreen";

const Stack = createStackNavigator();

const RootNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={LoginScreen} component={LoginScreen} />
      <Stack.Screen name={HomeScreen} component={HOMESCREEN} />
      <Stack.Screen name={ResultScreen} component={RESULTSCREEN} />
      <Stack.Screen name={TransferScreen} component={TRANSFERSCREEN} />
    </Stack.Navigator>
  );
};
export default RootNavigation;
