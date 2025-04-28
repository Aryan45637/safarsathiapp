import { StyleSheet, Text, View, TouchableOpacity, Linking, Alert } from 'react-native';
import React from 'react';

const RateUs = () => {
  
  const handleRateUs = () => {
    // Replace this URL with your app's Play Store or App Store link
    const url = 'https://play.google.com/store/apps/details?id=com.safarsathi';
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Unable to open the store link.');
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enjoying SafarSathi?</Text>
      <Text style={styles.subtitle}>We would love to hear your feedback!</Text>

      <TouchableOpacity style={styles.button} onPress={handleRateUs}>
        <Text style={styles.buttonText}>Rate Us</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RateUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E86C1',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#2E86C1',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
