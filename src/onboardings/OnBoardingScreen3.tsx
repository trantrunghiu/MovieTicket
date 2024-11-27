import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

const OnboardingScreen3 = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Get Started</Text>
      <Text style={styles.description}>
        Let’s get started with your journey!
      </Text>
      <Image source={require('../assets/image/ob3.png')} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'orange',
  },
  description: {
    textAlign: 'center',
    color: '#777',
    marginTop: 10,
  },
});

export default OnboardingScreen3;
