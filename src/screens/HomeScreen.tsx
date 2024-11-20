import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  FlatList,
} from 'react-native';
import {COLORS, SPACING} from '../themes/theme';
import {
  upcomingMovies,
  nowPlayingMovies,
  popularMovies,
  baseImagePath,
} from '../api/apicalls';
const {width, height} = Dimensions.get('window');
const HomeScreen = () => {
const [upcomingMoviesList, setupcomingMoviesList] = useState<any>(undefined);
const [nowPlayingMoviesList, setnowPlayingMoviesList] = useState<any>(undefined);
const [popularMoviesList, setpopularMoviesList] = useState<any>(undefined);
if (!upcomingMoviesList || !nowPlayingMoviesList || !popularMoviesList) {

  return (   
     <ScrollView
        style={styles.container}
        bounces={false}
        contentContainerStyle={styles.scrollViewContainer}>
        <StatusBar hidden />
        <View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} color={COLORS.Orange} />
        </View>
      </ScrollView>

  );
}
return <View style={styles.container}></View>;

}; 
const styles = StyleSheet.create({
   container: {
    display: 'flex',
    backgroundColor: COLORS.Black,
  },
  scrollViewContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  }
});

export default HomeScreen;