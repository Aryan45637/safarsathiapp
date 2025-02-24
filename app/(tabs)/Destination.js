import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAP_KEY } from '../constant/googlemapkey';
import MapViewDirections from 'react-native-maps-directions';

export default function Destination({ route }) {
    const fromcord = route?.params?.fromcord;
    const [location, setLocation] = useState(null);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);

    useEffect(() => {
        if (fromcord && location && GOOGLE_MAP_KEY) {
            const origin = `${fromcord.latitude},${fromcord.longitude}`;
            const destination = `${location.latitude},${location.longitude}`;
            const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${GOOGLE_MAP_KEY}`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.status === "OK") {
                        const element = data.rows[0].elements[0];
                        setDistance(element.distance.text);
                        setDuration(element.duration.text);
                        console.log(`Distance: ${element.distance.text}, Duration: ${element.duration.text}`);
                    } else {
                        console.error("Error fetching distance:", data.status);
                    }
                })
                .catch(error => console.error("Error:", error));
        }
    }, [fromcord, location]);

    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: fromcord?.latitude ?? 37.78825,
                        longitude: fromcord?.longitude ?? -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    onPress={(event) => {
                        const { latitude, longitude } = event.nativeEvent.coordinate;
                        setLocation({ latitude, longitude });
                    }}
                >
                    {/* Marker for Start Location */}
                    {fromcord && (
                        <Marker
                            coordinate={{ latitude: fromcord.latitude, longitude: fromcord.longitude }}
                            title="Start Location"
                            pinColor="blue"
                        />
                    )}

                    {/* Marker for Destination */}
                    {location && (
                        <Marker
                            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                            title="Destination"
                            pinColor="red"
                        />
                    )}

                    {/* Directions */}
                    {fromcord && location && GOOGLE_MAP_KEY && (
                        <MapViewDirections
                            origin={fromcord}
                            destination={location}
                            apikey={GOOGLE_MAP_KEY}
                            strokeWidth={5}
                            strokeColor="blue"
                            mode="DRIVING"
                        />
                    )}
                </MapView>

                {/* Menu Icon */}
                <View style={styles.start}>
                    <View style={styles.menuIcon}>
                        <Ionicons name="menu" size={25} color="#808080" />
                    </View>
                </View>
            </View>

            {/* Search Box */}
            <View style={styles.textContainer}>
                <Text style={styles.text}>Nearby Buses</Text>
                <View style={styles.line} />
                <GooglePlacesAutocomplete
                    fetchDetails={true}
                    placeholder="Enter Destination"
                    styles={{
                        textInputContainer: {
                            width: "100%",
                            padding: 5,
                            marginLeft: 5,
                            marginRight: 5,
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
                            const { lat, lng } = details.geometry.location;
                            setLocation({ latitude: lat, longitude: lng });
                        }
                    }}
                    query={{
                        key: GOOGLE_MAP_KEY,
                        language: 'en',
                    }}
                />
            </View>

            {/* Distance and Duration Display */}
            {distance && duration && (
                <View style={styles.distanceContainer}>
                    <Text style={styles.text}>Distance: {distance}</Text>
                    <Text style={styles.text}>Duration: {duration}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mapContainer: {
        flex: 0.6,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    menuIcon: {
        height: 40,
        width: 40,
        backgroundColor: 'white',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    textContainer: {
        flex: 0.4,
        marginTop: 10,
        alignItems: 'center',
    },
    text: {
        color: '#808080',
        fontSize: 16,
    },
    line: {
        height: 1,
        backgroundColor: '#808080',
        width: '100%',
        marginVertical: 10,
    },
    start: {
        position: 'absolute',
        marginLeft: 10,
        marginTop: 20,
        flexDirection: 'row',
        gap: 15,
    },
    distanceContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
});

