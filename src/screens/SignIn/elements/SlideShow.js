import * as React from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import {SwiperFlatList} from 'react-native-swiper-flatlist';

import { SlideShowItem } from './SlideShowItem';

const data = ['','','',''];
const {width: screenWidth} = Dimensions.get('window');

const SlideShow = ({onChangeNewIndex = (newIndex) => {}}) => {
  const handleChangeIndex = (swiperData) => {
    onChangeNewIndex(swiperData, data.length);
  };

  let {width, height} = Dimensions.get('screen')
  console.log(width)
  return (
    <SwiperFlatList
      autoplay
      autoplayDelay={5}
      autoplayLoop={false}
      index={0}
      showPagination
      paginationStyleItem={styles.dot}
      paginationStyle={styles.dotContainer}
      data={data}
      renderItem={({item, index}) => {
          return <SlideShowItem index={index} />
      } }
      onChangeIndex={handleChangeIndex}
    />
  );
};

export default SlideShow;

const styles = StyleSheet.create({
  containerCard: {
    flex: 1,
    backgroundColor: 'gray',
    width: screenWidth,
  },
  image: {flex: 1},
  dot: {
    width: 8,
    height: 8,
    marginHorizontal: 5,
  },
  dotContainer: {
    marginBottom: 6,
  }
});
