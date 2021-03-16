import React from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
const {width: screenWidth} = Dimensions.get('window');
const SlideShow = () => {
  return (
    <SwiperFlatList
      autoplay
      autoplayDelay={3}
      autoplayLoop
      index={2}
      showPagination
      data={[1, 2, 3]}
      renderItem={({item}) => <Card />}
    />
  );
};

const Card = () => {
  return (
    <View style={styles.containerCard}>
      <Image
        resizeMode="cover"
        source={{uri: 'https://picsum.photos/200/300'}}
        style={styles.image}
      />
    </View>
  );
};

export default SlideShow;

const styles = StyleSheet.create({
  containerCard: {
    flex: 1,
    backgroundColor: 'red',
    width: screenWidth,
  },
  image: {flex: 1},
});
