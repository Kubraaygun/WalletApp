import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/homeScren";
import LoginScreen from "../screens/loginScreen";
import ResultScreen from "../screens/resultScreen";
import TransferScreen from "../screens/transferScreen";
import { HOME, LOGIN, RESULT, TRANSFER } from "../utils/routes";

const Stack = createNativeStackNavigator();

const RootNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown={false}}}>
      <Stack.Screen name={HOME} component={HomeScreen} />
      <Stack.Screen name={LOGIN} component={LoginScreen} />
      <Stack.Screen name={RESULT} component={ResultScreen} />
      <Stack.Screen name={TRANSFER} component={TransferScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigation;
