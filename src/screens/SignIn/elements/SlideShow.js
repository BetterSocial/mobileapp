import * as React from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';

import {SwiperFlatList} from 'react-native-swiper-flatlist';

const data = [
  'https://picsum.photos/id/1/200/300',
  'https://picsum.photos/id/1036/200/300',
  'https://picsum.photos/id/1048/200/300',
  'https://picsum.photos/id/1018/200/300',
];
const {width: screenWidth} = Dimensions.get('window');

const SlideShow = ({onChangeNewIndex = (newIndex) => {}}) => {
  const handleChangeIndex = (swiperData) => {
    onChangeNewIndex(swiperData, data.length);
  };

  return (
    <SwiperFlatList
      autoplay
      autoplayDelay={5}
      autoplayLoop={false}
      index={0}
      showPagination
      paginationStyleItem={styles.dot}
      data={data}
      renderItem={({item}) => <Card image={item} />}
      onChangeIndex={handleChangeIndex}
    />
  );
};

const Card = ({image}) => {
  return (
    <View style={styles.containerCard}>
      {image && (
        <Image resizeMode="cover" source={{uri: image}} style={styles.image} />
      )}
    </View>
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
});
