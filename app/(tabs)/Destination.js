import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Image, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';
const GOOGLE_MAP_KEY = Constants.expoConfig.extra.googleMapKey;
import MapViewDirections from 'react-native-maps-directions';
import { useNavigation } from '@react-navigation/native';

export default function Destination({ route }) {
    const navigation = useNavigation();
    const fromcord = route?.params?.fromcord || { latitude: 37.78825, longitude: -122.4324 };
    const [location, setLocation] = useState(null);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [busLocations, setBusLocations] = useState([]);
    const [destinationSelected, setDestinationSelected] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [destinationText, setDestinationText] = useState("Your Destination");

    // Fetch Nearby Buses API from backend (MongoDB Atlas now)
    useEffect(() => {
        if (fromcord) {
            fetch(`http://<YOUR_SERVER_IP>:8080/users/nearby?latitude=${fromcord.latitude}&longitude=${fromcord.longitude}&radius=30`)
                .then(response => response.json())
                .then(data => {
                    if (Array.isArray(data) && data.length > 0) {
                        const validBuses = data.filter(bus => bus.latitude && bus.longitude);
                        setBusLocations(validBuses);
                    }
                })
                .catch(error => console.error("❌ Error fetching bus location:", error));
        }
    }, [fromcord]);

    // Fetch Distance & Duration API
    useEffect(() => {
        if (fromcord && location) {
            const origin = `${fromcord.latitude},${fromcord.longitude}`;
            const destination = `${location.latitude},${location.longitude}`;
            const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${GOOGLE_MAP_KEY}`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.status === "OK" && data.rows[0].elements[0].status === "OK") {
                        const element = data.rows[0].elements[0];
                        setDistance(element.distance.text);
                        setDuration(element.duration.text);
                    }
                })
                .catch(error => console.error("❌ Error:", error));
        }
    }, [fromcord, location]);

    // Open Nearby Buses Page
    const handleSubmit = () => {
        if (location) {
            navigation.navigate("Nearbybuses", {
                userLatitude: fromcord.latitude,
                userLongitude: fromcord.longitude,
                destinationLatitude: location.latitude,
                destinationLongitude: location.longitude,
                locationdistance: distance,
                duration
            });
        } else {
            Alert.alert("🚨 Error", "Please select a location first.");
        }
    };

    return (
        <View style={styles.container}>
            {/* Map Section */}
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: fromcord.latitude,
                        longitude: fromcord.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {/* Start Location Marker */}
                    <Marker
                        coordinate={{ latitude: fromcord.latitude, longitude: fromcord.longitude }}
                        title="Start Location"
                        pinColor="blue"
                    />

                    {/* Destination Marker */}
                    {location && (
                        <Marker
                            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                            title="Destination"
                            pinColor="red"
                        />
                    )}

                    {/* Bus Markers */}
                    {busLocations.map((bus, index) => (
                        <Marker
                            key={index}
                            coordinate={{ latitude: bus.latitude, longitude: bus.longitude }}
                            title="Bus Location"
                        >
                            <Image
                                source={require('../../assets/icons/bus.png')}
                                style={{ width: 40, height: 40 }}
                                resizeMode="contain"
                            />
                        </Marker>
                    ))}

                    {/* Route between Start and Destination */}
                    {location && (
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
            </View>

            {/* Bottom Section */}
            <View style={styles.bottomContainer}>
                <Text style={styles.heading}>Nearby Buses</Text>

                {/* Destination Input Field */}
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.destinationInput}>
                    <Text style={styles.inputText}>{destinationText}</Text>
                </TouchableOpacity>

                {/* Distance & Duration Display */}
                {destinationSelected && distance && duration && (
                    <View style={styles.distanceContainer}>
                        <Text style={styles.text}>Distance: {distance}</Text>
                        <Text style={styles.text}>Duration: {duration}</Text>
                    </View>
                )}

                {/* Button to View Nearby Buses */}
                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                    <Text style={styles.buttonText}>View Nearby Buses</Text>
                </TouchableOpacity>
            </View>

            {/* Modal for Google Places Autocomplete */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                        <Text style={styles.closeText}>X</Text>
                    </TouchableOpacity>

                    <GooglePlacesAutocomplete
                        fetchDetails={true}
                        placeholder="Search for a destination"
                        onPress={(data, details = null) => {
                            if (details) {
                                setLocation({
                                    latitude: details.geometry.location.lat,
                                    longitude: details.geometry.location.lng,
                                });
                                setDestinationText(data.description);
                                setDestinationSelected(true);
                                setModalVisible(false);
                            }
                        }}
                        query={{ key: GOOGLE_MAP_KEY, language: 'en' }}
                        styles={{
                            textInput: styles.searchInput,
                        }}
                    />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    mapContainer: { flex: 0.7 },
    map: { width: '100%', height: '100%' },
    bottomContainer: { flex: 0.3, padding: 15, backgroundColor: '#f7f7f7' },
    heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginLeft: 100 },
    destinationInput: { flexDirection: 'row', backgroundColor: '#fff', padding: 10, borderRadius: 10 },
    inputText: { flex: 1, fontSize: 16, alignItems: 'center' },
    button: { backgroundColor: '#007bff', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 20, width: "100%" },
    buttonText: { color: 'white', fontSize: 16 },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    closeButton: { position: 'absolute', top: 50, right: 50, backgroundColor: '#fff', padding: 10, borderRadius: 50 },
    closeText: { fontSize: 18, fontWeight: 'bold' },
    searchInput: { padding: 10, borderRadius: 10, backgroundColor: '#fff' },
    distanceContainer: { marginTop: 10 },
    text: { fontSize: 16 },
});
