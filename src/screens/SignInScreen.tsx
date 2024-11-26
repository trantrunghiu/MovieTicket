import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  TextInput,
  Alert,
  Keyboard,
} from 'react-native';
import {COLORS, FONTFAMILY, SPACING} from '../themes/theme';
import {NavigationProp} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
const SignInSignUp = ({navigation}: {navigation: NavigationProp<any>}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleSignIn = async () => {
    try {
      /*
       * Call the API to get the list of users
       * Replace the URL with your API URL
       * Replace the response.json() with the actual response format
       * 192.168.42.104 is my local IP address, replace it with your local IP address
       */
      const response = await fetch('http://192.168.42.104:3001/accounts');
      const users = await response.json();

      // Kiểm tra thông tin đăng nhập
      const user = users.find(
        (user: {username: string; password: string}) =>
          user.username === username && user.password === password,
      );
      if (user) {
        Alert.alert('Success', 'Login successful!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Tab'),
          },
        ]);
      } else {
        Alert.alert('Error', 'Invalid username or password.');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'An error occurred while trying to sign in.');
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.overlapWrapper}>
        <View style={styles.overlap}>
          {/* Ellipses */}
          <View style={[styles.ellipse, {top: 774, left: 15}]} />
          <View style={[styles.div, {top: 0, left: 371}]} />
          <View style={[styles.ellipse, {top: 774, left: 310}]} />
          <View style={[styles.ellipse, {top: 778, left: 0}]} />

          {/* Images */}
          <Image
            style={[styles.image, {top: 67, left: 71}]}
            source={require('../assets/image/image-6.png')}
          />
          <Image
            style={[styles.img, {top: 107, left: 154}]}
            source={require('../assets/image/image-7.png')}
          />
          <Image
            style={[styles.image2, {top: 67, left: 270}]}
            source={require('../assets/image/image-8.png')}
          />
          <Image
            style={[styles.image3, {top: 225, left: 270}]}
            source={require('../assets/image/image-9.png')}
          />
          <Image
            style={[styles.image4, {top: 67, left: 386}]}
            source={require('../assets/image/image-10.png')}
          />
          <Image
            style={[styles.image5, {top: 268, left: 154}]}
            source={require('../assets/image/image-11.png')}
          />
          <Image
            style={[styles.image6, {top: 209, left: 71}]}
            source={require('../assets/image/image-12.png')}
          />
          <Image
            style={[styles.image7, {top: 379, left: 71}]}
            source={require('../assets/image/image-13.png')}
          />
          <Image
            style={[styles.image8, {top: 394, left: 270}]}
            source={require('../assets/image/image-14.png')}
          />
          <Image
            style={[styles.image9, {top: 449, left: 154}]}
            source={require('../assets/image/image-15.png')}
          />
          <Image
            style={[styles.image10, {top: 543, left: 71}]}
            source={require('../assets/image/image-16.png')}
          />
          <Image
            style={[styles.image11, {top: 67, left: 154}]}
            source={require('../assets/image/image-17.png')}
          />
          <Image
            style={[styles.image12, {top: 199, left: 386}]}
            source={require('../assets/image/image-18.png')}
          />
          <Image
            style={[styles.image13, {top: 342, left: 386}]}
            source={require('../assets/image/image-19.png')}
          />
          <Image
            style={[styles.image14, {top: 511, left: 386}]}
            source={require('../assets/image/image-20.png')}
          />

          {/* Texts */}

          {/* Rectangle with Gradient */}
          <View style={styles.rectangle}>
            {/* Images */}
            {/* Your existing images here */}

            {/* Logo above Sign In */}
            <Image
              style={styles.logo}
              source={require('../assets/image/logo.png')} // Replace with your logo path
            />
          </View>
          <View style={styles.containerInput}>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#7F7F7F"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#7F7F7F"
              /*
               * Change secureTextEntry to true to hide the password
               * Change secureTextEntry to false to show the password
               */
              secureTextEntry={false}
              value={password}
              onChangeText={text => setPassword(text)}
            />
            <View style={styles.buttonContainer}>
              <Button
                title="Sign In"
                color={COLORS.Orange}
                onPress={handleSignIn}
              />
            </View>
            <View>
              <Text
                style={{
                  color: COLORS.White,
                  fontFamily: FONTFAMILY.BebasNeue,
                  fontSize: 13,
                }}>
                Don't have an account?
              </Text>
            </View>
          </View>

          {/* Text and Rectangles */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0e0e0e',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  overlapWrapper: {
    backgroundColor: '#0e0e0e',
    overflow: 'hidden',
    width: 393,
    height: 852,
  },
  overlap: {
    position: 'relative',
    width: 557,
    height: 964,
    top: -67,
    left: -71,
    backgroundColor: '#0e0e0e',
  },
  ellipse: {
    position: 'absolute',
    width: 186,
    height: 186,
    borderRadius: 93,
    filter: 'blur(300px)',
  },
  div: {
    position: 'absolute',
    width: 186,
    height: 186,
    borderRadius: 93,
    filter: 'blur(300px)',
  },
  image: {
    width: 77,
    height: 139,
    position: 'absolute',
    resizeMode: 'cover',
  },
  img: {
    width: 110,
    height: 157,
    position: 'absolute',
    resizeMode: 'cover',
  },
  image2: {
    width: 110,
    height: 152,
    position: 'absolute',
    resizeMode: 'cover',
  },
  image3: {
    width: 110,
    height: 163,
    position: 'absolute',
    resizeMode: 'cover',
  },
  image4: {
    width: 78,
    height: 126,
    position: 'absolute',
    resizeMode: 'cover',
  },
  image5: {
    width: 110,
    height: 174,
    position: 'absolute',
    resizeMode: 'cover',
  },
  image6: {
    width: 77,
    height: 163,
    position: 'absolute',
    resizeMode: 'cover',
  },
  image7: {
    width: 77,
    height: 157,
    position: 'absolute',
    resizeMode: 'cover',
  },
  image8: {
    width: 110,
    height: 163,
    position: 'absolute',
    resizeMode: 'cover',
  },
  image9: {
    width: 110,
    height: 163,
    position: 'absolute',
    resizeMode: 'cover',
  },
  image10: {
    width: 77,
    height: 138,
    position: 'absolute',
    resizeMode: 'cover',
  },
  image11: {
    width: 110,
    height: 36,
    position: 'absolute',
    resizeMode: 'cover',
  },
  image12: {
    width: 78,
    height: 138,
    position: 'absolute',
    resizeMode: 'cover',
  },
  image13: {
    width: 78,
    height: 163,
    position: 'absolute',
    resizeMode: 'cover',
  },
  image14: {
    width: 78,
    height: 163,
    position: 'absolute',
    resizeMode: 'cover',
  },
  rectangle: {
    position: 'absolute',
    width: 393,
    height: 858,
    top: 61,
    left: 71,
    backgroundColor: 'rgba(1, 1, 1, 0.9)',
    borderRadius: 13,
  },
  rectangle2: {
    position: 'absolute',
    width: 351,
    height: 57,
    top: 696,
    left: 92,
    backgroundColor: COLORS.Orange,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rectangle3: {
    position: 'absolute',
    width: 351,
    height: 57,
    top: 814,
    left: 92,
    backgroundColor: COLORS.Orange,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapper: {
    position: 'absolute',
    top: 769,
    left: 257,
    fontSize: 20,
    color: COLORS.White,
  },
  textWrapper2: {
    position: 'absolute',
    top: 712,
    left: 235,
    fontSize: 20,
    color: '#fff',
  },
  textWrapper3: {
    position: 'absolute',
    top: 830,
    left: 230,
    fontSize: 20,
    color: '#fff',
  },
  rectangle6: {
    position: 'absolute',
    width: 123,
    height: 1,
    top: 783,
    left: 128,
    backgroundColor: '#ffffff5e',
  },
  rectangle7: {
    position: 'absolute',
    width: 123,
    height: 1,
    top: 783,
    left: 283,
    backgroundColor: '#ffffff5e',
  },
  textSignInUp: {
    fontSize: 20,
    color: COLORS.White,

    fontFamily: FONTFAMILY.BebasNeue,
  },
  logo: {
    width: 300,
    height: 300,
    position: 'absolute',
    top: 300,
    left: 47,
  },
  containerInput: {
    top: 650,
    alignItems: 'center',
  },
  input: {
    width: 256,
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#333333',
    color: '#CCCCCC',
  },
  buttonContainer: {
    width: 256,
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default SignInSignUp;
