import React from 'react';
import {FlatList, View, StyleSheet, Image, Dimensions, Pressable} from 'react-native';
import FastImage from 'react-native-fast-image';

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    height: Dimensions.get('window').height * 0.3,
    width: Dimensions.get('window').width * 1
  },
  imageStyle: {
    width: Dimensions.get('window').width,
    height: '100%'
  }
});

/**
 * @typedef {Object} SwiperProps
 * @property {string[]} items
 */

/**
 *
 * @param {SwiperProps} props
 */

const Swiper = (props) => {
  const renderItem = (data) => {
    console.log(data.item, 'nikal');
    return (
      <Pressable style={styles.listContainer}>
        <FastImage
          resizeMode={FastImage.resizeMode.stretch}
          style={styles.imageStyle}
          source={{uri: data.item}}
        />
      </Pressable>
    );
  };

  return (
    <FlatList
      data={props.items}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default Swiper;
