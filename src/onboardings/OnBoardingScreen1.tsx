import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
const OnboardingScreen1 = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/image/logo.png')}
        style={styles.image}
      />
      <Text style={styles.title}>Welcome to App</Text>
      <Text style={styles.description}>This is my welcome screen!</Text>
      <Image source={require('../assets/image/ob1.png')} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
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

export default OnboardingScreen1;
