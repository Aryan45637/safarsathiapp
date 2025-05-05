import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';

const About = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>SafarSathi</Text>

      <Text style={styles.description}>
  SafarSathi is your smart travel companion, designed to make public transport safer, faster, and more convenient.{"\n\n"}

  Get real-time bus tracking, personalized route preferences, and instant updates right at your fingertips!{"\n\n"}

  At SafarSathi, our mission is to make daily commuting easier for everyone.{"\n"}
  We understand the challenges that passengers face — from unpredictable schedules to crowded routes — and we are committed to solving these problems through technology.{"\n\n"}

  SafarSathi is more than just an app; it's a friend for your journey.{"\n"}
  Whether you are a student, a working professional, or an everyday traveler, SafarSathi helps you plan your travel smarter, save time, and travel with confidence.{"\n\n"}

  We believe that by empowering people with information, we can make public transport systems more accessible, reliable, and stress-free for all.{"\n\n"}

  Thank you for making us a part of your journey.{"\n"}
  Let's move forward together, safely and smartly!
</Text>


      <Text style={styles.subtitle}>Developers</Text>

      <View style={styles.developerCard}>
        <Text style={styles.developerName}>Aryan Singh</Text>
        <Text style={styles.developerEmail}>aryan45637@gmail.com</Text>
      </View>
      <View style={styles.developerCard}>
        <Text style={styles.developerName}>Ayush Saini</Text>
        <Text style={styles.developerEmail}>ayushsaini79069@gmail.com</Text>
      </View>


      <View style={styles.developerCard}>
        <Text style={styles.developerName}>Ayushi Tiwari</Text>
        <Text style={styles.developerEmail}>tayushi204@gmail.com</Text>
      </View>

      <View style={styles.developerCard}>
        <Text style={styles.developerName}>Kriti Singh</Text>
        <Text style={styles.developerEmail}>kritisin2842@gmail.com</Text>
      </View>

      {/* Add more developers here if needed */}
      
    </ScrollView>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    // color: '#2E86C1',
    // textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 25,
    lineHeight: 24,
    color: '#555',
    textAlign: 'justify',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2E86C1',
  },
  developerCard: {
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    padding: 10,
    // borderRadius: 10,
  },
  developerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  developerEmail: {
    fontSize: 16,
    color: '#777',
    marginTop: 5,
  },
});
