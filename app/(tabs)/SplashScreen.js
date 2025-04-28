import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Video } from 'expo-av';  // Import Video component from expo-av
import { useNavigation } from '@react-navigation/native'; // Import for navigation

const SplashScreen = () => {
  const video = useRef(null);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        source={require('../../assets/splash.mp4')} // Your video file here
        style={styles.video}
        resizeMode="contain"  // Ensures the video is contained within the screen
        shouldPlay
        isLooping={false}
      />
    </View>
  );
};

export default SplashScreen;

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Set background to white
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: width * 0.8,  // 80% of the screen width for the video
    height: height * 0.5, // 50% of the screen height for the video
  },
});
