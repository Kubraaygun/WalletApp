import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/loginScreen";
import {
  HOMESCREEN,
  LOGINSCREEN,
  RESULTSCREEN,
  TRANSFERSCREEN,
} from "../utils/constants";

const Stack = createStackNavigator();

export default function App() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LOGINSCREEN} />
      <Stack.Screen name="Login" component={HOMESCREEN} />
      <Stack.Screen name="Login" component={RESULTSCREEN} />
      <Stack.Screen name="Login" component={TRANSFERSCREEN} />
    </Stack.Navigator>
  );
}
