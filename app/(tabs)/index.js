
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import From from "./From";
import Destination from "./Destination"


const Stack = createStackNavigator();

const App = () => {
  return (
    // <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Fromscreen" component={From} />

        <Stack.Screen name="destination" component={Destination} />
      </Stack.Navigator>
    // </NavigationContainer>
  );
};

export default App;
