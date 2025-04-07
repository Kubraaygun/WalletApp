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
      <Stack.Screen name={HomeScreen} component={HomeScreen} />
      <Stack.Screen name={ResultScreen} component={ResultScreen} />
      <Stack.Screen name={TransferScreen} component={TransferScreen} />
    </Stack.Navigator>
  );
};
export default RootNavigation;
