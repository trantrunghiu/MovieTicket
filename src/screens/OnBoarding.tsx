import React, {FunctionComponent, useState, useRef} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Button,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import CustomIcon from '../components/CustomIcon';
import {COLORS, FONTSIZE, SPACING} from '../themes/theme';
// Import các màn hình onboarding
import OnboardingScreen1 from './OnBoardingScreen1';
import OnboardingScreen2 from './OnBoardingScreen2';
import OnboardingScreen3 from './OnBoardingScreen3';

const {width} = Dimensions.get('window'); // Lấy chiều rộng của màn hình

const onboardingScreens = [
  <OnboardingScreen1 />,
  <OnboardingScreen2 />,
  <OnboardingScreen3 />,
];

interface OnboardingScreenProps {
  navigation: NavigationProp<any>;
}

const OnboardingScreen: FunctionComponent<OnboardingScreenProps> = ({
  navigation,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Chỉ số màn hình hiện tại
  const scrollViewRef = useRef<ScrollView>(null); // Ref cho ScrollView
  const isButtonPressed = useRef(false); // Biến tạm để kiểm tra nếu nhấn nút Next/Back

  // Hàm xử lý Next
  const handleNext = () => {
    if (currentIndex < onboardingScreens.length - 1) {
      const nextIndex = currentIndex + 1;
      isButtonPressed.current = true; // Đánh dấu rằng nút đã được nhấn
      setCurrentIndex(nextIndex); // Cập nhật chỉ số
      scrollViewRef.current?.scrollTo({x: nextIndex * width, animated: true}); // Cuộn đến màn tiếp theo
    } else {
      navigation.navigate('SignInSignUp'); // Chuyển đến màn đăng nhập
    }
  };

  // Hàm xử lý Back
  const handleBack = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      isButtonPressed.current = true; // Đánh dấu rằng nút đã được nhấn
      setCurrentIndex(prevIndex); // Cập nhật chỉ số
      scrollViewRef.current?.scrollTo({x: prevIndex * width, animated: true}); // Cuộn đến màn trước đó
    }
  };

  // Hàm xử lý cuộn (Scroll)
  const handleScroll = (event: any) => {
    if (isButtonPressed.current) {
      isButtonPressed.current = false; // Nếu nút vừa nhấn, bỏ qua cập nhật từ cuộn
      return;
    }

    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width); // Tính chỉ số từ vị trí cuộn
    if (index !== currentIndex) {
      setCurrentIndex(index); // Cập nhật chỉ số nếu khác
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll} // Theo dõi cuộn để cập nhật chỉ số
        scrollEventThrottle={16} // Tốc độ phản hồi sự kiện cuộn
        ref={scrollViewRef} // Tham chiếu ScrollView
      >
        {onboardingScreens.map((screen, index) => (
          <View key={index} style={[styles.screenContainer, {width}]}>
            {screen}
          </View>
        ))}
      </ScrollView>

      {/* In ra currentIndex để kiểm tra */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleBack}
          disabled={currentIndex === 0}
          style={[
            styles.btnFooter,
            currentIndex === 0 && styles.btnFooterDisabled, // Thêm style nếu bị vô hiệu hóa
          ]}>
          <CustomIcon name="arrow-left" style={styles.iconCustom} />
        </TouchableOpacity>
        <View style={styles.pagination}>
          {onboardingScreens.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                currentIndex === index && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity onPress={handleNext} style={styles.btnFooter}>
          <CustomIcon name="arrow-right" style={styles.iconCustom} />
        </TouchableOpacity>
      </View>
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
    height: '100%',
  },
  iconCustom: {
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
    height: '5%',
    backgroundColor: COLORS.Black,
  },
  btnFooter: {
    padding: 10,
    backgroundColor: COLORS.Orange,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#888',
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: COLORS.Orange,
  },
  btnFooterDisabled: {
    backgroundColor: 'gray',
  },
});

export default OnboardingScreen;
