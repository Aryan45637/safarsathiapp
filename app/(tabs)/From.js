import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAP_KEY } from "../constant/googlemapkey";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const uniqueId = uuidv4();

const From = ({ navigation }) => {
    const [location, setLocation] = useState(null);

    const handleSubmit = () => {
        if (location) {
            navigation.navigate("destination", { fromcord: location });
        } else {
            alert("Please select a location first.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.menuIcon}>
                <Ionicons name="menu" size={25} color="#808080" />
            </View>

            <GooglePlacesAutocomplete
                fetchDetails={true}
                placeholder="Nearest Station"
                styles={{
                    textInputContainer: {
                        borderWidth: 1,
                        borderRadius: 0,
                        borderBlockColor: "#808080",
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
                        const { lat, lng } = details.geometry.location;  // Use 'lat' and 'lng' here
                        setLocation({ latitude: lat, longitude: lng });
                        console.log("Selected Coordinates:", lat, lng);
                    }
                }}
                
                query={{
                    key: GOOGLE_MAP_KEY,
                    language: 'en',
                }}
            />

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
    button: {
        backgroundColor: "blue",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});
