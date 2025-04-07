import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/loginScreen";
import {
  HOMESCREEN,
  LOGINSCREEN,
  RESULTSCREEN,
  TRANSFERSCREEN,
} from "../utils/constants";
import HomeScreen from "../screens/homeScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name={LoginScreen} component={LOGINSCREEN} />
      <Stack.Screen name={HomeScreen}" component={HOMESCREEN} />
      <Stack.Screen name="Login" component={RESULTSCREEN} />
      <Stack.Screen name="Login" component={TRANSFERSCREEN} />
    </Stack.Navigator>
  );
}
