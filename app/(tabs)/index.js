
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import From from "./From";
import Destination from "./Destination"
import Nearbybuses from "./Nearbybuses";
import BusDetails from "./BusDetails";


const Stack = createStackNavigator();

const App = () => {
  return (
    // <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Fromscreen" component={From} />

        <Stack.Screen name="destination" component={Destination} />
        <Stack.Screen name="Nearbybuses" component={Nearbybuses} options={{ headerShown: true , headerTitleAlign: "center"}} />
        <Stack.Screen name="BusDetails" component={BusDetails} options={{ headerShown: true , headerTitleAlign: "center"}} />

      </Stack.Navigator>
    // </NavigationContainer>
  );
};

export default App;
