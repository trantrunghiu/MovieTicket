import React, {useState, useEffect, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../themes/theme';
import AppHeader from '../components/AppHeader';
import SettingComponent from '../components/SettingComponent';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import removeAccents from 'remove-accents';
import {UserContext} from '../context/UserContext';

const UserAccountScreen = ({navigation}: any) => {
  const userContext = useContext(UserContext); // Truy cập thông tin người dùng từ Context
  const user = userContext?.user;
  const [userData, setUserData] = useState<any>(null);
  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const userRef = firestore().collection('users').doc(user.uid);
          const doc = await userRef.get();
          if (doc.exists) {
            setUserData(doc.data());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    }
  }, [user]);

  if (!userData) {
    return <ActivityIndicator size="large" color={COLORS.Orange} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.appHeaderContainer}>
        <AppHeader
          name="close"
          header={'My Profile'}
          action={() => navigation.goBack()}
        />
      </View>

      <View style={styles.profileContainer}>
        <Image source={{uri: userData.avatar}} style={styles.avatarImage} />
        <Text style={styles.avatarText}>
          {removeAccents(userData.fullname).toLocaleUpperCase()}
        </Text>
      </View>

      <View style={styles.profileContainer}>
        <SettingComponent
          icon="user"
          heading="Account"
          subheading="Edit Profile"
          subtitle="Change Password"
        />
        <SettingComponent
          icon="setting"
          heading="Settings"
          subheading="Theme"
          subtitle="Permissions"
        />
        <SettingComponent
          icon="dollar"
          heading="Offers & Referrals"
          subheading="Offer"
          subtitle="Referrals"
        />
        <SettingComponent
          icon="info"
          heading="About"
          subheading="About Movies"
          subtitle="More"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  appHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_20 * 2,
  },
  profileContainer: {
    alignItems: 'center',
    padding: SPACING.space_36,
  },
  avatarImage: {
    height: 80,
    width: 80,
    borderRadius: 80,
  },
  avatarText: {
    fontFamily: FONTFAMILY.poppins_extrabold,
    fontSize: FONTSIZE.size_16,
    marginTop: SPACING.space_16,
    color: COLORS.White,
  },
});

export default UserAccountScreen;
