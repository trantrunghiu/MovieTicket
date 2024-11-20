import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  FlatList,
  Image,
} from 'react-native';
import {COLORS, SPACING} from '../themes/theme';
import {baseImagePath, searchMovies} from '../api/apicalls';
import InputHeader from '../components/InputHeader';
import SubMovieCard from '../components/SubMovieCard';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {FONTFAMILY} from '../themes/theme';
import CategoryHeader from '../components/CategoryHeader';
import {nowPlayingMovies} from '../api/apicalls';

const {width, height} = Dimensions.get('screen');
const Tab = createMaterialTopTabNavigator();

const SearchScreen = ({navigation}: any) => {
  const [searchList, setSearchList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [nowPlayingMoviesList, setNowPlayingMoviesList] =
    useState<any>(undefined);

  useEffect(() => {
    (async () => {
      let tempNowPlaying = await getNowPlayingMoviesList();
      setNowPlayingMoviesList(tempNowPlaying.results);
    })();
  }, []);

  const searchMoviesFunction = async (name: string) => {
    setSearchQuery(name);
    try {
      let response = await fetch(searchMovies(name));
      let json = await response.json();
      setSearchList(json.results);
    } catch (error) {
      console.error('Something went wrong in searchMoviesFunction ', error);
    }
  };

  const getNowPlayingMoviesList = async () => {
    try {
      let response = await fetch(nowPlayingMovies);
      let json = await response.json();
      return json;
    } catch (error) {
      console.error(
        'Something went wrong in getNowPlayingMoviesList Function',
        error,
      );
    }
  };

  const AllMoviesTab = () => {
    if (!nowPlayingMoviesList || nowPlayingMoviesList.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={{color: COLORS.Black}}>Đang tải dữ liệu...</Text>
        </View>
      );
    }

    return (
      <View
        style={{
          width: 'auto',
          height: 'auto',
          flex: 1,
          backgroundColor: COLORS.Black,
        }}>
        <CategoryHeader />
        <FlatList
          style={{flex: 1, backgroundColor: COLORS.Black}}
          data={nowPlayingMoviesList}
          keyExtractor={(item: any) => item.id.toString()} // Cần đảm bảo id là chuỗi
          numColumns={1} // Chia thành 4 cột
          bounces={false}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.containerGap36}
          renderItem={({item, index}) => (
            <SubMovieCard
              shoudlMarginatedAtEnd={false}
              cardFunction={() => {
                navigation.push('MovieDetails', {movieid: item.id});
              }}
              cardWidth={width - SPACING.space_36 * 2} // Đảm bảo mỗi item có kích thước vuông
              isFirst={index == 0 ? true : false}
              isLast={index == nowPlayingMoviesList?.length - 1 ? true : false}
              title={item.original_title}
              imagePath={baseImagePath('w342', item.poster_path)}
            />
          )}
        />
      </View>
    );
  };

  const FavoriteMoviesTab = () => (
    <View style={styles.centerContainer}>
      <Text style={{color: COLORS.Black}}>Phim yêu thích</Text>
    </View>
  );

  const RecentlyAddedTab = () => (
    <View style={styles.centerContainer}>
      <Text style={{color: COLORS.Black}}>Phim mới thêm</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.InputHeaderContainer}>
        <InputHeader searchFunction={searchMoviesFunction} />
      </View>

      {/* Hiển thị kết quả tìm kiếm nếu có */}
      {searchQuery ? (
        <FlatList
          data={searchList}
          keyExtractor={(item: any) => item.id.toString()}
          bounces={false}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.centerContainer}
          renderItem={({item}) => (
            <SubMovieCard
              shoudlMarginatedAtEnd={false}
              shouldMarginatedAround={true}
              cardFunction={() => {
                navigation.push('MovieDetails', {movieid: item.id});
              }}
              cardWidth={width / 2 - SPACING.space_12 * 2}
              title={item.original_title}
              imagePath={baseImagePath('w342', item.poster_path)}
            />
          )}
        />
      ) : (
        // Nếu không có từ khóa tìm kiếm, hiển thị các tab
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: COLORS.Orange,
            tabBarStyle: {
              backgroundColor: COLORS.Black,
              paddingTop: 10,
              paddingBottom: 5,
              width: width - SPACING.space_36 * 2,
            },
            tabBarLabelStyle: {
              fontSize: 14,
              fontWeight: 'bold',
              fontFamily: FONTFAMILY.poppins_light,
            },
            tabBarIndicatorStyle: {
              backgroundColor: COLORS.Orange,
              height: 3,
            },
          }}>
          <Tab.Screen name="All Movies" component={AllMoviesTab} />
          <Tab.Screen name="Favorites" component={AllMoviesTab} />
          <Tab.Screen name="Recently Added" component={AllMoviesTab} />
        </Tab.Navigator>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    alignItems: 'center',
    backgroundColor: COLORS.Black,
  },
  InputHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_28,
    marginBottom: SPACING.space_28 - SPACING.space_12,
  },
  centerContainer: {
    alignItems: 'center',
  },
  containerGap36: {
    gap: SPACING.space_36,
  },
});

export default SearchScreen;
