import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import {COLORS, FONTFAMILY} from '../themes/theme';
import {NavigationProp} from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {Colors} from 'react-native/Libraries/NewAppScreen';

// Cấu hình Google Sign-In
GoogleSignin.configure({
  webClientId:
    '1000406782901-pauplpqt30uf9nuerr6qt5snl1egvj1d.apps.googleusercontent.com', // Lấy từ Firebase Console
  offlineAccess: false,
});

const SignUpScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const dropdownRef = useRef<SelectDropdown>(null);
  const [isLoading, setIsLoading] = useState(false); // State cho màn hình loading

  // Hàm đăng ký Firebase
  const handleSignUp = async () => {
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

    setIsLoading(true); // Hiển thị loading khi bắt đầu đăng ký

    const defaultAvatarUrl = 'https://i.imgur.com/zD994Xh.png';

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;

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

      Alert.alert('Được rồi đi thôi', 'Đăng ký thành công!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('SignIn', {username, password}),
        },
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
      setIsLoading(false); // Ẩn loading khi hoàn tất
    }
  };

  // Hàm đăng nhập bằng Google

  const handleGoogleSignUp = async () => {
    try {
      // Kiểm tra dịch vụ Google Play trên thiết bị
      await GoogleSignin.hasPlayServices();

      // Đăng nhập với Google và lấy thông tin người dùng
      const userInfo = await GoogleSignin.signIn();

      // Kiểm tra đối tượng user trước khi truy cập các thuộc tính
      const user = userInfo?.data?.user; // Sửa ở đây để truy cập đúng đối tượng `user`
      if (!user) {
        throw new Error('Không có thông tin người dùng.');
      }

      const {id, email, name, photo} = user;

      // Đăng nhập với Firebase Authentication bằng Google
      const credential = auth.GoogleAuthProvider.credential(
        userInfo?.data?.idToken ?? null,
      );

      setIsLoading(true); // Hiển thị màn hình loading khi bắt đầu đăng ký

      // Đăng nhập hoặc đăng ký người dùng mới vào Firebase
      const userCredential = await auth().signInWithCredential(credential);
      const firebaseUser = userCredential.user;

      // Kiểm tra nếu người dùng đã có trong Firestore chưa
      const userRef = firestore().collection('users').doc(firebaseUser.uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        // Nếu người dùng chưa có, tạo tài khoản mới và lưu thông tin vào Firestore
        await userRef.set({
          username: name || 'User' + firebaseUser.uid, // Tạo username mặc định
          fullname: name || 'Unknown', // Lấy tên hiển thị từ Google
          email: email,
          phonenumber: '', // Có thể yêu cầu người dùng nhập số điện thoại sau
          gender: 'Other', // Mặc định là 'Other'
          avatar: photo || 'https://i.imgur.com/zD994Xh.png', // Lấy ảnh đại diện từ Google hoặc ảnh mặc định
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

        Alert.alert(
          'Được rồi đi thôi',
          'Đăng ký thành công, tiến hành đăng nhập thành công!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Tab'),
            },
          ],
        );
      } else {
        // Nếu người dùng đã có tài khoản trong Firestore, chỉ cần hiển thị thông báo đăng nhập thành công
        Alert.alert(
          'Được rồi đi thôi',
          'Đã có tài khoản, đăng nhập thành công!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Tab'),
            },
          ],
        );
      }
    } catch (error) {
      console.error('Google SignIn Error:', error);

      // Kiểm tra lỗi và hiển thị thông báo
      if (error && (error as any).code) {
        if ((error as any).code === statusCodes.SIGN_IN_CANCELLED) {
          Alert.alert('Lỗi', 'Đăng nhập bị hủy.');
        } else if ((error as any).code === statusCodes.IN_PROGRESS) {
          Alert.alert('Lỗi', 'Đăng nhập đang được xử lý.');
        } else if (
          (error as any).code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
        ) {
          Alert.alert(
            'Lỗi',
            'Dịch vụ Google Play không khả dụng trên thiết bị này.',
          );
        } else {
          Alert.alert('Lỗi', 'Có lỗi xảy ra. Vui lòng thử lại.');
        }
      } else {
        // Nếu không có thuộc tính 'code', xử lý lỗi chung
        Alert.alert('Lỗi', 'Có lỗi không xác định xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false); // Ẩn loading khi hoàn tất
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.overlay} pointerEvents="auto">
          <ActivityIndicator size="large" color={COLORS.Orange} />
        </View>
      )}
      <View style={styles.overlapWrapper}>
        <View style={styles.overlap}>
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
            {!isLoading && (
              <TouchableOpacity
                style={styles.SignUpView}
                onPress={handleSignUp}>
                <Text style={styles.TextButton}>SIGN UP</Text>
              </TouchableOpacity>
            )}
            {/* Nút đăng ký với Google */}
            <TouchableOpacity
              style={{
                ...styles.SignUpView,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={handleGoogleSignUp}>
              <Text style={styles.TextButton}>OR LOGIN BY </Text>
              <MaterialCommunityIcons name="google" size={30} color="white" />
            </TouchableOpacity>
            {/* Footer */}
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
    justifyContent: 'center',
  },
  dropdownButtonText: {
    color: '#CCCCCC',
  },
  dropdownItem: {
    padding: 6,
    backgroundColor: '#333333',
  },
  dropdownItemText: {
    color: '#CCCCCC',
    fontSize: 16,
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
    fontSize: 16,
  },
  Footer: {
    flexDirection: 'row',
    marginTop: 10,
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

export default SignUpScreen;
