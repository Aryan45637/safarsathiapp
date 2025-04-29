import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from "react-native";

const ShareJourney = ({ route }) => {
    const {
        busNo,
        latitude,
        longitude,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
        eta
    } = route.params;

    const [shareMessage, setShareMessage] = useState("");

    const calculateArrivalTime = (etaMinutes) => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + etaMinutes);
        return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    };

    useEffect(() => {
        const generateShareMessage = () => {
            const arrivalTime = calculateArrivalTime(eta);
            const googleMapsLink = `https://www.google.com/maps/dir/?api=1&origin=${userLatitude},${userLongitude}&destination=${destinationLatitude},${destinationLongitude}`;
            const message = `🚌 *Bus Journey Details*:\n\n🚍 Bus No: ${busNo}\n📡 Live Bus Location: https://www.google.com/maps?q=${latitude},${longitude}\n🕒 ETA (Arrival Time): ${arrivalTime}\n🧭 Route: From your location to destination\n🔗 Google Maps Route: ${googleMapsLink}`;

            setShareMessage(message);
        };

        generateShareMessage();
    }, []);

    const shareViaWhatsApp = () => {
        const url = `whatsapp://send?text=${encodeURIComponent(shareMessage)}`;
        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    Alert.alert("WhatsApp not installed");
                }
            })
            .catch((err) => console.error(err));
    };

    const shareViaSMS = () => {
        const url = `sms:?body=${encodeURIComponent(shareMessage)}`;
        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    Alert.alert("SMS app not available");
                }
            })
            .catch((err) => Alert.alert("Failed to send SMS", err.message));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Share Your Bus Journey</Text>

            <TouchableOpacity style={styles.button} onPress={shareViaWhatsApp}>
                <Text style={styles.buttonText}>Share via WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor: "#4CAF50" }]} onPress={shareViaSMS}>
                <Text style={styles.buttonText}>Share via SMS</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 30,
    },
    button: {
        backgroundColor: "#25D366",
        padding: 15,
        borderRadius: 10,
        width: "90%",
        alignItems: "center",
        marginVertical: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default ShareJourney;
