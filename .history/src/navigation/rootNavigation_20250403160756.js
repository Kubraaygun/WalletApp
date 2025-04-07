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
      <Stack.Screen name={LOGINSCREEN} component={LoginScreen} />
      <Stack.Screen name={HOMESCREEN} component={HomeScreen} />
      <Stack.Screen name={RESULTSCREEN} component={ResultScreen} />
      <Stack.Screen name={TRANSFERSCREEN} component={TransferScreen} />
    </Stack.Navigator>
  );
};
export default RootNavigation;
