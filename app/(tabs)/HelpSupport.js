import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native'; // ✅ Add this
import EmergencyScreen from './EmergenctScreen';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HelpSupport = () => {
  const navigation = useNavigation(); // ✅ navigation hook
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleAnswer = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+911234567890');
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:seamlesstrackers@gmail.com');
  };

  const handleEmergency = () => {
    navigation.navigate('Emergency');
  };

  const faqData = [
    {
      question: '1. How do I track my bus?',
      answer: "Go to the 'Live Map' section and enter your bus number to view real-time location.",
    },
    {
      question: '2. I lost an item. What should I do?',
      answer: "Use the 'Lost & Found' feature in the app to report and search for your lost item.",
    },
    {
      question: '3. How can I report a problem with the app?',
      answer: "Scroll down to the 'Contact Us' section and send us an email or call our support line.",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FAQs</Text>
        {faqData.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => toggleAnswer(index)} style={styles.card}>
            <Text style={styles.question}>{item.question}</Text>
            {expandedIndex === index && <Text style={styles.answer}>{item.answer}</Text>}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <TouchableOpacity onPress={handleCallSupport}>
          <Text style={styles.link}>📞 Connect to our customer support</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEmailSupport}>
          <Text style={styles.link}>📧 Mail your issue</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Feedback</Text>
        <Text style={styles.answer}>
          We’d love to hear your thoughts! Help us improve your journey experience. Send feedback via email or through the app settings.
        </Text>
      </View>

      {/* 🚨 Emergency Button */}
      <TouchableOpacity onPress={handleEmergency} style={styles.emergencyButton}>
        <Text style={styles.emergencyText}>🚨 Emergency</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HelpSupport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f6',
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1e90ff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  answer: {
    fontSize: 15,
    color: '#555',
    marginTop: 8,
  },
  link: {
    fontSize: 16,
    color: '#1e90ff',
    marginVertical: 6,
  },
  emergencyButton: {
    marginTop: 20,
    backgroundColor: '#ff4d4d',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  emergencyText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
  },
});
