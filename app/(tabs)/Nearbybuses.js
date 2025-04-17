import React, { useEffect, useState } from "react";
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
  Alert, Image, TouchableOpacity
} from "react-native";
import * as Location from "expo-location";
import { GOOGLE_MAP_KEY } from "../constant/googlemapkey";

const FARE_PER_KM = 1.53; // Fare per KM

const BusListScreen = ({ route, navigation }) => {
  const {
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
    locationdistance,
    duration
  } = route.params;
  console.log(userLatitude, userLongitude, destinationLatitude,
    destinationLongitude)
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Nearby Buses
  const fetchNearbyBuses = async () => {
    try {
      const apiUrl = "http://192.168.211.234:8080/users/nearby";
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Enable location to proceed.");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      const response = await fetch(`${apiUrl}?latitude=${latitude}&longitude=${longitude}&radius=3`);
      const data = await response.json();

      if (Array.isArray(data)) {
        const busesWithETA = await Promise.all(
          data.map(async (bus) => {
            const eta = await fetchETA(bus.latitude, bus.longitude, userLatitude, userLongitude);
            return { ...bus, eta };
          })
        );
        setBuses(busesWithETA);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching buses:", error);
      Alert.alert("Error", "Failed to fetch buses");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch ETA using Google Maps API
  const fetchETA = async (busLat, busLon, userLat, userLon) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${busLat},${busLon}&destination=${userLat},${userLon}&key=${GOOGLE_MAP_KEY}`
      );
      const data = await response.json();

      if (data.routes.length > 0) {
        const etaInSeconds = data.routes[0].legs[0].duration.value;
        let etaMinutes = Math.ceil(etaInSeconds / 60); // Convert to minutes

        // ✅ Ensure ETA is always positive
        return etaMinutes > 0 ? etaMinutes : 0;
      }
      return null;
    } catch (error) {
      console.error("Error fetching ETA:", error);
      return null;
    }
  };

  // ✅ Format Arrival Time
  const formatArrivalTime = (eta) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + eta);
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    fetchNearbyBuses();
    const interval = setInterval(fetchNearbyBuses, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : buses.length === 0 ? (
        <View style={styles.noBusesContainer}>
          <Text style={styles.noBusesText}>🚍 No buses available</Text>
        </View>
      ) : (
        <FlatList
          data={buses}
          keyExtractor={(item) => item.busNo}
          renderItem={({ item }) => {
            const distance = parseFloat(locationdistance);
            const fare = isNaN(distance) ? "0.00" : (distance * FARE_PER_KM).toFixed(2);
  
            return (
              <TouchableOpacity
                onPress={() => {
                  console.log("Navigating to BusDetail with:", item);
                  navigation.navigate("BusDetails", {
                    busNo: item.busNo,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    availableSeats: item.availableSeats,
                    fare,
                    userLatitude,
                    userLongitude,
                    destinationLatitude,
                    destinationLongitude,
                    eta: item.eta,
                    distance,
                  });
                }}
                style={styles.card}
              >
                <Image source={require("../../assets/icons/bus.png")} style={styles.busIcon} />
                <View style={styles.busDetails}>
                  <Text style={styles.busText}>{item.busNo}</Text>
  
                  {item.eta > 0 ? (
                    <Text style={styles.infoText}>Arrives at: {formatArrivalTime(item.eta)}</Text>
                  ) : (
                    <Text style={styles.arrivedText}>🚍 Arrived</Text>
                  )}
  
                  <Text style={styles.seatText}>
                    🪑 {Math.max(60 + item.availableSeats, 0)}{" "}
                    {60 + item.availableSeats <= 0 ? "(Currently Bus has no seats)" : ""}
                  </Text>
                </View>
                <Text style={styles.fareText}>Fare: ₹{fare}</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
  
};

// ✅ Styles for UI
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "white",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderRadius: 8,
  },
  busIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  busDetails: {
    flex: 1,
  },
  busText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 14,
    color: "gray",
    marginTop: 3,
  },
  arrivedText: {
    fontSize: 14,
    color: "green",
    marginTop: 3,
    fontWeight: "bold",
  },
  seatText: {
    fontSize: 14,
    color: "gray",
    marginTop: 3,
  },
  fareText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginTop: 45,
  },
});

export default BusListScreen;
