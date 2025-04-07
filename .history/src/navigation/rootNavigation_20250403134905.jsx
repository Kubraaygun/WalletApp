import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/homeScreen";
import LoginScreen from "../screens/loginScreen";
import ResultScreen from "../screens/resultScreen";
import TransferScreen from "../screens/transferScreen";
import { HOME, LOGIN, RESULT, TRANSFER } from "../utils/routes";

const Stack = createNativeStackNavigator();

const RootNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name={LOGIN}
        component={LoginScreen}
      />
      <Stack.Screen name={TRANSFER} component={TransferScreen} />

      <Stack.Screen name={RESULT} component={ResultScreen} />
      <Stack.Screen name={HOME} component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigation;
