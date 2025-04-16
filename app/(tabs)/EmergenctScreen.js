import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const EmergencyScreen = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardText}>Accidental Emergency</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
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
