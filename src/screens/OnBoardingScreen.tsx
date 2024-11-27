import React, {useState, useRef, useCallback, useMemo, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import CustomIcon from '../components/CustomIcon';
import {COLORS} from '../themes/theme';
import OnboardingScreen1 from '../onboardings/OnBoardingScreen1';
import OnboardingScreen2 from '../onboardings/OnBoardingScreen2';
import OnboardingScreen3 from '../onboardings/OnBoardingScreen3';
import {OnboardingScreenProps, OnboardingScreenData} from '../types/onboarding';

const {width} = Dimensions.get('window');

const onboardingScreens: OnboardingScreenData[] = [
  {component: <OnboardingScreen1 />, key: 'screen1'},
  {component: <OnboardingScreen2 />, key: 'screen2'},
  {component: <OnboardingScreen3 />, key: 'screen3'},
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({navigation}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = useCallback(() => {
    if (currentIndex < onboardingScreens.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({x: nextIndex * width, animated: true});
    } else {
      navigation.navigate('SignInSignUp');
    }
  }, [currentIndex, navigation, width]);

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      scrollViewRef.current?.scrollTo({x: prevIndex * width, animated: true});
    }
  }, [currentIndex, width]);

  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {x: scrollX}}}],
    {useNativeDriver: false},
  );

  const updateCurrentIndex = useCallback(
    (offset: number) => {
      const newIndex = Math.round(offset / width);
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    },
    [currentIndex, width],
  );

  useEffect(() => {
    const listener = scrollX.addListener(({value}) =>
      updateCurrentIndex(value),
    );
    return () => scrollX.removeListener(listener);
  }, [scrollX, updateCurrentIndex]);

  const inputRange = useMemo(
    () => onboardingScreens.map((_, index) => index * width),
    [],
  );

  const dotStyle = useCallback(
    (index: number) => {
      const inputRange = onboardingScreens.map((_, i) => i * width);
      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: inputRange.map((_, i) => (i === index ? 1 : 0.3)),
        extrapolate: 'clamp',
      });

      const scale = scrollX.interpolate({
        inputRange,
        outputRange: inputRange.map((_, i) => (i === index ? 1.4 : 1)),
        extrapolate: 'clamp',
      });

      return {
        opacity,
        transform: [{scale}],
      };
    },
    [scrollX, width],
  );

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ref={scrollViewRef}>
        {onboardingScreens.map(({component, key}) => (
          <View key={key} style={[styles.screenContainer, {width}]}>
            {component}
          </View>
        ))}
      </Animated.ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleBack}
          disabled={currentIndex === 0}
          style={[
            styles.btnFooter,
            currentIndex === 0 && styles.btnFooterDisabled,
          ]}>
          <CustomIcon name="arrow-left" style={styles.iconCustom} />
        </TouchableOpacity>
        <View style={styles.pagination}>
          {onboardingScreens.map((_, index) => (
            <Animated.View
              key={index}
              style={[styles.paginationDot, dotStyle(index)]}
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
    backgroundColor: COLORS.Black,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.Black,
  },
  btnFooter: {
    padding: 10,
    backgroundColor: COLORS.Orange,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnFooterDisabled: {
    backgroundColor: 'gray',
  },
  iconCustom: {
    color: 'white',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.Orange,
    marginHorizontal: 5,
  },
});

export default React.memo(OnboardingScreen);
