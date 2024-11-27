import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  TextInput,
  Alert,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {COLORS, FONTFAMILY, SPACING} from '../themes/theme';
import {NavigationProp} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {UserContext} from '../context/UserContext';
const SignInScreen = ({
  navigation,
  route,
}: {
  navigation: NavigationProp<any>;
  route: any;
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const userContext = useContext(UserContext); // Lấy userContext từ Context
  if (!userContext) {
    throw new Error('UserContext is null');
  }
  const {setUser} = userContext;
  // Hàm đăng nhập

  // Hàm đăng nhập
  const handleSignIn = async () => {
    if (!username || !password) {
      Alert.alert('Lỗi', 'Không được bỏ trống tài khoản hoặc mật khẩu.');
      return;
    }

    setIsLoading(true); // Hiển thị loading khi bắt đầu đăng nhập

    try {
      // Kiểm tra xem username có phải là email không
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);

      let emailToUse = username;
      if (!isEmail) {
        // Nếu username không phải là email, tìm email tương ứng trong Firestore
        const userSnapshot = await firestore()
          .collection('users')
          .where('username', '==', username)
          .get();

        if (userSnapshot.empty) {
          Alert.alert('Lỗi', 'Chưa có tài khoản trên hệ thống, hãy đăng ký.');
          setIsLoading(false);
          return;
        }

        // Nếu tìm thấy, lấy email từ Firestore
        const userDoc = userSnapshot.docs[0];
        emailToUse = userDoc.data().email;
      }

      // Đăng nhập Firebase bằng email và password
      const userCredential = await auth().signInWithEmailAndPassword(
        emailToUse,
        password,
      );
      setUser(userCredential.user);
      Alert.alert('Được rồi đi thôi', 'Đăng nhập thành công!', [
        {text: 'OK', onPress: () => navigation.navigate('Tab')}, // Chuyển đến trang tab khi đăng nhập thành công
      ]);
    } catch (error) {
      let errorMessage = 'Đăng nhập thất bại. Vui lòng thử lại sau.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false); // Ẩn màn hình loading khi hoàn tất
    }
  };

  useEffect(() => {
    // Lấy dữ liệu từ params nếu có
    if (route.params) {
      const {username: passedUsername, password: passedPassword} = route.params;
      setUsername(passedUsername || '');
      setPassword(passedPassword || '');
    }
  }, [route.params]);
  return (
    <View style={styles.container}>
      {/* Màn hình loading */}
      {isLoading && (
        <View style={styles.overlay} pointerEvents="auto">
          <ActivityIndicator size="large" color={COLORS.Orange} />
        </View>
      )}
      <View style={styles.overlapWrapper}>
        <View style={styles.overlap}>
          {/* Images */}
          <Image
            style={[styles.image, {top: 67, left: 71}]}
            source={require('../assets/image/image-6.png')}
          />
          <Image
            style={[styles.image1, {top: 107, left: 154}]}
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
            <View style={styles.containerInput}>
              <TextInput
                style={styles.input}
                placeholder="E-mail or Username"
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
              <TouchableOpacity
                style={styles.SignUpView}
                onPress={handleSignIn}>
                <Text style={styles.TextButton}>SIGN UP</Text>
              </TouchableOpacity>

              <View style={styles.Footer}>
                <Text style={styles.TextButton}> Havn't an account ? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                  <Text style={[styles.TextButton, {color: COLORS.Orange}]}>
                    SIGN UP
                  </Text>
                </TouchableOpacity>
              </View>
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
  image: {
    width: 77,
    height: 139,
    position: 'absolute',
    resizeMode: 'cover',
  },
  image1: {
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
  textSignInUp: {
    fontSize: 20,
    color: COLORS.White,

    fontFamily: FONTFAMILY.poppins_medium,
  },
  logo: {
    width: 300,
    height: 300,
    position: 'absolute',
    top: 300,
    left: 47,
  },
  containerInput: {
    top: 600,
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

  SignUpView: {
    width: 256,
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.Orange,
    alignItems: 'center',
  },
  TextButton: {
    color: COLORS.White,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: 12,
  },
  Footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Lớp phủ mờ đen
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Đảm bảo lớp overlay nằm trên cùng
  },
});

export default SignInScreen;
