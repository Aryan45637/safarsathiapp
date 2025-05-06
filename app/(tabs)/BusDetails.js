import React, { useEffect, useState, useLayoutEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import { getDistance } from "geolib";


const GOOGLE_MAP_KEY = Constants.expoConfig.extra.googleMapKey;
const BASE_URL = Constants.expoConfig.extra.BASE_URL;

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
        duration,
        distance,
    } = route.params;
    console.log(duration)
    const [fromCity, setFromCity] = useState("Fetching...");
    const [toCity, setToCity] = useState("Fetching...");
    const [inBus, setInBus] = useState(false);

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

    // ✅ Function to Fetch City Name from Coordinates
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

    // Fetch City Names on Component Mount
    useEffect(() => {
        fetchCityName(userLatitude, userLongitude, setFromCity);
        fetchCityName(destinationLatitude, destinationLongitude, setToCity);
    }, []);

    // ✅ Show popup when bus is arriving
    useEffect(() => {
        const distanceToUser = getDistance(
            { latitude: userLatitude, longitude: userLongitude },
            { latitude, longitude }
        );

        if (distanceToUser <= 100 && !inBus) {
            Alert.alert(
                "Bus Nearby",
                "The bus is within 100 meters. Are you in the bus?",
                [
                    {
                        text: "No",
                        style: "cancel",
                    },
                    {
                        text: "Yes",
                        onPress: () => setInBus(true),
                    },
                ],
                { cancelable: false }
            );
        }
    }, [latitude, longitude]);


    // Calculate Arrival Time
    const calculateArrivalTime = (durationInHours) => {
        const hours = parseFloat(durationInHours);

        if (isNaN(hours) || hours < 0) return "Unavailable";
        if (hours === 0) return "Arriving now";

        const now = new Date();
        const arrivalTime = new Date(now.getTime() + hours * 60 * 60000); // Convert hours to ms

        const isNextDay = arrivalTime.getDate() !== now.getDate();

        const formattedTime = arrivalTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

        return isNextDay ? `Tomorrow at ${formattedTime}` : formattedTime;
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
                {/* Start Marker */}
                {!inBus && (
                    <Marker
                        coordinate={{ latitude: userLatitude, longitude: userLongitude }}
                        title="Your Location"
                        pinColor="blue"
                    />
                )}


                {/* Bus Marker */}
                <Marker coordinate={{ latitude, longitude }} title="Bus">
                    <Image
                        source={require("../../assets/icons/bus.png")}
                        style={styles.busIcon}
                    />
                </Marker>


                {/* Destination Marker */}
                <Marker
                    coordinate={{
                        latitude: destinationLatitude,
                        longitude: destinationLongitude,
                    }}
                    title="Destination"
                />

                {/* Conditional Directions */}
                {!inBus ? (
                    // Show direction from user to bus
                    <MapViewDirections
                        origin={{ latitude: userLatitude, longitude: userLongitude }}
                        destination={{ latitude: latitude, longitude: longitude }}
                        apikey={GOOGLE_MAP_KEY}
                        strokeWidth={4}
                        strokeColor="black"
                        mode="DRIVING"
                    />
                ) : (
                    // Show direction from bus to destination
                    <MapViewDirections
                        origin={{ latitude, longitude }}
                        destination={{
                            latitude: destinationLatitude,
                            longitude: destinationLongitude,
                        }}
                        apikey={GOOGLE_MAP_KEY}
                        strokeWidth={5}
                        strokeColor="blue"
                        mode="DRIVING"
                    />
                )}
            </MapView>

            {/* Bus Details */}
            <View style={styles.detailsContainer}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Text style={styles.label}>Estimated Arrival Time</Text>
                    <View style={styles.timeBox}>
                        <Text style={styles.timeText}>
                            {inBus
                                ? `${calculateArrivalTime(duration)}`
                                : `${calculateArrivalTime(eta)}`}
                        </Text>

                    </View>
                </View>

                <View style={styles.busInfo}>
                    <Image
                        source={require("../../assets/icons/bus.png")}
                        style={styles.busSmallIcon}
                    />
                    <Text style={styles.busNumber}>{busNo}</Text>
                </View>

                {/* ✅ Display City Names */}
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

// ✅ Styles
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
