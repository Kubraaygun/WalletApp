import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/homeScren";
import LoginScreen from "../screens/loginScreen";
import ResultScreen from "../screens/resultScreen";
import TransferScreen from "../screens/transferScreen";

const Stack = createNativeStackNavigator();

const RootNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
      <Stack.Screen name="Transfer" component={TransferScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigation;
