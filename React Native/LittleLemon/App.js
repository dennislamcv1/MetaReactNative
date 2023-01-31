import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigators/RootNavigator";

// App.js is already setup by wrapping NavigationContainer around Root Navigator
export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
