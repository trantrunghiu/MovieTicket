import { ReactElement } from 'react';
import { NavigationProp } from '@react-navigation/native';

export interface OnboardingScreenProps {
  navigation: NavigationProp<any>;
}

export interface OnboardingScreenData {
  component: ReactElement;
  key: string;
}

