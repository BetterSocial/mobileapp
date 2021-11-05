import React from 'react';
import {View, Dimensions, StyleSheet, Text, StatusBar} from 'react-native';
import PropTypes from 'prop-types';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
// const bottomHeight = useBottomTabBarHeight();
const FULL_WIDTH = Dimensions.get('screen').width;
const FULL_HEIGHT = Dimensions.get('screen').height;
const tabBarHeight = StatusBar.currentHeight;

const styles = StyleSheet.create({
  cardContainer: {
    height: FULL_HEIGHT - tabBarHeight,
    width: FULL_WIDTH,
  },
  cardMain: {
    height: '100%',
    width: '100%',
  },
});

const RenderListFeed = (props) => {
  const {item} = props;
  const bottomHeight = useBottomTabBarHeight();
  console.log(item);
  return (
    <View
      style={[
        styles.cardContainer,
        {height: styles.cardContainer.height - bottomHeight},
      ]}>
      <View style={styles.cardMain} />
    </View>
  );
};

RenderListFeed.propTypes = {
  item: PropTypes.object,
};

export default RenderListFeed;
