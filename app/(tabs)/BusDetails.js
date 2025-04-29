import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import Constants from 'expo-constants';
const GOOGLE_MAP_KEY = Constants.expoConfig.extra.googleMapKey;

const BusDetailScreen = ({ route }) => {
    const navigation = useNavigation();
    const {
        busNo,
        latitude,
        longitude,
        availableSeats,
        fare,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
        eta,
        distance
    } = route.params;

    const [fromCity, setFromCity] = useState("Fetching...");
    const [toCity, setToCity] = useState("Fetching...");

    // 🔁 Set header button for sharing
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={{ marginRight: 15 }}
                    onPress={() => navigation.navigate("ShareJourney", { ...route.params })}
                >
                    <Text style={{ color: "#007BFF", fontWeight: "bold" }}>Share</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const fetchCityName = async (latitude, longitude, setCity) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAP_KEY}`
            );
            const data = await response.json();

            if (data.results.length > 0) {
                const addressComponents = data.results[0].address_components;
                const cityComponent = addressComponents.find((component) =>
                    component.types.includes("locality")
                );

                if (cityComponent) {
                    setCity(cityComponent.long_name);
                } else {
                    setCity("Unknown City");
                }
            } else {
                setCity("Unknown City");
            }
        } catch (error) {
            console.error("Error fetching city name:", error);
            setCity("Error Fetching");
        }
    };

    useEffect(() => {
        fetchCityName(userLatitude, userLongitude, setFromCity);
        fetchCityName(destinationLatitude, destinationLongitude, setToCity);
    }, []);

    const calculateArrivalTime = (eta) => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + eta);
        return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    };

    return (
        <View style={styles.container}>
            {/* Map View */}
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: (latitude + userLatitude) / 2,
                    longitude: (longitude + userLongitude) / 2,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                <Marker coordinate={{ latitude, longitude }}>
                    <Image source={require("../../assets/icons/bus.png")} style={styles.busIcon} />
                </Marker>
                <Marker coordinate={{ latitude: userLatitude, longitude: userLongitude }} />
                <Polyline
                    coordinates={[{ latitude, longitude }, { latitude: userLatitude, longitude: userLongitude }]}
                    strokeColor="#6c63ff"
                    strokeWidth={3}
                />
            </MapView>

            {/* Bus Details */}
            <View style={styles.detailsContainer}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={styles.label}>Estimated Arrival Time</Text>
                    <View style={styles.timeBox}>
                        <Text style={styles.timeText}>{calculateArrivalTime(eta)}</Text>
                    </View>
                </View>

                <View style={styles.busInfo}>
                    <Image source={require("../../assets/icons/bus.png")} style={styles.busSmallIcon} />
                    <Text style={styles.busNumber}>{busNo}</Text>
                </View>

                <Text style={styles.routeText}>From: {fromCity}</Text>
                <Text style={styles.routeText}>To: {toCity}</Text>
                <Text style={styles.routeText}>
                    Available: {Math.max(60 + availableSeats, 0)}{" "}
                    {60 + availableSeats <= 0 ? "(Currently Bus has no seats)" : ""}
                </Text>

                <Text style={styles.fareText}>Fare Charges: ₹{fare}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "white" },
    map: { flex: 1 },
    busIcon: { width: 30, height: 30 },
    detailsContainer: {
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: "white",
        elevation: 5,
        position: "absolute",
        bottom: 0,
        width: "100%",
    },
    label: { fontSize: 16, color: "gray" },
    timeBox: {
        backgroundColor: "#2c2c2c",
        padding: 10,
        borderRadius: 5,
        alignSelf: "flex-start",
        marginTop: 5,
    },
    timeText: { color: "white", fontSize: 18, fontWeight: "bold" },
    busInfo: { flexDirection: "row", alignItems: "center", marginTop: 10 },
    busSmallIcon: { width: 20, height: 20, marginRight: 10 },
    busNumber: { fontSize: 20, fontWeight: "bold" },
    routeText: { fontSize: 16, color: "gray", marginTop: 5 },
    fareText: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
});

export default BusDetailScreen;
