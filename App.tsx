import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigator from './src/navigators/TabNavigator';
import MovieDetailsScreen from './src/screens/MovieDetailsScreen';
import SeatBookingScreen from './src/screens/SeatBookingScreen';
import TicketScreen from './src/screens/TicketScreen';
import SignInSignUpScreen from './src/screens/SignInSignUpScreen';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SignInSignUp" // Đặt Login là màn hình khởi đầu
        screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="SignInSignUp"
          component={SignInSignUpScreen}
          options={{animation: 'fade'}}
        />
        <Stack.Screen
          name="Tab"
          component={TabNavigator}
          options={{animation: 'default'}}
        />
        <Stack.Screen
          name="MovieDetails"
          component={MovieDetailsScreen}
          options={{animation: 'slide_from_right'}}
        />
        <Stack.Screen
          name="SeatBooking"
          component={SeatBookingScreen}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="Ticket"
          component={TicketScreen}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{animation: 'slide_from_bottom'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
