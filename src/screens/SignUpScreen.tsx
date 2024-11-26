import React, {useState, useRef} from 'react';
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
} from 'react-native';
import {COLORS, FONTFAMILY, SPACING} from '../themes/theme';
import {NavigationProp} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';
import {Colors} from 'react-native/Libraries/NewAppScreen';
const SignUpScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const dropdownRef = useRef<SelectDropdown>(null);
  /*
   * Handle SignUp function
   * Call API to sign up
   * If success, navigate to SignIn screen
   * If fail, show error message
   * If username or password is empty, show error message
   * If username or password is invalid, show error message
   * If username or password is too short, show error message
   * If username or password is too long, show error message
   * If username or password is too weak, show error message
   * If username or password is too strong, show error message
   * If username or password is too common, show error message
   * If username or password is too similar to email, show error message
   * If username or password is too similar to fullname, show error message
   * If username or password is too similar to phonenumber, show error message
   * If username or password is too similar
   */
  const handleSignUp = async () => {
    // Kiểm tra dữ liệu
    if (!/^[a-zA-Z0-9]{3,16}$/.test(username)) {
      Alert.alert(
        'Error',
        'Username phải từ 3-16 ký tự và không chứa ký tự đặc biệt.',
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password phải từ 6 ký tự trở lên.');
      return;
    }

    if (!fullname.trim()) {
      Alert.alert('Error', 'Full name không được để trống.');
      return;
    }
    if (!gender) {
      Alert.alert('Error', 'Vui lòng chọn giới tính.');
      return;
    }

    if (!/^\d{10,11}$/.test(phonenumber)) {
      Alert.alert('Error', 'Phone number phải là 10-11 ký tự số.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.trim() === '') {
      Alert.alert('Error', 'Email không hợp lệ.');
      return;
    }

    // Gửi yêu cầu lên API
    const data = {
      username,
      password,
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg', // Cố định hoặc thay đổi
      fullName: fullname,
      phoneNumber: phonenumber,
      email,
      gender: gender.toLowerCase(), // Chuyển về chữ thường
    };

    try {
      const response = await fetch('http://192.168.42.104:3001/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        Alert.alert('Success', 'Đăng ký thành công!', [
          {text: 'OK', onPress: () => navigation.navigate('SignIn')},
        ]);
        /*
         * Reset form after success
         */
        setUsername('');
        setPassword('');
        setFullname('');
        setPhonenumber('');
        dropdownRef.current?.reset();
        setGender('');
        setEmail('');
      } else {
        const errorResponse = await response.json();
        Alert.alert('Error', errorResponse.message || 'Đăng ký thất bại.');
      }
    } catch (error) {
      Alert.alert('Error', 'Không thể kết nối với máy chủ.');
      console.error('Sign Up Error:', error);
    }
  };

  return (
    <View style={styles.container}>
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
            <Image
              style={styles.logo}
              source={require('../assets/image/logo.png')} // Replace with your logo path
            />
            <View style={styles.containerInput}>
              <TextInput
                style={styles.input}
                placeholder="Username"
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
              <TextInput
                style={styles.input}
                placeholder="Full name"
                placeholderTextColor="#7F7F7F"
                secureTextEntry={false}
                value={fullname}
                onChangeText={text => setFullname(text)}
              />
              <SelectDropdown
                data={['Male', 'Female', 'Other']} // Dữ liệu để hiển thị trong dropdown
                ref={dropdownRef}
                onSelect={(selectedItem, index) => {
                  setGender(selectedItem);
                }}
                renderButton={(selectedItem, index) => (
                  <View style={styles.dropdownButton}>
                    <Text style={styles.dropdownButtonText}>
                      {selectedItem || 'Select Gender'}
                    </Text>
                  </View>
                )}
                renderItem={(item, index) => (
                  <View style={styles.dropdownItem}>
                    <Text style={styles.dropdownItemText}>{item}</Text>
                  </View>
                )}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone number"
                placeholderTextColor="#7F7F7F"
                secureTextEntry={false}
                value={phonenumber}
                onChangeText={text => setPhonenumber(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#7F7F7F"
                secureTextEntry={false}
                value={email}
                onChangeText={text => setEmail(text)}
              />
              <TouchableOpacity
                style={styles.SignUpView}
                onPress={handleSignUp}>
                <Text style={styles.TextButton}>SIGN UP</Text>
              </TouchableOpacity>
              <View style={styles.Footer}>
                <Text style={styles.TextButton}>You have an account ? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                  <Text style={[styles.TextButton, {color: COLORS.Orange}]}>
                    SIGN IN
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
    top: 100,
    left: 50,
  },
  containerInput: {
    top: 400,
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
  dropdownButton: {
    width: 256,
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#333333',
    alignItems: 'center',
  },
  dropdownButtonText: {
    color: '#CCCCCC',
  },
  dropdownItem: {
    width: 256,
    borderRadius: 0,
    backgroundColor: '#333333',
    alignItems: 'center',
  },
  dropdownItemText: {
    color: '#CCCCCC',
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
  SignUpView: {
    width: 256,
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.Orange,
    alignItems: 'center',
  },
});

export default SignUpScreen;
