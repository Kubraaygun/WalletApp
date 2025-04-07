import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function App() {
  return <Stack.Navigator initialRouteName="Login"></Stack.Navigator>;
}
