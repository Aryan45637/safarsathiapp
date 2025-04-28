import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from "react-native";

const EmergencyScreen = () => {
  
  const callAmbulance = () => {
    const ambulanceNumber = '102'; // Common ambulance number in India
    Linking.openURL(`tel:${ambulanceNumber}`).catch((err) =>
      Alert.alert('Error', 'Unable to make a call at the moment.')
    );
  };

  const callWomenHelpline = () => {
    const womenHelplineNumber = '1091'; // Common women's helpline number in India
    Linking.openURL(`tel:${womenHelplineNumber}`).catch((err) =>
      Alert.alert('Error', 'Unable to make a call at the moment.')
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} onPress={callAmbulance}>
        <Text style={styles.cardText}>Accidental Emergency</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={callWomenHelpline}>
        <Text style={styles.cardText}>Women Safety</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F8F8",
  },
  card: {
    width: 250,
    height: 250,
    backgroundColor: "#D9E8E3",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 8,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EmergencyScreen;
