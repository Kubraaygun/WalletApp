import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/loginScreen";

const Navigation = () => {
  return (
    <NavigationContainer>
      <StackNavigator>
        <Stack.Screen name="Login" component={LoginScreen} />
      </StackNavigator>
    </NavigationContainer>
  );
};

export default Navigation;
