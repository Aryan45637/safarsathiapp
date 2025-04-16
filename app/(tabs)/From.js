import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Ionicons } from '@expo/vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAP_KEY } from "../constant/googlemapkey";
import * as Location from 'expo-location';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const From = ({ navigation }) => {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const googlePlacesRef = useRef();

    // Function to get the user's current location
    const getCurrentLocation = async () => {
        setLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert("Permission to access location was denied.");
            setLoading(false);
            return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        const coords = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude
        };

        setLocation(coords);
        setLoading(false);

        // Use reverse geocoding to get the location name
        let reverseGeocode = await Location.reverseGeocodeAsync(coords);
        if (reverseGeocode.length > 0) {
            let placeName = `${reverseGeocode[0].name}, ${reverseGeocode[0].city}`;
            googlePlacesRef.current?.setAddressText(placeName);
        }
    };

    const handleSubmit = () => {
        if (location) {
            navigation.navigate("Destination", { fromcord: location });
        } else {
            alert("Please select a location first.");
        }
    };

    return (
        <View style={styles.container}>
            

            {/* Google Places Input */}
            <GooglePlacesAutocomplete
                ref={googlePlacesRef}
                fetchDetails={true}
                placeholder="Enter location"
                styles={{
                    textInputContainer: {
                        borderWidth: 1,
                        borderRadius: 8,
                        borderBlockColor: "#808080",
                        marginBottom: 10,
                    },
                    textInput: {
                        color: "#5d5d5d",
                        fontSize: 16,
                    },
                    predefinedPlacesDescription: {
                        color: "#1faadb",
                    },
                }}
                onPress={(data, details = null) => {
                    if (details) {
                        setLocation({
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng,
                        });
                    }
                }}
                query={{
                    key: GOOGLE_MAP_KEY,
                    language: 'en',
                }}
            />

            {/* Use My Location Button */}
            <TouchableOpacity 
                style={styles.locationButton} 
                onPress={getCurrentLocation}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="white" />
                ) : (
                    <>
                        <Ionicons name="locate" size={18} color="white" />
                        <Text style={styles.buttonText}>Use My Location</Text>
                    </>
                )}
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>Go to Destination</Text>
            </TouchableOpacity>
        </View>
    );
};

export default From;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 16,
    },
    menuIcon: {
        marginTop: 15,
        marginLeft: 5,
        marginBottom: 20,
        height: 40,
        width: 40,
        backgroundColor: "#f8f9f9",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
    },
    locationButton: {
        flexDirection: "row",
        backgroundColor: "green",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    button: {
        backgroundColor: "blue",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
        marginBottom:50,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
    },
});
