import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator, // Import spinner loading
  TouchableWithoutFeedback, // Ngăn không cho người dùng tương tác
} from 'react-native';
import {COLORS, FONTFAMILY} from '../themes/theme';
import {NavigationProp} from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const SignUpScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const dropdownRef = useRef<SelectDropdown>(null);
  const [isLoading, setIsLoading] = useState(false); // State cho màn hình loading
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
    // Bắt đầu quá trình đăng ký và hiển thị loading
    setIsLoading(true);

    const defaultAvatarUrl = 'https://i.imgur.com/zD994Xh.png';
    // Đăng ký bằng Firebase
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;

      console.log('Firebase User Created:', user);

      // Lưu thông tin bổ sung vào Firestore
      await firestore().collection('users').doc(user.uid).set({
        username,
        fullname,
        phonenumber,
        gender,
        email,
        avatar: defaultAvatarUrl, // Lưu URL của avatar mặc định
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Success', 'Đăng ký thành công!', [
        {text: 'OK', onPress: () => navigation.navigate('SignIn')},
      ]);

      // Reset form sau khi đăng ký thành công
      setUsername('');
      setPassword('');
      setFullname('');
      setPhonenumber('');
      dropdownRef.current?.reset();
      setGender('');
      setEmail('');
    } catch (error) {
      console.error('Firebase Sign Up Error:', error);
      let errorMessage = 'Đăng ký thất bại.';
      if ((error as any).code === 'auth/email-already-in-use') {
        errorMessage = 'Email đã được sử dụng.';
      } else if ((error as any).code === 'auth/invalid-email') {
        errorMessage = 'Email không hợp lệ.';
      } else if ((error as any).code === 'auth/weak-password') {
        errorMessage = 'Mật khẩu quá yếu.';
      }
      Alert.alert('Error', errorMessage);
    } finally {
      // Sau khi hoàn tất, ẩn loading
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Lớp phủ (overlay) khi loading */}
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={COLORS.Orange} />
        </View>
      )}
      <View style={styles.overlapWrapper}>
        <View style={styles.overlap}>
          {/* Logo */}
          <Image
            style={styles.logo}
            source={require('../assets/image/logo.png')}
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
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor="#7F7F7F"
              value={fullname}
              onChangeText={setFullname}
            />
            <SelectDropdown
              data={['Male', 'Female', 'Other']}
              ref={dropdownRef}
              onSelect={setGender}
              renderButton={selectedItem => (
                <View style={styles.dropdownButton}>
                  <Text style={styles.dropdownButtonText}>
                    {selectedItem || 'Select Gender'}
                  </Text>
                </View>
              )}
              renderItem={item => (
                <View style={styles.dropdownItem}>
                  <Text style={styles.dropdownItemText}>{item}</Text>
                </View>
              )}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone number"
              placeholderTextColor="#7F7F7F"
              value={phonenumber}
              onChangeText={setPhonenumber}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#7F7F7F"
              value={email}
              onChangeText={setEmail}
            />
            {/* Hiển thị spinner loading */}
            {/* Ngừng thao tác nếu đang đăng ký */}
            {!isLoading && (
              <TouchableOpacity
                style={styles.SignUpView}
                onPress={handleSignUp}>
                <Text style={styles.TextButton}>SIGN UP</Text>
              </TouchableOpacity>
            )}
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
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0e0e0e',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlapWrapper: {
    backgroundColor: '#0e0e0e',
    width: '100%',
    height: '100%',
  },
  overlap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  containerInput: {
    width: '80%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#333333',
    color: '#CCCCCC',
  },
  dropdownButton: {
    width: '100%',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#333333',
    alignItems: 'center',
  },
  dropdownButtonText: {
    color: '#CCCCCC',
  },
  SignUpView: {
    width: '100%',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.Orange,
    alignItems: 'center',
  },
  TextButton: {
    color: COLORS.White,
    fontFamily: FONTFAMILY.poppins_medium,
  },
  Footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  dropdownItem: {
    backgroundColor: '#333333',
    padding: 2,
  },
  dropdownItemText: {
    color: '#CCCCCC',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Chế độ mờ đen
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // Đảm bảo overlay nằm trên cùng
  },
});

export default SignUpScreen;
