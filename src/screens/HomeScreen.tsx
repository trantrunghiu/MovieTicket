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
import InputHeader from '../components/InputHeader';
import CategoryHeader from '../components/CategoryHeader';

const {width, height} = Dimensions.get('window');

const getNowPlayingMoviesList = async () => {
    try {
        let response = await fetch(nowPlayingMovies);
        let json = await response.json();
        return json;
    } catch (error) {
        console.error("error in getNowPlayingMoviesList Function: ", error); 
    }
};

const getUpcomingMoviesList = async () => {
    try {
        let response = await fetch(upcomingMovies);
        let json = await response.json();
        return json;
    } catch (error) {
        console.error("error in getUpcomingMoviesList Function: ", error); 
    } 
};

const getPopularMoviesList = async () => {
 try {
        let response = await fetch(popularMovies);
        let json = await response.json();
        return json;
    } catch (error) {
        console.error("error in getPopularMoviesList Function: ", error); 
    }
};

const HomeScreen = ({navigation}: any) => {
  const [nowPlayingMoviesList, setNowPlayingMoviesList] = useState<any>(undefined);
  const [popularMoviesList, setPopularMoviesList] = useState<any>(undefined);
  const [upcomingMoviesList, setUpcomingMoviesList] = useState<any>(undefined);

  useEffect(() => {
    (async () => {
      let tempNowPlaying = await getNowPlayingMoviesList();
      setNowPlayingMoviesList(tempNowPlaying.results);

      let tempPopular = await getPopularMoviesList();
      setPopularMoviesList(tempPopular.results);

      let tempUpcoming = await getUpcomingMoviesList();
      setUpcomingMoviesList(tempUpcoming.results);
    })();
  }, []);

  const searchMoviesFunction = () => {
    navigation.navigate('Search');
  };

  if (
    nowPlayingMoviesList == undefined &&
    nowPlayingMoviesList == null &&
    popularMoviesList == undefined &&
    popularMoviesList == null &&
    upcomingMoviesList == undefined &&
    upcomingMoviesList == null
  ) {
    return (
      <ScrollView
        style={styles.container}
        bounces={false}
        contentContainerStyle={styles.scrollViewContainer}>
        <StatusBar hidden />

        <View style={styles.InputHeaderContainer}>
          <InputHeader searchFunction={searchMoviesFunction} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} color={COLORS.Orange} />
        </View>
      </ScrollView>
    );
  }
  return (
      <ScrollView
        style={styles.container}
        bounces={false}
        contentContainerStyle={styles.scrollViewContainer}>
        <StatusBar hidden />

        <View style={styles.InputHeaderContainer}>
          <InputHeader searchFunction={searchMoviesFunction} />
        </View>

        <CategoryHeader title = {'Now playing'}/>
        <CategoryHeader title = {'Popular'}/>
        <CategoryHeader title = {'Upcoming'}/>

      </ScrollView>
    );
  

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
  },
  InputHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_28,
  },
});
export default HomeScreen;
