import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';

const Privacypolicy = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.sectionTitle}>1. Introduction</Text>
      <Text style={styles.text}>
        Welcome to SafarSathi. We are committed to protecting your personal information and your right to privacy. 
        If you have any questions or concerns about our policy, or our practices regarding your personal information, 
        please contact us.
      </Text>

      <Text style={styles.sectionTitle}>2. Information We Collect</Text>
      <Text style={styles.text}>
        We may collect personal information such as your name, email address, location data (for route tracking), 
        and device information to improve your experience with SafarSathi.
      </Text>

      <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
      <Text style={styles.text}>
        We use the collected data to provide real-time bus tracking, improve route suggestions, notify you of updates, 
        and enhance the app’s functionality and security.
      </Text>

      <Text style={styles.sectionTitle}>4. Sharing of Information</Text>
      <Text style={styles.text}>
        Your information is kept confidential. We do not share your personal data with third parties except to comply with 
        legal obligations or to protect our rights.
      </Text>

      <Text style={styles.sectionTitle}>5. Data Security</Text>
      <Text style={styles.text}>
        We implement industry-standard security measures to protect your information. 
        However, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
      </Text>

      <Text style={styles.sectionTitle}>6. Your Choices</Text>
      <Text style={styles.text}>
        You have the right to access, update, or delete your personal information. 
        You can also opt-out of receiving notifications by adjusting the settings within the app.
      </Text>

      <Text style={styles.sectionTitle}>7. Changes to This Policy</Text>
      <Text style={styles.text}>
        We may update this Privacy Policy from time to time. We encourage you to review this policy periodically for any changes.
      </Text>

      <Text style={styles.sectionTitle}>8. Contact Us</Text>
      <Text style={styles.text}>
        If you have any questions about this Privacy Policy, you can contact us at: 
      </Text>
      <Text style={styles.email}>
        seamlesstrackers@gmail.com
      </Text>
    </ScrollView>
  );
};

export default Privacypolicy;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    // color: '#2E86C1',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    textAlign: 'justify',
  },
  email: {
    fontSize: 16,
    marginTop: 10,
    // color: '#2E86C1',
    fontWeight: '600',
  },
});
