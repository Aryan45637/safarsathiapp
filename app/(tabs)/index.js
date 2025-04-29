import React, { useState, useEffect } from 'react';
import { usestate ,TouchableOpacity } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";


// Screens
import From from "./From";
import Destination from "./Destination";
import Nearbybuses from "./Nearbybuses";
import BusDetails from "./BusDetails";
import EmergencyScreen from "./EmergencyScreen";
import About from "./About";
import HelpSupport from "./HelpSupport";
import Splash from "./SplashScreen";
import Privacypolicy from './Privacypolicy';
import ReportIssue from './ReportIssue';
import RateUs from './RateUs';
import ShareJourney from './ShareJourney';

// const ReportIssue = () => <></>;
// const RateUs = () => <></>;

// 🔁 Drawer Toggle Icon
const DrawerToggle = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 15 }}>
      <Ionicons name="menu-outline" size={28} color="black" />
    </TouchableOpacity>
  );
};

// ✅ Drawer for From page + other drawer items
const Drawer = createDrawerNavigator();
function FromWithDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerLeft: () => <DrawerToggle />,
      }}
    >
      <Drawer.Screen
        name="From"
        component={From}
        options={{
          title: "Home",
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Emergency"
        component={EmergencyScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="call-outline" size={size} color={color} />,
        }}
      />
      
      <Drawer.Screen
        name="Report Issue"
        component={ReportIssue}
        options={{
          drawerIcon: ({ color, size }) => <MaterialIcons name="bug-report" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Rate Us"
        component={RateUs}
        options={{
          drawerIcon: ({ color, size }) => <FontAwesome name="star-o" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="About Us"
        component={About}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="information-circle-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Privacy & Policy"
        component={Privacypolicy}
        options={{
          drawerIcon: ({ color, size }) => <MaterialIcons name="privacy-tip" size={size} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
}

// ✅ Home Stack wraps the drawer and other navigation screens
const HomeStack = createStackNavigator();
function HomeFlow() {
  return (
    <HomeStack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
       {/* <HomeStack.Screen name="Splash" component={Splash} options ={{headerShown: false }} /> */}
      <HomeStack.Screen
        name="HomeDrawer"
        component={FromWithDrawer}
        options={{ headerShown: false }}
      />
     
      <HomeStack.Screen name="Destination" component={Destination} />
      <HomeStack.Screen name="Nearbybuses" component={Nearbybuses} options={{ title: "Nearby Buses" }} />
      <HomeStack.Screen name="BusDetails" component={BusDetails} options={{ title: "Bus Details" }} />
      <HomeStack.Screen name ="EmergencyScreen" component={EmergencyScreen}/>
      <HomeStack.Screen name ="ShareJourney" component={ShareJourney}/>
    </HomeStack.Navigator>
  );
}

// ✅ Help Stack
const HelpStack = createStackNavigator();
function HelpFlow() {
  return (
    <HelpStack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <HelpStack.Screen name="HelpSupport" component={HelpSupport} options={{ title: "Help & Support" }} />
    </HelpStack.Navigator>
  );
}

// ✅ Bottom Tabs
const Tab = createBottomTabNavigator();
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconName = route.name === "Home" ? "home-outline" : "headset-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          height: 60,
          backgroundColor: "#f8f8f8",
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "bold",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeFlow} />
      <Tab.Screen name="Help & Support" component={HelpFlow} />
    </Tab.Navigator>
  );
}
export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    // Hide the splash screen after 3 seconds
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 3000); // Match this time to your splash duration

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  return (

      isSplashVisible ? <Splash/> : <MainTabs />
  );
}
